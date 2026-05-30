// server.js - TrialSync Agent Backend Server (Dual-Mode MongoDB Engine)

import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import { mockSites, mockPatientPopulations, sampleProtocol } from './src/mockData.js';
import { calculateScores } from './src/utils/scoringEngine.js';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let db = null;
let client = null;
let isMockMode = true;

// Mock database storage in memory
const memoryDb = {
  protocols: [sampleProtocol],
  sites: mockSites,
  patient_populations: mockPatientPopulations,
  site_scores: [],
  feasibility_surveys: [],
  agent_logs: [
    {
      _id: "log_init",
      timestamp: new Date().toISOString(),
      protocol_number: "P-2026-CV-001",
      action: "database_init",
      input: { status: "initialized" },
      output: { message: "Mock databases loaded successfully." },
      model: "system",
      latency_ms: 12,
      status: "success"
    }
  ],
  alerts: [
    {
      id: "alert_1",
      type: "medium",
      category: "outreach",
      title: "Outreach Reminder Alert",
      message: "Site #3 (Mayo Clinic) has not responded to feasibility survey after 48 hours. Recommend follow-up.",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      read: false
    }
  ]
};

// Establish Database Connection
async function connectDb() {
  if (MONGODB_URI) {
    try {
      console.log("⚡ Connecting to MongoDB Atlas...");
      client = new MongoClient(MONGODB_URI);
      await client.connect();
      db = client.db('trialsync');
      isMockMode = false;
      console.log("✅ Successfully connected to MongoDB Atlas database: 'trialsync'");
      
      // Seed collections if empty
      const sitesCount = await db.collection('sites').countDocuments();
      if (sitesCount === 0) {
        console.log("🌱 Database is empty. Seeding collections...");
        await db.collection('sites').insertMany(mockSites);
        await db.collection('patient_populations').insertMany(mockPatientPopulations);
        await db.collection('protocols').insertOne(sampleProtocol);
        console.log("🌱 Collections seeded successfully.");
      }
    } catch (error) {
      console.error("❌ Failed to connect to MongoDB Atlas. Dropping back to Mock Fallback Mode.", error.message);
      isMockMode = true;
    }
  } else {
    console.log("ℹ️ No MONGODB_URI provided. Running in Mock Fallback Mode (In-Memory Database).");
    isMockMode = true;
  }
}

// REST Webhook endpoints for Google Cloud Agent Builder Custom Tools

// 1. Tool Endpoint: Parse Protocol
app.post('/api/agent/parse-protocol', async (req, res) => {
  const { protocolText } = req.body;
  const startTime = Date.now();
  console.log("📥 Received protocol text for parsing (Tool Call)...");

  // In production, this would invoke Gemini 3 to parse the text.
  // We simulate the extraction of the P-2026-CV-001 protocol details.
  const protocol = {
    ...sampleProtocol,
    _id: new ObjectId(),
    protocol_number: `P-${Date.now().toString().slice(-6)}`,
    study_title: "Phase 3 Cardiology Prevention Trial (AUTO-EXTRACT)",
    uploaded_at: new Date().toISOString()
  };

  const log = {
    timestamp: new Date().toISOString(),
    protocol_number: protocol.protocol_number,
    action: "protocol_parsing",
    input: { text_length: protocolText?.length || 100 },
    output: { protocol_number: protocol.protocol_number, criteria_extracted: protocol.inclusion_criteria.length },
    model: "gemini-3-pro",
    latency_ms: Date.now() - startTime,
    status: "success"
  };

  if (isMockMode) {
    memoryDb.protocols.push(protocol);
    memoryDb.agent_logs.push(log);
  } else {
    await db.collection('protocols').insertOne(protocol);
    await db.collection('agent_logs').insertOne(log);
  }

  res.json({
    success: true,
    protocol_number: protocol.protocol_number,
    study_title: protocol.study_title,
    phase: protocol.phase,
    therapeutic_area: protocol.therapeutic_area,
    inclusion_criteria: protocol.inclusion_criteria,
    exclusion_criteria: protocol.exclusion_criteria,
    target_enrollment: protocol.target_enrollment
  });
});

// 2. Tool Endpoint: Find & Query Patient Populations (Geospatial & Demographics)
app.post('/api/agent/query-patients', async (req, res) => {
  const { icd10_codes } = req.body;
  const startTime = Date.now();
  console.log(`📥 Querying patient populations for ICD-10 codes: ${JSON.stringify(icd10_codes)} (Tool Call)...`);

  let matchedPopulations = [];
  
  if (isMockMode) {
    matchedPopulations = memoryDb.patient_populations.filter(pop => 
      pop.conditions.some(cond => icd10_codes.includes(cond.icd10_code))
    );
  } else {
    matchedPopulations = await db.collection('patient_populations').find({
      "conditions.icd10_code": { $in: icd10_codes }
    }).toArray();
  }

  const log = {
    timestamp: new Date().toISOString(),
    protocol_number: "P-2026-CV-001",
    action: "patient_query",
    input: { icd10_codes },
    output: { matching_sites_count: matchedPopulations.length },
    model: "gemini-3-flash",
    latency_ms: Date.now() - startTime,
    status: "success"
  };

  if (isMockMode) {
    memoryDb.agent_logs.push(log);
  } else {
    await db.collection('agent_logs').insertOne(log);
  }

  res.json({
    success: true,
    sites_found: matchedPopulations.length,
    results: matchedPopulations.map(pop => ({
      site_id: pop.site_id,
      EMR: pop.emr_system,
      conditions: pop.conditions.filter(c => icd10_codes.includes(c.icd10_code))
    }))
  });
});

// 3. Tool Endpoint: Score & Rank Sites
app.post('/api/agent/score-sites', async (req, res) => {
  const { protocol_number, weights } = req.body;
  const startTime = Date.now();
  console.log(`📥 Computing weighted scores for protocol: ${protocol_number}...`);

  let activeProtocol = sampleProtocol;
  if (isMockMode) {
    activeProtocol = memoryDb.protocols.find(p => p.protocol_number === protocol_number) || sampleProtocol;
  } else {
    activeProtocol = await db.collection('protocols').findOne({ protocol_number }) || sampleProtocol;
  }

  const scoredList = calculateScores(weights, activeProtocol);

  const log = {
    timestamp: new Date().toISOString(),
    protocol_number,
    action: "site_scoring",
    input: { weights },
    output: { top_site: scoredList[0]?.site_name, total_scored: scoredList.length },
    model: "gemini-3-flash",
    latency_ms: Date.now() - startTime,
    status: "success"
  };

  if (isMockMode) {
    memoryDb.site_scores = scoredList;
    memoryDb.agent_logs.push(log);
  } else {
    await db.collection('site_scores').deleteMany({ protocol_number });
    await db.collection('site_scores').insertMany(scoredList.map(s => ({ ...s, protocol_number })));
    await db.collection('agent_logs').insertOne(log);
  }

  res.json({
    success: true,
    protocol_number,
    top_recommended_site: scoredList[0]?.site_name,
    rankings: scoredList.slice(0, 10).map(s => ({
      rank: s.rank,
      site_id: s.site_id,
      site_name: s.site_name,
      overall_score: s.overall_score,
      recommendation: s.recommendation
    }))
  });
});

// 4. Tool Endpoint: Trigger Outreach (Feasibility Surveys)
app.post('/api/agent/send-surveys', async (req, res) => {
  const { protocol_number, site_ids } = req.body;
  const startTime = Date.now();
  console.log(`📥 Initiating feasibility survey outreach for ${site_ids.length} sites...`);

  const outreachRecords = site_ids.map(siteId => ({
    _id: new ObjectId().toString(),
    protocol_number,
    site_id: siteId,
    survey_sent_at: new Date().toISOString(),
    status: "pending",
    reminders_sent: [],
    recipient_email: "schen@stanford.edu",
    created_by: "trialsync-agent"
  }));

  const log = {
    timestamp: new Date().toISOString(),
    protocol_number,
    action: "outreach_campaign",
    input: { sites_targeted: site_ids.length },
    output: { campaigns_created: outreachRecords.length },
    model: "gemini-3-pro",
    latency_ms: Date.now() - startTime,
    status: "success"
  };

  if (isMockMode) {
    memoryDb.feasibility_surveys.push(...outreachRecords);
    memoryDb.agent_logs.push(log);
  } else {
    await db.collection('feasibility_surveys').insertMany(outreachRecords);
    await db.collection('agent_logs').insertOne(log);
  }

  res.json({
    success: true,
    emails_sent: site_ids.length,
    status: "pending_responses"
  });
});

// Helper REST APIs for the React Frontend App

app.get('/api/sites', async (req, res) => {
  if (isMockMode) {
    res.json(memoryDb.sites);
  } else {
    const list = await db.collection('sites').find({}).toArray();
    res.json(list);
  }
});

app.get('/api/protocols', async (req, res) => {
  if (isMockMode) {
    res.json(memoryDb.protocols);
  } else {
    const list = await db.collection('protocols').find({}).toArray();
    res.json(list);
  }
});

app.get('/api/site-scores', async (req, res) => {
  if (isMockMode) {
    res.json(memoryDb.site_scores);
  } else {
    const list = await db.collection('site_scores').find({}).toArray();
    res.json(list);
  }
});

app.get('/api/feasibility', async (req, res) => {
  if (isMockMode) {
    res.json(memoryDb.feasibility_surveys);
  } else {
    const list = await db.collection('feasibility_surveys').find({}).toArray();
    res.json(list);
  }
});

app.post('/api/feasibility/respond', async (req, res) => {
  const { id, status, responseData } = req.body;
  console.log(`📥 Site survey response received: ID ${id} -> ${status}`);

  let updatedRecord = null;
  if (isMockMode) {
    const record = memoryDb.feasibility_surveys.find(f => f._id === id);
    if (record) {
      record.status = status;
      record.responded_at = new Date().toISOString();
      record.response_data = responseData;
      updatedRecord = record;
      
      // Generate real-time alert trigger
      if (status === 'responded') {
        const site = memoryDb.sites.find(s => s.site_id === record.site_id) || { site_name: "Clinical Site" };
        memoryDb.alerts.push({
          id: `alert_${Date.now()}`,
          type: "success",
          category: "outreach",
          title: "Feasibility Response",
          message: `🚨 ALERT: Survey completed by ${site.site_name} (PI: ${site.principal_investigator.name}). Setup time: ${site.historical_metrics.avg_activation_days} days. Status updated.`,
          timestamp: new Date().toISOString(),
          read: false
        });
      }
    }
  } else {
    await db.collection('feasibility_surveys').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          responded_at: new Date().toISOString(),
          response_data: responseData
        }
      }
    );
    updatedRecord = await db.collection('feasibility_surveys').findOne({ _id: new ObjectId(id) });
  }

  res.json({ success: true, record: updatedRecord });
});

app.get('/api/logs', async (req, res) => {
  if (isMockMode) {
    res.json(memoryDb.agent_logs.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
  } else {
    const list = await db.collection('agent_logs').find({}).sort({ timestamp: -1 }).toArray();
    res.json(list);
  }
});

app.get('/api/alerts', (req, res) => {
  res.json(memoryDb.alerts.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)));
});

app.post('/api/alerts/clear', (req, res) => {
  memoryDb.alerts = [];
  res.json({ success: true });
});

// Serve static files from Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all other routes to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Seeding standard assets if needed and listening
app.listen(PORT, async () => {
  await connectDb();
  console.log(`🚀 TrialSync Agent Tool Webhook Server active on port ${PORT}`);
  console.log(`📡 Agent Builder Grounding Endpoint: http://localhost:${PORT}/api/agent/...`);
});

