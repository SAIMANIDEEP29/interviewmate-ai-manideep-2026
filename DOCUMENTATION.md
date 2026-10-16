# PROJECT DOCUMENTATION
# INTERVIEWMATE AI: AUTOMATED VOICE & RESUME TECHNICAL SCREENING STUDIO

---

### Student & Project Credentials
* **Project Name:** InterviewMate AI — Voice & Resume Mock Technical Screening Studio
* **Candidate / Author:** **Maruthota Sai Mani Deep**
* **Department & Section:** Department of Artificial Intelligence & Data Science (AI & DS), B-SEC
* **University Roll Number:** **23481A54A6**
* **Academic Institution:** Seshadri Rao Gudlavalleru Engineering College (SRGEC)
* **GitHub Repository:** [SAIMANIDEEP29/interviewmate-ai-manideep-2026](https://github.com/SAIMANIDEEP29/interviewmate-ai-manideep-2026)
* **Live Production URL:** [https://interviewmate-ai-pro.netlify.app/](https://interviewmate-ai-pro.netlify.app/)

---

## 1. Executive Summary

Campus recruitment drives and technical screening rounds often present high barriers for graduating engineering students due to inconsistent feedback, performance anxiety, and lack of exposure to multi-stage structured corporate interview formats. 

**InterviewMate AI** is an advanced, automated technical screening interview simulation platform engineered to replicate Tier-1 corporate screening environments (such as HCLTech, TCS, and product engineering hiring workflows). The platform introduces:
1. **Interactive Virtual Avatar Telepresence (`Tesla`):** An animated SVG/CSS state-driven interviewer with real-time audio wave reactivity and conversational cues.
2. **7-Stage Technical Screening Pipeline:** A progressive interview journey spanning Introduction, Resume Deep-Dive, Technical Fundamentals, Hands-on Coding/SQL, Production Scenario Diagnostics, STAR Behavioral Questions, and Closing Reflection.
3. **Multilingual Speech Intelligence:** In-browser Speech-to-Text (STT) and natural Text-to-Speech (TTS) supporting English (`en-IN`), Hindi (`hi-IN`), and Telugu (`te-IN`).
4. **Document Ingestion Engine:** Client-side parsing of candidate Resumes and Job Descriptions (PDF, DOCX, TXT) with automatic competency mapping.
5. **Hybrid AI & Deterministic Evaluation:** Real-time multi-dimensional scoring (Technical Knowledge, Communication Clarity, Problem Solving, and Job Alignment) powered by Google Gemini API with deterministic fallback heuristics.
6. **Serverless Production Architecture:** Built on React 19, TypeScript, TanStack Start, Nitro server engine, and deployed globally on Netlify Edge.

---

## 2. Problem Statement & System Objectives

### 2.1 Problem Statement
Traditional mock interviews suffer from significant limitations:
* **Subjectivity & Inconsistency:** Human mock interviews are unstandardized and dependent on interviewer availability.
* **Lack of Multi-stage Structure:** Most existing online tools only present isolated quiz questions without contextual progression (e.g., relating questions directly to projects mentioned in a resume).
* **Language & Accessibility Barriers:** Non-native English speakers often struggle with initial speech articulation and require multi-lingual accommodations during early practice.
* **Absence of Real-time Diagnostic Scenarios:** Fresher candidates rarely get tested on practical production scenarios (e.g., resolving sudden database latency or connection pool exhaustion).

### 2.2 System Objectives
* **Objective 1:** Engineer a zero-lag, browser-native voice interview experience requiring no third-party plugin installations.
* **Objective 2:** Implement automated resume and job description (JD) alignment that extracts candidate skills and generates tailored questions.
* **Objective 3:** Build an interactive code and SQL assessment interface directly integrated into the conversational flow.
* **Objective 4:** Provide actionable, rubric-based feedback including model answers using the **STAR** (Situation, Task, Action, Result) methodology.
* **Objective 5:** Deliver an enterprise-grade, mobile-responsive web application deployed on scalable serverless infrastructure.

---

## 3. High-Level Architecture & Workflow

The architecture follows a modern **Server-Side Rendered (SSR) / Serverless** design leveraging TanStack Start and Nitro:

```
[Client Browser: React 19 + TypeScript]
  ├── Tesla Avatar Engine (Blink / Speak / Pulse)
  ├── Web Speech API (STT & TTS Engine: en-IN, hi-IN, te-IN)
  ├── Document Parser (Mammoth.js & PDF Extractor)
  └── Local Rubric Engine (Deterministic Fallback Scorer)
           │
           ▼
[Netlify Edge & Global CDN]
  ├── Netlify Edge Router (_redirects / netlify.toml)
  ├── Static CDN Cache (dist/assets)
  └── Nitro SSR Server Handler (.netlify/functions-internal/server)
           │
           ▼
[Serverless API Layer]
  ├── /api/interview/health
  ├── /api/interview/evaluate-response
  ├── /api/interview/analyze-documents
  └── Google Gemini 2.5 API Client (@google/genai)
```

---

## 4. Key Functional Modules & Implementation Details

### 4.1 Module 1: Virtual AI Interviewer Avatar (`Tesla`)
Located in `src/components/interview/Avatar.tsx`:
* **Visual Identity:** Designed with a professional corporate aesthetic using custom SVG vector geometry, smooth CSS transitions, and subtle indigo/emerald status halos.
* **Dynamic Facial Expressions & Audio Reactivity:**
  * **Idle:** Eyes blink periodically using randomized CSS keyframe intervals (3.5s - 6s).
  * **Speaking:** Mouth morphs with synchronized audio pulse ripples driven by Web Speech synthesis playback events.
  * **Listening:** Ear and halo glow transitions to an active emerald pulse indicating microphone audio capture.
  * **Thinking:** Concentric rotating gradient borders signal ongoing rubric evaluation or AI inference.

### 4.2 Module 2: Document Ingestion & Skill Extractor
Located in `src/lib/document-parser.ts`:
* Supports `.pdf`, `.docx`, and `.txt` files directly in the browser.
* Uses **Mammoth.js** (`mammoth.extractRawText`) for extracting raw semantic text from binary Microsoft Word documents without server round-trips.
* **Skill Identification Pipeline:**
  * Uses regular expressions and keyword indexing against a curated dictionary of 150+ frameworks, databases, and programming languages (Java, Python, SQL, React, Docker, Kubernetes, etc.).
  * Generates a dynamic `CandidateContext` that feeds the interview plan generator.

### 4.3 Module 3: 7-Stage Structured Technical Screening Pipeline
Located in `src/lib/interview-controller.ts`:
Each stage serves a specific evaluation goal aligned with corporate placement rubrics:

| Stage Number | Stage Identifier | Focus Area | Dynamic Context Injected |
| :--- | :--- | :--- | :--- |
| **Stage 1** | `stage_1_intro` | Candidate Background & Education | Target Role & Experience Level |
| **Stage 2** | `stage_2_resume` | Project Architecture & Tech Stack | Primary Project extracted from Resume |
| **Stage 3** | `stage_3_technical` | Core Fundamentals & Clean Code | Detected Skills (e.g., SQL, Java, OOP) |
| **Stage 4** | `stage_4_coding` | Hands-on Algorithm / SQL Query | Live coding prompt with Starter Code |
| **Stage 5** | `stage_5_scenario` | Production Incident Troubleshooting | High-traffic Latency / Deadlock Scenario |
| **Stage 6** | `stage_6_behavioral` | Teamwork, Deadlines & Disagreements | STAR evaluation metric requirement |
| **Stage 7** | `stage_7_closing` | Candidate Questions & Culture Fit | Forward-looking growth alignment |

### 4.4 Module 4: Multilingual Speech Intelligence Engine
Located in `src/lib/speech.ts`:
* **Text-to-Speech (TTS):**
  * Utilizes `window.speechSynthesis`.
  * Filters and prioritizes natural female/male locale voices:
    * English: `en-IN` (Indian English Natural), `en-US`, `en-GB`.
    * Hindi: `hi-IN` (Google हिन्दी / Microsoft Hemant/Kalpana).
    * Telugu: `te-IN` (Google తెలుగు / Microsoft Mohan).
  * Automatically handles speech interruptions, rate adjustments (0.95x for clarity), and phoneme normalization.
* **Speech-to-Text (STT):**
  * Wraps `webkitSpeechRecognition` with continuous listening and interim transcript buffering.
  * Provides a fallback editable text area for candidates without functional microphones or in noisy environments.

### 4.5 Module 5: Hybrid Scoring & Rubric Engine
Located in `src/lib/evaluate.ts` and `src/server-ai.ts`:

The evaluation model computes an overall stage score out of 10 composed of four weighted sub-metrics:

$$\text{Overall Score} = 0.35 \cdot \text{Technical} + 0.25 \cdot \text{Communication} + 0.25 \cdot \text{Problem Solving} + 0.15 \cdot \text{Job Alignment}$$

Where:
* **Technical Knowledge (35%):** Technical correctness, terminology precision, and concept depth.
* **Communication Clarity (25%):** Structural delivery, conciseness, and articulation clarity.
* **Problem Solving (25%):** Trade-off analysis, systematic methodology, and edge-case handling.
* **Job Alignment (15%):** Direct relevance to the targeted job description and required competencies.

If Google Gemini API (`GEMINI_API_KEY`) is active, evaluation requests are routed through `@google/genai` using structured JSON schemas. If offline or in fallback mode, the deterministic heuristic engine analyzes keyword density, length, STAR structure, and technical depth.

---

## 5. Deployment & Build Engineering Fixes

During deployment of this project to Netlify, critical configuration and syntax obstacles were diagnosed and resolved:

### 5.1 Syntax Resolution in Interview Controller
* **Defect:** In `src/lib/interview-controller.ts`, lines 722–724 contained an orphaned duplicate statement:
  ```ts
  return questions;
  }
  ```
* **Impact:** Vite’s underlying Rolldown compiler threw `[builtin:vite-transform] A 'return' statement can only be used within a function body`, terminating `npm run build` with exit code `1`.
* **Remedy:** Cleaned the AST boundary, eliminating duplicate returns and restoring clean compilation.

### 5.2 Nitro Server Engine Netlify Preset Binding
* **Defect:** Lovable’s default `@lovable.dev/vite-tanstack-config` defaulted Nitro to Cloudflare Workers (`preset: 'cloudflare-module'`), which directed build output into `.output/public` and generated `wrangler.json`.
* **Impact:** Netlify looked for `dist` and `.netlify/functions-internal/server`, found an empty or mismatched directory, and triggered the default Netlify `404 Site not found` error.
* **Remedy:** In `vite.config.ts`, explicitly bound the preset:
  ```ts
  export default defineConfig({
    nitro: {
      preset: "netlify",
    },
    tanstackStart: {
      server: { entry: "server" },
    },
  });
  ```
  This immediately generated:
  * Static CDN bundle in `dist/`
  * Serverless SSR entry point in `.netlify/functions-internal/server/`
  * Seamless rewrite rules via `netlify.toml`

---

## 6. Verification & Experimental Results

### Sample Benchmark: Associate Data Analyst (Fresher) Simulation
Conducted on October 16, 2026 by candidate **Maruthota Sai Mani Deep**:
* **Total Stages Completed:** 7 / 7
* **Overall Composite Score:** **7.9 / 10** (*Placement Ready with Refinements*)
  * **Technical Knowledge:** 7.8 / 10
  * **Communication Clarity:** 8.9 / 10
  * **Problem Solving:** 7.5 / 10
  * **JD Relevance & Alignment:** 8.0 / 10
* **Hands-on SQL Challenge:** Implemented `DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC)` inside a CTE with detailed explanation of O(N log N) performance advantage over correlated subqueries.
* **Scenario Diagnostic Workflow:** Outlined a 4-step production triage methodology (Metric baseline assessment -> query index and connection pool inspection -> coordinated mitigation -> post-incident root cause documentation).

---

## 7. Technology Stack Summary

| Layer | Technology / Package | Purpose |
| :--- | :--- | :--- |
| **Language** | TypeScript 5.8 | Type-safe enterprise domain models |
| **Frontend Framework** | React 19.2 | Component tree & modern hook architecture |
| **Application Framework** | TanStack Start (v1.168) | Full-stack SSR and API route handling |
| **Client Routing** | TanStack Router (v1.170) | Type-safe client-side routing & preloading |
| **Styling & Design System** | Tailwind CSS v4, Lucide React, Radix UI | Accessible minimal UI & custom animations |
| **Server Engine** | Nitro (v3.0-beta) | Cross-cloud serverless compilation |
| **Document Processing** | Mammoth.js, PDF extractor | In-browser parsing of resumes and job descriptions |
| **AI Integration** | Google Gemini API (`@google/genai` v2.30) | Intelligent response evaluation & coaching models |
| **Hosting & CI/CD** | Netlify Edge & GitHub | Continuous automated build and deployment |

---

## 8. Conclusion & Future Scope

**InterviewMate AI** successfully demonstrates how client-side Web Speech capabilities, modern full-stack SSR frameworks, and generative AI can be integrated into an automated, multi-lingual mock interview platform. 

### Future Enhancements:
1. **Dynamic Code Sandbox Execution:** Integrating WebAssembly-based code runners (e.g., Pyodide for Python and SQLite-WASM for live SQL query validation).
2. **Automated ATS Resume Scorer:** Visual heatmaps showing keyword parity between uploaded resumes and target job specifications.
3. **Audio Tone & Pace Analytics:** Real-time feedback on speaking pace (words-per-minute) and filler word frequency ("um", "like", "actually").

---

*Document compiled and certified for Maruthota Sai Mani Deep (23481A54A6, AI & DS B-SEC, SRGEC).*
