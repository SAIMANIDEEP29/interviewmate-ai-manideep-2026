import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "@/components/interview/Avatar";
import {
  BANK, LANG_CODES, LANG_NAMES, ROLES, pickQuestions, questionText,
  type InterviewType, type Lang, type Level, type Question,
} from "@/lib/questions";
import { evaluate, type Evaluation } from "@/lib/evaluate";
import { createRecognizer, hasVoiceFor, speak, stopSpeaking, sttSupported, ttsSupported } from "@/lib/speech";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InterviewMate AI — Practice Mock Interviews by Voice" },
      { name: "description", content: "Practice HR, technical and aptitude interviews in English, Hindi or Telugu with a speaking AI-style interviewer and instant feedback." },
      { property: "og:title", content: "InterviewMate AI — Voice Mock Interviews" },
      { property: "og:description", content: "Voice-driven practice interviews with local scoring, feedback and a printable report." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: App,
});

interface Config { name: string; role: string; level: Level; type: InterviewType; lang: Lang; count: number }
interface Response { qid: string; answer: string; evaluation: Evaluation }
interface Session { phase: "setup" | "interview" | "report"; config: Config; qids: string[]; index: number; responses: Response[]; startedAt: number }

const KEY = "interviewmate.session.v1";
const DEFAULT: Config = { name: "", role: "python", level: "fresher", type: "hr", lang: "en", count: 5 };
const fresh = (): Session => ({ phase: "setup", config: DEFAULT, qids: [], index: 0, responses: [], startedAt: 0 });

function App() {
  const [s, setS] = useState<Session>(fresh);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS(JSON.parse(raw)); } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(KEY, JSON.stringify(s)); }, [s, loaded]);

  const reset = () => { stopSpeaking(); localStorage.removeItem(KEY); setS(fresh()); };

  return (
    <div className="min-h-screen">
      <header className="no-print border-b bg-card/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-hero font-display text-sm font-bold text-primary-foreground">IM</div>
            <span className="font-display font-semibold">InterviewMate <span className="text-violet">AI</span></span>
          </div>
          {s.phase !== "setup" && (
            <button onClick={reset} className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-muted">Reset session</button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        {!loaded ? (
          <div className="grid h-64 place-items-center text-muted-foreground" role="status">Loading…</div>
        ) : s.phase === "setup" ? (
          <Setup initial={s.config} onStart={(config) => {
            const qs = pickQuestions(config.type, config.role, config.count, Date.now() % 100000);
            setS({ phase: "interview", config, qids: qs.map((q) => q.id), index: 0, responses: [], startedAt: Date.now() });
          }} />
        ) : s.phase === "interview" ? (
          <Interview session={s} onAnswer={(r, end) => setS((p) => {
            const responses = [...p.responses, r];
            const done = end || p.index + 1 >= p.qids.length;
            return { ...p, responses, index: p.index + 1, phase: done ? "report" : "interview" };
          })} onEnd={() => setS((p) => ({ ...p, phase: "report" }))} />
        ) : (
          <Report session={s} onRestart={reset} onRetry={() => setS({ ...fresh(), config: s.config })} />
        )}
        <Disclosure />
      </main>
    </div>
  );
}

function Disclosure() {
  return (
    <p className="no-print mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground">
      Practice demo for learning purposes only. Questions are scored locally in your browser using answer length and relevant
      keywords — no remote AI model is called and nothing is uploaded. Voice features depend on your browser and installed
      voices (Chrome/Edge work best); Hindi/Telugu voices may be unavailable on some devices. Your session is saved only on this device.
    </p>
  );
}

/* ---------------- Setup ---------------- */
const field = "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

function Setup({ initial, onStart }: { initial: Config; onStart: (c: Config) => void }) {
  const [c, setC] = useState<Config>(initial);
  const [voiceInfo, setVoiceInfo] = useState<string>("");
  const set = <K extends keyof Config>(k: K, v: Config[K]) => setC((p) => ({ ...p, [k]: v }));

  const poolSize = useMemo(() => pickQuestions(c.type, c.role, 99, 1).length, [c.type, c.role]);
  useEffect(() => { if (c.count > poolSize) set("count", poolSize); }, [poolSize]); // eslint-disable-line

  useEffect(() => {
    const check = () => {
      if (!ttsSupported()) return setVoiceInfo("Your browser can't speak questions aloud — they'll be shown as text.");
      setVoiceInfo(hasVoiceFor(LANG_CODES[c.lang]) ? "" : `No ${LANG_NAMES[c.lang]} voice found on this device; a default voice will be used.`);
    };
    check();
    if (ttsSupported()) window.speechSynthesis.onvoiceschanged = check;
  }, [c.lang]);

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
      <section className="relative overflow-hidden rounded-3xl bg-hero p-8 text-navy-foreground shadow-soft sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-foreground/70">Voice mock interview</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Meet Maya, your<br />practice interviewer.</h1>
        <p className="mt-3 max-w-md text-sm text-navy-foreground/80">
          She asks questions out loud, listens to your answers, and gives you a scored report — in English, Hindi or Telugu.
        </p>
        <div className="mt-8 flex justify-center"><Avatar size={170} /></div>
        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
          {[[String(BANK.length), "questions"], ["3", "languages"], ["0", "API keys"]].map(([n, l]) => (
            <div key={l} className="rounded-xl bg-navy-foreground/10 py-3"><div className="font-display text-xl font-semibold">{n}</div>{l}</div>
          ))}
        </div>
      </section>

      <form className="rounded-3xl border bg-card p-6 shadow-soft sm:p-8" onSubmit={(e) => { e.preventDefault(); onStart(c); }}>
        <h2 className="text-xl font-semibold">Set up your interview</h2>
        <p className="mt-1 text-sm text-muted-foreground">Takes about {c.count * 2} minutes.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-medium">Name <span className="text-muted-foreground font-normal">(optional)</span>
            <input className={cn(field, "mt-1.5")} value={c.name} maxLength={40} placeholder="e.g. Priya" onChange={(e) => set("name", e.target.value)} />
          </label>
          <label className="text-sm font-medium">Job role
            <select className={cn(field, "mt-1.5")} value={c.role} onChange={(e) => set("role", e.target.value)}>
              {ROLES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium">Experience
            <select className={cn(field, "mt-1.5")} value={c.level} onChange={(e) => set("level", e.target.value as Level)}>
              <option value="fresher">Fresher</option><option value="junior">1–3 years</option>
              <option value="mid">3–6 years</option><option value="senior">6+ years</option>
            </select>
          </label>
        </div>
        <fieldset className="mt-5">
          <legend className="text-sm font-medium">Interview type</legend>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {(["hr", "technical", "aptitude"] as const).map((t) => (
              <button type="button" key={t} onClick={() => set("type", t)} aria-pressed={c.type === t}
                className={cn("rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition", c.type === t ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted")}>
                {t === "hr" ? "HR" : t}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="mt-5">
          <legend className="text-sm font-medium">Language</legend>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {(Object.keys(LANG_NAMES) as Lang[]).map((l) => (
              <button type="button" key={l} onClick={() => set("lang", l)} aria-pressed={c.lang === l}
                className={cn("rounded-lg border px-2 py-2.5 text-xs font-medium sm:text-sm transition", c.lang === l ? "border-violet bg-accent text-accent-foreground" : "hover:bg-muted")}>
                {LANG_NAMES[l].split(" (")[0]}
              </button>
            ))}
          </div>
          {c.lang !== "en" && c.type === "technical" && (
            <p className="mt-2 text-xs text-muted-foreground">Some technical questions are only available in English and will be shown in English.</p>
          )}
          {voiceInfo && <p className="mt-2 text-xs text-warning">{voiceInfo}</p>}
        </fieldset>
        <label className="mt-5 block text-sm font-medium">Questions: <span className="text-primary">{c.count}</span>
          <input type="range" min={3} max={poolSize} value={c.count} onChange={(e) => set("count", +e.target.value)} className="mt-2 w-full accent-[var(--primary)]" />
        </label>
        <button type="submit" className="mt-6 w-full rounded-xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 active:scale-[0.99]">
          Start interview →
        </button>
      </form>
    </div>
  );
}

/* ---------------- Interview ---------------- */
function Interview({ session, onAnswer, onEnd }: {
  session: Session; onAnswer: (r: Response, end?: boolean) => void; onEnd: () => void;
}) {
  const { config, qids, index } = session;
  const q = BANK.find((b) => b.id === qids[index]) as Question | undefined;
  const [speaking, setSpeaking] = useState(false);
  const [listening, setListening] = useState(false);
  const [answer, setAnswer] = useState("");
  const [interim, setInterim] = useState("");
  const [error, setError] = useState("");
  const recRef = useRef<ReturnType<typeof createRecognizer> | null>(null);
  const stt = useMemo(() => sttSupported(), []);
  const shown = q ? questionText(q, config.lang) : null;

  const say = () => {
    if (!shown) return;
    const intro = index === 0 && config.name ? `${greet(config.lang, config.name)} ` : "";
    speak(intro + shown.text, LANG_CODES[shown.lang], { start: () => setSpeaking(true), end: () => setSpeaking(false) });
  };

  useEffect(() => {
    setAnswer(""); setInterim(""); setError("");
    say();
    return () => { stopSpeaking(); recRef.current?.abort(); };
  }, [index]); // eslint-disable-line

  if (!q || !shown) return <div className="text-center text-muted-foreground">No questions available. <button className="underline" onClick={onEnd}>View report</button></div>;

  const toggleMic = () => {
    setError("");
    if (listening) { recRef.current?.stop(); return; }
    stopSpeaking(); setSpeaking(false);
    try {
      const rec = createRecognizer(LANG_CODES[config.lang], {
        onText: (fin, int) => { if (fin) setAnswer((a) => (a + " " + fin).trim()); setInterim(int); },
        onEnd: () => { setListening(false); setInterim(""); },
        onError: (m) => setError(m),
      });
      recRef.current = rec; rec.start(); setListening(true);
    } catch { setError("Could not start the microphone. Please type your answer."); }
  };

  const submit = (skip = false, end = false) => {
    recRef.current?.abort(); stopSpeaking();
    const text = skip ? "" : answer;
    onAnswer({ qid: q.id, answer: text, evaluation: evaluate(q, text) }, end);
  };

  const pct = ((index) / qids.length) * 100;

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <aside className="flex flex-col items-center rounded-3xl bg-hero p-6 text-navy-foreground shadow-soft">
        <Avatar speaking={speaking} listening={listening} size={150} />
        <p className="mt-3 font-display font-semibold">Maya</p>
        <p className="text-xs text-navy-foreground/75" role="status" aria-live="polite">
          {speaking ? "Speaking…" : listening ? "Listening to you…" : "Waiting for your answer"}
        </p>
        <div className="mt-5 w-full text-xs text-navy-foreground/80">
          <div className="flex justify-between"><span>Question {index + 1} of {qids.length}</span><span>{Math.round(pct)}%</span></div>
          <div className="mt-1.5 h-1.5 rounded-full bg-navy-foreground/15"><div className="h-full rounded-full bg-success transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
      </aside>

      <section className="rounded-3xl border bg-card p-5 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-secondary px-2.5 py-1 font-medium uppercase tracking-wide text-secondary-foreground">{q.category === "aiml" ? "AI/ML" : q.category}</span>
          {shown.lang !== config.lang && <span className="rounded-full bg-accent px-2.5 py-1 text-accent-foreground">Shown in English</span>}
        </div>
        <h2 key={q.id} className="mt-4 text-xl font-semibold leading-snug animate-in fade-in slide-in-from-bottom-2 sm:text-2xl" lang={shown.lang}>{shown.text}</h2>

        <div className="mt-6">
          <label htmlFor="ans" className="text-sm font-medium">Your answer</label>
          <textarea id="ans" rows={6} value={answer + (interim ? " " + interim : "")} onChange={(e) => setAnswer(e.target.value)} readOnly={listening}
            placeholder={stt ? "Tap the mic and speak, or type here…" : "Type your answer here…"} lang={config.lang}
            className={cn(field, "mt-1.5 resize-y leading-relaxed", listening && "ring-2 ring-success")} />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>{answer.trim() ? answer.trim().split(/\s+/).length : 0} words</span>
            {!stt && <span className="text-warning">Voice input isn't supported in this browser — please type.</span>}
          </div>
          {error && <p role="alert" className="mt-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={toggleMic} disabled={!stt}
            className={cn("rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40",
              listening ? "bg-destructive text-destructive-foreground" : "bg-success text-success-foreground hover:opacity-90")}>
            {listening ? "■ Stop mic" : "🎙 Start mic"}
          </button>
          <button onClick={say} disabled={!ttsSupported()} className="rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted disabled:opacity-40">↻ Repeat</button>
          <button onClick={() => submit(true)} className="rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-muted">Skip</button>
          <button onClick={() => submit(false)} disabled={!answer.trim()}
            className="ml-auto rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40">
            {index + 1 === qids.length ? "Submit & finish" : "Submit answer →"}
          </button>
        </div>
        <button onClick={() => { if (confirm("End the interview now? Unanswered questions won't be scored.")) { answer.trim() ? submit(false, true) : onEnd(); } }}
          className="mt-4 text-sm text-muted-foreground underline-offset-4 hover:text-destructive hover:underline">End interview</button>
      </section>
    </div>
  );
}

function greet(lang: Lang, name: string) {
  return lang === "hi" ? `नमस्ते ${name}, चलिए शुरू करते हैं।` : lang === "te" ? `నమస్కారం ${name}, ప్రారంభిద్దాం.` : `Hello ${name}, let's begin.`;
}

/* ---------------- Report ---------------- */
function Report({ session, onRestart, onRetry }: { session: Session; onRestart: () => void; onRetry: () => void }) {
  const { responses, config, qids } = session;
  const role = ROLES.find((r) => r.id === config.role)?.label ?? "";
  const answered = responses.filter((r) => !r.evaluation.skipped);
  const overall = qids.length ? Math.round((responses.reduce((a, r) => a + r.evaluation.score, 0) / qids.length) * 10) / 10 : 0;
  const best = [...answered].sort((a, b) => b.evaluation.score - a.evaluation.score);

  const strengths: string[] = [];
  const improve: string[] = [];
  if (answered.length === qids.length && qids.length) strengths.push("Attempted every question — great persistence.");
  if (best[0] && best[0].evaluation.score >= 7) strengths.push(`Strong answer on: "${qt(best[0].qid)}"`);
  if (answered.some((r) => r.evaluation.matched.length >= 4)) strengths.push("Used relevant terminology and key concepts.");
  if (answered.length && answered.reduce((a, r) => a + r.answer.split(/\s+/).length, 0) / answered.length > 40) strengths.push("Gave detailed, well-developed answers.");
  if (responses.length < qids.length) improve.push(`Interview ended early — ${qids.length - responses.length} question(s) unanswered.`);
  if (responses.some((r) => r.evaluation.skipped)) improve.push("Avoid skipping; a partial answer always scores better than none.");
  if (answered.some((r) => r.evaluation.score < 5)) improve.push("Expand short answers with examples and reasoning.");
  if (config.type !== "aptitude") improve.push("Practise the STAR method (Situation, Task, Action, Result) for structured answers.");
  if (!strengths.length) strengths.push("You showed up and practised — that's the first step!");

  const verdict = overall >= 8 ? "Excellent" : overall >= 6 ? "Good" : overall >= 4 ? "Developing" : "Needs practice";

  const download = () => {
    const lines = [
      `InterviewMate AI — Practice Report`, `Candidate: ${config.name || "Anonymous"}`, `Role: ${role} | Level: ${config.level} | Type: ${config.type} | Language: ${LANG_NAMES[config.lang]}`,
      `Date: ${new Date(session.startedAt).toLocaleString()}`, `Overall: ${overall}/10 (${verdict})`, "",
      ...qids.map((id, i) => { const r = responses.find((x) => x.qid === id);
        return `Q${i + 1}. ${qt(id, config.lang)}\nAnswer: ${r ? r.answer || "(skipped)" : "(not reached)"}\nScore: ${r ? r.evaluation.score : 0}/10\nFeedback: ${r?.evaluation.feedback ?? "-"}\n`; }),
      "Strengths:", ...strengths.map((x) => "- " + x), "", "Areas to improve:", ...improve.map((x) => "- " + x), "",
      "Disclaimer: practice demo with local keyword-based scoring; not a real hiring assessment.",
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = `interviewmate-report-${Date.now()}.txt`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="print-card grid gap-6 rounded-3xl bg-hero p-6 text-navy-foreground shadow-soft sm:grid-cols-[auto_1fr] sm:p-8">
        <div className="grid h-32 w-32 place-items-center rounded-full border-4 border-success/70 bg-navy-foreground/10">
          <div className="text-center"><div className="font-display text-4xl font-semibold">{overall}</div><div className="text-xs">out of 10</div></div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-navy-foreground/70">Interview report</p>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{verdict}{config.name ? `, ${config.name}` : ""}</h1>
          <p className="mt-2 text-sm text-navy-foreground/80">{role} · {config.level} · {config.type.toUpperCase()} · {LANG_NAMES[config.lang]} · {answered.length}/{qids.length} answered</p>
          <div className="no-print mt-4 flex flex-wrap gap-2">
            <button onClick={() => window.print()} className="rounded-lg bg-navy-foreground px-4 py-2 text-sm font-semibold text-navy hover:opacity-90">Print / Save PDF</button>
            <button onClick={download} className="rounded-lg border border-navy-foreground/40 px-4 py-2 text-sm font-medium hover:bg-navy-foreground/10">Download .txt</button>
            <button onClick={onRetry} className="rounded-lg border border-navy-foreground/40 px-4 py-2 text-sm font-medium hover:bg-navy-foreground/10">New interview</button>
            <button onClick={onRestart} className="rounded-lg px-4 py-2 text-sm font-medium text-navy-foreground/80 hover:underline">Clear all</button>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <ListCard title="Strengths" tone="success" items={strengths} />
        <ListCard title="Areas to improve" tone="warning" items={improve} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Question breakdown</h2>
        {qids.map((id, i) => {
          const r = responses.find((x) => x.qid === id);
          const sc = r?.evaluation.score ?? 0;
          return (
            <article key={id} className="print-card rounded-2xl border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-sans text-sm font-semibold sm:text-base" lang={config.lang}>Q{i + 1}. {qt(id, config.lang)}</h3>
                <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-bold", sc >= 7 ? "bg-success/15 text-success" : sc >= 4 ? "bg-warning/15 text-warning" : "bg-destructive/10 text-destructive")}>{sc}/10</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap rounded-lg bg-muted p-3 text-sm text-muted-foreground">{r ? r.answer || "Skipped" : "Not reached"}</p>
              {r && <p className="mt-2 text-sm leading-relaxed">{r.evaluation.feedback}</p>}
              {r && r.evaluation.matched.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">{r.evaluation.matched.map((m) => <span key={m} className="rounded bg-accent px-1.5 py-0.5 text-xs text-accent-foreground">{m}</span>)}</div>
              )}
            </article>
          );
        })}
      </section>
      <p className="text-xs text-muted-foreground">Scores are generated locally from answer completeness and keyword relevance — a practice indicator, not a hiring assessment.</p>
    </div>
  );
}

function qt(id: string, lang: Lang = "en") { const q = BANK.find((b) => b.id === id); return q ? questionText(q, lang).text : id; }

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: "success" | "warning" }) {
  return (
    <div className="print-card rounded-2xl border bg-card p-5 shadow-soft">
      <h2 className={cn("text-base font-semibold", tone === "success" ? "text-success" : "text-warning")}>{title}</h2>
      <ul className="mt-2 space-y-1.5 text-sm">{items.map((x) => <li key={x} className="flex gap-2"><span aria-hidden>{tone === "success" ? "✓" : "→"}</span>{x}</li>)}</ul>
    </div>
  );
}
