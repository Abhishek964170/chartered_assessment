# Chartered Vectorial – Multi-Stage Investment Advisory Platform

![Platform Architecture](https://img.shields.io/badge/Architecture-Next.js_|_React_|_Zustand-blue) ![Data Storage](https://img.shields.io/badge/Storage-IndexedDB-green) ![Zero-Trust Validation](https://img.shields.io/badge/Security-Zod_Strict-red)

A sophisticated, state-driven workflow application designed for wealth management professionals to evaluate, synthesize, and mathematically score AI-driven client portfolio recommendations. 

This repository serves as the official submission for the **AI Engineer (Forger)** technical assessment.

---

## 📖 Project Overview

This platform simulates a next-generation AI advisory toolkit. Unlike simple web forms, this application is built as a **decoupled distributed system**. It guides financial advisors through a rigid 5-stage pipeline:

1. **Information Gathering:** File upload parsing and validation gates for portfolio data.
2. **Conversational Risk Assessment:** A progressive chat UI that computes completion coverage constraints natively before unlocking pipelines.
3. **AI Pipeline Orchestration:** A decoupled asynchronous sequencer that triggers 3 independent AI Agent modules.
4. **Weighted Scoring:** Mathematical projection of Feasibility vs. Impact derived from the AI output.
5. **Global Dashboard:** A highly interactive data-grid and 2D Scatter Matrix mapping the firm's overall advisory strategy.

---

## 🚀 Quick Start: Step-by-Step Local Deployment

Follow these instructions to safely clone and run the platform on your local machine.

### Prerequisites
*   [Node.js](https://nodejs.org/en/) (v18.0.0 or higher)
*   Git installed on your terminal

### Step 1: Clone the Repository
Open your terminal and clone the project to your local environment:
```bash
git clone git@github.com:Abhishek964170/chartered_assessment.git
```

### Step 2: Navigate to Directory
```bash
cd chartered_assessment
```

### Step 3: Install Dependencies
Install all required NPM packages (Next.js, Zustand, Zod, Recharts, Tailwind v4, etc.):
```bash
npm install
```

### Step 4: Run the Development Server
Spin up the Next.js local server:
```bash
npm run dev
```

### Step 5: View the Application
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

*(Note: There are no `.env` files or external database keys required to run this simulation. All mock latency and storage architectures are handled natively within the repository).*

---

## 🏗️ Architectural Decisions & Senior Features

Instead of building a simple React UI, this platform was purposefully engineered as a **Zero-Trust, production-grade microservice architecture**:

### 1. Serverless API Execution Engine
Rather than relying on primitive client-side `setTimeout` mocks, the three AI Agents execute their heavyweight workflows inside discrete Next.js Backend Endpoints (`/api/analyze/...`). The frontend orchestrator communicates with these APIs asynchronously via HTTP calls, mirroring how real LLMs interact.

### 2. Zero-Trust Security Boundaries (Zod)
We cannot trust the client to send valid data, nor can we implicitly trust prompt-based LLMs to return correctly structured JSON. Therefore, strict **Zod runtime validation** runs at both boundaries:
*   Incoming telemetry payloads from the frontend are validated on the backend.
*   The raw JSON returned by the simulated backends is strictly `.parse()`'d against rigourous schemas before updating global state. Hallucinations trigger instant error rejection (`400 Bad Request`).

### 3. Asynchronous IndexedDB Persistence
Handling highly-nested JSON states for 25+ complex clients will rapidly crash standard, synchronous 5MB `localStorage` limits. The `Zustand` global state orchestrator is configured utilizing an `idb-keyval` wrapper to write the entire platform state to the browser's hidden, high-capacity **IndexedDB**. 

### 4. Telemetry & Fault Tolerance
The `useAgentPipeline` orchestration hook implements a robust "Wait & Retry" structure. Simulated timeouts or network drops execute a graceful UI failure state. These events are structurally captured in `src/lib/telemetry.ts`, mapping error footprints identically to DataDog/Sentry environments.

---

## 💡 Future "Staff-Level" Considerations

Given the scope of this assignment, there are scalable enhancements omitted which would be required in a true live production deployment:

1. **Background Job Queues:** Switching from synchronous `/api/` fetch loops to a robust message queue (e.g., Celery/BullMQ) to process long-running LLM tasks asynchronously without risking HTTP gateway timeout limits.
2. **Multi-Tenant Security:** Tying the architecture into a secure Authentication layer (e.g., NextAuth/Clerk) and implementing Row-Level Security via Postgres to absolutely guarantee strict data segregation between differing financial advisors on the same platform.

---
*Developed by Abhishek for Chartered Vectorial.*