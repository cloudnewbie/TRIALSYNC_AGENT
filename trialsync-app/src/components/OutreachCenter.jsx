// OutreachCenter.jsx - Feasibility survey outreach tracking, change-stream simulator, and notification feed

import React, { useState } from 'react';

export default function OutreachCenter({ feasibilityList, scoredSites, handleMockRespond, alerts, clearAlerts }) {
  const [activeSurveySim, setActiveSurveySim] = useState(null);
  
  const getSiteName = (siteId) => {
    const site = scoredSites.find(s => s.site_id === siteId);
    return site ? site.site_name : "Clinical Site";
  };

  const getPiEmail = (siteId) => {
    const site = scoredSites.find(s => s.site_id === siteId);
    return site ? site.pi.email : "pi@hospital.edu";
  };

  const triggerSimResponse = (survey, answer) => {
    handleMockRespond(survey._id, answer);
    setActiveSurveySim(null);
  };

  return (
    <div className="glass-panel" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📧 Feasibility Outreach & Email Orchestration</h1>
          <p className="page-subtitle">Track survey dispatch status, simulate PI responses, and monitor real-time change stream alerts.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', marginTop: '24px' }}>
        
        {/* Left Column: Sent Surveys List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#fff' }}>Outreach Campaign Log</h3>
            
            {feasibilityList.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-dark)' }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>✉️</span>
                No surveys sent yet. Go to the "Live Agent Runner" tab to start your first campaign!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {feasibilityList.map(survey => {
                  const siteName = getSiteName(survey.site_id);
                  const email = getPiEmail(survey.site_id);
                  
                  return (
                    <div 
                      key={survey._id} 
                      className="glass-card" 
                      style={{
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderLeft: survey.status === 'responded' ? '3px solid var(--color-primary)' : survey.status === 'declined' ? '3px solid var(--color-danger)' : '3px solid var(--color-warn)'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{siteName}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Sent to: <span style={{ fontFamily: 'var(--font-mono)' }}>{email}</span> • Sent Date: {new Date(survey.survey_sent_at).toLocaleDateString()}
                        </p>
                        
                        {survey.responded_at && (
                          <p style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px' }}>
                            ✓ Responded: {new Date(survey.responded_at).toLocaleTimeString()}
                          </p>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {survey.status === 'pending' ? (
                          <>
                            <span className="badge badge-backup">PENDING RESPONSE</span>
                            <button 
                              className="btn btn-secondary"
                              onClick={() => setActiveSurveySim(survey)}
                              style={{ padding: '6px 12px', fontSize: '11px' }}
                            >
                              Simulate Response
                            </button>
                          </>
                        ) : survey.status === 'responded' ? (
                          <span className="badge badge-recommended">RESPONDED</span>
                        ) : (
                          <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>DECLINED</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Real-time Alert Hub */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(139, 92, 246, 0.02)' }}>
            <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>🔔 Live MongoDB Alerts</h3>
              {alerts.length > 0 && (
                <button 
                  onClick={clearAlerts}
                  style={{
                    marginLeft: 'auto',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-dark)',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Clear Feed
                </button>
              )}
            </div>
            
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '20px' }}>
              Real-time events captured using **MongoDB Change Streams**. Alerts trigger when feasibility survey states modify or population counts deviate.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
              {alerts.length === 0 ? (
                <div style={{ padding: '24px 0', textAlign: 'center', color: 'var(--text-dark)', fontSize: '12px' }}>
                  No active notifications. Trigger survey responses on the left to see live change stream alerts.
                </div>
              ) : (
                alerts.map(alert => (
                  <div 
                    key={alert.id} 
                    className="glass-card" 
                    style={{
                      padding: '12px 16px',
                      fontSize: '12px',
                      background: alert.type === 'success' ? 'rgba(16, 185, 129, 0.03)' : 'rgba(245, 158, 11, 0.03)',
                      border: alert.type === 'success' ? '1px solid rgba(16, 185, 129, 0.15)' : '1px solid rgba(245, 158, 11, 0.15)'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>{alert.title}</div>
                    <div style={{ color: 'var(--text-muted)', lineHeight: '1.4' }}>{alert.message}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-dark)', marginTop: '8px', textAlign: 'right' }}>
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Simulator Popup Modal Overlay */}
      {activeSurveySim && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 300
        }}>
          <div className="glass-panel" style={{ width: '420px', padding: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>Simulate Site Response</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '24px' }}>
              Mocks the action of the candidate Principal Investigator completing the TrialSync feasibility survey form. Updates the database and triggers a live change stream event.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                className="btn btn-primary"
                onClick={() => triggerSimResponse(activeSurveySim, 'responded')}
                style={{ width: '100%', padding: '12px' }}
              >
                👍 Complete Survey (Enrollment: YES)
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => triggerSimResponse(activeSurveySim, 'declined')}
                style={{ width: '100%', padding: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}
              >
                👎 Decline Outreach (Enrollment: NO)
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setActiveSurveySim(null)}
                style={{ width: '100%', padding: '12px', marginTop: '12px' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
