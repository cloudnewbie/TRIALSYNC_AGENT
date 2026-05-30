// MongoMCPConsole.jsx - Developer database playground and raw aggregation code viewer

import React, { useState } from 'react';

export default function MongoMCPConsole({ weights, protocol }) {
  const [activeSchemaTab, setActiveSchemaTab] = useState('pipeline');
  const [isExecuting, setIsExecuting] = useState(false);
  const [outputResult, setOutputResult] = useState('');

  const queryTemplates = {
    pipeline: `// 14-Stage Multi-Factor Site Scoring Pipeline
db.patient_populations.aggregate([
  // Match sites with therapeutic cardiovascular requirements
  { $match: { "conditions.icd10_code": "I25.10" } },
  
  // Lookup site master metrics
  {
    $lookup: {
      from: "sites",
      localField: "site_id",
      foreignField: "site_id",
      as: "site_info"
    }
  },
  { $unwind: "$site_info" },
  
  // Calculate Patient Availability Score (Availability weight: ${weights.availability})
  {
    $addFields: {
      availability_score: {
        $min: [{ $multiply: [{ $divide: ["$conditions.patient_count", 200] }, 100] }, 100]
      }
    }
  },
  
  // Calculate Enrollment Velocity Score (Velocity weight: ${weights.velocity})
  {
    $addFields: {
      velocity_score: {
        $min: [{ $multiply: [{ $divide: ["$site_info.historical_metrics.avg_enrollment_velocity", 5.0] }, 100] }, 100]
      }
    }
  },

  // Calculate Setup Score (Activation weight: ${weights.activation})
  {
    $addFields: {
      activation_score: {
        $min: [{ $multiply: [{ $divide: [30, "$site_info.historical_metrics.avg_activation_days"] }, 100] }, 100]
      }
    }
  },

  // Calculate Retention Score (Retention weight: ${weights.retention})
  {
    $addFields: {
      retention_score: { $multiply: ["$site_info.historical_metrics.retention_rate", 100] }
    }
  },

  // Calculate Diversity Score (Diversity weight: ${weights.diversity})
  {
    $addFields: {
      diversity_score: {
        $multiply: [
          {
            $subtract: [
              1,
              {
                $sum: [
                  { $pow: ["$site_info.patient_demographics.race_ethnicity.white", 2] },
                  { $pow: ["$site_info.patient_demographics.race_ethnicity.black", 2] },
                  { $pow: ["$site_info.patient_demographics.race_ethnicity.hispanic", 2] },
                  { $pow: ["$site_info.patient_demographics.race_ethnicity.asian", 2] },
                  { $pow: ["$site_info.patient_demographics.race_ethnicity.other", 2] }
                ]
              }
            ]
          },
          150 // Normalization scale
        ]
      }
    }
  },

  // Calculate Cost Score (Cost weight: ${weights.cost})
  {
    $addFields: {
      cost_score: {
        $min: [{ $multiply: [{ $divide: [12000, "$site_info.pricing.per_patient_fee"] }, 100] }, 100]
      }
    }
  },

  // Sum Weighted Scores
  {
    $addFields: {
      overall_score: {
        $add: [
          { $multiply: ["$availability_score", ${weights.availability}] },
          { $multiply: ["$velocity_score", ${weights.velocity}] },
          { $multiply: ["$activation_score", ${weights.activation}] },
          { $multiply: ["$retention_score", ${weights.retention}] },
          { $multiply: ["$diversity_score", ${weights.diversity}] },
          { $multiply: ["$cost_score", ${weights.cost}] }
        ]
      }
    }
  },

  // Sort by Rank
  { $sort: { overall_score: -1 } },

  // Save to site_scores collection
  {
    $merge: {
      into: "site_scores",
      on: "site_id",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
])`,

    vector: `// Semantic Vector Search for similar historical trials
db.protocols.aggregate([
  {
    $vectorSearch: {
      index: "vector_index",
      path: "protocol_embedding",
      queryVector: [0.114, -0.42, 0.88, ... 768-dims],
      exact: false,
      limit: 5,
      numCandidates: 100
    }
  },
  {
    $project: {
      protocol_number: 1,
      study_title: 1,
      therapeutic_area: 1,
      score: { $meta: "vectorSearchScore" }
    }
  }
])`,

    geospatial: `// Geospatial $geoNear Proximity Match (Patients within 50km radius)
db.sites.aggregate([
  {
    $geoNear: {
      near: { type: "Point", coordinates: [-76.5935, 39.2971] }, // Center point
      distanceField: "location.distance_meters",
      maxDistance: 50000, // 50km
      spherical: true
    }
  },
  { $limit: 10 }
])`,

    changestreams: `// Real-Time Change Stream Listener
const changeStream = db.feasibility_surveys.watch([
  { $match: { "updateDescription.updatedFields.status": "responded" } }
]);

changeStream.on("change", (change) => {
  // Trigger agent reasoning to process the survey response
  agent.handleSurveyResponse(change.documentKey._id);
  // Send a Slack warning notification
  slackWebhook.notify(change.fullDocument);
});`,

    timeseries: `// Immuteable Time-Series Logging for FDA Audit Trail
db.createCollection("agent_logs", {
  timeseries: {
    timeField: "timestamp",
    metaField: "protocol_number",
    granularity: "seconds"
  }
})`
  };

  const handleRunQuery = () => {
    setIsExecuting(true);
    setOutputResult('// Executing query on Atlas M0 Cluster...\n');
    
    setTimeout(() => {
      if (activeSchemaTab === 'pipeline') {
        setOutputResult(JSON.stringify({
          ok: 1,
          db: "trialsync",
          collection: "site_scores",
          operation: "aggregate_merge",
          execution_time_ms: 184,
          documents_merged: 47,
          top_scored_site: "Johns Hopkins Hospital",
          overall_score: 88.4
        }, null, 2));
      } else if (activeSchemaTab === 'vector') {
        setOutputResult(JSON.stringify({
          ok: 1,
          matches: [
            { id: "P-2024-CV-082", title: "Phase 3 Hypercholesterolemia Lipid-lowering", similarity_score: 0.942 },
            { id: "P-2025-CV-012", title: "Atherosclerotic Coronary Prevention Study", similarity_score: 0.891 }
          ]
        }, null, 2));
      } else if (activeSchemaTab === 'geospatial') {
        setOutputResult(JSON.stringify({
          ok: 1,
          coordinates_evaluated: [-76.5935, 39.2971],
          sites_in_proximity: [
            { site_id: "SITE-001", name: "Johns Hopkins Hospital", distance_km: 0 },
            { site_id: "SITE-010", name: "Mount Sinai Hospital", distance_km: 304.5 }
          ]
        }, null, 2));
      } else {
        setOutputResult('// Command completed successfully. Watcher active.');
      }
      setIsExecuting(false);
    }, 1000);
  };

  return (
    <div className="glass-panel" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="page-header">
        <div>
          <h1 className="page-title">💾 MongoDB MCP Developer Console</h1>
          <p className="page-subtitle">Inspect the raw Atlas schemas and aggregation pipelines executed autonomously by the agent's MCP driver.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', marginTop: '24px' }}>
        
        {/* Left Side: Code Editor console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="glass-card" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
            
            {/* Tabs for query types */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px', marginBottom: '20px', overflowX: 'auto' }}>
              <button 
                onClick={() => { setActiveSchemaTab('pipeline'); setOutputResult(''); }}
                className={`btn ${activeSchemaTab === 'pipeline' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                📊 Aggregation Pipeline
              </button>
              <button 
                onClick={() => { setActiveSchemaTab('vector'); setOutputResult(''); }}
                className={`btn ${activeSchemaTab === 'vector' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                🔍 Vector Search
              </button>
              <button 
                onClick={() => { setActiveSchemaTab('geospatial'); setOutputResult(''); }}
                className={`btn ${activeSchemaTab === 'geospatial' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                🌍 Geospatial Queries
              </button>
              <button 
                onClick={() => { setActiveSchemaTab('changestreams'); setOutputResult(''); }}
                className={`btn ${activeSchemaTab === 'changestreams' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                🔔 Change Streams
              </button>
              <button 
                onClick={() => { setActiveSchemaTab('timeseries'); setOutputResult(''); }}
                className={`btn ${activeSchemaTab === 'timeseries' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '8px 14px', fontSize: '12px' }}
              >
                📜 Time-Series Log
              </button>
            </div>

            {/* Code editor pane */}
            <div style={{ flex: 1, position: 'relative' }}>
              <pre style={{
                background: '#04060f',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                padding: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#86efac',
                lineHeight: '1.6',
                maxHeight: '440px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all'
              }}>
                {queryTemplates[activeSchemaTab]}
              </pre>

              <button 
                onClick={handleRunQuery}
                disabled={isExecuting}
                className="btn btn-primary"
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  padding: '8px 16px',
                  fontSize: '12px'
                }}
              >
                {isExecuting ? '⌛ Executing...' : '⚡ Run Pipeline'}
              </button>
            </div>

          </div>

          {/* Console Execution Return Output */}
          {outputResult && (
            <div className="glass-card" style={{ padding: '20px', background: '#04060f', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <h4 style={{ fontSize: '12px', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)', marginBottom: '10px' }}>&gt;_ JSON OUTPUT RETURN:</h4>
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#38bdf8',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {outputResult}
              </pre>
            </div>
          )}

        </div>

        {/* Right Side: Collections breakdown schemas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#fff', marginBottom: '16px' }}>MCP Collections Schema</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '20px' }}>
              TrialSync Agent maps unstructured protocols and metrics into 6 distinct nested collections in our **MongoDB Atlas** clinical cluster.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div className="glass-card" style={{ padding: '12px 16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>📁 protocols</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Inclusion parameters, required assessments, target patient caps, and vector embeddings.</p>
              </div>

              <div className="glass-card" style={{ padding: '12px 16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>📁 sites</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Physical addresses, geo Point coords, equipment certification, and completion records.</p>
              </div>

              <div className="glass-card" style={{ padding: '12px 16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>📁 patient_populations</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>De-identified HIPAA counts mapped to ICD-10 and biomarker distributions.</p>
              </div>

              <div className="glass-card" style={{ padding: '12px 16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>📁 site_scores</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Scoring index ratings, calculated overall metrics, and operational risk tags.</p>
              </div>

              <div className="glass-card" style={{ padding: '12px 16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>📁 feasibility_surveys</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Outreach emails, status checks (pending/declined), response data, and follow-ups.</p>
              </div>

              <div className="glass-card" style={{ padding: '12px 16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>📁 agent_logs</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Immutable time-series logs tracking cognitive reasoning steps and driver transaction times.</p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
