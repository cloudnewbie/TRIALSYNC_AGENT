// mockData.js - De-identified Patient Populations & Site Master Database (TrialSync Engine)

export const mockSites = [
  {
    site_id: "SITE-001",
    site_name: "Johns Hopkins Hospital",
    institution_type: "Academic Medical Center",
    location: {
      type: "Point",
      coordinates: [-76.5935, 39.2971], // [longitude, latitude]
      address: "1800 Orleans St",
      city: "Baltimore",
      state: "MD",
      zip: "21287",
      country: "US",
      region: "East Coast",
      timezone: "America/New_York"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular", "Oncology", "Neurology", "Endocrinology"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT", "PET Scan"],
      labs: ["Hematology", "Chemistry", "Lipids", "Cardiac Biomarkers"],
      pharmacy: { on_site: true, investigational_drug_storage: true },
      staff: { pis: 15, sub_investigators: 8, coordinators: 22, research_nurses: 12 }
    },
    certifications: ["CAP", "CLIA", "JCI"],
    pricing: { per_patient_fee: 16500, startup_fee: 35000, currency: "USD" },
    historical_metrics: {
      trials_completed: 147,
      active_trials: 23,
      avg_enrollment_velocity: 4.2, // patients per month
      avg_activation_days: 45,
      avg_irb_approval_days: 30,
      retention_rate: 0.92,
      site_dropout_rate: 0.08,
      screen_failure_rate: 0.21,
      protocol_deviation_rate: 0.03
    },
    patient_demographics: {
      total_patients_screened_2025: 4800,
      race_ethnicity: { white: 0.46, black: 0.28, hispanic: 0.15, asian: 0.08, other: 0.03 }
    },
    principal_investigator: { name: "Dr. Jane Smith", email: "jsmith@jh.edu", phone: "+1-410-555-0123" }
  },
  {
    site_id: "SITE-002",
    site_name: "Massachusetts General Hospital",
    institution_type: "Academic Medical Center",
    location: {
      type: "Point",
      coordinates: [-71.0686, 42.3629],
      address: "55 Fruit St",
      city: "Boston",
      state: "MA",
      zip: "02114",
      country: "US",
      region: "East Coast",
      timezone: "America/New_York"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular", "Oncology", "Immunology", "Pulmonology"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT", "EUS"],
      labs: ["Hematology", "Chemistry", "Lipids", "Genomics"],
      pharmacy: { on_site: true, investigational_drug_storage: true },
      staff: { pis: 18, sub_investigators: 10, coordinators: 28, research_nurses: 15 }
    },
    certifications: ["CAP", "CLIA", "JCI", "AAHRPP"],
    pricing: { per_patient_fee: 17200, startup_fee: 38000, currency: "USD" },
    historical_metrics: {
      trials_completed: 189,
      active_trials: 31,
      avg_enrollment_velocity: 3.9,
      avg_activation_days: 52,
      avg_irb_approval_days: 35,
      retention_rate: 0.89,
      site_dropout_rate: 0.06,
      screen_failure_rate: 0.24,
      protocol_deviation_rate: 0.04
    },
    patient_demographics: {
      total_patients_screened_2025: 5600,
      race_ethnicity: { white: 0.62, black: 0.12, hispanic: 0.14, asian: 0.09, other: 0.03 }
    },
    principal_investigator: { name: "Dr. Robert Vance", email: "rvance@mgh.harvard.edu", phone: "+1-617-555-0144" }
  },
  {
    site_id: "SITE-003",
    site_name: "Mayo Clinic (Rochester)",
    institution_type: "Academic Medical Center",
    location: {
      type: "Point",
      coordinates: [-92.4640, 44.0220],
      address: "200 First St SW",
      city: "Rochester",
      state: "MN",
      zip: "55905",
      country: "US",
      region: "Midwest",
      timezone: "America/Chicago"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular", "Oncology", "Neurology", "Rheumatology"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT", "PET Scan", "Cath Lab"],
      labs: ["Hematology", "Chemistry", "Lipids", "Pathology", "Biomarkers"],
      pharmacy: { on_site: true, investigational_drug_storage: true },
      staff: { pis: 24, sub_investigators: 15, coordinators: 45, research_nurses: 25 }
    },
    certifications: ["CAP", "CLIA", "JCI", "AAHRPP"],
    pricing: { per_patient_fee: 18500, startup_fee: 45000, currency: "USD" },
    historical_metrics: {
      trials_completed: 312,
      active_trials: 48,
      avg_enrollment_velocity: 4.8,
      avg_activation_days: 38,
      avg_irb_approval_days: 20,
      retention_rate: 0.94,
      site_dropout_rate: 0.04,
      screen_failure_rate: 0.18,
      protocol_deviation_rate: 0.02
    },
    patient_demographics: {
      total_patients_screened_2025: 8200,
      race_ethnicity: { white: 0.74, black: 0.08, hispanic: 0.09, asian: 0.06, other: 0.03 }
    },
    principal_investigator: { name: "Dr. Alistair Ross", email: "ross.alistair@mayo.edu", phone: "+1-507-555-0182" }
  },
  {
    site_id: "SITE-004",
    site_name: "Cleveland Clinic",
    institution_type: "Academic Medical Center",
    location: {
      type: "Point",
      coordinates: [-81.6201, 41.5032],
      address: "9500 Euclid Ave",
      city: "Cleveland",
      state: "OH",
      zip: "44195",
      country: "US",
      region: "Midwest",
      timezone: "America/New_York"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular", "Pulmonology", "Neurology", "Nephrology"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT", "PET Scan", "Cath Lab"],
      labs: ["Hematology", "Chemistry", "Lipids", "Biomarkers"],
      pharmacy: { on_site: true, investigational_drug_storage: true },
      staff: { pis: 22, sub_investigators: 12, coordinators: 40, research_nurses: 22 }
    },
    certifications: ["CAP", "CLIA", "JCI", "AAALAC"],
    pricing: { per_patient_fee: 16000, startup_fee: 32000, currency: "USD" },
    historical_metrics: {
      trials_completed: 275,
      active_trials: 42,
      avg_enrollment_velocity: 4.5,
      avg_activation_days: 41,
      avg_irb_approval_days: 25,
      retention_rate: 0.91,
      site_dropout_rate: 0.05,
      screen_failure_rate: 0.19,
      protocol_deviation_rate: 0.03
    },
    patient_demographics: {
      total_patients_screened_2025: 7400,
      race_ethnicity: { white: 0.58, black: 0.24, hispanic: 0.10, asian: 0.05, other: 0.03 }
    },
    principal_investigator: { name: "Dr. Marc Geller", email: "mgeller@ccf.org", phone: "+1-216-555-0155" }
  },
  {
    site_id: "SITE-005",
    site_name: "UCSF Medical Center",
    institution_type: "Academic Medical Center",
    location: {
      type: "Point",
      coordinates: [-122.4589, 37.7631],
      address: "505 Parnassus Ave",
      city: "San Francisco",
      state: "CA",
      zip: "94143",
      country: "US",
      region: "West Coast",
      timezone: "America/Los_Angeles"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular", "Oncology", "Neurology", "Infectious Disease"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT", "PET Scan"],
      labs: ["Hematology", "Chemistry", "Lipids", "Genomics"],
      pharmacy: { on_site: true, investigational_drug_storage: true },
      staff: { pis: 20, sub_investigators: 11, coordinators: 35, research_nurses: 18 }
    },
    certifications: ["CAP", "CLIA", "JCI"],
    pricing: { per_patient_fee: 17800, startup_fee: 40000, currency: "USD" },
    historical_metrics: {
      trials_completed: 215,
      active_trials: 34,
      avg_enrollment_velocity: 3.6,
      avg_activation_days: 58,
      avg_irb_approval_days: 38,
      retention_rate: 0.88,
      site_dropout_rate: 0.07,
      screen_failure_rate: 0.25,
      protocol_deviation_rate: 0.04
    },
    patient_demographics: {
      total_patients_screened_2025: 6100,
      race_ethnicity: { white: 0.40, black: 0.10, hispanic: 0.20, asian: 0.25, other: 0.05 }
    },
    principal_investigator: { name: "Dr. Linda Zhao", email: "linda.zhao@ucsf.edu", phone: "+1-415-555-0177" }
  },
  {
    site_id: "SITE-006",
    site_name: "Toronto General Hospital",
    institution_type: "Academic Medical Center",
    location: {
      type: "Point",
      coordinates: [-79.3879, 43.6591],
      address: "200 Elizabeth St",
      city: "Toronto",
      state: "ON",
      zip: "M5G 2C4",
      country: "Canada",
      region: "Canada",
      timezone: "America/Toronto"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular", "Pulmonology", "Oncology", "Hepatology"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT", "PET Scan"],
      labs: ["Hematology", "Chemistry", "Lipids", "Biomarkers"],
      pharmacy: { on_site: true, investigational_drug_storage: true },
      staff: { pis: 16, sub_investigators: 8, coordinators: 25, research_nurses: 14 }
    },
    certifications: ["CAP", "CLIA"],
    pricing: { per_patient_fee: 14500, startup_fee: 28000, currency: "CAD" },
    historical_metrics: {
      trials_completed: 132,
      active_trials: 19,
      avg_enrollment_velocity: 3.5,
      avg_activation_days: 48,
      avg_irb_approval_days: 28,
      retention_rate: 0.91,
      site_dropout_rate: 0.06,
      screen_failure_rate: 0.20,
      protocol_deviation_rate: 0.03
    },
    patient_demographics: {
      total_patients_screened_2025: 4200,
      race_ethnicity: { white: 0.44, black: 0.08, hispanic: 0.06, asian: 0.38, other: 0.04 }
    },
    principal_investigator: { name: "Dr. Andrew Patel", email: "apatel@uhn.ca", phone: "+1-416-555-0199" }
  },
  {
    site_id: "SITE-007",
    site_name: "Texas Heart Institute",
    institution_type: "Academic Medical Center",
    location: {
      type: "Point",
      coordinates: [-95.3978, 29.7024],
      address: "6770 Bertner Ave",
      city: "Houston",
      state: "TX",
      zip: "77030",
      country: "US",
      region: "South",
      timezone: "America/Chicago"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular", "Hematology"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT", "Cath Lab"],
      labs: ["Hematology", "Chemistry", "Lipids", "Coagulation"],
      pharmacy: { on_site: true, investigational_drug_storage: true },
      staff: { pis: 12, sub_investigators: 6, coordinators: 20, research_nurses: 10 }
    },
    certifications: ["CAP", "CLIA", "JCI"],
    pricing: { per_patient_fee: 13800, startup_fee: 24000, currency: "USD" },
    historical_metrics: {
      trials_completed: 115,
      active_trials: 15,
      avg_enrollment_velocity: 4.1,
      avg_activation_days: 43,
      avg_irb_approval_days: 29,
      retention_rate: 0.86,
      site_dropout_rate: 0.09,
      screen_failure_rate: 0.22,
      protocol_deviation_rate: 0.05
    },
    patient_demographics: {
      total_patients_screened_2025: 3500,
      race_ethnicity: { white: 0.42, black: 0.22, hispanic: 0.28, asian: 0.06, other: 0.02 }
    },
    principal_investigator: { name: "Dr. Roberto Silva", email: "rsilva@texasheart.org", phone: "+1-832-555-0162" }
  },
  {
    site_id: "SITE-008",
    site_name: "Vanderbilt University Medical Center",
    institution_type: "Academic Medical Center",
    location: {
      type: "Point",
      coordinates: [-86.8028, 36.1414],
      address: "1211 Medical Center Dr",
      city: "Nashville",
      state: "TN",
      zip: "37232",
      country: "US",
      region: "South",
      timezone: "America/Chicago"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular", "Oncology", "Neurology", "Pediatrics"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT", "PET Scan"],
      labs: ["Hematology", "Chemistry", "Lipids", "Biomarkers"],
      pharmacy: { on_site: true, investigational_drug_storage: true },
      staff: { pis: 14, sub_investigators: 8, coordinators: 24, research_nurses: 12 }
    },
    certifications: ["CAP", "CLIA", "JCI", "AAHRPP"],
    pricing: { per_patient_fee: 14800, startup_fee: 29000, currency: "USD" },
    historical_metrics: {
      trials_completed: 134,
      active_trials: 18,
      avg_enrollment_velocity: 3.8,
      avg_activation_days: 47,
      avg_irb_approval_days: 31,
      retention_rate: 0.90,
      site_dropout_rate: 0.07,
      screen_failure_rate: 0.20,
      protocol_deviation_rate: 0.03
    },
    patient_demographics: {
      total_patients_screened_2025: 4100,
      race_ethnicity: { white: 0.65, black: 0.22, hispanic: 0.08, asian: 0.03, other: 0.02 }
    },
    principal_investigator: { name: "Dr. Arthur Pendelton", email: "arthur.pendelton@vumc.org", phone: "+1-615-555-0105" }
  },
  {
    site_id: "SITE-009",
    site_name: "Apex Cardiology Network (Dallas)",
    institution_type: "Private Practice Network",
    location: {
      type: "Point",
      coordinates: [-96.7970, 32.7767],
      address: "8300 Walnut Hill Ln",
      city: "Dallas",
      state: "TX",
      zip: "75231",
      country: "US",
      region: "South",
      timezone: "America/Chicago"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT"],
      labs: ["Lipids", "Hematology"],
      pharmacy: { on_site: true, investigational_drug_storage: false },
      staff: { pis: 6, sub_investigators: 4, coordinators: 10, research_nurses: 4 }
    },
    certifications: ["CLIA"],
    pricing: { per_patient_fee: 11200, startup_fee: 15000, currency: "USD" },
    historical_metrics: {
      trials_completed: 64,
      active_trials: 8,
      avg_enrollment_velocity: 3.4,
      avg_activation_days: 28, // Fast activation!
      avg_irb_approval_days: 15, // Central IRB!
      retention_rate: 0.82,
      site_dropout_rate: 0.12,
      screen_failure_rate: 0.28,
      protocol_deviation_rate: 0.06
    },
    patient_demographics: {
      total_patients_screened_2025: 2200,
      race_ethnicity: { white: 0.50, black: 0.20, hispanic: 0.22, asian: 0.06, other: 0.02 }
    },
    principal_investigator: { name: "Dr. Frank Miller", email: "fmiller@apexcardio.com", phone: "+1-214-555-0171" }
  },
  {
    site_id: "SITE-010",
    site_name: "Mount Sinai Hospital",
    institution_type: "Academic Medical Center",
    location: {
      type: "Point",
      coordinates: [-73.9529, 40.7900],
      address: "1468 Madison Ave",
      city: "New York",
      state: "NY",
      zip: "10029",
      country: "US",
      region: "East Coast",
      timezone: "America/New_York"
    },
    capabilities: {
      therapeutic_areas: ["Cardiovascular", "Oncology", "Neurology", "Gastroenterology"],
      equipment: ["ECG", "Echocardiogram", "MRI", "CT", "PET Scan"],
      labs: ["Hematology", "Chemistry", "Lipids", "Genomics"],
      pharmacy: { on_site: true, investigational_drug_storage: true },
      staff: { pis: 19, sub_investigators: 10, coordinators: 30, research_nurses: 16 }
    },
    certifications: ["CAP", "CLIA", "JCI"],
    pricing: { per_patient_fee: 17500, startup_fee: 39000, currency: "USD" },
    historical_metrics: {
      trials_completed: 167,
      active_trials: 25,
      avg_enrollment_velocity: 3.8,
      avg_activation_days: 50,
      avg_irb_approval_days: 32,
      retention_rate: 0.88,
      site_dropout_rate: 0.07,
      screen_failure_rate: 0.23,
      protocol_deviation_rate: 0.04
    },
    patient_demographics: {
      total_patients_screened_2025: 5200,
      race_ethnicity: { white: 0.38, black: 0.25, hispanic: 0.22, asian: 0.12, other: 0.03 }
    },
    principal_investigator: { name: "Dr. Sarah Jenkins", email: "sjenkins@mountsinai.org", phone: "+1-212-555-0118" }
  }
];

export const mockPatientPopulations = [
  {
    site_id: "SITE-001",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 12450,
      age_distribution: { "18-39": 2890, "40-64": 5740, "65-85": 3820 },
      gender_distribution: { male: 6540, female: 5910 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 387 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 245 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 198 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 512 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 3829 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "LDL", "HDL"],
    emr_system: "Epic",
    emr_integration: true
  },
  {
    site_id: "SITE-002",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 14200,
      age_distribution: { "18-39": 3120, "40-64": 6500, "65-85": 4580 },
      gender_distribution: { male: 7200, female: 7000 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 345 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 230 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 185 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 489 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 4120 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "LDL", "HDL"],
    emr_system: "Epic",
    emr_integration: true
  },
  {
    site_id: "SITE-003",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 22800,
      age_distribution: { "18-39": 4120, "40-64": 10540, "65-85": 8140 },
      gender_distribution: { male: 11980, female: 10820 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 612 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 429 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 382 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 890 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 7340 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "LDL", "HDL"],
    emr_system: "Epic",
    emr_integration: true
  },
  {
    site_id: "SITE-004",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 19500,
      age_distribution: { "18-39": 3890, "40-64": 8900, "65-85": 6710 },
      gender_distribution: { male: 10100, female: 9400 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 520 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 367 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 298 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 742 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 6110 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "LDL", "HDL"],
    emr_system: "Epic",
    emr_integration: true
  },
  {
    site_id: "SITE-005",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 15400,
      age_distribution: { "18-39": 3740, "40-64": 6920, "65-85": 4740 },
      gender_distribution: { male: 7890, female: 7510 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 312 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 201 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 152 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 421 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 4620 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "LDL", "HDL"],
    emr_system: "Epic",
    emr_integration: true
  },
  {
    site_id: "SITE-006",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 11200,
      age_distribution: { "18-39": 2430, "40-64": 5120, "65-85": 3650 },
      gender_distribution: { male: 5740, female: 5460 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 287 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 178 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 142 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 395 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 3410 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "LDL", "HDL"],
    emr_system: "Cerner",
    emr_integration: true
  },
  {
    site_id: "SITE-007",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 9800,
      age_distribution: { "18-39": 2110, "40-64": 4210, "65-85": 3480 },
      gender_distribution: { male: 5100, female: 4700 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 265 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 182 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 135 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 382 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 3120 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "LDL", "HDL"],
    emr_system: "Cerner",
    emr_integration: false
  },
  {
    site_id: "SITE-008",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 10500,
      age_distribution: { "18-39": 2340, "40-64": 4890, "65-85": 3270 },
      gender_distribution: { male: 5410, female: 5090 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 272 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 165 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 110 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 350 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 3200 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "LDL", "HDL"],
    emr_system: "Epic",
    emr_integration: true
  },
  {
    site_id: "SITE-009",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 6200,
      age_distribution: { "18-39": 1210, "40-64": 2980, "65-85": 2010 },
      gender_distribution: { male: 3210, female: 2990 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 198 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 95 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 72 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 215 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 2180 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "LDL", "HDL"],
    emr_system: "Allscripts",
    emr_integration: false
  },
  {
    site_id: "SITE-010",
    data_as_of: "2026-05-01T00:00:00Z",
    demographics: {
      total_patients: 13100,
      age_distribution: { "18-39": 2980, "40-64": 6120, "65-85": 4000 },
      gender_distribution: { male: 6710, female: 6390 }
    },
    conditions: [
      { icd10_code: "I25.10", description: "Coronary atherosclerosis", patient_count: 310 },
      { icd10_code: "I50.1", description: "Left ventricular failure", patient_count: 210 },
      { icd10_code: "I50.2", description: "Systolic heart failure", patient_count: 168 },
      { icd10_code: "E78.0", description: "Pure hypercholesterolemia", patient_count: 450 },
      { icd10_code: "I10", description: "Essential hypertension", patient_count: 3950 }
    ],
    biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "LDL", "HDL"],
    emr_system: "Epic",
    emr_integration: true
  }
];

export const sampleProtocol = {
  protocol_number: "P-2026-CV-001",
  sponsor: "Demo Pharma Inc",
  study_title: "Phase 3 Cardiovascular Prevention Trial (PREVENT-CV)",
  phase: "Phase 3",
  therapeutic_area: "Cardiovascular",
  indication: "Coronary Atherosclerosis with Hypercholesterolemia",
  target_enrollment: 500,
  geography: ["US", "Canada"],
  estimated_duration_months: 18,
  inclusion_criteria: [
    {
      criterion_id: "I1",
      type: "age",
      description: "Adults aged 45 years and older (45-85)",
      operator: ">=",
      value: 45,
      unit: "years"
    },
    {
      criterion_id: "I2",
      type: "diagnosis",
      description: "Coronary atherosclerosis of native coronary artery (ICD-10 I25.10)",
      code: "I25.10",
      coding_system: "ICD-10"
    },
    {
      criterion_id: "I3",
      type: "lab_value",
      description: "LDL cholesterol > 190 mg/dL",
      test: "LDL Cholesterol",
      operator: ">",
      value: 190,
      unit: "mg/dL"
    }
  ],
  exclusion_criteria: [
    {
      criterion_id: "E1",
      type: "medical_history",
      description: "Recent myocardial infarction (< 6 months)",
      lookback_months: 6
    }
  ],
  assessments: [
    { name: "ECG", frequency: "Every visit", required: true },
    { name: "Echocardiogram", frequency: "Baseline, Month 6, Month 12", required: true },
    { name: "Lipid Panel", frequency: "Every 3 months", required: true }
  ],
  budget: {
    estimated_per_site_activation: 35000,
    estimated_per_patient: 15000,
    total_budget: 7500000
  },
  timeline: {
    protocol_finalized: "2026-03-01",
    site_selection_target: "2026-04-15",
    first_patient_in: "2026-06-01",
    last_patient_in: "2026-12-01",
    study_completion: "2027-06-01"
  }
};
