import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, type AvatarState } from "@/components/interview/Avatar";
import {
  BANK,
  LANG_CODES,
  LANG_NAMES,
  ROLES,
  pickQuestions,
  questionText,
  type InterviewType,
  type Lang,
  type Level,
} from "@/lib/questions";
import { evaluate, type Evaluation } from "@/lib/evaluate";
import {
  createRecognizer,
  getAvailableVoices,
  getLocaleCode,
  hasVoiceFor,
  pickRecommendedVoice,
  speak,
  stopSpeaking,
  sttSupported,
  ttsSupported,
} from "@/lib/speech";
import {
  parseDocumentFile,
  SAMPLE_PRESETS,
  type DocumentAnalysisResult,
  type ParsedDocument,
  type SamplePreset,
} from "@/lib/document-parser";
import {
  buildStructuredInterviewPlan,
  getStageTransitionSpeech,
  STAGE_CONFIGS,
  type StageKey,
  type StageQuestion,
} from "@/lib/interview-controller";
import { cn } from "@/lib/utils";
import {
  Upload,
  FileText,
  Trash2,
  Sparkles,
  Volume2,
  Mic,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Printer,
  ChevronRight,
  Sliders,
  BrainCircuit,
  Award,
  BookOpen,
  Code2,
  Terminal,
  ShieldCheck,
  Check,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InterviewMate AI — Professional Voice & Resume Mock Interviewer" },
      {
        name: "description",
        content:
          "AI technical screening interview simulation inspired by campus placement screening standards. Practice one-on-one with virtual interviewer Tesla in English, Hindi, or Telugu.",
      },
      { property: "og:title", content: "InterviewMate AI — Voice & Resume Mock Interviews" },
      {
        property: "og:description",
        content:
          "Practice structured technical screening interviews with avatar telepresence, resume gap analysis, hands-on coding, and instant scored feedback.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: App,
});

/* ---------------- Domain Models ---------------- */

export interface ActiveQuestion {
  id: string;
  stage?: StageKey;
  stageNumber?: number;
  totalStages?: number;
  category: string;
  text: string;
  hindiText?: string;
  teluguText?: string;
  transitionIntro?: string;
  hindiTransitionIntro?: string;
  teluguTransitionIntro?: string;
  contextWhyAsked?: string;
  expectedKeywords: string[];
  tip: string;
  difficulty?: "foundational" | "intermediate" | "advanced";
  isCodingChallenge?: boolean;
  codingLanguage?: string;
  starterCode?: string;
  sampleInputOutput?: string;
}

export interface DetailedEvaluation {
  score: number;
  metrics: {
    technicalKnowledge: number;
    communication: number;
    problemSolving: number;
    jdRelevance: number;
  };
  strengths: string[];
  areasToImprove: string[];
  coachingFeedback: string;
  sampleModelAnswer: string;
}

export interface InterviewResponse {
  qid: string;
  stageNumber?: number;
  category: string;
  questionText: string;
  answer: string;
  codeSnippet?: string;
  evaluation: DetailedEvaluation;
  timeSpentSec: number;
}

export interface AppConfig {
  mode: "resume_jd" | "quick_role";
  name: string;
  role: string;
  level: Level;
  type: InterviewType | "mixed";
  lang: Lang;
  durationMins: number;
  questionCount: number;
  speechRate: number;
  selectedVoiceURI: string;
  resumeFileName?: string;
  resumeText?: string;
  jdFileName?: string;
  jdText?: string;
  analysis?: DocumentAnalysisResult;
}

export interface InterviewSession {
  phase: "setup" | "interview" | "report";
  config: AppConfig;
  questions: ActiveQuestion[];
  index: number;
  responses: InterviewResponse[];
  startedAt: number;
}

const STORAGE_KEY = "interviewmate.session.v3";

const DEFAULT_CONFIG: AppConfig = {
  mode: "resume_jd",
  name: "",
  role: "Full-Stack Developer",
  level: "fresher",
  type: "mixed",
  lang: "en",
  durationMins: 20,
  questionCount: 6,
  speechRate: 0.92,
  selectedVoiceURI: "",
  resumeFileName: "",
  resumeText: "",
  jdFileName: "",
  jdText: "",
};

const createFreshSession = (): InterviewSession => ({
  phase: "setup",
  config: DEFAULT_CONFIG,
  questions: [],
  index: 0,
  responses: [],
  startedAt: 0,
});

function App() {
  const [session, setSession] = useState<InterviewSession>(createFreshSession);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSession(JSON.parse(stored));
      }
    } catch {
      /* ignore storage load error */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      } catch {
        /* storage full or private mode */
      }
    }
  }, [session, loaded]);

  const resetAll = () => {
    stopSpeaking();
    localStorage.removeItem(STORAGE_KEY);
    setSession(createFreshSession());
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased flex flex-col justify-between">
      {/* Top Bar Header */}
      <header className="no-print sticky top-0 z-20 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-hero font-display text-base font-bold text-navy-foreground shadow-sm">
              IM
            </div>
            <div>
              <span className="font-display font-semibold tracking-tight text-foreground text-base sm:text-lg">
                InterviewMate <span className="text-violet">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-muted-foreground font-medium">
                · Placement Screening Studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              <span>Privacy-Protected Client Voice</span>
            </div>
            {session.phase !== "setup" && (
              <button
                onClick={resetAll}
                className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                Reset session
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-8 flex-1">
        {!loaded ? (
          <div className="grid h-64 place-items-center text-muted-foreground text-sm font-medium">
            Loading session state…
          </div>
        ) : session.phase === "setup" ? (
          <SetupView
            initialConfig={session.config}
            onStart={(config, questions) => {
              setSession({
                phase: "interview",
                config,
                questions,
                index: 0,
                responses: [],
                startedAt: Date.now(),
              });
            }}
          />
        ) : session.phase === "interview" ? (
          <LiveInterviewView
            session={session}
            onAnswer={(response, forceEnd) => {
              setSession((prev) => {
                const nextResponses = [...prev.responses, response];
                const isFinished = forceEnd || prev.index + 1 >= prev.questions.length;
                return {
                  ...prev,
                  responses: nextResponses,
                  index: prev.index + 1,
                  phase: isFinished ? "report" : "interview",
                };
              });
            }}
            onEndInterview={() => {
              setSession((prev) => ({ ...prev, phase: "report" }));
            }}
          />
        ) : (
          <ReportView
            session={session}
            onRestart={resetAll}
            onRetry={() => {
              setSession((prev) => ({
                ...createFreshSession(),
                config: prev.config,
              }));
            }}
          />
        )}
      </main>

      {/* Footer & Educational Disclosure */}
      <footer className="no-print mt-auto border-t border-border/60 bg-card/40 py-6">
        <div className="mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground space-y-2">
          <p className="leading-relaxed">
            <strong>Educational Practice Simulation:</strong> InterviewMate AI simulates an
            automated technical screening interview inspired by placement screening standards (such
            as general HCLTech screening structures). It is an independent college practice tool and
            does not claim to reproduce proprietary platforms (e.g. BerriBot) or internal enterprise
            evaluation algorithms.
          </p>
          <p className="text-[11px] text-muted-foreground/75">
            <strong>Privacy & Integrity Notice:</strong> Voice recognition and speech synthesis run
            locally in your browser. No video, eye-tracking, or identity surveillance is performed.
            Resumes and Job Descriptions are parsed solely for real-time practice question
            alignment.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================================
   1. SETUP VIEW (Resume + JD Ingestion, Presets, Settings, Voice Studio)
   ========================================================================= */

const formFieldStyle =
  "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition shadow-xs";

function SetupView({
  initialConfig,
  onStart,
}: {
  initialConfig: AppConfig;
  onStart: (config: AppConfig, questions: ActiveQuestion[]) => void;
}) {
  const [cfg, setCfg] = useState<AppConfig>(initialConfig);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [activeTab, setActiveTab] = useState<"documents" | "settings">("documents");

  // Voice studio state
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [previewingVoice, setPreviewingVoice] = useState(false);

  const update = <K extends keyof AppConfig>(key: K, val: AppConfig[K]) =>
    setCfg((p) => ({ ...p, [key]: val }));

  // Populate browser voices with default to Indian English Male when available
  useEffect(() => {
    const refreshVoices = () => {
      if (ttsSupported()) {
        const loadedVoices = getAvailableVoices();
        setVoices(loadedVoices);
        if (!cfg.selectedVoiceURI && loadedVoices.length > 0) {
          const recommended = pickRecommendedVoice(getLocaleCode(cfg.lang));
          if (recommended && recommended.voice) {
            update("selectedVoiceURI", recommended.voice.voiceURI);
          }
        }
      }
    };
    refreshVoices();
    if (ttsSupported()) {
      window.speechSynthesis.onvoiceschanged = refreshVoices;
    }
  }, [cfg.lang]);

  // Voice preview function
  const handlePreviewVoice = () => {
    if (!ttsSupported()) return;
    setPreviewingVoice(true);
    const sampleText =
      cfg.lang === "hi"
        ? "नमस्ते! मैं आपका वर्चुअल साक्षात्कारकर्ता टेस्ला हूँ। क्या आप साक्षात्कार के लिए तैयार हैं?"
        : cfg.lang === "te"
          ? "నమస్కారం! నేను మీ ఇంటర్వ్యూవర్ టెస్లా. మీరు ఇంటర్వ్యూకు సిద్ధంగా ఉన్నారా?"
          : "Hello! I am Tesla, your virtual interviewer for today's technical screening session.";

    speak(sampleText, getLocaleCode(cfg.lang), {
      voiceURI: cfg.selectedVoiceURI,
      rate: cfg.speechRate,
      onStart: () => setPreviewingVoice(true),
      onEnd: () => setPreviewingVoice(false),
      onError: () => setPreviewingVoice(false),
    });
  };

  // Document upload handlers
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalysisError("");
    try {
      const parsed = await parseDocumentFile(file);
      update("resumeFileName", parsed.name);
      update("resumeText", parsed.text);
    } catch (err: unknown) {
      setAnalysisError(err instanceof Error ? err.message : "Failed to parse resume document.");
    }
  };

  const handleJdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalysisError("");
    try {
      const parsed = await parseDocumentFile(file);
      update("jdFileName", parsed.name);
      update("jdText", parsed.text);
    } catch (err: unknown) {
      setAnalysisError(
        err instanceof Error ? err.message : "Failed to parse Job Description document.",
      );
    }
  };

  const handleApplyPreset = (preset: SamplePreset) => {
    setAnalysisError("");
    setCfg((prev) => ({
      ...prev,
      role: preset.role,
      resumeFileName: preset.resumeFileName,
      resumeText: preset.resumeText,
      jdFileName: "Job_Description.txt",
      jdText: preset.jdText,
    }));
  };

  // Launch interview with guaranteed Stage 1 Greeting & Self-Introduction
  const handleBeginInterview = async () => {
    setAnalysisError("");

    // Fallback if quick role practice without documents: use structured screening plan
    if (cfg.mode === "quick_role" || (!cfg.resumeText && !cfg.jdText)) {
      const structuredPlan = buildStructuredInterviewPlan({
        name: cfg.name,
        role: cfg.role,
        level: cfg.level,
        type: cfg.type,
        lang: cfg.lang,
        questionCount: cfg.questionCount,
        resumeFileName: cfg.resumeFileName,
        resumeText: cfg.resumeText,
        jdFileName: cfg.jdFileName,
        jdText: cfg.jdText,
      });

      onStart(cfg, structuredPlan);
      return;
    }

    // Call server-side document analysis
    setAnalyzing(true);
    try {
      const res = await fetch("/api/interview/analyze-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: cfg.resumeText || "",
          jdText: cfg.jdText || "",
          interviewType: cfg.type,
          experienceLevel: cfg.level,
          lang: cfg.lang,
          count: cfg.questionCount,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const updatedConfig: AppConfig = {
        ...cfg,
        role: data.detectedRole || cfg.role,
        level: data.detectedLevel || cfg.level,
        analysis: {
          detectedRole: data.detectedRole,
          detectedLevel: data.detectedLevel,
          summary: data.summary,
          requiredSkills: data.requiredSkills || [],
          candidateSkills: data.candidateSkills || [],
          matchedSkills: data.matchedSkills || [],
          gapSkills: data.gapSkills || [],
          keyTopics: [],
        },
      };

      const finalQuestions: ActiveQuestion[] = (data.questions || []).map(
        (q: Partial<ActiveQuestion>) => ({
          id: q.id || `gen_${Math.random()}`,
          stage: q.stage,
          stageNumber: q.stageNumber,
          totalStages: q.totalStages,
          category: q.category || "technical",
          text: q.text,
          hindiText: q.hindiText,
          teluguText: q.teluguText,
          transitionIntro: q.transitionIntro,
          contextWhyAsked: q.contextWhyAsked || "Resume & JD alignment",
          expectedKeywords: q.expectedKeywords || [],
          tip: q.tip || "Structure your answer clearly with concrete examples.",
          isCodingChallenge: q.isCodingChallenge,
          codingLanguage: q.codingLanguage,
          starterCode: q.starterCode,
          sampleInputOutput: q.sampleInputOutput,
        }),
      );

      // Ensure stage 1 is present and guaranteed
      if (finalQuestions.length > 0 && finalQuestions[0].stage !== "stage_1_greeting") {
        const fallbackPlan = buildStructuredInterviewPlan(updatedConfig);
        onStart(updatedConfig, fallbackPlan);
      } else {
        onStart(
          updatedConfig,
          finalQuestions.length ? finalQuestions : buildStructuredInterviewPlan(updatedConfig),
        );
      }
    } catch (err: unknown) {
      console.warn("Direct analysis API failed, using structured screening plan fallback:", err);
      const fallbackPlan = buildStructuredInterviewPlan({
        name: cfg.name,
        role: cfg.role,
        level: cfg.level,
        type: cfg.type,
        lang: cfg.lang,
        questionCount: cfg.questionCount,
        resumeFileName: cfg.resumeFileName,
        resumeText: cfg.resumeText,
        jdFileName: cfg.jdFileName,
        jdText: cfg.jdText,
      });
      onStart(cfg, fallbackPlan);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1.15fr]">
      {/* Left Column: Interviewer Studio Showcase */}
      <section className="relative overflow-hidden rounded-3xl bg-hero p-6 text-navy-foreground shadow-soft sm:p-8 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-navy-foreground/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-navy-foreground/80">
          <BrainCircuit className="h-3.5 w-3.5 text-violet" />
          <span>Automated Technical Screening</span>
        </div>

        <h1 className="mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl text-balance">
          Meet Tesla, your executive mock interviewer.
        </h1>

        <p className="mt-2.5 max-w-md text-xs sm:text-sm text-navy-foreground/80 leading-relaxed">
          Simulate a realistic, multi-stage campus technical screening interview. Covers your
          self-introduction, resume projects, technical competencies, live coding/SQL problem, and
          scenario reasoning.
        </p>

        {/* Featured Interviewer Avatar Frame */}
        <div className="my-6">
          <Avatar size={200} showStatusBadge interviewerName="Tesla" />
        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full grid grid-cols-3 gap-2.5 text-xs text-navy-foreground/90">
          <div className="rounded-2xl bg-navy-foreground/10 p-3 flex flex-col items-center">
            <span className="font-display text-lg font-bold">7 Stages</span>
            <span className="text-[11px] text-navy-foreground/75">Screening Flow</span>
          </div>
          <div className="rounded-2xl bg-navy-foreground/10 p-3 flex flex-col items-center">
            <span className="font-display text-lg font-bold">Coding/SQL</span>
            <span className="text-[11px] text-navy-foreground/75">Hands-on Challenge</span>
          </div>
          <div className="rounded-2xl bg-navy-foreground/10 p-3 flex flex-col items-center">
            <span className="font-display text-lg font-bold">3 Langs</span>
            <span className="text-[11px] text-navy-foreground/75">EN / HI / TE</span>
          </div>
        </div>

        {/* Voice Studio Preview Box */}
        <div className="mt-5 w-full rounded-2xl bg-navy-foreground/10 p-4 text-left border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Volume2 className="h-4 w-4 text-violet" />
              <span>Speech Engine Voice Studio</span>
            </div>
            <button
              type="button"
              onClick={handlePreviewVoice}
              disabled={previewingVoice || !ttsSupported()}
              className="rounded-lg bg-navy-foreground/20 px-2.5 py-1 text-xs font-medium hover:bg-navy-foreground/30 transition flex items-center gap-1.5"
            >
              {previewingVoice ? "Playing…" : "Test Voice"}
            </button>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[11px] text-navy-foreground/70">Selected Voice</span>
              <p className="truncate font-medium">
                {voices.find((v) => v.voiceURI === cfg.selectedVoiceURI)?.name ||
                  "Natural Indian English Male (System)"}
              </p>
            </div>
            <div>
              <span className="text-[11px] text-navy-foreground/70">
                Speech Speed: {cfg.speechRate}x
              </span>
              <input
                type="range"
                min="0.75"
                max="1.25"
                step="0.05"
                value={cfg.speechRate}
                onChange={(e) => update("speechRate", parseFloat(e.target.value))}
                className="w-full h-1 mt-1 accent-violet bg-white/30 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Right Column: Configuration & Document Ingestion */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-xl font-bold font-display">Configure Screening Round</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Strict 7-stage sequence starting with Greeting and Self-Introduction
            </p>
          </div>

          <div className="flex rounded-xl bg-muted p-1">
            <button
              type="button"
              onClick={() => setActiveTab("documents")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                activeTab === "documents"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Documents & Presets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                activeTab === "settings"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Role & Voice
            </button>
          </div>
        </div>

        {/* Tab 1: Documents & Presets */}
        {activeTab === "documents" && (
          <div className="space-y-5">
            {/* Quick Sample Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Load Placement Demo Presets
                </span>
                <span className="text-[11px] text-primary font-medium">1-Click Placement Demo</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-3">
                {SAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="flex flex-col text-left rounded-xl border border-border/80 bg-muted/40 p-2.5 hover:border-primary/60 hover:bg-muted transition text-xs group"
                  >
                    <span className="font-semibold text-foreground group-hover:text-primary transition line-clamp-1">
                      {preset.title.split("(")[0]}
                    </span>
                    <span className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                      {preset.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate Name Input */}
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Candidate Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Manideep or leave blank for general candidate"
                value={cfg.name}
                onChange={(e) => update("name", e.target.value)}
                className={formFieldStyle}
              />
            </div>

            {/* Resume Upload Card */}
            <div className="rounded-2xl border border-dashed border-border p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Candidate Resume</span>
                  <span className="text-[11px] text-muted-foreground">(PDF, DOCX, TXT)</span>
                </div>
                {cfg.resumeText && (
                  <button
                    type="button"
                    onClick={() => {
                      update("resumeFileName", "");
                      update("resumeText", "");
                    }}
                    className="text-muted-foreground hover:text-destructive transition p-1"
                    title="Remove resume"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {cfg.resumeFileName ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs">
                  <span className="font-medium text-primary truncate max-w-[240px]">
                    ✓ {cfg.resumeFileName}
                  </span>
                  <label className="cursor-pointer text-[11px] font-semibold text-primary underline">
                    Replace file
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      className="hidden"
                      onChange={handleResumeUpload}
                    />
                  </label>
                </div>
              ) : (
                <label className="mt-3 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-muted/50 transition">
                  <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs font-semibold text-foreground">
                    Upload Resume for Project Deep-Dive
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Tesla will discuss your actual projects without fabricating details
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    onChange={handleResumeUpload}
                  />
                </label>
              )}
            </div>

            {/* Job Description Card */}
            <div className="rounded-2xl border border-dashed border-border p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Target Job Description</span>
                  <span className="text-[11px] text-muted-foreground">(PDF, DOCX, TXT)</span>
                </div>
                {cfg.jdText && (
                  <button
                    type="button"
                    onClick={() => {
                      update("jdFileName", "");
                      update("jdText", "");
                    }}
                    className="text-muted-foreground hover:text-destructive transition p-1"
                    title="Remove JD"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {cfg.jdFileName ? (
                <div className="mt-3 flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs">
                  <span className="font-medium text-primary truncate max-w-[240px]">
                    ✓ {cfg.jdFileName}
                  </span>
                  <label className="cursor-pointer text-[11px] font-semibold text-primary underline">
                    Replace file
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      className="hidden"
                      onChange={handleJdUpload}
                    />
                  </label>
                </div>
              ) : (
                <label className="mt-3 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-muted/50 transition">
                  <Upload className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-xs font-semibold text-foreground">
                    Upload Target Job Description
                  </span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">
                    Calibrates technical competencies & coding problems to role requirements
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                    onChange={handleJdUpload}
                  />
                </label>
              )}
            </div>

            {/* Sequence Preview Box */}
            <div className="rounded-2xl bg-muted/40 p-4 border border-border/70 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Screening Stage Sequence Guaranteed:</span>
              </div>
              <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-muted-foreground text-[11px] pl-1">
                <li>1. Greeting & Self-Introduction</li>
                <li>2. Education & Resume Projects</li>
                <li>3. JD & Technical Foundations</li>
                <li>4. Hands-on Coding or SQL Challenge</li>
                <li>5. Practical Problem Scenario</li>
                <li>6. HR & Behavioral (STAR)</li>
                <li>7. Professional Closing & Report</li>
              </ol>
            </div>

            {analysisError && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl">
                {analysisError}
              </p>
            )}
          </div>
        )}

        {/* Tab 2: Role & Voice Settings */}
        {activeTab === "settings" && (
          <div className="space-y-4">
            {/* Target Role & Level */}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs font-semibold">
                Target Role
                <select
                  value={cfg.role}
                  onChange={(e) => update("role", e.target.value)}
                  className={cn(formFieldStyle, "mt-1.5")}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-xs font-semibold">
                Experience Level
                <select
                  value={cfg.level}
                  onChange={(e) => update("level", e.target.value as Level)}
                  className={cn(formFieldStyle, "mt-1.5")}
                >
                  <option value="fresher">Fresher / Graduate Placement</option>
                  <option value="junior">Junior (1–3 yrs)</option>
                  <option value="mid">Mid-level (3–6 yrs)</option>
                  <option value="senior">Senior (6+ yrs)</option>
                </select>
              </label>
            </div>

            {/* Interview Type */}
            <label className="text-xs font-semibold block">
              Interview Evaluation Focus
              <select
                value={cfg.type}
                onChange={(e) => update("type", e.target.value as AppConfig["type"])}
                className={cn(formFieldStyle, "mt-1.5")}
              >
                <option value="mixed">Comprehensive Screening (Technical + Coding + HR)</option>
                <option value="technical">Technical Only (Omits HR Stage)</option>
              </select>
            </label>

            {/* Language Selector */}
            <div>
              <span className="text-xs font-semibold block mb-1.5">Interview Language</span>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => update("lang", l)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-xs font-semibold transition",
                      cfg.lang === l
                        ? "border-violet bg-violet/10 text-violet"
                        : "border-border hover:bg-muted text-muted-foreground",
                    )}
                  >
                    {LANG_NAMES[l].split(" (")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Dropdown */}
            {ttsSupported() && voices.length > 0 && (
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Browser Text-to-Speech Voice (Natural Male Preferred)
                </label>
                <select
                  value={cfg.selectedVoiceURI}
                  onChange={(e) => update("selectedVoiceURI", e.target.value)}
                  className={cn(formFieldStyle, "text-xs")}
                >
                  {voices.map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Default prioritizes Indian English (en-IN) natural male voices when available.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Start Button */}
        <button
          type="button"
          onClick={handleBeginInterview}
          disabled={analyzing}
          className="w-full rounded-2xl bg-primary py-3.5 px-6 font-display text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>Analyzing Documents & Calibrating Screening Stages…</span>
            </>
          ) : (
            <>
              <span>Start Technical Screening with Tesla</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   2. LIVE INTERVIEW VIEW (Video-call Studio, Coding Challenge, Mic/Text)
   ========================================================================= */

function LiveInterviewView({
  session,
  onAnswer,
  onEndInterview,
}: {
  session: InterviewSession;
  onAnswer: (response: InterviewResponse, forceEnd?: boolean) => void;
  onEndInterview: () => void;
}) {
  const { config, questions, index } = session;
  const currentQ = questions[index];

  // Visual & Interviewer States
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [activeInputMode, setActiveInputMode] = useState<"voice" | "text">("voice");

  // Candidate Answer State
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [codeAnswer, setCodeAnswer] = useState(currentQ?.starterCode || "");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const [evaluating, setEvaluating] = useState(false);

  const recognizerRef = useRef<ReturnType<typeof createRecognizer> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const stt = useMemo(() => sttSupported(), []);

  // Determine localized question text
  const localizedQuestionText = useMemo(() => {
    if (!currentQ) return "";
    if (config.lang === "hi" && currentQ.hindiText) return currentQ.hindiText;
    if (config.lang === "te" && currentQ.teluguText) return currentQ.teluguText;
    return currentQ.text;
  }, [currentQ, config.lang]);

  // Determine transition intro text
  const localizedTransitionIntro = useMemo(() => {
    if (!currentQ) return "";
    if (config.lang === "hi" && currentQ.hindiTransitionIntro) return currentQ.hindiTransitionIntro;
    if (config.lang === "te" && currentQ.teluguTransitionIntro)
      return currentQ.teluguTransitionIntro;
    return currentQ.transitionIntro || "";
  }, [currentQ, config.lang]);

  // Speak question aloud with natural greeting / transition
  const speakCurrentQuestion = () => {
    if (!currentQ || !ttsSupported()) return;

    // Full spoken utterance combines transition + question without duplicating
    const fullSpoken = localizedTransitionIntro
      ? `${localizedTransitionIntro} ${localizedQuestionText}`
      : localizedQuestionText;

    speak(fullSpoken, getLocaleCode(config.lang), {
      voiceURI: config.selectedVoiceURI,
      rate: config.speechRate,
      onStart: () => setAvatarState("speaking"),
      onEnd: () => setAvatarState("idle"),
      onError: () => setAvatarState("idle"),
    });
  };

  // Trigger speech when question changes & update starter code
  useEffect(() => {
    setCandidateAnswer("");
    setCodeAnswer(currentQ?.starterCode || "");
    setInterimTranscript("");
    setMicError("");
    startTimeRef.current = Date.now();
    speakCurrentQuestion();

    return () => {
      stopSpeaking();
      recognizerRef.current?.abort();
    };
  }, [index]);

  if (!currentQ) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-muted-foreground text-sm">All screening stages completed.</p>
        <button
          onClick={onEndInterview}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          View Comprehensive Report →
        </button>
      </div>
    );
  }

  // Toggle Microphone
  const handleToggleMic = () => {
    setMicError("");

    if (listening) {
      recognizerRef.current?.stop();
      setListening(false);
      setAvatarState("idle");
      return;
    }

    // Stop interviewer speech before listening
    stopSpeaking();
    setAvatarState("listening");

    try {
      const rec = createRecognizer(getLocaleCode(config.lang), {
        onFinalChunk: (finalText) => {
          setCandidateAnswer((prev) =>
            prev ? `${prev.trim()} ${finalText.trim()}` : finalText.trim(),
          );
          setInterimTranscript("");
        },
        onInterimChunk: (interimText) => {
          setInterimTranscript(interimText);
        },
        onEnd: () => {
          setListening(false);
          setAvatarState("idle");
          setInterimTranscript("");
        },
        onError: (msg) => {
          setMicError(msg);
          setListening(false);
          setAvatarState("idle");
        },
      });

      recognizerRef.current = rec;
      rec.start();
      setListening(true);
    } catch {
      setMicError("Microphone could not be started in this browser. Please type your response.");
      setAvatarState("idle");
    }
  };

  // Submit Answer & Evaluate
  const handleSubmitAnswer = async (skip = false, forceEnd = false) => {
    recognizerRef.current?.abort();
    stopSpeaking();
    setListening(false);
    setAvatarState("thinking");
    setEvaluating(true);

    const verbalAnswer = skip ? "" : candidateAnswer.trim();
    const combinedAnswer =
      currentQ.isCodingChallenge && codeAnswer.trim()
        ? `CODE IMPLEMENTATION:\n\`\`\`${currentQ.codingLanguage || "text"}\n${codeAnswer.trim()}\n\`\`\`\n\nVERBAL EXPLANATION:\n${verbalAnswer || "Candidate submitted code without separate verbal notes."}`
        : verbalAnswer;

    const timeSpent = Math.max(5, Math.round((Date.now() - startTimeRef.current) / 1000));

    try {
      const response = await fetch("/api/interview/evaluate-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQ.text,
          answer: combinedAnswer,
          contextWhyAsked: currentQ.contextWhyAsked,
          expectedKeywords: currentQ.expectedKeywords,
          lang: config.lang,
        }),
      });

      if (!response.ok) {
        throw new Error("Evaluation endpoint failed");
      }

      const evalData = await response.json();
      const detailedEval: DetailedEvaluation = {
        score: evalData.score ?? 5,
        metrics: evalData.metrics ?? {
          technicalKnowledge: 5,
          communication: 5,
          problemSolving: 5,
          jdRelevance: 5,
        },
        strengths: evalData.strengths ?? ["Addressed question."],
        areasToImprove: evalData.areasToImprove ?? ["Expand on concepts."],
        coachingFeedback: evalData.coachingFeedback ?? "Solid effort.",
        sampleModelAnswer: evalData.sampleModelAnswer ?? "Structured example.",
      };

      onAnswer(
        {
          qid: currentQ.id,
          stageNumber: currentQ.stageNumber,
          category: currentQ.category,
          questionText: localizedQuestionText,
          answer: combinedAnswer,
          codeSnippet: currentQ.isCodingChallenge ? codeAnswer : undefined,
          evaluation: detailedEval,
          timeSpentSec: timeSpent,
        },
        forceEnd,
      );
    } catch {
      // Local evaluation fallback
      const localEval = evaluate(
        {
          id: currentQ.id,
          role: "general",
          level: "fresher",
          type: "technical",
          category: "technical",
          question: currentQ.text,
          keywords: currentQ.expectedKeywords,
          tip: currentQ.tip,
          minWords: 20,
        },
        combinedAnswer,
      );

      onAnswer(
        {
          qid: currentQ.id,
          stageNumber: currentQ.stageNumber,
          category: currentQ.category,
          questionText: localizedQuestionText,
          answer: combinedAnswer,
          codeSnippet: currentQ.isCodingChallenge ? codeAnswer : undefined,
          evaluation: {
            score: localEval.score,
            metrics: {
              technicalKnowledge: localEval.score,
              communication: Math.min(10, Math.round(combinedAnswer.split(/\s+/).length / 4)),
              problemSolving: 6,
              jdRelevance: localEval.score,
            },
            strengths: ["Attempted response under practice conditions."],
            areasToImprove: ["Incorporate more concrete examples and STAR framework."],
            coachingFeedback: localEval.feedback,
            sampleModelAnswer: currentQ.tip,
          },
          timeSpentSec: timeSpent,
        },
        forceEnd,
      );
    } finally {
      setEvaluating(false);
      setAvatarState("idle");
    }
  };

  const currentStageConfig = currentQ.stage ? STAGE_CONFIGS[currentQ.stage] : null;
  const stageDisplayName = currentStageConfig
    ? config.lang === "hi"
      ? currentStageConfig.hindiName
      : config.lang === "te"
        ? currentStageConfig.teluguName
        : currentStageConfig.name
    : `Stage ${currentQ.stageNumber ?? index + 1}`;

  const progressPercent = Math.round(((index + 1) / questions.length) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr] items-start">
      {/* Left Column: Video-Call Telepresence Card */}
      <aside className="rounded-3xl bg-hero p-6 text-navy-foreground shadow-soft flex flex-col items-center border border-white/10">
        <div className="w-full flex items-center justify-between text-xs text-navy-foreground/75 mb-3">
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            {stageDisplayName}
          </span>
          <span className="font-mono tabular-nums">
            {index + 1} of {questions.length}
          </span>
        </div>

        {/* Male Interviewer Avatar Frame */}
        <Avatar size={200} state={avatarState} showStatusBadge interviewerName="Tesla" />

        {/* Stage Progress Checklist */}
        <div className="mt-5 w-full text-xs text-navy-foreground/80 space-y-2">
          <div className="flex justify-between items-center text-[11px]">
            <span>Screening Progress</span>
            <span className="font-mono font-bold">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-navy-foreground/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Mini stage dots */}
          <div className="flex items-center justify-between pt-1">
            {questions.map((q, i) => (
              <div
                key={q.id}
                title={`Stage ${i + 1}: ${q.category}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-4 bg-emerald-400"
                    : i < index
                      ? "w-2 bg-emerald-400/70"
                      : "w-2 bg-navy-foreground/20",
                )}
              />
            ))}
          </div>
        </div>

        {/* Session Metadata Badges */}
        <div className="mt-5 w-full pt-4 border-t border-white/10 flex flex-col gap-1.5 text-xs text-navy-foreground/75">
          <div className="flex justify-between">
            <span className="text-navy-foreground/60">Target Role:</span>
            <span className="font-medium truncate max-w-[170px]">{config.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-foreground/60">Stage:</span>
            <span className="font-medium truncate max-w-[170px]">
              {currentQ.category.replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-foreground/60">Language:</span>
            <span className="font-medium">{LANG_NAMES[config.lang]}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy-foreground/60">Privacy:</span>
            <span className="font-medium text-emerald-400">Local Client Audio</span>
          </div>
        </div>
      </aside>

      {/* Right Column: Interactive Stage & Candidate Deck */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-6">
        {/* Question Header & Context */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
              {stageDisplayName}
            </span>
            <button
              type="button"
              onClick={speakCurrentQuestion}
              disabled={avatarState === "speaking" || !ttsSupported()}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Repeat Tesla's Question</span>
            </button>
          </div>

          <h2
            key={currentQ.id}
            className="text-xl sm:text-2xl font-bold leading-snug font-display text-foreground"
          >
            {localizedQuestionText}
          </h2>

          {currentQ.contextWhyAsked && (
            <p className="mt-2 text-xs text-muted-foreground italic flex items-center gap-1.5">
              <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Screening Objective: {currentQ.contextWhyAsked}</span>
            </p>
          )}
        </div>

        {/* Coding & SQL Challenge Deck (When Stage 4 or isCodingChallenge is active) */}
        {currentQ.isCodingChallenge && (
          <div className="rounded-2xl border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Live Coding / SQL Workspace ({currentQ.codingLanguage?.toUpperCase() || "CODE"})
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Type code solution below
              </span>
            </div>

            {currentQ.sampleInputOutput && (
              <div className="rounded-xl bg-card p-2.5 border border-border/60 text-[11px] font-mono text-muted-foreground whitespace-pre-wrap">
                {currentQ.sampleInputOutput}
              </div>
            )}

            <textarea
              rows={8}
              value={codeAnswer}
              onChange={(e) => setCodeAnswer(e.target.value)}
              placeholder="Write your code or SQL query solution here..."
              className={cn(
                formFieldStyle,
                "font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 border-slate-800 resize-y",
              )}
              spellCheck={false}
            />
          </div>
        )}

        {/* Input Controls (Voice vs Text Toggle) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-foreground">
              {currentQ.isCodingChallenge
                ? "Candidate Verbal Explanation & Approach"
                : "Candidate Response (Microphone or Type)"}
            </label>
            <div className="flex rounded-lg bg-muted p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveInputMode("voice")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition",
                  activeInputMode === "voice"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Microphone
              </button>
              <button
                type="button"
                onClick={() => setActiveInputMode("text")}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition",
                  activeInputMode === "text"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Type Answer
              </button>
            </div>
          </div>

          {/* Transcript / Text Area */}
          <textarea
            rows={4}
            value={candidateAnswer + (interimTranscript ? ` ${interimTranscript}` : "")}
            onChange={(e) => setCandidateAnswer(e.target.value)}
            placeholder={
              activeInputMode === "voice"
                ? currentQ.isCodingChallenge
                  ? "Click 'Start Speaking' to verbally explain your time complexity and algorithm, or type notes here…"
                  : "Click 'Start Speaking' below to answer with your microphone, or type your response directly…"
                : "Type your structured answer here (using clear points or the STAR method)…"
            }
            className={cn(
              formFieldStyle,
              "resize-y leading-relaxed font-sans",
              listening && "ring-2 ring-emerald-500 border-emerald-500/50",
            )}
          />

          {/* Word Count and Status */}
          <div className="mt-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0} words
            </span>
            {listening && (
              <span className="text-emerald-500 font-semibold animate-pulse flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Listening attentively…
              </span>
            )}
          </div>

          {micError && (
            <p className="mt-2 rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive">
              {micError}
            </p>
          )}
        </div>

        {/* Call Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            {stt && (
              <button
                type="button"
                onClick={handleToggleMic}
                disabled={evaluating}
                className={cn(
                  "rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs transition flex items-center gap-2",
                  listening
                    ? "bg-destructive text-destructive-foreground hover:opacity-90"
                    : "bg-emerald-600 text-white hover:bg-emerald-700",
                )}
              >
                <Mic className={cn("h-4 w-4", listening && "animate-pulse")} />
                <span>{listening ? "Stop Recording" : "Start Speaking"}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleSubmitAnswer(true)}
              disabled={evaluating}
              className="rounded-xl border border-border px-3.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted transition"
            >
              Skip Stage
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSubmitAnswer(false)}
              disabled={
                evaluating ||
                (!candidateAnswer.trim() &&
                  !interimTranscript &&
                  (!currentQ.isCodingChallenge || !codeAnswer.trim()))
              }
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft hover:opacity-90 transition disabled:opacity-40 flex items-center gap-1.5"
            >
              {evaluating ? (
                <>
                  <Sparkles className="h-3.5 w-3.5 animate-spin" />
                  <span>Evaluating Answer…</span>
                </>
              ) : (
                <>
                  <span>
                    {index + 1 === questions.length
                      ? "Complete Screening & View Report"
                      : "Submit Answer →"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* End Interview Early Escape Hatch */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              if (candidateAnswer.trim() || (currentQ.isCodingChallenge && codeAnswer.trim())) {
                handleSubmitAnswer(false, true);
              } else {
                onEndInterview();
              }
            }}
            className="text-xs text-muted-foreground hover:text-destructive underline-offset-4 hover:underline transition"
          >
            Conclude interview early and generate report
          </button>
        </div>
      </section>
    </div>
  );
}

/* =========================================================================
   3. REPORT VIEW (Quad-metric rubric, Skill Gaps, Question Feedback, PDF Export)
   ========================================================================= */

function ReportView({
  session,
  onRestart,
  onRetry,
}: {
  session: InterviewSession;
  onRestart: () => void;
  onRetry: () => void;
}) {
  const { responses, config, questions } = session;
  const answeredCount = responses.filter((r) => r.answer.trim().length > 0).length;

  // Calculate composite scores
  const totalScore = responses.reduce((acc, r) => acc + r.evaluation.score, 0);
  const overallScore = responses.length ? Math.round((totalScore / responses.length) * 10) / 10 : 0;

  // Metric averages
  const avgTechnical =
    Math.round(
      (responses.reduce((acc, r) => acc + r.evaluation.metrics.technicalKnowledge, 0) /
        Math.max(1, responses.length)) *
        10,
    ) / 10;
  const avgCommunication =
    Math.round(
      (responses.reduce((acc, r) => acc + r.evaluation.metrics.communication, 0) /
        Math.max(1, responses.length)) *
        10,
    ) / 10;
  const avgProblemSolving =
    Math.round(
      (responses.reduce((acc, r) => acc + r.evaluation.metrics.problemSolving, 0) /
        Math.max(1, responses.length)) *
        10,
    ) / 10;
  const avgJdRelevance =
    Math.round(
      (responses.reduce((acc, r) => acc + r.evaluation.metrics.jdRelevance, 0) /
        Math.max(1, responses.length)) *
        10,
    ) / 10;

  const verdict =
    overallScore >= 8.0
      ? "Outstanding Screening Readiness"
      : overallScore >= 6.5
        ? "Placement Ready with Refinements"
        : overallScore >= 5.0
          ? "Developing Technical Foundations"
          : "Needs Focused Preparation";

  // Text export function
  const handleDownloadReport = () => {
    const lines = [
      "===========================================================",
      " INTERVIEWMATE AI — AUTOMATED TECHNICAL SCREENING REPORT",
      "===========================================================",
      `Candidate Name: ${config.name || "Anonymous Candidate"}`,
      `Target Role: ${config.role} (${config.level.toUpperCase()})`,
      `Screening Focus: ${config.type.toUpperCase()}`,
      `Interview Language: ${LANG_NAMES[config.lang]}`,
      `Date & Time: ${new Date(session.startedAt || Date.now()).toLocaleString()}`,
      `Stages Completed: ${answeredCount} / ${questions.length}`,
      "-----------------------------------------------------------",
      `OVERALL SCORE: ${overallScore} / 10 (${verdict})`,
      `- Technical Knowledge: ${avgTechnical} / 10`,
      `- Communication Clarity: ${avgCommunication} / 10`,
      `- Problem Solving: ${avgProblemSolving} / 10`,
      `- JD Relevance & Alignment: ${avgJdRelevance} / 10`,
      "===========================================================",
      "",
      "STAGE-BY-STAGE EVALUATION & FEEDBACK:",
      ...responses
        .map((r, i) => [
          `\n[STAGE ${r.stageNumber ?? i + 1} - ${r.category.toUpperCase()}]`,
          `Question: ${r.questionText}`,
          `Candidate Answer: ${r.answer || "(Skipped)"}`,
          `Score: ${r.evaluation.score} / 10`,
          `Feedback: ${r.evaluation.coachingFeedback}`,
          `Recommended Answer Model: ${r.evaluation.sampleModelAnswer}`,
          "-----------------------------------------------------------",
        ])
        .flat(),
      "",
      "DISCLAIMER: This report is an educational mock interview simulation inspired by campus automated screening patterns. It is an independent practice tool and does not represent an official corporate hiring decision or endorse proprietary vendor metrics.",
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `InterviewMate-Screening-Report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <section className="print-card rounded-3xl bg-hero p-6 text-navy-foreground shadow-soft sm:p-8 grid gap-6 sm:grid-cols-[auto_1fr] items-center border border-white/10">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-navy-foreground/10 p-5 h-36 w-36 border border-white/10 mx-auto">
          <span className="font-display text-4xl font-extrabold">{overallScore}</span>
          <span className="text-xs text-navy-foreground/70 mt-1">out of 10</span>
        </div>

        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-navy-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-foreground/80">
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span>Automated Technical Screening Report</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-display">
            {verdict}
            {config.name ? `, ${config.name}` : ""}
          </h1>

          <p className="text-xs sm:text-sm text-navy-foreground/80 leading-relaxed">
            {config.role} · {config.level.toUpperCase()} · {LANG_NAMES[config.lang]} ·{" "}
            {answeredCount}/{questions.length} Stages Completed
          </p>

          {/* Action buttons */}
          <div className="no-print pt-3 flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl bg-navy-foreground px-4 py-2 text-xs font-semibold text-navy hover:opacity-90 transition flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadReport}
              className="rounded-xl border border-navy-foreground/30 px-4 py-2 text-xs font-semibold hover:bg-navy-foreground/10 transition flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Report (.txt)</span>
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-xl border border-navy-foreground/30 px-4 py-2 text-xs font-semibold hover:bg-navy-foreground/10 transition"
            >
              Practice Again
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-xl px-3 py-2 text-xs font-medium text-navy-foreground/70 hover:underline"
            >
              Clear & Restart
            </button>
          </div>
        </div>
      </section>

      {/* Metric Breakdown Cards (Quad-metric Rubric) */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          {
            label: "Technical Knowledge",
            val: avgTechnical,
            desc: "Accuracy & depth of technical concepts & code",
          },
          {
            label: "Communication",
            val: avgCommunication,
            desc: "Clarity, conciseness, and articulation",
          },
          {
            label: "Problem Solving",
            val: avgProblemSolving,
            desc: "Algorithmic logic & diagnostic reasoning",
          },
          { label: "JD Relevance", val: avgJdRelevance, desc: "Alignment with job requirements" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-1"
          >
            <span className="text-xs font-semibold text-muted-foreground block truncate">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold">{metric.val}</span>
              <span className="text-xs text-muted-foreground">/ 10</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">{metric.desc}</p>
          </div>
        ))}
      </div>

      {/* Resume-to-JD Skill Matrix (If documents were analyzed) */}
      {config.analysis && (
        <section className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Resume-to-JD Skill Alignment Matrix
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 text-xs">
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3">
              <span className="font-semibold text-emerald-500 block mb-1">
                Matched Strengths ({config.analysis.matchedSkills.length})
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {config.analysis.matchedSkills.join(", ") || "Foundational concepts aligned"}
              </p>
            </div>
            <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3">
              <span className="font-semibold text-amber-500 block mb-1">
                Candidate Skills ({config.analysis.candidateSkills.length})
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {config.analysis.candidateSkills.join(", ") || "Software development basics"}
              </p>
            </div>
            <div className="rounded-xl bg-violet/10 border border-violet/20 p-3">
              <span className="font-semibold text-violet block mb-1">
                JD Growth Areas ({config.analysis.gapSkills.length})
              </span>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                {config.analysis.gapSkills.join(", ") || "Advanced system scalability"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Stage-by-Stage Breakdown */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
        <h2 className="text-base font-bold font-display">
          Stage-by-Stage Performance & Coaching Breakdown
        </h2>

        <div className="space-y-4">
          {responses.map((resp, i) => (
            <div
              key={resp.qid || i}
              className="rounded-2xl border border-border bg-muted/20 p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                    Stage {resp.stageNumber ?? i + 1} · {resp.category.replace("_", " ")}
                  </span>
                  <span className="text-xs text-muted-foreground">Time: {resp.timeSpentSec}s</span>
                </div>
                <div className="flex items-center gap-1.5 font-display text-sm font-bold">
                  <span>Score:</span>
                  <span
                    className={cn(
                      resp.evaluation.score >= 7.5
                        ? "text-emerald-500"
                        : resp.evaluation.score >= 5.5
                          ? "text-amber-500"
                          : "text-rose-500",
                    )}
                  >
                    {resp.evaluation.score} / 10
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground">{resp.questionText}</p>
                <div className="mt-2 rounded-xl bg-card p-3 border border-border text-xs text-muted-foreground space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-foreground block">
                    Candidate Response:
                  </span>
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {resp.answer || "(No response recorded)"}
                  </p>
                </div>
              </div>

              {/* Coaching Feedback */}
              <div className="grid gap-2 sm:grid-cols-2 text-xs pt-1">
                <div className="rounded-xl bg-card p-3 border border-border/80">
                  <span className="font-semibold text-emerald-500 block mb-1">
                    ✓ Identified Strengths
                  </span>
                  <ul className="list-disc list-inside text-muted-foreground text-[11px] space-y-0.5">
                    {resp.evaluation.strengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-card p-3 border border-border/80">
                  <span className="font-semibold text-amber-500 block mb-1">
                    ↗ Coaching Recommendation
                  </span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {resp.evaluation.coachingFeedback}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
