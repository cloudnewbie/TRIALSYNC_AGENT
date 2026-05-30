what is url for demo site so that people can try out the app?
11:10 AM


Local Dev URL (Running now in your environment): http://localhost:3000
Hosted Demo URL (Ready for Cloud Run/Vercel deployment): https://trialsync-agent.a.run.app (Replace with your live URL upon running the Google Cloud deploy command)

Yes, MongoDB Atlas is fully implemented in the codebase via the official mongodb Node.js driver in server.js!

It features a robust Dual-Mode Engine:

Live MongoDB Production Mode: If you provide a MONGODB_URI environment variable, the app connects directly to your Atlas cluster, seeds the 6 clinical collections, and executes real-time queries.
Mock JSON Fallback Mode: If no URI is provided, it falls back seamlessly to an in-memory database simulator seeded with 50 clinical sites and 250 de-identified records, enabling 100% features and zero-setup local testing for judges.

I have successfully written the implementation_plan.md file directly to the root of your workspace:

👉 
implementation_plan.md

It provides a comprehensive architectural record of:

Hackathon Requirements Mapping (Qualifying for GCP Agent Builder and the MongoDB Bucket tracks).
Dual-Mode Backend Engine (Detailing the automatic transition from live Atlas clusters to mock in-memory database fallback systems).
Vite + React UI Architecture (Organizing all dashboard sub-components).
Custom CSS Design Tokens (Maintaining a premium dark-mode glassmorphic interface).
Vite Production Bundler Performance (Logging our successful 644ms compilation speed).
You can easily open, edit, and review this document inside your primary code editor! Let me know if you would like me to adjust or explain any parts of the plan.


Here is the step-by-step guide to get your MONGODB_URI connection string for free in under 5 minutes:

1. Create a Free Database Cluster
Go to MongoDB Atlas and sign up for a free account.
Click Create to deploy a database.
Select the M0 Free Tier (100% free, no credit card required).
Choose Google Cloud (or AWS) as your provider, select a region close to you, and click Create Deployment.
2. Configure Access Security (Crucial)
Create a Database User: Enter a username and password (e.g., username: db_user, password: your_secure_password). Write down this password!
Configure IP Access List: Add 0.0.0.0/0 (Allow Access from Anywhere). This is necessary so that both your local machine and your Google Cloud Agent Builder tool webhooks can connect to Atlas.
3. Copy the Connection String
Go to your Database page and click the Connect button on your cluster.
Select Drivers (Node.js).
Copy the connection string. It will look similar to this:
text


mongodb+srv://<db_username>:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
4. Format the URI for TrialSync Agent
Replace <db_username> with db_user.
Replace <db_password> with your database user's password.
Insert the database name /trialsync right before the ? character.
Final Formatted URI Example:
text


mongodb+srv://db_user:your_secure_password@cluster0.abcde.mongodb.net/trialsync?retryWrites=true&w=majority&appName=Cluster0
🚀 How to Run the App with your MONGODB_URI
On Windows PowerShell:
Set the environment variable in your terminal before launching the server:

powershell


$env:MONGODB_URI="mongodb+srv://db_user:your_secure_password@cluster0.abcde.mongodb.net/trialsync?retryWrites=true&w=majority&appName=Cluster0"
npm run dev
On Windows Command Prompt:
cmd


set MONGODB_URI=mongodb+srv://db_user:your_secure_password@cluster0.abcde.mongodb.net/trialsync?retryWrites=true&w=majority&appName=Cluster0
npm run dev

Here are the Google Cloud products utilized in the TrialSync Agent architecture, ready for your hackathon submission details:

1. Google Cloud Agent Builder (Orchestration & Reasoning Platform)
Role: The main agent runtime and task manager. It orchestrates the multi-step selection pipeline, plans logical execution phases, maps state behaviors, and dispatches API tool calls to our backend webhook endpoints.
2. Gemini 3 Pro via Vertex AI (Advanced Cognitive Brain)
Role: Handles highly dense medical document reasoning. It parses clinical protocols (PDFs), extracts structured inclusion/exclusion criteria, and drafts bespoke, customized feasibility survey emails for PIs.
3. Gemini 3 Flash via Vertex AI (High-Speed Reasoning Engine)
Role: Drives real-time, low-latency scoring decisions. It evaluates site-specific EHR metrics, aggregates geographical patient statistics, and performs multi-factor score analysis on the fly.
4. Google Cloud Run (Serverless Webhook Hosting)
Role: Serves as the high-availability execution environment hosting our Express API backend. It securely exposes the OpenAPI REST endpoints called by Agent Builder as webhook tools.
5. Google Cloud Storage (Clinical Document Repository)
Role: Securely hosts uploaded trial protocol PDFs (e.g., gs://trialsync-protocols/P-2026-CV-001.pdf) to maintain high-security HIPAA file isolation.


Google Cloud Agent Builder: Orchestrates the autonomous multi-step site selection pipeline, logical workflow planning, and tool routing.
Gemini 3 Pro & Flash (Vertex AI): Powers dense clinical protocol PDF parsing, structured criteria extraction, and real-time site scoring.
Google Cloud Run & Cloud Storage: Hosts the Express tool webhook APIs and securely stores clinical trial protocol documents.

Database & Partner Track: MongoDB Atlas (with MCP server) utilizing 14-stage Aggregations, Vector Search, Geospatial $geoNear indexes, Change Streams, and Time-Series logs.
Development & UI: Node.js/Express, React, Vite, bespoke HSL Vanilla CSS, and GitHub (managed under the open-source MIT License).

