# TrialSync Agent - Product Specification

**Google Gemini Agent Hackathon Submission**  
**Partner Track:** MongoDB  
**Version:** 1.0  
**Date:** May 30, 2026

---

## Executive Summary

### Product Name
**TrialSync Agent**

### Tagline
*"AI-Powered Clinical Trial Site Selection in 48 Hours, Not 6 Months"*

### What It Does
TrialSync Agent is an autonomous AI agent that revolutionizes clinical trial site selection by:
- **Parsing** complex trial protocol PDFs (50-200 pages)
- **Extracting** inclusion/exclusion criteria automatically
- **Matching** patient populations across 250+ clinical trial sites
- **Scoring** sites on 6 critical factors (availability, velocity, activation speed, retention, diversity, cost)
- **Generating** executive feasibility reports with site recommendations
- **Monitoring** site responses and alerting on risks

**Impact:** Reduces site selection from 24 weeks to 48 hours, saving $5M+ per trial.

---

## Problem Statement

### Current Challenge
Clinical trial sponsors (pharma/biotech) face massive inefficiencies in site selection:
- **Timeline:** 6 months average for site identification and feasibility
- **Cost:** $2M-$10M per trial in site selection/activation expenses
- **Failure Rate:** 40% of sites enroll ZERO patients
- **Manual Process:** PhD-level medical teams spend weeks reading 200-page protocols and manually querying sites

### Market Size
- $60B+ global clinical trial market
- 450,000+ active trials worldwide
- Site selection represents 15-20% of total trial costs
- $10B+ addressable market for site selection optimization

### Why This Problem Matters
- **Patient Lives:** Faster trials = faster drug approvals = lives saved
- **R&D Efficiency:** Site selection delays cascade through entire development timeline
- **Cost of Capital:** Every month of delay costs pharma companies $50M+ in lost revenue
- **Regulatory Pressure:** FDA/EMA prioritize patient diversity and trial efficiency

---

## Solution: TrialSync Agent

### Core Capabilities

#### 1. Autonomous Protocol Intelligence
- **PDF Parsing:** Extracts structured data from 50-200 page protocol documents
- **Criteria Extraction:** Identifies inclusion/exclusion criteria using Gemini 3 Pro
- **Entity Recognition:** Finds disease codes (ICD-10), drug names (RxNorm), age ranges, biomarker thresholds
- **Schema Mapping:** Structures unstructured medical text into MongoDB documents

#### 2. Patient Population Matching
- **Cross-Site Queries:** Searches de-identified patient counts across 250+ sites in real-time
- **Geospatial Analysis:** MongoDB geospatial queries for site proximity to patient populations
- **Demographic Filtering:** Matches age, gender, race/ethnicity criteria
- **Comorbidity Screening:** Identifies sites with appropriate patient mix

#### 3. Multi-Factor Site Scoring
Scores sites on 6 weighted factors:
1. **Patient Availability** (30%): Matching patient count at site
2. **Enrollment Velocity** (25%): Historical enrollment speed (patients/month)
3. **Activation Speed** (15%): Time from contract to first patient
4. **Retention Rate** (15%): % of enrolled patients completing trials
5. **Diversity Score** (10%): Race/ethnicity representation
6. **Cost Efficiency** (5%): Per-patient enrollment cost

#### 4. Automated Feasibility Management
- **Survey Generation:** Creates customized feasibility questionnaires
- **Email Orchestration:** Sends surveys to top 20-30 sites
- **Response Monitoring:** Tracks replies in real-time
- **Follow-Up Automation:** Sends reminders every 48 hours

#### 5. Executive Reporting
- **Ranked Site Lists:** Top 10-15 sites with detailed scorecards
- **Risk Analysis:** Flags concerns (low diversity, high cost, slow activation)
- **Timeline Projections:** Estimates enrollment completion dates
- **Budget Optimization:** Compares cost scenarios across site combinations

#### 6. Continuous Intelligence
- **Alert System:** Notifies stakeholders when sites respond or decline
- **Portfolio Monitoring:** Tracks multiple trials simultaneously
- **Audit Trail:** FDA-compliant logs of all agent decisions (stored in MongoDB)

---

## Technical Architecture

### Technology Stack

#### Core Platform
- **Agent Orchestration:** Google Cloud Agent Builder
- **Reasoning Engine:** Gemini 3 Flash (fast queries) + Gemini 3 Pro (complex reasoning)
- **Data Layer:** MongoDB Atlas (MCP integration)
- **User Interface:** Streamlit web app (demo/prototype)

#### Integration Layer
- **MongoDB MCP Server:** Handles all database operations via Model Context Protocol
- **Vector Search:** MongoDB Atlas Vector Search for semantic protocol matching
- **Aggregation Pipelines:** Complex multi-collection queries for site scoring

#### Tools & Extensions
- **PDF Parser Tool:** PyMuPDF + Gemini 3 Pro for protocol extraction
- **Email Service:** SendGrid API for feasibility survey distribution
- **Report Generator:** Python-based PDF creation for executive reports
- **Alert Service:** Slack/email notifications for stakeholder updates

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                      │
│                  (Streamlit Web App)                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              Google Cloud Agent Builder                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Gemini 3 Pro/Flash (Reasoning & Planning)           │  │
│  └───────────────────────┬──────────────────────────────┘  │
│                          │                                   │
│  ┌───────────────────────┼──────────────────────────────┐  │
│  │         Agent Tools                                   │  │
│  │  • PDF Parser          • Email Service                │  │
│  │  • Report Generator    • Alert Service                │  │
│  └───────────────────────┬──────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│              MongoDB MCP Server                              │
│  (Model Context Protocol Integration)                        │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   MongoDB Atlas                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collections:                                         │  │
│  │  • protocols (trial protocol documents)              │  │
│  │  • sites (master site data - 250+ sites)             │  │
│  │  • patient_populations (de-identified counts)        │  │
│  │  • site_scores (agent-generated rankings)            │  │
│  │  • feasibility_surveys (outreach tracking)           │  │
│  │  • agent_logs (audit trail for compliance)           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Features:                                                   │
│  • Atlas Vector Search (semantic protocol search)           │
│  • Geospatial Indexing (site proximity queries)             │
│  • Aggregation Pipelines (complex scoring logic)            │
│  • Change Streams (real-time updates)                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Models (MongoDB)

### Collection: `protocols`
```javascript
{
  _id: ObjectId("..."),
  protocol_number: "ACME-CV-2026-001",
  sponsor: "ACME Pharma",
  indication: "Heart Failure with Reduced Ejection Fraction",
  phase: "Phase 3",
  uploaded_at: ISODate("2026-05-30T10:00:00Z"),
  
  // Extracted structured data
  inclusion_criteria: [
    {
      type: "age",
      min_age: 18,
      max_age: 85,
      unit: "years"
    },
    {
      type: "diagnosis",
      icd10_codes: ["I50.1", "I50.2"],
      description: "Heart failure with reduced ejection fraction (LVEF ≤40%)"
    },
    {
      type: "biomarker",
      name: "NT-proBNP",
      threshold: ">600 pg/mL",
      unit: "pg/mL"
    }
  ],
  
  exclusion_criteria: [
    {
      type: "comorbidity",
      icd10_codes: ["N18.5"],
      description: "End-stage renal disease"
    }
  ],
  
  target_enrollment: 500,
  estimated_duration_months: 24,
  
  // Vector embedding for semantic search
  protocol_embedding: [0.123, -0.456, ...], // 768-dim vector
  
  // Metadata
  pdf_url: "gs://trialsync-protocols/ACME-CV-2026-001.pdf",
  parsed_by: "gemini-3-pro",
  parsed_at: ISODate("2026-05-30T10:05:23Z")
}
```

### Collection: `sites`
```javascript
{
  _id: ObjectId("..."),
  site_id: "SITE-001",
  site_name: "Stanford Medicine Clinical Research Center",
  
  // Location (geospatial)
  location: {
    type: "Point",
    coordinates: [-122.1697, 37.4275] // [longitude, latitude]
  },
  address: {
    street: "1070 Arastradero Road",
    city: "Palo Alto",
    state: "CA",
    zip: "94304",
    country: "USA"
  },
  
  // Capabilities
  therapeutic_areas: ["Cardiology", "Oncology", "Neurology"],
  phases_conducted: ["Phase 1", "Phase 2", "Phase 3"],
  certifications: ["CAP", "CLIA", "AAALAC"],
  
  // Performance metrics
  historical_metrics: {
    trials_completed: 47,
    avg_enrollment_velocity: 3.2, // patients per month
    avg_activation_days: 45,
    retention_rate: 0.87,
    screen_failure_rate: 0.23
  },
  
  // Diversity data
  patient_demographics: {
    total_patients_screened_2025: 1200,
    race_ethnicity: {
      white: 0.45,
      black: 0.15,
      hispanic: 0.25,
      asian: 0.12,
      other: 0.03
    }
  },
  
  // Cost structure
  pricing: {
    per_patient_fee: 15000,
    startup_fee: 25000,
    currency: "USD"
  },
  
  // Contact
  principal_investigator: {
    name: "Dr. Sarah Chen",
    email: "schen@stanford.edu",
    phone: "+1-650-555-0123"
  },
  
  // Metadata
  last_updated: ISODate("2026-05-01T00:00:00Z"),
  status: "active"
}
```

### Collection: `patient_populations`
```javascript
{
  _id: ObjectId("..."),
  site_id: "SITE-001",
  
  // De-identified patient counts by condition
  conditions: [
    {
      icd10_code: "I50.1",
      description: "Left ventricular failure",
      patient_count: 230,
      age_distribution: {
        "18-39": 12,
        "40-64": 98,
        "65-85": 120
      },
      gender_distribution: {
        male: 145,
        female: 85
      }
    }
  ],
  
  // Biomarker data availability
  biomarkers_available: ["NT-proBNP", "Troponin", "eGFR", "HbA1c"],
  
  // EMR system (impacts data extraction speed)
  emr_system: "Epic",
  emr_integration: true,
  
  // Data freshness
  as_of_date: ISODate("2026-04-30T00:00:00Z"),
  refresh_frequency: "monthly"
}
```

### Collection: `site_scores`
```javascript
{
  _id: ObjectId("..."),
  protocol_number: "ACME-CV-2026-001",
  site_id: "SITE-001",
  
  // Overall score
  total_score: 87.5,
  rank: 3,
  
  // Component scores (weighted)
  scores: {
    patient_availability: {
      score: 92,
      weight: 0.30,
      weighted_score: 27.6,
      details: {
        matching_patients: 230,
        required_enrollment: 15,
        availability_ratio: 15.3
      }
    },
    enrollment_velocity: {
      score: 88,
      weight: 0.25,
      weighted_score: 22.0,
      details: {
        avg_velocity: 3.2,
        estimated_completion_months: 4.7
      }
    },
    activation_speed: {
      score: 75,
      weight: 0.15,
      weighted_score: 11.25,
      details: {
        avg_activation_days: 45,
        benchmark_days: 30
      }
    },
    retention_rate: {
      score: 95,
      weight: 0.15,
      weighted_score: 14.25,
      details: {
        historical_retention: 0.87,
        benchmark_retention: 0.80
      }
    },
    diversity_score: {
      score: 82,
      weight: 0.10,
      weighted_score: 8.2,
      details: {
        diversity_index: 0.82, // based on race/ethnicity distribution
        fda_benchmark: 0.75
      }
    },
    cost_efficiency: {
      score: 70,
      weight: 0.05,
      weighted_score: 3.5,
      details: {
        per_patient_cost: 15000,
        benchmark_cost: 12000
      }
    }
  },
  
  // Risk flags
  risks: [
    {
      type: "medium",
      category: "activation_speed",
      message: "Site activation typically takes 45 days (15 days above target)"
    }
  ],
  
  // Metadata
  scored_at: ISODate("2026-05-30T10:12:45Z"),
  scored_by: "trialsync-agent",
  gemini_model: "gemini-3-flash"
}
```

### Collection: `feasibility_surveys`
```javascript
{
  _id: ObjectId("..."),
  protocol_number: "ACME-CV-2026-001",
  site_id: "SITE-001",
  
  // Outreach tracking
  survey_sent_at: ISODate("2026-05-30T11:00:00Z"),
  survey_url: "https://trialsync.app/surveys/xyz123",
  recipient_email: "schen@stanford.edu",
  
  // Response tracking
  status: "pending", // pending | responded | declined | no_response
  responded_at: null,
  response_data: null,
  
  // Follow-up history
  reminders_sent: [
    {
      sent_at: ISODate("2026-06-01T11:00:00Z"),
      type: "reminder_1"
    }
  ],
  
  // Metadata
  created_by: "trialsync-agent"
}
```

### Collection: `agent_logs`
```javascript
{
  _id: ObjectId("..."),
  timestamp: ISODate("2026-05-30T10:12:45Z"),
  protocol_number: "ACME-CV-2026-001",
  
  // Agent action
  action: "site_scoring",
  input: {
    protocol_id: ObjectId("..."),
    sites_evaluated: 250
  },
  output: {
    sites_scored: 250,
    top_sites: ["SITE-003", "SITE-042", "SITE-001"]
  },
  
  // Model details
  model: "gemini-3-flash",
  prompt_tokens: 2340,
  completion_tokens: 890,
  latency_ms: 1240,
  
  // Audit trail (FDA 21 CFR Part 11 compliance)
  user_id: "user@acmepharma.com",
  session_id: "sess_abc123",
  
  // Error tracking
  status: "success", // success | error | timeout
  error_message: null
}
```

---

## Agent Workflow

### Step-by-Step Process

#### Step 1: Protocol Upload & Parsing
```
User Action: Uploads trial protocol PDF (e.g., 150-page document)
Agent Action:
  1. Stores PDF in Google Cloud Storage
  2. Calls PDF Parser Tool
  3. Gemini 3 Pro extracts:
     - Inclusion/exclusion criteria
     - Target enrollment numbers
     - Disease codes (ICD-10)
     - Biomarker thresholds
     - Duration estimates
  4. Structures data into protocol schema
  5. Generates vector embedding of protocol text
MongoDB Operation:
  - INSERT into `protocols` collection
  - Creates vector search index on protocol_embedding
Output: Structured protocol document with ID
```

#### Step 2: Patient Population Query
```
Agent Action:
  1. Extracts matching criteria from protocol
  2. Builds MongoDB aggregation pipeline:
     - Match sites with therapeutic area
     - Filter patient_populations by ICD-10 codes
     - Apply age/gender/biomarker filters
     - Calculate matching patient counts per site
MongoDB Operations:
  - Aggregation across `sites` and `patient_populations`
  - Geospatial query for site proximity (if location criteria exist)
Output: List of 250 sites with matching patient counts
```

#### Step 3: Multi-Factor Scoring
```
Agent Action:
  For each site:
    1. Calculate 6 component scores (availability, velocity, etc.)
    2. Apply weights to component scores
    3. Compute total weighted score
    4. Generate risk flags
    5. Rank sites by total score
MongoDB Operation:
  - INSERT batch of documents into `site_scores`
  - Create index on (protocol_number, total_score DESC)
Output: Ranked list of sites with detailed scorecards
```

#### Step 4: Feasibility Survey Generation
```
Agent Action:
  1. Selects top 20-30 sites (score > 75)
  2. For each site, generates customized survey questions:
     - "Can you enroll 15 heart failure patients?"
     - "Estimated time to first patient?"
     - "Do you have NT-proBNP testing capability?"
  3. Creates survey links
MongoDB Operation:
  - INSERT into `feasibility_surveys` collection
Output: Survey documents ready for email distribution
```

#### Step 5: Automated Email Outreach
```
Agent Action:
  1. Calls Email Service Tool
  2. Sends personalized emails to site PIs
  3. Includes survey link and deadline (7 days)
MongoDB Operation:
  - UPDATE `feasibility_surveys` with sent_at timestamp
Output: Email delivery confirmations
```

#### Step 6: Response Monitoring
```
Agent Action (Continuous Loop):
  1. Every 4 hours:
     - Query `feasibility_surveys` for new responses
     - Parse response data
     - Update site_scores if needed
  2. If no response after 48 hours:
     - Send reminder email
     - Log reminder in feasibility_surveys.reminders_sent
MongoDB Operations:
  - MongoDB Change Streams to detect new responses in real-time
  - UPDATE operations for response tracking
Output: Real-time response dashboard
```

#### Step 7: Executive Report Generation
```
Agent Action:
  1. Aggregates data:
     - Top 10-15 sites with scorecards
     - Risk analysis summary
     - Timeline projections
     - Budget estimates
  2. Generates visualizations:
     - Site ranking bar chart
     - Geographic map of sites
     - Enrollment timeline Gantt chart
  3. Creates PDF report
MongoDB Operations:
  - Aggregation queries across site_scores, sites, feasibility_surveys
Output: Executive-ready PDF report
```

#### Step 8: Stakeholder Alerts
```
Agent Action (Event-Driven):
  - Site responds "Yes" → Slack alert to project manager
  - Site responds "No" → Email to backup site coordinators
  - Risk detected (e.g., low diversity) → Alert to clinical ops
MongoDB Operation:
  - Query agent_logs for alert history (avoid duplicate alerts)
Output: Real-time notifications via Slack/email
```

#### Step 9: Audit Trail Logging
```
Agent Action (Continuous):
  - Every agent action logged to `agent_logs`
  - Captures inputs, outputs, model used, latency
  - Records user actions for FDA compliance
MongoDB Operation:
  - INSERT into `agent_logs` collection
  - Time-series indexing for efficient queries
Output: Complete audit trail for regulatory inspection
```

---

## MongoDB Track Winning Strategy

### Why MongoDB is Central to This Solution

#### 1. Document Flexibility
- **Challenge:** Clinical trial data is highly variable (different protocols have different criteria)
- **MongoDB Advantage:** Flexible schema accommodates diverse protocol structures without schema migrations
- **Example:** Protocol A has 12 inclusion criteria, Protocol B has 25 → both fit naturally in MongoDB

#### 2. Advanced Aggregation Pipelines
- **Challenge:** Site scoring requires multi-collection joins and complex calculations
- **MongoDB Advantage:** Aggregation framework handles multi-stage scoring logic efficiently
- **Example Pipeline:**
```javascript
db.patient_populations.aggregate([
  // Stage 1: Match sites with therapeutic area
  {$match: {therapeutic_areas: "Cardiology"}},
  
  // Stage 2: Lookup site details
  {$lookup: {
    from: "sites",
    localField: "site_id",
    foreignField: "site_id",
    as: "site_info"
  }},
  
  // Stage 3: Filter by patient counts
  {$match: {"conditions.patient_count": {$gte: 50}}},
  
  // Stage 4: Calculate availability score
  {$addFields: {
    availability_score: {
      $multiply: [
        {$divide: ["$conditions.patient_count", 15]}, // ratio
        100 // scale to 0-100
      ]
    }
  }},
  
  // Stage 5: Sort by score
  {$sort: {availability_score: -1}},
  
  // Stage 6: Limit to top 20
  {$limit: 20}
])
```

#### 3. Vector Search for Semantic Matching
- **Challenge:** Match new protocols to similar historical trials
- **MongoDB Advantage:** Atlas Vector Search enables semantic similarity search
- **Use Case:** "Find sites that succeeded in similar heart failure trials"

#### 4. Geospatial Queries
- **Challenge:** Site selection must consider patient proximity
- **MongoDB Advantage:** Native geospatial indexing and $geoNear queries
- **Example:**
```javascript
db.sites.find({
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [-122.1697, 37.4275] // Patient population center
      },
      $maxDistance: 50000 // 50km radius
    }
  }
})
```

#### 5. Change Streams for Real-Time Updates
- **Challenge:** Agent needs to react to site responses in real-time
- **MongoDB Advantage:** Change Streams provide event-driven updates
- **Implementation:**
```javascript
const changeStream = db.feasibility_surveys.watch([
  {$match: {"updateDescription.updatedFields.status": "responded"}}
]);

changeStream.on("change", (change) => {
  // Trigger agent to process new response
  agent.handleSiteResponse(change.documentKey._id);
});
```

#### 6. Time-Series Collections for Audit Logs
- **Challenge:** FDA requires complete audit trail of agent decisions
- **MongoDB Advantage:** Time-series collections optimize for append-only log data
- **Benefits:** Efficient storage, fast time-range queries, automatic data retention policies

### Competitive Differentiation

#### vs. Other MongoDB Entries
| Dimension | TrialSync Agent | Typical MongoDB Entry |
|-----------|-----------------|----------------------|
| **Complexity** | Multi-collection aggregations, vector search, geospatial | Simple CRUD operations |
| **Business Value** | $5M+ savings per trial, $10B market | Productivity tool, smaller TAM |
| **MongoDB Usage** | 6 collections, aggregations, vector search, change streams | 1-2 collections, basic queries |
| **Enterprise Readiness** | FDA compliance, audit logs, security | Prototype/demo level |
| **Gemini Integration** | Gemini 3 Pro for reasoning + Flash for speed | Generic Gemini usage |

#### Why Judges Will Love This
1. **Real Enterprise Use Case:** Pharma/biotech is MongoDB's #1 growth vertical in healthcare
2. **Technical Depth:** Showcases 5+ advanced MongoDB features (aggregations, vector search, geospatial, change streams, time-series)
3. **Quantified ROI:** $5M savings per trial → 13.6x return on TrialSync cost
4. **Autonomous Multi-Step Agent:** Not a chatbot → demonstrates Google Cloud Agent Builder capabilities
5. **Compliance Story:** FDA audit trail requirements make MongoDB's document model ideal
6. **Scalability:** Designed for 250+ sites, 10,000+ trials (enterprise scale)

---

## Implementation Plan

### Phase 1: Core Infrastructure (Day 1)
**Goal:** Set up basic agent + MongoDB connection

#### Tasks
1. **MongoDB Atlas Setup** (30 min)
   - Create M0 free tier cluster
   - Create database: `trialsync`
   - Create collections: `protocols`, `sites`, `patient_populations`
   - Load sample data (10 sites, 1 protocol)

2. **Google Cloud Agent Builder** (60 min)
   - Create new agent project
   - Configure Gemini 3 Flash as default model
   - Set up MCP server connection to MongoDB

3. **Basic Streamlit UI** (90 min)
   - Upload page for protocol PDFs
   - Display page for site rankings
   - Simple text-based reports

4. **PDF Parser Tool** (90 min)
   - PyMuPDF integration
   - Gemini 3 Pro prompt for criteria extraction
   - Test with sample protocol

**Deliverable:** Agent can parse 1 protocol and query MongoDB for matching sites

### Phase 2: Scoring & Reporting (Day 2)
**Goal:** Implement multi-factor scoring and report generation

#### Tasks
1. **Aggregation Pipeline Development** (120 min)
   - Build scoring pipeline (6 factors)
   - Test with 10 sample sites
   - Optimize query performance

2. **Site Scoring Logic** (90 min)
   - Implement weighting algorithm
   - Add risk flag detection
   - Write scores to `site_scores` collection

3. **Report Generator Tool** (120 min)
   - Executive summary generation
   - Top 10 site list with scorecards
   - Risk analysis section
   - Export to PDF

4. **Enhanced UI** (60 min)
   - Site ranking table with sortable columns
   - Risk flags visualization
   - Download report button

**Deliverable:** Agent produces executive-ready site selection reports

### Phase 3: Polish & Demo (Day 3)
**Goal:** Add advanced features and create demo video

#### Tasks
1. **Vector Search Implementation** (90 min)
   - Create embeddings for protocol text
   - Set up Atlas Vector Search index
   - Add "Find similar trials" feature

2. **Geospatial Queries** (60 min)
   - Add location data to sites
   - Implement $geoNear query for proximity scoring
   - Display map in UI

3. **Change Streams for Alerts** (60 min)
   - Set up change stream on `feasibility_surveys`
   - Mock email alert system (console logs for demo)
   - Add alert history to UI

4. **Audit Logging** (45 min)
   - Create `agent_logs` collection
   - Log all agent actions with timestamps
   - Add audit trail viewer to UI

5. **Demo Video Production** (120 min)
   - Record screen capture (3 minutes)
   - Add voiceover narration
   - Edit with transitions and captions
   - Upload to YouTube

6. **Documentation** (60 min)
   - README.md for GitHub repo
   - Architecture diagram
   - Setup instructions
   - MongoDB schema documentation

**Deliverable:** Complete demo-ready application + 3-minute video + GitHub repo

### Development Stack
```
Frontend:
  - Streamlit (rapid prototyping)
  - Plotly (charts/visualizations)
  - Folium (geospatial maps)

Backend:
  - Python 3.11+
  - Google Cloud Agent Builder SDK
  - Gemini 3 API (via Vertex AI)
  - MongoDB Python Driver (pymongo)
  - PyMuPDF (PDF parsing)

Infrastructure:
  - Google Cloud Run (hosting)
  - MongoDB Atlas M0 (free tier)
  - Google Cloud Storage (protocol PDFs)

Testing:
  - pytest (unit tests)
  - Sample protocols (synthetic data)
  - 10-site test dataset
```

### Resource Requirements
- **Developer Time:** 3 days (hackathon timeline)
- **Cloud Costs:** $0 (free tiers)
- **APIs:** Free (Gemini 3 experimental, MongoDB M0, GCS free tier)

---

## Demo Video Script (3 Minutes)

### Segment 1: The Problem (0:00-0:45)
**[Screen: Stats overlaid on clinical trial imagery]**

**Voiceover:**
"Every year, pharmaceutical companies run 450,000 clinical trials worldwide. But there's a massive hidden bottleneck: site selection.

The current process takes 6 months and costs millions. Teams of PhD-level medical experts manually read 200-page protocols, query hundreds of sites, and coordinate feasibility surveys.

The result? 40% of sites enroll ZERO patients. Trials fail. Patients wait longer for life-saving drugs.

What if AI could do in 48 hours what takes humans 6 months?"

### Segment 2: The Solution (0:45-1:30)
**[Screen: Streamlit UI - protocol upload]**

**Voiceover:**
"Introducing TrialSync Agent. Upload your trial protocol—150 pages, dense medical text—and watch the magic happen."

**[Action: Upload PDF, click 'Start Analysis']**

"TrialSync Agent, powered by Google's Gemini 3 and MongoDB, instantly extracts every inclusion criterion, exclusion criterion, and biomarker threshold.

It queries 250 clinical trial sites stored in MongoDB Atlas—matching patient populations, historical performance, diversity metrics, and cost data."

**[Screen: Site ranking table appears]**

"In seconds, TrialSync scores every site on 6 critical factors:
- Patient availability
- Enrollment velocity
- Activation speed
- Retention rate
- Diversity
- Cost efficiency

Sites are ranked. Risk flags are identified. The agent even generates feasibility surveys and emails them to the top 20 sites."

### Segment 3: MongoDB Superpowers (1:30-2:15)
**[Screen: Architecture diagram highlighting MongoDB]**

**Voiceover:**
"Why MongoDB? This isn't just a database—it's the brain of TrialSync.

MongoDB's aggregation pipelines handle complex multi-factor scoring across millions of patient records.

Atlas Vector Search finds similar historical trials semantically—not just keyword matching.

Geospatial queries identify sites near patient populations—critical for enrollment success.

Change Streams enable real-time alerts when sites respond to surveys.

And time-series collections maintain a complete FDA-compliant audit trail of every agent decision."

**[Screen: Show aggregation pipeline code briefly]**

"Six MongoDB collections working in harmony. Five advanced features in one agent. This is MongoDB at its best."

### Segment 4: The Impact (2:15-2:45)
**[Screen: Executive report PDF]**

**Voiceover:**
"The output? An executive-ready report. Top 10 sites. Risk analysis. Timeline projections. Budget estimates.

What once took 6 months now takes 48 hours.

The ROI? $5 million saved per trial. 13.6x return on investment. Faster trials mean drugs reach patients sooner—lives are saved."

**[Screen: Return to UI showing multiple protocols being managed]**

"TrialSync Agent scales to manage entire portfolios—10 trials, 100 trials, 1,000 trials—simultaneously."

### Segment 5: Call to Action (2:45-3:00)
**[Screen: TrialSync logo + GitHub link]**

**Voiceover:**
"TrialSync Agent. Built with Google Gemini 3, Google Cloud Agent Builder, and MongoDB.

Autonomous. Intelligent. Enterprise-ready.

The future of clinical trials starts here.

Check out our open-source code on GitHub. Let's revolutionize drug development together."

**[End screen: TrialSync Agent logo, GitHub URL, "Made for Google Gemini Agent Hackathon"]**

---

## Competitive Analysis

### Direct Competitors (Clinical Trial Tech)
| Company | Solution | Weakness vs. TrialSync |
|---------|----------|------------------------|
| **Florence Healthcare** | Site selection SaaS | Manual process, 2-3 weeks, human-driven |
| **Antidote** | Patient-trial matching | Consumer-focused, not site selection |
| **Deep 6 AI** | Patient finding via EMR | Requires EMR integration, no site scoring |
| **TriNetX** | Real-world data analytics | Descriptive analytics, not prescriptive recommendations |

### Indirect Competitors (Hackathon Context)
| Likely Entry Type | Why TrialSync Wins |
|-------------------|-------------------|
| **MongoDB chatbot** | TrialSync is autonomous multi-step agent, not Q&A bot |
| **E-commerce recommendation engine** | Smaller TAM, less technical depth |
| **Social media sentiment analyzer** | Consumer app, not enterprise B2B |
| **Generic RAG application** | TrialSync uses 5 MongoDB features, not just vector search |

### Differentiation Summary
✅ **Autonomous agent** (not chatbot)  
✅ **Enterprise B2B** ($10B market)  
✅ **Quantified ROI** ($5M savings)  
✅ **Technical depth** (6 MongoDB collections, 5 advanced features)  
✅ **Healthcare/pharma focus** (MongoDB's priority vertical)  
✅ **Compliance story** (FDA audit requirements)  
✅ **Real-world validation** (built by ex-clinical trial professional)

---

## Business Model (Post-Hackathon)

### Revenue Model
**B2B SaaS Subscription**

#### Pricing Tiers
1. **Starter** - $5,000/month
   - Up to 5 protocols per month
   - 100 site database access
   - Basic reporting
   
2. **Professional** - $15,000/month
   - Up to 20 protocols per month
   - 250 site database access
   - Advanced analytics + alerts
   - API access
   
3. **Enterprise** - Custom pricing
   - Unlimited protocols
   - Custom site database integration
   - White-label option
   - Dedicated support + SLAs

#### Alternative: Per-Trial Pricing
- $25,000 per protocol analyzed
- Average pharma trial budget: $10M-$50M
- TrialSync cost: 0.25% of trial budget
- Value delivered: $5M+ in savings (13.6x ROI)

### Target Customers
1. **Pharmaceutical companies** (top 20 pharma = $300B R&D spend)
2. **Biotech companies** (5,000+ biotech firms)
3. **Contract Research Organizations (CROs)** (top 10 CROs manage 60% of trials)
4. **Clinical trial site networks** (reverse model: sites find matching trials)

### Go-To-Market Strategy
1. **Year 1:** Pilot with 3-5 mid-size biotech companies
2. **Year 2:** Expand to CROs, land 2-3 enterprise pharma deals
3. **Year 3:** Platform play—integrate with EMR systems (Epic, Cerner)

### Total Addressable Market (TAM)
- Clinical trial site selection market: **$10B+**
- Growing 12% annually (increasing trial complexity)
- TrialSync can capture 5% in 5 years = **$500M opportunity**

---

## Risks & Mitigations

### Technical Risks
| Risk | Mitigation |
|------|-----------|
| **Gemini 3 hallucinations in protocol parsing** | Human-in-the-loop validation, confidence scores, fallback to manual review |
| **MongoDB query performance at scale** | Indexing strategy, aggregation pipeline optimization, Atlas autoscaling |
| **PDF parsing accuracy** | Multi-model approach (Gemini + PyMuPDF + DocAI), 95%+ accuracy target |

### Business Risks
| Risk | Mitigation |
|------|-----------|
| **Regulatory acceptance (FDA scrutiny)** | Audit trail, human oversight, position as "decision support" not "decision maker" |
| **Data privacy (HIPAA, GDPR)** | De-identified data only, MongoDB Atlas encryption, SOC 2 compliance |
| **Competitive response from incumbents** | First-mover advantage, patent filing, exclusive partnerships |

### Hackathon Risks
| Risk | Mitigation |
|------|-----------|
| **Demo failures during video recording** | Pre-recorded segments, multiple takes, test environment |
| **MongoDB MCP server bugs** | Fallback to direct MongoDB driver, test integration early |
| **Time constraints (3 days)** | MVP focus, synthetic data, cut non-essential features |

---

## Success Metrics

### Hackathon Judging Criteria (Predicted)
1. **Innovation** (30%): Autonomous agent, not chatbot ✅
2. **Technical Depth** (25%): 5 MongoDB features, complex pipelines ✅
3. **Business Value** (20%): $10B market, $5M savings per trial ✅
4. **Demo Quality** (15%): Professional video, working prototype ✅
5. **Code Quality** (10%): Clean repo, documentation, reproducible ✅

### Performance Metrics (If Deployed)
- **Speed:** Protocol analysis in <5 minutes (vs. 6 months manual)
- **Accuracy:** 90%+ precision in site ranking (validated against historical data)
- **Adoption:** 20+ protocols analyzed per customer per year
- **ROI:** 10x+ return for customers ($5M savings vs. $500K annual subscription)

---

## Open Source & Community

### GitHub Repository Structure
```
trialsync-agent/
├── README.md                 # Overview, setup instructions
├── LICENSE                   # MIT License
├── requirements.txt          # Python dependencies
├── architecture.md           # System design documentation
├── DEMO_VIDEO.md            # Link to YouTube demo
│
├── src/
│   ├── agent/               # Google Cloud Agent Builder integration
│   │   ├── agent_config.py
│   │   └── tools.py
│   ├── mongodb/             # Database operations
│   │   ├── models.py        # Collection schemas
│   │   ├── queries.py       # Aggregation pipelines
│   │   └── mcp_server.py    # MCP server integration
│   ├── parsers/             # Protocol parsing
│   │   └── pdf_parser.py
│   └── ui/                  # Streamlit application
│       └── app.py
│
├── data/
│   ├── sample_protocol.pdf  # Example trial protocol
│   ├── sample_sites.json    # 10 synthetic sites
│   └── seed_database.py     # MongoDB data loader
│
├── tests/
│   ├── test_parser.py
│   ├── test_scoring.py
│   └── test_mongodb.py
│
└── docs/
    ├── MONGODB_SCHEMA.md    # Detailed schema documentation
    ├── API.md               # API reference
    └── DEPLOYMENT.md        # Production deployment guide
```

### Open Source Benefits
1. **Transparency:** Healthcare/pharma industry values auditability
2. **Contributions:** Community can add new scoring algorithms
3. **Integrations:** Third parties can build connectors (e.g., Salesforce, Veeva)
4. **Credibility:** Open source signals commitment to industry

---

## Appendix A: Sample Aggregation Pipeline

### Site Scoring Pipeline (Full MongoDB Code)
```javascript
// Pipeline to calculate multi-factor site scores for a given protocol
db.patient_populations.aggregate([
  
  // Stage 1: Match sites with relevant therapeutic areas
  {
    $match: {
      "conditions.icd10_code": {$in: ["I50.1", "I50.2"]} // Heart failure codes
    }
  },
  
  // Stage 2: Lookup site master data
  {
    $lookup: {
      from: "sites",
      localField: "site_id",
      foreignField: "site_id",
      as: "site_info"
    }
  },
  {$unwind: "$site_info"},
  
  // Stage 3: Calculate patient availability score
  {
    $addFields: {
      matching_patients: {
        $sum: "$conditions.patient_count"
      },
      availability_score: {
        $min: [
          {
            $multiply: [
              {$divide: ["$conditions.patient_count", 15]}, // 15 patients needed
              100
            ]
          },
          100 // Cap at 100
        ]
      }
    }
  },
  
  // Stage 4: Calculate enrollment velocity score
  {
    $addFields: {
      velocity_score: {
        $multiply: [
          {$divide: [
            "$site_info.historical_metrics.avg_enrollment_velocity",
            5 // Benchmark: 5 patients/month
          ]},
          100
        ]
      }
    }
  },
  
  // Stage 5: Calculate activation speed score
  {
    $addFields: {
      activation_score: {
        $multiply: [
          {$divide: [
            30, // Target: 30 days
            "$site_info.historical_metrics.avg_activation_days"
          ]},
          100
        ]
      }
    }
  },
  
  // Stage 6: Calculate retention rate score
  {
    $addFields: {
      retention_score: {
        $multiply: [
          "$site_info.historical_metrics.retention_rate",
          100
        ]
      }
    }
  },
  
  // Stage 7: Calculate diversity score (Simpson's Diversity Index)
  {
    $addFields: {
      diversity_score: {
        $multiply: [
          {
            $subtract: [
              1,
              {
                $sum: [
                  {$pow: ["$site_info.patient_demographics.race_ethnicity.white", 2]},
                  {$pow: ["$site_info.patient_demographics.race_ethnicity.black", 2]},
                  {$pow: ["$site_info.patient_demographics.race_ethnicity.hispanic", 2]},
                  {$pow: ["$site_info.patient_demographics.race_ethnicity.asian", 2]},
                  {$pow: ["$site_info.patient_demographics.race_ethnicity.other", 2]}
                ]
              }
            ]
          },
          100
        ]
      }
    }
  },
  
  // Stage 8: Calculate cost efficiency score
  {
    $addFields: {
      cost_score: {
        $multiply: [
          {$divide: [
            12000, // Benchmark: $12K per patient
            "$site_info.pricing.per_patient_fee"
          ]},
          100
        ]
      }
    }
  },
  
  // Stage 9: Calculate weighted total score
  {
    $addFields: {
      total_score: {
        $add: [
          {$multiply: ["$availability_score", 0.30]},
          {$multiply: ["$velocity_score", 0.25]},
          {$multiply: ["$activation_score", 0.15]},
          {$multiply: ["$retention_score", 0.15]},
          {$multiply: ["$diversity_score", 0.10]},
          {$multiply: ["$cost_score", 0.05]}
        ]
      }
    }
  },
  
  // Stage 10: Generate risk flags
  {
    $addFields: {
      risks: {
        $concatArrays: [
          {$cond: [
            {$lt: ["$availability_score", 70]},
            [{type: "high", message: "Insufficient patient availability"}],
            []
          ]},
          {$cond: [
            {$gt: ["$site_info.historical_metrics.avg_activation_days", 60]},
            [{type: "medium", message: "Slow activation history"}],
            []
          ]},
          {$cond: [
            {$lt: ["$diversity_score", 60]},
            [{type: "low", message: "Limited patient diversity"}],
            []
          ]}
        ]
      }
    }
  },
  
  // Stage 11: Sort by total score
  {$sort: {total_score: -1}},
  
  // Stage 12: Limit to top 50 sites
  {$limit: 50},
  
  // Stage 13: Project final output
  {
    $project: {
      site_id: "$site_id",
      site_name: "$site_info.site_name",
      location: "$site_info.location",
      total_score: {$round: ["$total_score", 2]},
      scores: {
        availability: {$round: ["$availability_score", 2]},
        velocity: {$round: ["$velocity_score", 2]},
        activation: {$round: ["$activation_score", 2]},
        retention: {$round: ["$retention_score", 2]},
        diversity: {$round: ["$diversity_score", 2]},
        cost: {$round: ["$cost_score", 2]}
      },
      matching_patients: 1,
      risks: 1
    }
  },
  
  // Stage 14: Write to site_scores collection
  {
    $merge: {
      into: "site_scores",
      on: ["site_id"],
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
])
```

---

## Appendix B: Gemini Prompts

### Protocol Parsing Prompt (Gemini 3 Pro)
```
You are a clinical trial protocol analyzer. Extract structured data from the following protocol text.

Protocol Text:
{protocol_text}

Extract the following information in JSON format:
1. inclusion_criteria: List of inclusion criteria with fields:
   - type: "age" | "diagnosis" | "biomarker" | "comorbidity" | "medication"
   - details: Specific values (e.g., min_age, max_age, icd10_codes, threshold)
   - description: Natural language description

2. exclusion_criteria: Same structure as inclusion_criteria

3. target_enrollment: Integer (total number of patients to enroll)

4. estimated_duration_months: Integer (expected trial duration)

5. therapeutic_area: String (e.g., "Cardiology", "Oncology")

6. phase: "Phase 1" | "Phase 2" | "Phase 3" | "Phase 4"

Rules:
- For diagnoses, always include ICD-10 codes if mentioned
- For biomarkers, extract threshold values and units
- For age criteria, separate into min_age and max_age
- Be precise with numerical values (do not round or estimate)

Output only valid JSON, no additional text.
```

### Site Scoring Reasoning Prompt (Gemini 3 Flash)
```
You are evaluating clinical trial sites for protocol {protocol_number}.

Site Data:
{site_data}

Protocol Requirements:
- Target enrollment: {target_enrollment} patients
- Indication: {indication}
- Key inclusion criteria: {key_criteria}

Evaluate this site on the following factors (0-100 scale):
1. Patient Availability: Does the site have enough matching patients?
2. Enrollment Velocity: Can the site enroll patients quickly?
3. Activation Speed: How fast can the site activate?
4. Retention Rate: Does the site retain patients well?
5. Diversity: Does the site have diverse patient populations?
6. Cost Efficiency: Is the site cost-competitive?

For each factor, provide:
- score (0-100)
- reasoning (1-2 sentences)

Also identify any risk flags:
- High Risk: Critical issues that could derail enrollment
- Medium Risk: Concerns that need monitoring
- Low Risk: Minor issues

Output in JSON format:
{
  "scores": {
    "availability": {"score": 0-100, "reasoning": "..."},
    ...
  },
  "risks": [
    {"type": "high|medium|low", "message": "..."}
  ]
}
```

---

## Appendix C: FDA Compliance Notes

### 21 CFR Part 11 (Electronic Records/Signatures)
**Requirement:** Audit trails for all system actions

**TrialSync Compliance:**
- All agent actions logged to `agent_logs` collection
- Logs include: timestamp, user_id, action, input, output, model used
- Immutable logs (append-only, no deletions)
- Retention: 7 years (per FDA requirements)

### Good Clinical Practice (GCP) Guidelines
**Requirement:** Site selection must be documented and justified

**TrialSync Compliance:**
- Transparent scoring algorithm (not black box)
- Human oversight: Final decisions made by clinical ops teams
- Documentation: Executive reports provide justification for site choices

### HIPAA (Patient Privacy)
**Requirement:** Protected Health Information (PHI) must be secured

**TrialSync Compliance:**
- De-identified patient counts only (no PHI)
- MongoDB Atlas encryption at rest + in transit
- Role-based access control (RBAC)
- BAA (Business Associate Agreement) with MongoDB

---

## Conclusion

TrialSync Agent represents the convergence of three cutting-edge technologies:
1. **Google Gemini 3** - Advanced reasoning for complex medical protocols
2. **Google Cloud Agent Builder** - Orchestration of multi-step autonomous workflows
3. **MongoDB Atlas** - Flexible, powerful data layer for clinical trial data

**The result?** A system that delivers **$5M+ in savings per trial** while reducing timelines from **6 months to 48 hours**.

This is not a chatbot. This is not a simple CRUD app. This is an **autonomous enterprise AI agent** solving a **$10B market problem** with **deep technical sophistication**.

**For the hackathon judges:** TrialSync Agent showcases MongoDB's most advanced features—aggregation pipelines, vector search, geospatial queries, change streams, and time-series collections—in a real-world enterprise use case.

**For the clinical trial industry:** TrialSync Agent is the future of site selection.

**For patients waiting for life-saving treatments:** TrialSync Agent means faster trials, faster approvals, faster access to new therapies.

---

**Ready to build TrialSync Agent? Let's get started. 🚀**

*Questions? Contact: [Your Name] | [Your Email] | [GitHub: @yourusername]*

---

**Document Version:** 1.0  
**Last Updated:** May 30, 2026  
**License:** MIT (Open Source)  
**Hackathon:** Google Gemini Agent Hackathon - MongoDB Track
