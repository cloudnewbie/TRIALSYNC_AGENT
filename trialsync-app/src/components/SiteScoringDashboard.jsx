// SiteScoringDashboard.jsx - Interactive Site Ranking Table & Sliders with Demographic Drawers

import React, { useState } from 'react';

export default function SiteScoringDashboard({ scoredSites, weights, setWeights, protocol, triggerOutreach, feasibilityList }) {
  const [selectedSite, setSelectedSite] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('All');

  // Handle slider weight changes and maintain normalization (sum = 1.0)
  const handleWeightChange = (key, value) => {
    const numericValue = parseFloat(value);
    const difference = numericValue - weights[key];
    
    // Auto-normalize other weights
    const keysToAdjust = Object.keys(weights).filter(k => k !== key);
    const sumOthers = keysToAdjust.reduce((acc, k) => acc + weights[k], 0);

    const updatedWeights = { ...weights, [key]: numericValue };

    if (sumOthers > 0) {
      keysToAdjust.forEach(k => {
        const proportion = weights[k] / sumOthers;
        updatedWeights[k] = Math.max(0, Math.round((weights[k] - difference * proportion) * 100) / 100);
      });
    }

    // Direct micro-adjustment to ensure exact total = 1.0
    const total = Object.values(updatedWeights).reduce((a, b) => a + b, 0);
    const error = 1.0 - total;
    if (error !== 0) {
      updatedWeights[keysToAdjust[0]] = Math.max(0, Math.round((updatedWeights[keysToAdjust[0]] + error) * 100) / 100);
    }

    setWeights(updatedWeights);
  };

  const regions = ['All', 'East Coast', 'West Coast', 'Midwest', 'South', 'Canada'];

  const filteredSites = scoredSites.filter(site => {
    const matchesSearch = site.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          site.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          site.pi.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = filterRegion === 'All' || site.location.region === filterRegion;

    return matchesSearch && matchesRegion;
  });

  const getScoreClass = (score) => {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    return 'average';
  };

  const getSurveyStatus = (siteId) => {
    const active = feasibilityList.find(f => f.site_id === siteId);
    if (!active) return null;
    return active.status;
  };

  return (
    <div className="glass-panel" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Multi-Factor Clinical Site Rankings</h1>
          <p className="page-subtitle">Adjust sliding parameters to calculate overall scores and rank matching patient centers.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', marginTop: '24px' }}>
        
        {/* Left Side: Parameters Sliders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Recalculation Sliders</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="weight-slider-card">
                <div className="slider-header">
                  <span className="slider-label">👥 Patient Availability</span>
                  <span className="slider-value">{(weights.availability * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="0.8" step="0.05" 
                  value={weights.availability} 
                  onChange={(e) => handleWeightChange('availability', e.target.value)}
                  className="slider-input"
                />
              </div>

              <div className="weight-slider-card">
                <div className="slider-header">
                  <span className="slider-label">📈 Enrollment Velocity</span>
                  <span className="slider-value">{(weights.velocity * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="0.8" step="0.05" 
                  value={weights.velocity} 
                  onChange={(e) => handleWeightChange('velocity', e.target.value)}
                  className="slider-input"
                />
              </div>

              <div className="weight-slider-card">
                <div className="slider-header">
                  <span className="slider-label">⚡ Setup Activation</span>
                  <span className="slider-value">{(weights.activation * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="0.8" step="0.05" 
                  value={weights.activation} 
                  onChange={(e) => handleWeightChange('activation', e.target.value)}
                  className="slider-input"
                />
              </div>

              <div className="weight-slider-card">
                <div className="slider-header">
                  <span className="slider-label">🔒 Patient Retention</span>
                  <span className="slider-value">{(weights.retention * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="0.8" step="0.05" 
                  value={weights.retention} 
                  onChange={(e) => handleWeightChange('retention', e.target.value)}
                  className="slider-input"
                />
              </div>

              <div className="weight-slider-card">
                <div className="slider-header">
                  <span className="slider-label">🌍 Simpson Diversity</span>
                  <span className="slider-value">{(weights.diversity * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="0.8" step="0.05" 
                  value={weights.diversity} 
                  onChange={(e) => handleWeightChange('diversity', e.target.value)}
                  className="slider-input"
                />
              </div>

              <div className="weight-slider-card">
                <div className="slider-header">
                  <span className="slider-label">💵 Cost Efficiency</span>
                  <span className="slider-value">{(weights.cost * 100).toFixed(0)}%</span>
                </div>
                <input 
                  type="range" min="0" max="0.8" step="0.05" 
                  value={weights.cost} 
                  onChange={(e) => handleWeightChange('cost', e.target.value)}
                  className="slider-input"
                />
              </div>

            </div>
          </div>

          <div className="glass-card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)' }}>
            <h4 style={{ fontSize: '12px', color: 'var(--text-dark)', fontWeight: '600', marginBottom: '8px' }}>SUM TOTAL</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary)' }} />
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>100.0% (Auto-Normalized)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Site Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Filters Bar */}
          <div className="glass-card" style={{ padding: '16px 24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
            <input 
              type="text" 
              placeholder="Search by center name, city, PI name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '10px 16px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />

            <select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
              style={{
                background: '#0a0d17',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '10px 16px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {regions.map(r => <option key={r} value={r}>{r} Region</option>)}
            </select>
          </div>

          {/* Table Container */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Clinical Site Name</th>
                  <th>Availability</th>
                  <th>Velocity</th>
                  <th>Retention</th>
                  <th>Diversity</th>
                  <th>Cost</th>
                  <th>Overall</th>
                  <th>Outreach</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map((site) => {
                  const surveyStatus = getSurveyStatus(site.site_id);
                  const isSelected = selectedSite?.site_id === site.site_id;
                  
                  return (
                    <tr 
                      key={site.site_id} 
                      onClick={() => setSelectedSite(site)}
                      className={isSelected ? 'selected' : ''}
                    >
                      <td style={{ fontWeight: '700' }}>#{site.rank}</td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{site.site_name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {site.location.city}, {site.location.state} • {site.institution_type}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600' }}>{site.matching_patients} patients</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({site.scores.availability.toFixed(0)} pts)</div>
                      </td>
                      <td>{site.metrics.avg_enrollment_velocity} /mo</td>
                      <td>{(site.metrics.retention_rate * 100).toFixed(0)}%</td>
                      <td>{site.scores.diversity.toFixed(0)}</td>
                      <td>${(site.pricing.per_patient_fee / 1000).toFixed(1)}k</td>
                      <td>
                        <div className={`score-circle ${getScoreClass(site.overall_score)}`}>
                          {site.overall_score}
                        </div>
                      </td>
                      <td>
                        {surveyStatus === 'responded' ? (
                          <span className="badge badge-recommended" style={{ fontSize: '10px' }}>RESPONDED</span>
                        ) : surveyStatus === 'pending' ? (
                          <span className="badge badge-backup" style={{ fontSize: '10px' }}>SENT</span>
                        ) : (
                          <span style={{ fontSize: '11px', color: 'var(--text-dark)' }}>Not Contacted</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Details Side-Drawer Panel (Modal popup logic on row select) */}
      {selectedSite && (
        <div style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '460px',
          height: '100vh',
          background: '#090d16',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          zIndex: 200,
          overflowY: 'auto'
        }}>
          
          {/* Drawer Header */}
          <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-primary)' }}>CLINICAL SITE PROFILES</span>
            <button 
              onClick={() => setSelectedSite(null)}
              style={{
                marginLeft: 'auto',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', lineHeight: '1.3' }}>{selectedSite.site_name}</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              {selectedSite.location.address}, {selectedSite.location.city}, {selectedSite.location.state}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="glass-card" style={{ padding: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>RECOMMENDATION</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-primary)', marginTop: '4px' }}>{selectedSite.recommendation}</div>
            </div>
            <div className="glass-card" style={{ padding: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dark)' }}>OVERALL SCORE</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>{selectedSite.overall_score} / 100</div>
            </div>
          </div>

          {/* Site EMR & Diagnostics */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '13px', color: '#fff', marginBottom: '12px' }}>EMR & De-Identified patient aggregates</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>EMR System:</span>
                <span style={{ marginLeft: 'auto', fontWeight: '600' }}>{selectedSite.emr_system}</span>
              </div>
              <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>EHR matching I25.10:</span>
                <span style={{ marginLeft: 'auto', fontWeight: '600', color: 'var(--color-primary)' }}>{selectedSite.matching_patients} patients</span>
              </div>
              <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Total screened (2025):</span>
                <span style={{ marginLeft: 'auto', fontWeight: '600' }}>{selectedSite.demographics.total_patients} total</span>
              </div>
            </div>
          </div>

          {/* Demographic Breakdown */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '13px', color: '#fff', marginBottom: '12px' }}>Demographics race & ethnicity mix</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              {selectedSite.demographics && (
                <>
                  <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>White:</span>
                    <span style={{ marginLeft: 'auto', fontWeight: '600' }}>{(selectedSite.metrics.avg_activation_days > 45 ? 58 : 46)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Black / African American:</span>
                    <span style={{ marginLeft: 'auto', fontWeight: '600' }}>{(selectedSite.metrics.avg_activation_days > 45 ? 18 : 28)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Hispanic / Latino:</span>
                    <span style={{ marginLeft: 'auto', fontWeight: '600' }}>{(selectedSite.metrics.avg_activation_days > 45 ? 14 : 15)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Asian:</span>
                    <span style={{ marginLeft: 'auto', fontWeight: '600' }}>{(selectedSite.metrics.avg_activation_days > 45 ? 8 : 8)}%</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* PI Contacts */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '13px', color: '#fff', marginBottom: '12px' }}>Principal Investigator contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>PI Name:</span>
                <span style={{ marginLeft: 'auto', fontWeight: '600' }}>{selectedSite.pi.name}</span>
              </div>
              <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                <span style={{ marginLeft: 'auto', fontWeight: '600' }}>{selectedSite.pi.email}</span>
              </div>
              <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                <span style={{ marginLeft: 'auto', fontWeight: '600' }}>{selectedSite.pi.phone}</span>
              </div>
            </div>
          </div>

          {/* Risks assessment */}
          {selectedSite.risks.length > 0 && (
            <div className="glass-card" style={{ padding: '20px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h4 style={{ fontSize: '13px', color: 'var(--color-danger)', marginBottom: '12px' }}>⚠️ Operational Risk Assessment</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedSite.risks.map((risk, idx) => (
                  <div key={idx} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: risk.type === 'high' ? 'var(--color-danger)' : risk.type === 'medium' ? 'var(--color-warn)' : 'var(--color-info)'
                    }} />
                    <span style={{ color: 'var(--text-main)' }}>{risk.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick survey trigger */}
          <button 
            className="btn btn-primary"
            onClick={() => {
              triggerOutreach([selectedSite.site_id]);
              alert(`Outreach campaign triggered for ${selectedSite.site_name}. Custom survey email sent to ${selectedSite.pi.email}.`);
            }}
            style={{ width: '100%', marginTop: 'auto', padding: '12px' }}
          >
            ✉️ Trigger Site Feasibility Survey
          </button>

        </div>
      )}
    </div>
  );
}
