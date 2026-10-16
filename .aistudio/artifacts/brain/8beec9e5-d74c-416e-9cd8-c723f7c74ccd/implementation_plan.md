# InterviewMate AI — Personalized Voice & Resume/JD Practice Interviewer

An enterprise-grade, conversational mock interview platform inspired by HCLTech's AI interview bot. Candidates can upload their Resume and Job Description (or choose industry presets), practice realistic voice-driven interviews led by a professional male interviewer avatar across English, Hindi, and Telugu, and receive an in-depth rubric evaluation with skill gap analysis.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Confirmed User Preferences (Phase 1 Clarifications):**
>
> 1. **Document Ingestion**: Supports both PDF/DOCX document upload and direct text paste, equipped with realistic built-in sample presets (Full Stack Software Engineer, AI/ML Engineer, Data Analyst) for instant testing.
> 2. **Question Strategy**: Candidate-configurable mode (Technical, HR/Behavioral, or Mixed) that analyzes the candidate's actual projects, tools, and JD requirements without hallucinating qualifications.
> 3. **Progression Mode**: Adaptive conversational flow with dynamic contextual follow-up questions tailored to previous answers, plus candidate controls to review/edit voice transcripts before submitting.

- **Avatar Visual Asset**: The primary interviewer visual uses the provided portrait of the male interviewer in a tailored navy suit at his studio desk, framed prominently in an interactive video-call format with active audio-spectrum visualizers, subtle state aura rings, and clear status indicators (idle, listening, thinking, speaking).
- **AI Backend & Local Resiliency**: Powered by server-side Gemini 3.8 Flash (`@google/genai`) for JD parsing, resume-gap mapping, and contextual question generation; smoothly falls back to the rich offline question bank and local keyword rubric whenever external services are unreachable.

---

### 1. Overview & Core Concept

- **What It Does**: Simulates a live one-on-one video job interview with an AI interviewer. It ingests the candidate's resume and target JD, generates customized questions targeting both confirmed experiences and skill gaps, speaks questions aloud via synthesized browser speech, listens via speech recognition, and generates a printable debrief report.
- **Target Audience / Persona**: College students, fresh graduates, and software engineers preparing for campus placements, technical screenings, and HR rounds.
- **Key Value**: Replaces anxiety-inducing blind interviews with a personalized, bilingual/trilingual safe practice environment with actionable feedback on technical knowledge, problem-solving structure, communication clarity, and JD alignment.

---

### 2. User Experience & Visual Design

#### Key User Flows

1. **Setup & Ingestion Stage**:
   - **Mode Selection**: Choose "Resume + JD Tailored" or "Quick Role Practice".
   - **Document Upload & Presets**: Drag-and-drop or browse for PDF/DOCX files (with file size/type validation, replace, and clear buttons), or paste JD text directly. Includes "Load Sample Resume & JD" buttons for instant zero-friction demonstration.
   - **Document Analysis Preview**: Instant extracted summary showing detected target role, top required skills, matching candidate skills, and identified skill gaps.
   - **Interview Configuration**: Adjust duration (10, 20, 30 mins), difficulty (Beginner, Intermediate, Advanced), focus (Technical, HR/Behavioral, Mixed), and interview language (English - India, Hindi, Telugu).
   - **Voice Studio Settings**: Choose browser voice, test with "Voice Preview", and adjust speech rate slider (0.8x to 1.2x).
2. **Interactive Live Interview Stage**:
   - **Studio Layout**: Modern video-conference aesthetic with the male interviewer portrait anchored prominently.
   - **Interviewer Telepresence**: Displays states with distinct visual cues:
     - _Idle_: Calm resting state with gentle ambient pulse.
     - _Speaking_: Glowing violet audio-wave spectrum visualizer and status badge.
     - _Listening_: Radiant emerald aura ring and real-time audio waveform.
     - _Thinking_: Animated amber processing indicator while generating follow-ups.
   - **Voice & Transcript Dual Input**:
     - Auto-speaks questions in natural sentence-by-sentence pacing without voice overlap.
     - Candidate can click "Speak" to talk, watch live interim transcript with stable non-duplicating append, review or edit the recognized text in the editor, and submit when satisfied.
     - Candidate can toggle "Type Answer" anytime for quiet environments or when microphone permissions are denied.
3. **Comprehensive Performance & Skill Gap Report**:
   - Overall composite score out of 10.
   - Quad-metric radar/bar breakdown: Technical Knowledge, Communication Structure, Problem Solving, and JD Relevance.
   - Resume-to-JD Skill Matrix: Covered skills, missing competencies, and alignment rate.
   - Question-by-Question Deep Dive: Full transcript, candidate's response, rubric score, strengths, and sample model answer.
   - Curated Next Steps: Actionable study topics and STAR method recommendations.
   - Export: 1-click Print/Save as PDF and text file download.

#### Visual Identity & Theme

- **Color Discipline**: Executive Navy (`oklch(0.22 0.07 268)`) and Crisp Canvas (`oklch(0.985 0.004 265)`), paired with Violet (`oklch(0.58 0.16 292)`) for AI interviewer states, Emerald (`oklch(0.52 0.12 162)`) for live candidate audio capture, and Amber (`oklch(0.62 0.14 70)`) for thinking/caution notes.
- **Typography**: Sora display headlines paired with Manrope body prose; monospace numbers with `tabular-nums` for timers and scores.
- **Anti-Slop Discipline**: Zero static pill enclosures for metadata; clean unboxed editorial typography with dot separators (`·`); single-elevation rounded cards; clear human button labels.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Document Extraction Strategy (Client-side vs Server-side)**
  - _Chosen Approach_: Robust client-side extraction using `pdfjs-dist` (or lightweight text extractor) and `mammoth` for DOCX, with fallback to raw text paste.
  - _Why_: Provides instant client feedback, ensures candidate privacy (files never leave the browser unnecessarily), and eliminates complex server binary dependencies.
- **Decision 2: Server-Side AI Orchestration via @google/genai**
  - _Chosen Approach_: Expose `/api/interview/*` endpoints in `src/server.ts` powered by Gemini 3.8 Flash (`@google/genai`) with API keys securely read from `process.env.GEMINI_API_KEY`.
  - _Why_: Adheres strictly to security rules (no client-side API keys), delivers high-fidelity JD analysis and contextual follow-ups, and gracefully falls back to local algorithms if offline.
- **Decision 3: Speech Recognition & Synthesis Architecture**
  - _Chosen Approach_: Dedicated `SpeechManager` wrapper around Web Speech API with debounce, sentence chunking, asynchronous voice list discovery, and explicit state machines (`idle`, `speaking`, `listening`, `thinking`).
  - _Why_: Eliminates the common bug where interim speech gets duplicated onto final text, cancels old speech on route transitions, and supports English, Hindi (`hi-IN`), and Telugu (`te-IN`).

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Candidate Browser Client                        │
│                                                                        │
│   ┌───────────────────┐    ┌────────────────────┐    ┌─────────────┐   │
│   │ Document Uploader │    │ Interview Studio   │    │ Performance │   │
│   │ (PDF/DOCX/Paste)  │───>│ Male Avatar Frame  │───>│ Report &    │   │
│   │ + Sample Presets  │    │ Audio Visualizer   │    │ Skill Gaps  │   │
│   └────────┬──────────┘    │ Transcript Editor  │    └─────────────┘   │
│            │               └─────────┬──────────┘                      │
│            ▼                         ▼                                 │
│   ┌─────────────────────────────────────────────┐                      │
│   │ Speech & Voice Engine (Web Speech API)      │                      │
│   │ • Multilingual TTS (EN, HI, TE) + Rate      │                      │
│   │ • Non-repeating STT + Live Edit Fallback    │                      │
│   └─────────────────────────────────────────────┘                      │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │ Secure API calls
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Server-Side Runtime (src/server.ts)                      │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ /api/interview/analyze-documents                               │   │
│   │ • Parses Resume + JD, extracts skills, matches, gaps           │   │
│   ├────────────────────────────────────────────────────────────────┤   │
│   │ /api/interview/generate-question                               │   │
│   │ • Contextual question & adaptive follow-up generator           │   │
│   ├────────────────────────────────────────────────────────────────┤   │
│   │ /api/interview/evaluate-response                               │   │
│   │ • Multi-dimensional scoring & actionable coaching feedback     │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│                                   ▼                                    │
│                     ┌───────────────────────────┐                      │
│                     │ Google GenAI SDK          │                      │
│                     │ Model: gemini-3.8-flash   │                      │
│                     │ User-Agent: aistudio-build│                      │
│                     └───────────────────────────┘                      │
└────────────────────────────────────────────────────────────────────────┘
```

#### Key State Entities

```typescript
interface DocumentAnalysis {
  role: string;
  level: "fresher" | "junior" | "mid" | "senior";
  requiredSkills: string[];
  candidateSkills: string[];
  matchedSkills: string[];
  gapSkills: string[];
  summary: string;
}

interface InterviewQuestion {
  id: string;
  category: "technical" | "project_deepdive" | "behavioral" | "scenario";
  text: string;
  contextWhyAsked: string;
  expectedKeywords: string[];
  tip: string;
}
```

---

### Implementation Stages

1. **Avatar Component Upgrade**: Replace SVG illustration in `src/components/interview/Avatar.tsx` with the high-resolution male interviewer portrait visual asset, complete with animated pulse rings, audio waveform equalizer, and 4 explicit visual states (idle, listening, thinking, speaking).
2. **Enhanced Speech System**: Upgrade `src/lib/speech.ts` with voice selection, preview function, speed control (0.75x–1.25x), async voice resolution, sentence chunking, non-repeating speech recognition buffer, and Indian language locale fallbacks (`en-IN`, `hi-IN`, `te-IN`).
3. **Document Ingestion & Parsing**: Add client-side PDF/DOCX text extraction utilities and pre-loaded sample presets for easy testing.
4. **Server-Side Gemini API Routes**: Implement `/api/interview/*` handlers in `src/server.ts` with `@google/genai` for document analysis, adaptive questions, and detailed scoring with local offline fallback.
5. **UI & Routing Integration**: Update `src/routes/index.tsx` to support the document setup view, live video-call layout, transcript review modal, and the multi-dimensional skill gap report.
6. **Testing & Verification**: Run linting, unit tests, and compilation checks to verify full stability.
