// App.jsx - Main Dashboard Shell & Navigation Coordinator (TrialSync Engine)

import React, { useState, useEffect } from 'react';
import { calculateScores } from './utils/scoringEngine.js';
import { sampleProtocol } from './mockData.js';

// Components
import LiveAgentRunner from './components/LiveAgentRunner.jsx';
import SiteScoringDashboard from './components/SiteScoringDashboard.jsx';
import OutreachCenter from './components/OutreachCenter.jsx';
import MongoMCPConsole from './components/MongoMCPConsole.jsx';
import AuditTrail from './components/AuditTrail.jsx';
import ExecutiveReport from './components/ExecutiveReport.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('agent-runner');
  
  // Scoring parameters state
  const [weights, setWeights] = useState({
    availability: 0.30,
    velocity: 0.25,
    activation: 0.15,
    retention: 0.15,
    diversity: 0.10,
    cost: 0.05
  });

  const [protocol, setProtocol] = useState(sampleProtocol);
  const [scoredSites, setScoredSites] = useState([]);
  const [feasibilityList, setFeasibilityList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Real-time server connection helpers
  useEffect(() => {
    fetchData();
    // Poll for alerts and logs every 5 seconds
    const interval = setInterval(() => {
      fetchAlertsAndLogs();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Recalculate scores locally when weights or protocol changes
  useEffect(() => {
    const list = calculateScores(weights, protocol);
    setScoredSites(list);
  }, [weights, protocol]);

  const fetchData = async () => {
    try {
      const resSites = await fetch('/api/site-scores');
      if (resSites.ok) {
        const data = await resSites.json();
        if (data.length > 0) setScoredSites(data);
      }
      
      const resFeas = await fetch('/api/feasibility');
      if (resFeas.ok) {
        const data = await resFeas.json();
        setFeasibilityList(data);
      }

      fetchAlertsAndLogs();
    } catch (e) {
      console.warn("Express server not active. Operating in full standalone browser mock mode.");
    }
  };

  const fetchAlertsAndLogs = async () => {
    try {
      const resAlerts = await fetch('/api/alerts');
      if (resAlerts.ok) {
        const data = await resAlerts.json();
        setAlerts(data);
      }
      
      const resLogs = await fetch('/api/logs');
      if (resLogs.ok) {
        const data = await resLogs.json();
        setAuditLogs(data);
      }
    } catch (e) {
      // Local fallback logs if server is down
      if (auditLogs.length === 0) {
        setAuditLogs([
          {
            timestamp: new Date().toISOString(),
            protocol_number: "P-2026-CV-001",
            action: "standalone_mode",
            input: { environment: "browser" },
            output: { message: "Running in local standalone mode. Database queries simulated." },
            model: "system",
            latency_ms: 5,
            status: "success"
          }
        ]);
      }
    }
  };

  const triggerOutreach = async (selectedIds) => {
    try {
      const res = await fetch('/api/agent/send-surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          protocol_number: protocol.protocol_number,
          site_ids: selectedIds
        })
      });
      if (res.ok) {
        fetchData();
      } else {
        simulateOutreachFallback(selectedIds);
      }
    } catch (e) {
      simulateOutreachFallback(selectedIds);
    }
  };

  const simulateOutreachFallback = (selectedIds) => {
    const newSurveys = selectedIds.map(id => ({
      _id: `mock_survey_${id}_${Date.now()}`,
      protocol_number: protocol.protocol_number,
      site_id: id,
      survey_sent_at: new Date().toISOString(),
      status: "pending",
      reminders_sent: [],
      recipient_email: "jsmith@jh.edu",
      created_by: "trialsync-agent"
    }));
    
    setFeasibilityList(prev => [...newSurveys, ...prev]);
    
    // Add log
    setAuditLogs(prev => [
      {
        timestamp: new Date().toISOString(),
        protocol_number: protocol.protocol_number,
        action: "outreach_campaign_fallback",
        input: { sites_targeted: selectedIds.length },
        output: { campaigns_created: selectedIds.length },
        model: "gemini-3-pro",
        latency_ms: 125,
        status: "success"
      },
      ...prev
    ]);
  };

  const handleMockRespond = async (surveyId, status) => {
    try {
      const res = await fetch('/api/feasibility/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: surveyId, status, responseData: { comments: "Ready to enroll patients immediately." } })
      });
      if (res.ok) {
        fetchData();
      } else {
        simulateSurveyResponseFallback(surveyId, status);
      }
    } catch (e) {
      simulateSurveyResponseFallback(surveyId, status);
    }
  };

  const simulateSurveyResponseFallback = (surveyId, status) => {
    setFeasibilityList(prev => prev.map(f => {
      if (f._id === surveyId) {
        // Trigger alert in list
        const matchedSite = scoredSites.find(s => s.site_id === f.site_id) || { site_name: "Johns Hopkins Hospital" };
        if (status === 'responded') {
          const newAlert = {
            id: `alert_${Date.now()}`,
            type: "success",
            category: "outreach",
            title: "Feasibility Response Received",
            message: `🚨 ALERT: Survey completed by ${matchedSite.site_name} (PI: Dr. Sarah Chen). Setup time: ${matchedSite.metrics?.avg_activation_days || 45} days. Status updated.`,
            timestamp: new Date().toISOString(),
            read: false
          };
          setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
        }
        return {
          ...f,
          status,
          responded_at: new Date().toISOString(),
          response_data: { comments: "Fully equipped with Echocardiogram labs and cardiology sub-investigators." }
        };
      }
      return f;
    }));
  };

  const clearAlerts = async () => {
    try {
      await fetch('/api/alerts/clear', { method: 'POST' });
      setAlerts([]);
    } catch (e) {
      setAlerts([]);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 22H22L12 2Z" fill="#000" stroke="#10b981" strokeWidth="2"/>
              <circle cx="12" cy="14" r="3" fill="#10b981"/>
            </svg>
          </div>
          <span className="logo-text">TrialSync Agent</span>
        </div>

        <ul className="nav-menu">
          <li 
            className={`nav-item ${activeTab === 'agent-runner' ? 'active' : ''}`}
            onClick={() => setActiveTab('agent-runner')}
          >
            🤖 Live Agent Runner
          </li>
          <li 
            className={`nav-item ${activeTab === 'site-scoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('site-scoring')}
          >
            📊 Site Rankings
          </li>
          <li 
            className={`nav-item ${activeTab === 'outreach' ? 'active' : ''}`}
            onClick={() => setActiveTab('outreach')}
          >
            📧 Outreach Campaign
          </li>
          <li 
            className={`nav-item ${activeTab === 'mongo-console' ? 'active' : ''}`}
            onClick={() => setActiveTab('mongo-console')}
          >
            💾 MongoDB MCP Console
          </li>
          <li 
            className={`nav-item ${activeTab === 'audit-trail' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit-trail')}
          >
            📜 FDA Audit Trail
          </li>
          <li 
            className={`nav-item ${activeTab === 'executive-report' ? 'active' : ''}`}
            onClick={() => setActiveTab('executive-report')}
          >
            📋 Executive Report
          </li>
        </ul>

        <div style={{ marginTop: 'auto', padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-dark)', marginBottom: '4px' }}>HACKATHON TRACK</div>
          <div style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--color-primary)' }}>🟢 MONGODB PARTNER BUCKET</div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Render Tab Contents */}
        {activeTab === 'agent-runner' && (
          <LiveAgentRunner 
            protocol={protocol}
            weights={weights}
            scoredSites={scoredSites}
            triggerOutreach={triggerOutreach}
            setAuditLogs={setAuditLogs}
            setActiveTab={setActiveTab}
          />
        )}
        
        {activeTab === 'site-scoring' && (
          <SiteScoringDashboard 
            scoredSites={scoredSites}
            weights={weights}
            setWeights={setWeights}
            protocol={protocol}
            triggerOutreach={triggerOutreach}
            feasibilityList={feasibilityList}
          />
        )}

        {activeTab === 'outreach' && (
          <OutreachCenter 
            feasibilityList={feasibilityList}
            scoredSites={scoredSites}
            handleMockRespond={handleMockRespond}
            alerts={alerts}
            clearAlerts={clearAlerts}
          />
        )}

        {activeTab === 'mongo-console' && (
          <MongoMCPConsole 
            weights={weights}
            protocol={protocol}
          />
        )}

        {activeTab === 'audit-trail' && (
          <AuditTrail 
            auditLogs={auditLogs}
          />
        )}

        {activeTab === 'executive-report' && (
          <ExecutiveReport 
            scoredSites={scoredSites}
            protocol={protocol}
            weights={weights}
          />
        )}
      </main>
    </div>
  );
}
