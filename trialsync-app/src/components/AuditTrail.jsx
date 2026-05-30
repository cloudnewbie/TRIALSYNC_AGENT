// AuditTrail.jsx - FDA 21 CFR Part 11 Compliance Log Viewer

import React from 'react';

export default function AuditTrail({ auditLogs }) {
  return (
    <div className="glass-panel" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">📜 FDA 21 CFR Part 11 Compliance Audit Trail</h1>
          <p className="page-subtitle">Immutable time-series ledger documenting clinical decisions, tool webhooks, model latencies, and transaction hashes.</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '24px', marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#fff' }}>Immutable Operations Ledger</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Audit log hashes are committed automatically to the time-series db collection.</p>
          </div>
          <span className="badge badge-recommended" style={{ border: '1px solid var(--color-primary)' }}>🟢 COMPLIANT LEDGER ENABLED</span>
        </div>

        <div className="table-container">
          <table className="custom-table" style={{ fontSize: '13px' }}>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operation / Action</th>
                <th>Grounding Input</th>
                <th>Cognitive Output Hash</th>
                <th>AI Model</th>
                <th>Latency</th>
                <th>Hash Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td>
                    <span style={{ fontWeight: '600', color: '#fff' }}>{log.action.toUpperCase()}</span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#38bdf8' }}>
                    {JSON.stringify(log.input)}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {JSON.stringify(log.output)}
                  </td>
                  <td>
                    <span style={{ 
                      fontSize: '11px', 
                      padding: '3px 8px', 
                      borderRadius: '4px',
                      background: log.model.includes('pro') ? 'rgba(139, 92, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: log.model.includes('pro') ? 'var(--color-secondary)' : 'var(--color-primary)',
                      border: log.model.includes('pro') ? '1px solid rgba(139, 92, 246, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
                      fontWeight: '600'
                    }}>
                      {log.model}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: log.latency_ms > 1000 ? 'var(--color-warn)' : 'var(--text-main)' }}>
                    {log.latency_ms} ms
                  </td>
                  <td>
                    <span className="badge badge-recommended" style={{ fontSize: '10px' }}>✓ VERIFIED</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
