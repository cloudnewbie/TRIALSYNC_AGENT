// scoringEngine.js - Multi-factor Clinical Site Matcher & Scoring Algorithm

import { mockSites, mockPatientPopulations } from '../mockData.js';

export function calculateScores(weights, protocol) {
  // Extract inclusion criteria parameters
  const ageCriteria = protocol.inclusion_criteria.find(c => c.type === 'age');
  const dxCriteria = protocol.inclusion_criteria.find(c => c.type === 'diagnosis');
  const ldlCriteria = protocol.inclusion_criteria.find(c => c.type === 'lab_value' && c.test === 'LDL Cholesterol');

  const requiredDxCode = dxCriteria ? dxCriteria.code : "I25.10";
  
  return mockSites.map(site => {
    // 1. Query Patient Population matching this site
    const population = mockPatientPopulations.find(pop => pop.site_id === site.site_id) || {
      demographics: { total_patients: 1000 },
      conditions: []
    };

    // 2. Availability Score Calculation
    // Find aggregate count matching disease code
    const matchingDx = population.conditions.find(c => c.icd10_code === requiredDxCode);
    const matchingCount = matchingDx ? matchingDx.patient_count : 0;
    
    // Benchmark: 200 patients is a 100% score for patient pool size
    const rawAvailability = Math.min((matchingCount / 200) * 100, 100);
    const availabilityScore = Math.round(rawAvailability * 100) / 100;

    // 3. Enrollment Velocity Score
    // Benchmark: 5.0 patients/month is 100%
    const velocityScore = Math.round(Math.min((site.historical_metrics.avg_enrollment_velocity / 5) * 100, 100) * 100) / 100;

    // 4. Activation Speed Score
    // Benchmark: 30 days or less is 100%
    const activationDays = site.historical_metrics.avg_activation_days;
    const activationScore = Math.round(Math.min((30 / activationDays) * 100, 100) * 100) / 100;

    // 5. Retention Rate Score
    const retentionScore = Math.round(site.historical_metrics.retention_rate * 100 * 100) / 100;

    // 6. Diversity Score (Simpson's Index based on ethnic distributions)
    const races = site.patient_demographics.race_ethnicity;
    const sumSq = Math.pow(races.white, 2) + Math.pow(races.black, 2) + Math.pow(races.hispanic, 2) + Math.pow(races.asian, 2) + Math.pow(races.other, 2);
    const SimpsonIndex = 1 - sumSq; // Closer to 1 is more diverse
    // Normalise to 0-100, where 0.70 Simpson index = 100%
    const diversityScore = Math.round(Math.min((SimpsonIndex / 0.65) * 100, 100) * 100) / 100;

    // 7. Cost Efficiency Score
    // Benchmark: $12,000 per patient is 100%
    const perPatientCost = site.pricing.per_patient_fee;
    const costScore = Math.round(Math.min((12000 / perPatientCost) * 100, 100) * 100) / 100;

    // 8. Overall Weighted Score
    const overall = (
      availabilityScore * weights.availability +
      velocityScore * weights.velocity +
      activationScore * weights.activation +
      retentionScore * weights.retention +
      diversityScore * weights.diversity +
      costScore * weights.cost
    );
    const overallScore = Math.round(overall * 10) / 10;

    // 9. Risk Flags Evaluation
    const risks = [];
    if (availabilityScore < 70) {
      risks.push({ type: "high", message: `Low patient pool (${matchingCount} matching patients)` });
    }
    if (activationDays > 50) {
      risks.push({ type: "medium", message: `Slow setup timeline (${activationDays} days average)` });
    }
    if (diversityScore < 60) {
      risks.push({ type: "low", message: `Limited geographical patient diversity` });
    }
    if (retentionScore < 85) {
      risks.push({ type: "medium", message: `Historical patient dropout rate high (${(100 - retentionScore).toFixed(0)}%)` });
    }

    const predictedEnrollment = Math.round(site.historical_metrics.avg_enrollment_velocity * 10);
    const timelineMonths = Math.round((predictedEnrollment / site.historical_metrics.avg_enrollment_velocity) * 10) / 10;

    return {
      site_id: site.site_id,
      site_name: site.site_name,
      institution_type: site.institution_type,
      location: site.location,
      metrics: site.historical_metrics,
      pricing: site.pricing,
      pi: site.principal_investigator,
      demographics: population.demographics,
      emr_system: population.emr_system,
      matching_patients: matchingCount,
      scores: {
        availability: availabilityScore,
        velocity: velocityScore,
        activation: activationScore,
        retention: retentionScore,
        diversity: diversityScore,
        cost: costScore
      },
      overall_score: overallScore,
      risks: risks,
      predicted_enrollment: predictedEnrollment,
      predicted_timeline_months: timelineMonths,
      recommendation: overallScore >= 85 ? "STRONGLY RECOMMENDED" : overallScore >= 75 ? "RECOMMENDED" : "BACKUP ONLY"
    };
  }).sort((a, b) => b.overall_score - a.overall_score).map((site, index) => {
    return { ...site, rank: index + 1 };
  });
}
