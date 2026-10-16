import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as buildStructuredInterviewPlan } from "./ssr.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { _ as Briefcase, a as Sparkles, b as Award, c as RotateCcw, d as FileText, f as Download, g as Camera, h as Check, i as Trash2, l as Printer, m as ChevronRight, n as Volume2, o as ShieldCheck, p as CodeXml, r as Upload, s as Search, t as X, u as Mic, v as BrainCircuit, y as BookOpen } from "../_libs/lucide-react.mjs";
import { t as require_lib } from "../_libs/mammoth+xmlbuilder.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DfTTNIvG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var STORAGE_AVATAR_KEY = "interviewmate.tesla.avatar";
function Avatar({ state: stateProp, speaking = false, listening = false, thinking = false, size = "lg", className, showStatusBadge = true, interviewerName = "Tesla", allowPhotoUpload = true }) {
	const [photoSrc, setPhotoSrc] = (0, import_react.useState)("/tesla.jpg");
	const [uploadSuccess, setUploadSuccess] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		try {
			const stored = localStorage.getItem(STORAGE_AVATAR_KEY);
			if (stored) setPhotoSrc(stored);
		} catch {}
	}, []);
	const handleCustomPhotoChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result;
			if (result) {
				setPhotoSrc(result);
				try {
					localStorage.setItem(STORAGE_AVATAR_KEY, result);
				} catch {}
				setUploadSuccess(true);
				setTimeout(() => setUploadSuccess(false), 3e3);
			}
		};
		reader.readAsDataURL(file);
	};
	const activeState = stateProp ?? (speaking ? "speaking" : listening ? "listening" : thinking ? "thinking" : "idle");
	const sizePx = typeof size === "number" ? size : size === "sm" ? 120 : size === "md" ? 180 : size === "lg" ? 240 : 320;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex flex-col items-center select-none group", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative overflow-hidden rounded-3xl border-2 transition-all duration-300 shadow-2xl bg-slate-950", activeState === "speaking" && "border-violet ring-4 ring-violet/25 shadow-violet/20", activeState === "listening" && "border-emerald-500 ring-4 ring-emerald-500/25 shadow-emerald-500/20", activeState === "thinking" && "border-amber-400 ring-4 ring-amber-400/25 shadow-amber-400/20", activeState === "idle" && "border-slate-700/60 ring-1 ring-white/10 shadow-black/40"),
				style: {
					width: sizePx,
					height: sizePx
				},
				children: [
					activeState === "speaking" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-0 rounded-3xl bg-violet/10 animate-pulse z-10" }),
					activeState === "listening" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-0 rounded-3xl bg-emerald-500/10 animate-pulse z-10" }),
					activeState === "thinking" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "pointer-events-none absolute inset-0 rounded-3xl bg-amber-400/10 animate-pulse z-10" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: photoSrc,
						alt: `${interviewerName} — AI Interviewer`,
						referrerPolicy: "no-referrer",
						className: cn("h-full w-full object-cover object-top transition-transform duration-500", activeState === "speaking" ? "scale-[1.03]" : "scale-100")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-x-0 bottom-0 p-3 pt-6 z-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 rounded-full", activeState === "speaking" && "bg-violet animate-pulse", activeState === "listening" && "bg-emerald-400 animate-pulse", activeState === "thinking" && "bg-amber-400 animate-pulse", activeState === "idle" && "bg-emerald-400") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-slate-100 drop-shadow",
									children: [
										interviewerName,
										" ·",
										" ",
										activeState === "speaking" ? "Speaking" : activeState === "listening" ? "Listening" : activeState === "thinking" ? "Thinking" : "Ready"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-end gap-0.5 h-4",
								children: [
									.4,
									.9,
									.6,
									1,
									.7,
									.3,
									.8,
									.5
								].map((scale, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("w-1 rounded-full transition-all duration-150", activeState === "speaking" ? "bg-violet animate-wave" : activeState === "listening" ? "bg-emerald-400 animate-wave" : "bg-slate-400/40 h-1"),
									style: {
										height: activeState === "speaking" || activeState === "listening" ? `${scale * 16}px` : "3px",
										animationDelay: `${i % 4 * .12}s`
									}
								}, i))
							})]
						})
					}),
					allowPhotoUpload && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 top-0 p-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity z-20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => fileInputRef.current?.click(),
							className: "rounded-full bg-slate-900/80 p-2 text-white/90 hover:text-white hover:bg-slate-900 border border-white/20 backdrop-blur shadow-sm transition",
							title: "Upload exact photo (e.g. image.png)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileInputRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: handleCustomPhotoChange
						})]
					})
				]
			}),
			uploadSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-1.5 text-[11px] text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Exact face photo applied!"]
			}),
			showStatusBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center gap-2",
				children: [
					activeState === "speaking" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full bg-violet/15 px-3 py-1 text-xs font-semibold text-violet border border-violet/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-3.5 w-3.5 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [interviewerName, " is speaking…"] })]
					}),
					activeState === "listening" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "h-3.5 w-3.5 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [interviewerName, " is listening to you…"] })]
					}),
					activeState === "thinking" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-400/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Analyzing answer & formulating next question…" })]
					}),
					activeState === "idle" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground flex items-center gap-1.5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ready for your answer" })
					})
				]
			})
		]
	});
}
function StageProgressIndicator({ currentStage, interviewType, currentIndex, totalQuestions, isCodingChallenge = false, className }) {
	const steps = interviewType === "technical" ? [
		{
			id: "intro",
			label: "Intro",
			stageKeys: ["stage_1_greeting"]
		},
		{
			id: "resume",
			label: "Resume",
			stageKeys: ["stage_2_resume"]
		},
		{
			id: "technical",
			label: "Technical",
			stageKeys: [
				"stage_3_technical",
				"stage_4_coding_sql",
				"stage_5_scenario"
			]
		},
		{
			id: "closing",
			label: "Closing",
			stageKeys: ["stage_7_closing"]
		}
	] : [
		{
			id: "intro",
			label: "Intro",
			stageKeys: ["stage_1_greeting"]
		},
		{
			id: "resume",
			label: "Resume",
			stageKeys: ["stage_2_resume"]
		},
		{
			id: "technical",
			label: "Technical",
			stageKeys: [
				"stage_3_technical",
				"stage_4_coding_sql",
				"stage_5_scenario"
			]
		},
		{
			id: "hr",
			label: "HR",
			stageKeys: ["stage_6_behavioral"]
		},
		{
			id: "closing",
			label: "Closing",
			stageKeys: ["stage_7_closing"]
		}
	];
	let activeStepIndex = steps.findIndex((s) => currentStage && s.stageKeys.includes(currentStage));
	if (activeStepIndex === -1) if (currentIndex === 0) activeStepIndex = 0;
	else if (currentIndex >= totalQuestions - 1) activeStepIndex = steps.length - 1;
	else {
		const ratio = currentIndex / Math.max(1, totalQuestions);
		activeStepIndex = Math.min(steps.length - 1, Math.floor(ratio * steps.length));
	}
	const currentStep = steps[activeStepIndex];
	const progressPercent = Math.round((currentIndex + 1) / Math.max(1, totalQuestions) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-2xl border border-border/80 bg-card/85 backdrop-blur-md p-3 sm:px-4 sm:py-2.5 shadow-2xs transition-all", className),
		role: "progressbar",
		"aria-label": "Interview Stage Progress",
		"aria-valuenow": progressPercent,
		"aria-valuemin": 0,
		"aria-valuemax": 100,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5",
				children: steps.map((step, idx) => {
					const isCompleted = idx < activeStepIndex;
					const isActive = idx === activeStepIndex;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 sm:gap-1.5 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs transition-all duration-200 select-none", isActive && "bg-hero text-white font-semibold shadow-xs ring-1 ring-violet/50", isCompleted && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium hover:bg-emerald-500/15", idx > activeStepIndex && "bg-muted/40 text-muted-foreground/60"),
							children: [
								isCompleted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-500 shrink-0 stroke-[2.5]" }) : isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-3.5 w-3.5 rounded-full bg-muted/80 text-[10px] items-center justify-center font-mono text-muted-foreground/80 shrink-0",
									children: idx + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.label }),
								isActive && isCodingChallenge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "ml-0.5 inline-flex items-center gap-0.5 rounded bg-violet/30 px-1.5 py-0.2 text-[10px] font-mono text-white/95",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "h-2.5 w-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Code" })]
								})
							]
						}), idx < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: cn("h-3 w-3 shrink-0 transition-colors", isCompleted ? "text-emerald-500/60" : "text-muted-foreground/30") })]
					}, step.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between sm:justify-end gap-3 text-xs shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-border/50",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-muted-foreground",
							children: "Current:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground text-xs",
							children: currentStep?.label || "Screening"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-px bg-border hidden sm:block" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[11px] text-muted-foreground",
							children: [
								"Q ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-foreground",
									children: currentIndex + 1
								}),
								" of ",
								totalQuestions
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-12 h-1.5 rounded-full bg-muted overflow-hidden hidden sm:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary rounded-full transition-all duration-300",
								style: { width: `${progressPercent}%` }
							})
						})]
					})
				]
			})]
		})
	});
}
var LANG_NAMES = {
	en: "English",
	hi: "हिन्दी (Hindi)",
	te: "తెలుగు (Telugu)"
};
var norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}@\s-]/gu, " ").replace(/\s+/g, " ").trim();
function evaluate(q, raw) {
	const answer = norm(raw);
	if (!answer) return {
		score: 0,
		matched: [],
		skipped: true,
		feedback: `Skipped. ${q.tip}`
	};
	if (q.answer) return q.answer.some((a) => new RegExp(`(^|\\s)${a.toLowerCase()}(\\s|$|%)`, "u").test(answer)) ? {
		score: 10,
		matched: [q.answer[0] ?? ""],
		skipped: false,
		feedback: `Correct! ${q.tip}`
	} : {
		score: 2,
		matched: [],
		skipped: false,
		feedback: `Not quite. ${q.tip}`
	};
	const words = answer.split(" ").filter(Boolean).length;
	const matched = q.keywords.filter((k) => answer.includes(k.toLowerCase()));
	const uniqueMatched = [...new Set(matched)];
	const completeness = Math.min(1, words / q.minWords) * 4;
	const relevance = Math.min(1, uniqueMatched.length / 4) * 5;
	const structure = /(because|for example|example|such as|first|then|finally|so that|which|उदाहरण|क्योंकि|ఉదాహరణకు|ఎందుకంటే)/u.test(answer) ? 1 : 0;
	const score = Math.round((completeness + relevance + structure) * 10) / 10;
	const parts = [];
	if (score >= 8) parts.push("Strong, well-rounded answer.");
	else if (score >= 5) parts.push("Good start — there's room to go deeper.");
	else parts.push("This answer needs more substance.");
	if (words < q.minWords) parts.push(`Try expanding to around ${q.minWords}+ words (you used ${words}).`);
	if (uniqueMatched.length < 3) {
		const missing = q.keywords.filter((k) => !uniqueMatched.includes(k) && /^[a-z@ -]+$/.test(k)).slice(0, 4);
		if (missing.length) parts.push(`Consider covering: ${missing.join(", ")}.`);
	}
	if (!structure) parts.push("Add an example or reasoning (\"because…\", \"for example…\").");
	parts.push(`Tip: ${q.tip}`);
	return {
		score: Math.min(10, score),
		matched: uniqueMatched,
		skipped: false,
		feedback: parts.join(" ")
	};
}
var ttsSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;
var sttSupported = () => {
	if (typeof window === "undefined") return false;
	const win = window;
	return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
};
/**
* Known male voice names across Google, Microsoft, Apple, Android, and Web synthesizers
*/
var MALE_VOICE_KEYWORDS = [
	"male",
	"guy",
	"christopher",
	"roger",
	"ryan",
	"prabhat",
	"madhur",
	"mohan",
	"rishi",
	"ravi",
	"pradeep",
	"david",
	"mark",
	"george",
	"daniel",
	"james",
	"alex",
	"brian",
	"arthur",
	"thomas",
	"paul",
	"tom",
	"william",
	"richard",
	"anthony",
	"natural (male)"
];
/**
* Female voice names to distinguish gender
*/
var FEMALE_VOICE_KEYWORDS = [
	"female",
	"neerja",
	"swara",
	"aditi",
	"kalpana",
	"veena",
	"sangeeta",
	"zira",
	"samantha",
	"victoria",
	"karen",
	"fiona",
	"tessa",
	"anna",
	"eva",
	"olga",
	"helena",
	"monica",
	"laura",
	"julie",
	"alice",
	"natural (female)"
];
/**
* Detects voice gender based on voice name and URI
*/
function getVoiceGender(voice) {
	const label = `${voice.name} ${voice.voiceURI}`.toLowerCase();
	for (const femaleName of FEMALE_VOICE_KEYWORDS) if (label.includes(femaleName)) return "female";
	for (const maleName of MALE_VOICE_KEYWORDS) if (label.includes(maleName)) return "male";
	return "unknown";
}
/**
* Detects if a voice is a high-fidelity Neural / Natural HD browser voice
*/
function isNaturalVoice(voice) {
	const label = `${voice.name} ${voice.voiceURI}`.toLowerCase();
	return label.includes("natural") || label.includes("online") || label.includes("neural") || label.includes("enhanced") || label.includes("google") || label.includes("premium") || label.includes("studio");
}
/**
* Returns all currently loaded browser voices
*/
function getAvailableVoices() {
	if (!ttsSupported()) return [];
	return window.speechSynthesis.getVoices() || [];
}
/**
* Normalizes language codes like "en", "hi", "te" to regional browser tags
*/
function getLocaleCode(lang) {
	switch (lang) {
		case "hi": return "hi-IN";
		case "te": return "te-IN";
		default: return "en-IN";
	}
}
/**
* Calculates a quality score for an available voice.
* Prioritizes high-fidelity Natural / Neural voices over robotic legacy local synthesizers.
*/
function scoreVoice(voice, targetLocale, baseLang) {
	const vName = voice.name.toLowerCase();
	const vLang = voice.lang.replace("_", "-").toLowerCase();
	const isMale = getVoiceGender(voice) === "male";
	isNaturalVoice(voice);
	let score = 0;
	if (vName.includes("espeak") || vName.includes("speech-dispatcher")) return -1e3;
	if (vName.includes("online (natural)")) score += 1200;
	else if (vName.includes("natural")) score += 1e3;
	else if (vName.includes("neural")) score += 900;
	else if (vName.includes("enhanced")) score += 750;
	else if (vName.includes("google")) score += 600;
	if (vLang === targetLocale) score += 500;
	else if (vLang.startsWith(baseLang)) score += 300;
	else if (baseLang === "en" && vLang.startsWith("en")) score += 200;
	if (isMale) score += 250;
	if (voice.default) score += 50;
	return score;
}
/**
* Returns enriched list of available browser voices sorted by natural quality
*/
function getEnrichedVoices(currentLang) {
	const voices = getAvailableVoices();
	const targetLocale = getLocaleCode(currentLang).toLowerCase();
	const baseLang = currentLang.toLowerCase();
	return voices.map((v) => {
		const vLang = v.lang.replace("_", "-").toLowerCase();
		const gender = getVoiceGender(v);
		const isRegionalMatch = vLang === targetLocale || vLang.startsWith(baseLang);
		const isNatural = isNaturalVoice(v);
		const isMale = gender === "male";
		const score = scoreVoice(v, targetLocale, baseLang);
		return {
			voice: v,
			name: v.name,
			lang: v.lang,
			voiceURI: v.voiceURI,
			gender,
			isRecommendedMale: isMale && isRegionalMatch,
			isNaturalHD: isNatural,
			isRegionalMatch,
			score
		};
	}).sort((a, b) => b.score - a.score);
}
/**
* Picks the highest-fidelity natural voice for the target language.
* Avoids robotic synthesizers and prioritizes Natural / Neural voices.
*/
function pickRecommendedVoice(langCode, specificVoiceURI) {
	if (!ttsSupported()) return {
		voice: void 0,
		isConfirmedMale: false
	};
	const voices = getAvailableVoices();
	if (!voices.length) return {
		voice: void 0,
		isConfirmedMale: false
	};
	if (specificVoiceURI) {
		const selected = voices.find((v) => v.voiceURI === specificVoiceURI);
		if (selected) return {
			voice: selected,
			isConfirmedMale: getVoiceGender(selected) === "male"
		};
	}
	const ranked = getEnrichedVoices(langCode.split("-")[0]?.toLowerCase() ?? langCode.toLowerCase());
	if (ranked.length > 0 && ranked[0].score > -500) {
		const best = ranked[0];
		return {
			voice: best.voice,
			isConfirmedMale: best.gender === "male",
			note: best.isNaturalHD ? `Using Natural HD Voice (${best.name})` : void 0
		};
	}
	const fallback = voices[0];
	return {
		voice: fallback,
		isConfirmedMale: fallback ? getVoiceGender(fallback) === "male" : false
	};
}
/**
* Session tracking to guarantee previous speech is instantly cancelled
* and cannot resurrect or duplicate sentences.
*/
var activeSpeechSession = 0;
var keepAliveTimer = null;
/**
* Cleans raw question text to produce human, natural-sounding speech
* without markdown symbols, raw brackets, or repetitive filler.
*/
function sanitizeSpeechText(text) {
	if (!text) return "";
	return text.replace(/```[\s\S]*?```/g, " [coding problem displayed on screen] ").replace(/`([^`]+)`/g, "$1").replace(/[*_#~[\]]/g, "").replace(/\(http[^)]+\)/g, "").replace(/\bAPI\b/g, "A P I").replace(/\bSQL\b/g, "S Q L").replace(/\bRESTful\b/g, "REST-ful").replace(/\bUI\b/g, "U I").replace(/\bUX\b/g, "U X").replace(/\bAI\b/g, "A I").replace(/\bML\b/g, "M L").replace(/\bvs\.?\b/gi, "versus").replace(/\be\.g\.,?\b/gi, "for example,").replace(/\bi\.e\.,?\b/gi, "that is,").replace(/\betc\.\b/gi, "and so on").replace(/&/g, " and ").replace(/\+/g, " plus ").replace(/\s+/g, " ").trim();
}
/**
* Speaks text using the browser's native SpeechSynthesis API.
* Uses a single cohesive utterance with natural prosody, pitch, and speed.
* Uses strict session tracking to prevent duplicate or overlapping speech.
*/
function speak(text, langCode, options = {}) {
	if (!ttsSupported()) {
		options.onEnd?.();
		return;
	}
	const synth = window.speechSynthesis;
	synth.cancel();
	if (keepAliveTimer) {
		clearInterval(keepAliveTimer);
		keepAliveTimer = null;
	}
	const sessionId = ++activeSpeechSession;
	const cleanedText = sanitizeSpeechText(text);
	if (!cleanedText) {
		options.onEnd?.();
		return;
	}
	const voice = pickRecommendedVoice(langCode, options.voiceURI).voice;
	const speechRate = Math.max(.85, Math.min(1.2, options.rate ?? 1));
	const speechPitch = Math.max(.9, Math.min(1.1, options.pitch ?? 1));
	const utterance = new SpeechSynthesisUtterance(cleanedText);
	utterance.lang = langCode;
	if (voice) utterance.voice = voice;
	utterance.rate = speechRate;
	utterance.pitch = speechPitch;
	utterance.onstart = () => {
		if (sessionId !== activeSpeechSession) return;
		options.onStart?.();
	};
	utterance.onend = () => {
		if (keepAliveTimer) {
			clearInterval(keepAliveTimer);
			keepAliveTimer = null;
		}
		if (sessionId !== activeSpeechSession) return;
		options.onEnd?.();
	};
	utterance.onerror = (e) => {
		if (keepAliveTimer) {
			clearInterval(keepAliveTimer);
			keepAliveTimer = null;
		}
		if (sessionId !== activeSpeechSession) return;
		if (e.error !== "interrupted" && e.error !== "canceled") options.onError?.(`Speech issue: ${e.error}`);
		options.onEnd?.();
	};
	keepAliveTimer = window.setInterval(() => {
		if (sessionId !== activeSpeechSession) {
			if (keepAliveTimer) clearInterval(keepAliveTimer);
			return;
		}
		if (synth.speaking && !synth.paused) {
			synth.pause();
			synth.resume();
		}
	}, 1e4);
	setTimeout(() => {
		if (sessionId === activeSpeechSession) synth.speak(utterance);
	}, 20);
}
/**
* Immediately terminates all active browser speech synthesis
*/
function stopSpeaking() {
	if (ttsSupported()) {
		activeSpeechSession++;
		if (keepAliveTimer) {
			clearInterval(keepAliveTimer);
			keepAliveTimer = null;
		}
		window.speechSynthesis.cancel();
	}
}
/**
* Creates and configures the Web Speech Recognition instance.
* Separates final transcripts from interim results to prevent duplicated words.
*/
function createRecognizer(langCode, handlers) {
	const win = typeof window !== "undefined" ? window : {};
	const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
	if (!SpeechRec) throw new Error("Speech recognition is not supported in this browser.");
	const rec = new SpeechRec();
	rec.lang = langCode;
	rec.continuous = true;
	rec.interimResults = true;
	rec.maxAlternatives = 1;
	rec.onresult = (e) => {
		let finalAccum = "";
		let interimAccum = "";
		for (let i = e.resultIndex; i < e.results.length; i++) {
			const result = e.results[i];
			const text = result?.[0]?.transcript ?? "";
			if (result.isFinal) finalAccum += text + " ";
			else interimAccum += text;
		}
		if (finalAccum) handlers.onFinalChunk(finalAccum);
		handlers.onInterimChunk(interimAccum);
	};
	rec.onerror = (e) => {
		handlers.onError({
			"not-allowed": "Microphone access was denied. Please allow microphone permissions in your browser or switch to the 'Type Answer' tab.",
			"no-speech": "No speech was detected. Please speak closer to your microphone or type your response.",
			network: "Speech recognition service encountered a network glitch. Please type your answer.",
			"language-not-supported": "This language is not supported for voice recognition in your browser. Please type your response.",
			"audio-capture": "No microphone found or device is busy in another program."
		}[e.error] ?? `Voice input notification: ${e.error}`);
	};
	rec.onend = () => {
		handlers.onEnd();
	};
	return rec;
}
function validateDocumentFile(file) {
	const extension = file.name.split(".").pop()?.toLowerCase();
	if (!extension || ![
		"pdf",
		"docx",
		"txt",
		"doc"
	].includes(extension)) return {
		valid: false,
		error: `Unsupported file type ".${extension}". Please upload a PDF, DOCX, or TXT file.`
	};
	if (file.size > 5242880) return {
		valid: false,
		error: `File size (${(file.size / 1048576).toFixed(1)} MB) exceeds the 5 MB limit. Please upload a smaller document.`
	};
	return { valid: true };
}
/**
* Extracts raw readable text from a PDF file using text stream parsing
*/
async function extractTextFromPdf(buffer) {
	const bytes = new Uint8Array(buffer);
	const rawString = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
	const matches = [];
	const textBlockRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
	let match;
	while ((match = textBlockRegex.exec(rawString)) !== null) if (match[1] && match[1].length > 1) matches.push(match[1]);
	if (matches.length > 15) return matches.join(" ").replace(/\\r|\\n/g, " ").trim();
	const result = (rawString.match(/[\x20-\x7E\s]{4,}/g) || []).filter((chunk) => !chunk.startsWith("xref") && !chunk.startsWith("trailer") && !chunk.includes("obj") && !chunk.includes("endobj") && !chunk.includes("Font") && chunk.trim().length > 3).join(" ").replace(/\s+/g, " ").trim();
	if (result.length > 50) return result;
	throw new Error("Could not extract readable text from this PDF. Please copy and paste the document text directly.");
}
/**
* Extracts readable text from a DOCX file using mammoth
*/
async function extractTextFromDocx(buffer) {
	try {
		const result = await import_lib.extractRawText({ arrayBuffer: buffer });
		if (result.value && result.value.trim().length > 20) return result.value.trim();
	} catch (err) {
		console.warn("Mammoth extraction warning:", err);
	}
	throw new Error("Could not extract readable text from this DOCX. Please paste your text directly.");
}
/**
* High-level parser that processes any supported File object into a ParsedDocument
*/
async function parseDocumentFile(file) {
	const validation = validateDocumentFile(file);
	if (!validation.valid) throw new Error(validation.error);
	const ext = file.name.split(".").pop()?.toLowerCase();
	const buffer = await file.arrayBuffer();
	let text = "";
	if (ext === "txt") text = new TextDecoder().decode(buffer);
	else if (ext === "docx" || ext === "doc") text = await extractTextFromDocx(buffer);
	else if (ext === "pdf") text = await extractTextFromPdf(buffer);
	if (!text || text.trim().length < 20) throw new Error(`Document "${file.name}" appears to be empty or unscannable. Please paste the text directly.`);
	return {
		name: file.name,
		type: ext === "pdf" ? "pdf" : ext === "docx" ? "docx" : "txt",
		size: file.size,
		text: text.trim()
	};
}
var SAMPLE_PRESETS = [
	{
		id: "fullstack-react-node",
		title: "Full-Stack Software Engineer (React / Node.js)",
		role: "Full-Stack Developer",
		category: "fullstack",
		tags: [
			"React",
			"Node.js",
			"TypeScript",
			"PostgreSQL",
			"Docker"
		],
		description: "Matches a Computer Science graduate against an enterprise Full-Stack Associate opening.",
		resumeFileName: "Aditya_Sharma_Resume.pdf",
		resumeText: `ADITYA SHARMA
Email: aditya.sharma.dev@gmail.com | Phone: +91 98765 43210 | Bengaluru, India
GitHub: github.com/aditya-dev | LinkedIn: linkedin.com/in/adityasharma-dev

EDUCATION
B.Tech in Computer Science and Engineering | CGPA: 8.6/10
Vellore Institute of Technology (VIT), 2021 – 2025

TECHNICAL SKILLS
Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, TanStack Query
Backend: Node.js, Express.js, REST APIs, Microservices, Socket.io
Databases: PostgreSQL, MongoDB, Redis (caching)
DevOps & Tools: Docker, Git, GitHub Actions, AWS (S3, EC2, CloudFront), Postman

PROJECTS
1. E-Commerce Microservices Platform (React, Node.js, PostgreSQL, Redis, Docker)
- Architected a scalable order-processing engine handling 1,200+ concurrent requests with sub-100ms latency.
- Implemented JWT authentication with refresh token rotation and RBAC access control.
- Designed Redis caching layer reducing database read load by 45%.

2. Collaborative Real-Time Code Editor (React, TypeScript, WebSockets, Express)
- Developed a live collaborative markdown and code editor supporting multiple concurrent typers using Operational Transformation algorithms.
- Integrated Monaco editor with syntax highlighting and syntax error validation.

EXPERIENCE
Software Development Intern | InnoTech Labs, Hyderabad (June 2024 – Nov 2024)
- Built automated CI/CD pipeline reducing deployment cycle from 40 minutes to 8 minutes.
- Refactored legacy REST APIs in Express to TypeScript, improving test coverage to 84%.`,
		jdText: `Role: Full-Stack Software Engineer (Associate / Mid-Level)
Company: HCLTech Engineering & R&D Services
Location: Bengaluru / Hyderabad / Remote

About The Role:
We are seeking an energetic Full-Stack Engineer with strong computer science fundamentals to develop mission-critical enterprise web applications for global Fortune 500 clients.

Key Responsibilities:
- Design, build, and maintain high-performance frontend interfaces using React, TypeScript, and modern state management.
- Develop secure, highly scalable backend services and RESTful APIs using Node.js and Express.
- Work closely with relational databases (PostgreSQL/MySQL) and caching stores (Redis).
- Implement robust CI/CD pipelines, containerization using Docker, and cloud deployments on AWS.
- Collaborate in an Agile team with peer code reviews and automated testing (Jest, Vitest).

Required Qualifications:
- Bachelor's degree in Computer Science, IT, or equivalent experience.
- Strong proficiency in modern JavaScript, TypeScript, React.js, and Node.js.
- Solid understanding of data structures, algorithms, object-oriented design, and REST APIs.
- Experience with relational SQL databases and schema design.
- Familiarity with Git, Docker, and Linux environments.`
	},
	{
		id: "java-backend-spring",
		title: "Java Backend Engineer (Spring Boot / Microservices)",
		role: "Java Developer",
		category: "backend",
		tags: [
			"Java",
			"Spring Boot",
			"Microservices",
			"PostgreSQL",
			"Kafka"
		],
		description: "Core enterprise Java backend role covering OOP, Spring Boot, transactions, and REST APIs.",
		resumeFileName: "Rohan_Kulkarni_Java_Resume.pdf",
		resumeText: `ROHAN KULKARNI
Email: rohan.kulkarni.java@gmail.com | Pune, India
B.Tech in Computer Engineering | CGPA: 8.8/10 (2021 – 2025)

TECHNICAL SKILLS:
Languages: Java (8/11/17), SQL, C++
Frameworks: Spring Boot, Spring Data JPA, Spring Security, Hibernate, JUnit 5, Mockito
Architecture: RESTful APIs, Microservices, Event-Driven Architecture, Kafka, Docker
Databases: PostgreSQL, MySQL, Redis
Tools: Maven, Git, Docker, Postman, SonarQube

PROJECTS:
1. Distributed Banking Transaction Processing Engine (Java 17, Spring Boot, PostgreSQL, Kafka)
- Engineered idempotent payment transfer microservice handling 800+ transactions/sec with two-phase commit logic.
- Built distributed messaging pipeline using Apache Kafka for async transaction notifications and audit trails.
- Enforced role-based authentication with Spring Security and OAuth2 JWT tokens.

2. Inventory Management Microservices Platform (Spring Boot, Hibernate, Docker)
- Designed normalized schema with 18 relational tables, indexing critical foreign keys to slash query response times by 60%.
- Achieved 91% code coverage with comprehensive JUnit 5 and Mockito test suites.`,
		jdText: `Role: Associate Java Software Engineer
Company: Global IT & Digital Solutions (Campus Placement)
Location: Pune / Chennai / Bengaluru

Responsibilities:
- Build resilient backend microservices using Java 17, Spring Boot, and Hibernate.
- Write clean, well-tested code following SOLID principles and design patterns.
- Design database schemas, write complex SQL queries, and optimize query plans in PostgreSQL.
- Integrate message queues (Kafka / RabbitMQ) for asynchronous workflows.
- Participate in code reviews, bug fixes, and continuous delivery with Docker and Jenkins.

Requirements:
- Strong core Java fundamentals (Collections, Multithreading, Streams, Exception Handling).
- Solid grasp of Spring Boot, Dependency Injection, JPA, and REST API conventions.
- Strong knowledge of relational SQL databases and ACID transactions.`
	},
	{
		id: "python-backend-fastapi",
		title: "Python Software Engineer (FastAPI / Django / SQL)",
		role: "Python Developer",
		category: "python",
		tags: [
			"Python",
			"FastAPI",
			"PostgreSQL",
			"Redis",
			"Docker"
		],
		description: "Modern Python engineer profile testing async programming, REST APIs, and database design.",
		resumeFileName: "Ananya_Sen_Python_Resume.pdf",
		resumeText: `ANANYA SEN
Email: ananya.sen.python@gmail.com | Kolkata, India
B.Tech in Information Technology | CGPA: 8.7/10 (2021 – 2025)

TECHNICAL SKILLS:
Languages: Python 3.11+, SQL, JavaScript
Frameworks: FastAPI, Django, Flask, SQLAlchemy, Pydantic, Celery
Databases: PostgreSQL, Redis, MongoDB
DevOps: Docker, Docker Compose, Git, Linux, GitHub Actions, AWS EC2

PROJECTS:
1. Asynchronous Task Orchestration Service (FastAPI, Celery, Redis, PostgreSQL)
- Developed async API server using FastAPI and Celery handling 5,000+ background analytics jobs daily.
- Implemented connection pooling with SQLAlchemy and Pydantic schema validation.
- Built rate-limiting middleware using Redis token-bucket algorithm.

2. Healthcare Appointment & Teleconsult Booking System (Django, PostgreSQL, Stripe)
- Implemented secure REST APIs with JWT authentication, transaction isolation, and database migrations.
- Configured automated unit and integration tests using Pytest with 88% test coverage.`,
		jdText: `Role: Python Backend Developer
Company: Enterprise Digital Engineering Services
Location: Hyderabad / Bengaluru / Remote

Responsibilities:
- Develop and maintain scalable REST APIs and microservices using Python and modern web frameworks (FastAPI/Django).
- Design and optimize relational databases (PostgreSQL) and write efficient ORM / raw SQL queries.
- Build asynchronous job workers with Celery and Redis.
- Package and deploy applications using Docker containers.

Requirements:
- Strong core Python skills (OOP, Generators, Decorators, Concurrency, Asyncio).
- Experience building RESTful APIs with FastAPI or Django REST Framework.
- Good understanding of relational databases, indexing, and SQL queries.`
	},
	{
		id: "aiml-engineer",
		title: "AI & Machine Learning Engineer (Python / PyTorch)",
		role: "AI / ML Engineer",
		category: "aiml",
		tags: [
			"Python",
			"PyTorch",
			"RAG",
			"LLMs",
			"Vector DB"
		],
		description: "Evaluates an AI enthusiast against an Enterprise GenAI & Deep Learning job posting.",
		resumeFileName: "Priya_Nair_AI_Resume.docx",
		resumeText: `PRIYA NAIR
Email: priya.nair.ai@gmail.com | Hyderabad, India
B.Tech in Artificial Intelligence & Data Science | CGPA: 9.1/10 (2021 – 2025)

SKILLS:
Python, PyTorch, TensorFlow, Scikit-Learn, Hugging Face, LangChain, RAG Systems, Vector Databases (ChromaDB, Pinecone), FastAPI, Docker, Pandas, NumPy.

PROJECTS:
1. Enterprise Document QA with Hybrid RAG (LangChain, ChromaDB, FastAPI)
- Built an intelligent RAG pipeline parsing 10,000+ medical and technical PDFs with semantic chunking and reciprocal rank fusion.
- Deployed FastAPI microservice processing queries with 94% citation accuracy.

2. Fine-Tuned LLaMA-3 for Code Generation
- Fine-tuned 8B parameter model using LoRA and QLoRA on curated Python datasets, achieving a 14% improvement on HumanEval benchmark.`,
		jdText: `Role: Junior AI / ML Solutions Engineer
Company: HCLTech Digital Enterprise AI
Requirements:
- Deep proficiency in Python and modern ML frameworks (PyTorch or TensorFlow).
- Hands-on experience developing Retrieval-Augmented Generation (RAG) pipelines and working with Vector DBs.
- Experience deploying ML models via REST APIs (FastAPI/Flask) with Docker.
- Strong understanding of Transformer architectures, attention mechanisms, and fine-tuning techniques.`
	},
	{
		id: "data-analyst",
		title: "Data Analyst & Business Intelligence",
		role: "Data Analyst",
		category: "data",
		tags: [
			"SQL",
			"Power BI",
			"Python",
			"Tableau",
			"ETL"
		],
		description: "Tests data modeling, SQL queries, dashboarding, and business analytics skills.",
		resumeFileName: "Rahul_Varma_Data_Resume.pdf",
		resumeText: `RAHUL VARMA
Email: rahul.varma.data@gmail.com | Chennai, India
Education: B.Tech in Information Technology | 2021 - 2025

TECHNICAL SKILLS:
SQL (Advanced queries, CTEs, Window Functions), Python (Pandas, NumPy, Seaborn), Power BI, Tableau, Excel (VBA, Power Query), Data Modeling, ETL.

PROJECTS:
1. Retail Sales Performance Dashboard (Power BI, SQL)
- Analyzed 1.5 million transaction records across 40 stores. Created interactive KPIs for revenue growth, customer retention, and inventory churn.
2. Customer Churn Prediction & Analysis (Python, Scikit-Learn)
- Performed EDA, feature engineering, and logistic regression identifying top 3 factors driving churn with 82% recall.`,
		jdText: `Role: Associate Data Analyst
Company: HCLTech Analytics CoE
Responsibilities:
- Write complex SQL queries, stored procedures, and transformations for high-volume datasets.
- Build executive dashboards and visual reports in Power BI and Tableau.
- Collaborate with business stakeholders to extract actionable metrics and KPIs.
- Present data-driven recommendations with clear business communication.`
	},
	{
		id: "cloud-devops-aws",
		title: "Cloud & DevOps Engineer (AWS / Docker / K8s)",
		role: "Cloud & DevOps Engineer",
		category: "cloud",
		tags: [
			"AWS",
			"Docker",
			"Kubernetes",
			"CI/CD",
			"Linux"
		],
		description: "Infrastructure, container orchestration, Linux networking, and automated deployment pipelines.",
		resumeFileName: "Karthik_Raman_DevOps_Resume.pdf",
		resumeText: `KARTHIK RAMAN
Email: karthik.devops@gmail.com | Chennai, India
B.Tech in Computer Science and Engineering | CGPA: 8.5/10 (2021 – 2025)

TECHNICAL SKILLS:
Cloud: AWS (EC2, S3, VPC, IAM, RDS, EKS, CloudWatch)
Containers & Orchestration: Docker, Kubernetes, Helm
CI/CD & Automation: GitHub Actions, Jenkins, Terraform, Bash scripting
Operating Systems: Linux (Ubuntu, RHEL), Shell scripting, Networking (TCP/IP, DNS, SSL)

PROJECTS:
1. Multi-Tier Microservices Deployment on AWS EKS (Kubernetes, Helm, Terraform)
- Authored Terraform IaC provisioning high-availability VPC across 3 Availability Zones.
- Configured automated rolling deployments with Kubernetes Ingress and cert-manager SSL certificates.
- Set up Prometheus & Grafana monitoring dashboards tracking pod memory, CPU, and request latency.

2. Automated Zero-Downtime CI/CD Pipeline (GitHub Actions, Docker, AWS)
- Reduced build and deployment turnaround from 35 minutes to 6 minutes using multi-stage Docker caching.`,
		jdText: `Role: Associate Cloud & DevOps Engineer
Company: Cloud Infrastructure Services
Location: Chennai / Bengaluru / Hyderabad

Responsibilities:
- Automate provisioning of cloud infrastructure on AWS using Terraform or CloudFormation.
- Maintain and troubleshoot containerized services running on Docker and Kubernetes.
- Implement robust CI/CD pipelines for automated testing, container scanning, and zero-downtime deployment.
- Monitor system health, logs, and performance metrics across enterprise services.

Requirements:
- Solid understanding of Linux system administration, bash scripting, and networking fundamentals.
- Hands-on experience with Docker containerization and Kubernetes concepts (Pods, Services, Ingress).
- Familiarity with AWS core services (VPC, EC2, S3, IAM) and CI/CD tools.`
	},
	{
		id: "qa-sdet-automation",
		title: "QA Automation & SDET (Selenium / Pytest / API)",
		role: "QA & SDET Engineer",
		category: "qa",
		tags: [
			"Selenium",
			"Pytest",
			"Java",
			"API Testing",
			"Postman"
		],
		description: "Software testing methodologies, test automation frameworks, API validation, and bug reporting.",
		resumeFileName: "Sneha_Patel_QA_Resume.pdf",
		resumeText: `SNEHA PATEL
Email: sneha.patel.qa@gmail.com | Ahmedabad, India
B.Tech in Computer Engineering | CGPA: 8.4/10 (2021 – 2025)

TECHNICAL SKILLS:
Testing Methodologies: Functional, Regression, Smoke, Sanity, Integration, Performance Testing
Automation Tools: Selenium WebDriver (Java/Python), Pytest, TestNG, Postman, RestAssured
Languages: Java, Python, SQL
CI/CD & Management: Git, Jenkins, Jira, Allure Reporting

PROJECTS:
1. Automated Regression Suite for Financial Web Portal (Selenium, Java, TestNG)
- Developed Page Object Model (POM) automation framework running 250+ end-to-end regression tests.
- Integrated parallel test execution reducing regression test run time by 65%.
- Automated REST API testing with RestAssured validating status codes, payloads, and schema compliance.

2. Load & Performance Testing of E-Commerce APIs (JMeter, Postman)
- Simulated 500 concurrent virtual users measuring response latency, throughput, and error rates.`,
		jdText: `Role: Associate QA Automation Engineer (SDET)
Company: Enterprise Quality Engineering CoE
Location: Bengaluru / Pune / Remote

Responsibilities:
- Design, write, and execute automated test scripts for web applications and REST APIs.
- Work closely with developers to identify edge cases, defects, and performance bottlenecks.
- Build and maintain Page Object Model automation suites in Selenium with Java or Python.
- Integrate automated test suites into CI/CD delivery pipelines.

Requirements:
- Strong grasp of software testing lifecycle (STLC), defect tracking, and test case design.
- Hands-on experience with Selenium WebDriver and test runners (TestNG / Pytest).
- Experience validating REST APIs using Postman or automation libraries.
- Basic SQL proficiency for database validation.`
	},
	{
		id: "frontend-react-nextjs",
		title: "Frontend Web Developer (React / Next.js / Tailwind)",
		role: "Frontend Developer",
		category: "frontend",
		tags: [
			"React",
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Redux"
		],
		description: "Modern client-side engineering, responsive web applications, state management, and web performance.",
		resumeFileName: "Vikas_Verma_Frontend_Resume.pdf",
		resumeText: `VIKAS VERMA
Email: vikas.verma.fe@gmail.com | Delhi NCR, India
B.Tech in Computer Science | CGPA: 8.7/10 (2021 – 2025)

TECHNICAL SKILLS:
Languages: TypeScript, JavaScript (ES2023), HTML5, CSS3/SCSS
Frameworks: React.js, Next.js (App Router), Redux Toolkit, Zustand, TanStack Query
Styling: Tailwind CSS, CSS Modules, Radix UI, Framer Motion
Performance & Tools: Web Vitals, Lighthouse, Vite, Webpack, Git, Jest, React Testing Library

PROJECTS:
1. High-Performance Financial Dashboard (Next.js 14, TypeScript, Tailwind, Chart.js)
- Built responsive analytics portal achieving 98/100 Lighthouse performance score.
- Implemented optimistic UI updates, debounced search filters, and virtualization for 10,000+ data rows.
- Structured component library with atomic design and strict TypeScript typings.

2. Interactive Quiz & Assessment Web App (React, Tailwind CSS, Zustand)
- Created engaging assessment engine with live timers, keyboard navigation, and audio feedback.`,
		jdText: `Role: Associate Frontend Developer
Company: Enterprise Experience Engineering
Location: Hyderabad / Bengaluru / Gurgaon

Responsibilities:
- Build pixel-perfect, responsive web interfaces using React.js, TypeScript, and modern CSS frameworks.
- Optimize frontend web performance, accessibility (WCAG), and responsive cross-browser compatibility.
- Integrate REST and GraphQL endpoints with robust error handling and loading skeletons.
- Write clean component tests with Jest and React Testing Library.

Requirements:
- Strong proficiency in modern JavaScript/TypeScript, React fundamentals, hooks, and virtual DOM.
- Deep familiarity with Tailwind CSS or modern CSS layout techniques (Flexbox, Grid).
- Understanding of state management, client routing, and asynchronous data fetching.`
	}
];
var STORAGE_KEY = "interviewmate.session.v3";
var DEFAULT_CONFIG = {
	mode: "resume_jd",
	name: "",
	role: "Full-Stack Developer",
	level: "fresher",
	type: "mixed",
	lang: "en",
	durationMins: 20,
	questionCount: 6,
	speechRate: .92,
	selectedVoiceURI: "",
	resumeFileName: "",
	resumeText: "",
	jdFileName: "",
	jdText: ""
};
var createFreshSession = () => ({
	phase: "setup",
	config: DEFAULT_CONFIG,
	questions: [],
	index: 0,
	responses: [],
	startedAt: 0
});
function App() {
	const [session, setSession] = (0, import_react.useState)(createFreshSession);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) setSession(JSON.parse(stored));
		} catch {}
		setLoaded(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (loaded) try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
		} catch {}
	}, [session, loaded]);
	const resetAll = () => {
		stopSpeaking();
		localStorage.removeItem(STORAGE_KEY);
		setSession(createFreshSession());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground antialiased flex flex-col justify-between",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "no-print sticky top-0 z-20 border-b border-border/80 bg-card/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-9 w-9 items-center justify-center rounded-xl bg-hero font-display text-base font-bold text-navy-foreground shadow-sm",
							children: "IM"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display font-semibold tracking-tight text-foreground text-base sm:text-lg",
							children: ["InterviewMate ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-violet",
								children: "AI"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline-block ml-2 text-xs text-muted-foreground font-medium",
							children: "· Placement Screening Studio"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden md:flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Privacy-Protected Client Voice" })]
						}), session.phase !== "setup" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: resetAll,
							className: "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition",
							children: "Reset session"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 py-6 sm:py-8 flex-1",
				children: !loaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-64 place-items-center text-muted-foreground text-sm font-medium",
					children: "Loading session state…"
				}) : session.phase === "setup" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SetupView, {
					initialConfig: session.config,
					onStart: (config, questions) => {
						setSession({
							phase: "interview",
							config,
							questions,
							index: 0,
							responses: [],
							startedAt: Date.now()
						});
					}
				}) : session.phase === "interview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveInterviewView, {
					session,
					onAnswer: (response, forceEnd) => {
						setSession((prev) => {
							const nextResponses = [...prev.responses, response];
							const isFinished = forceEnd || prev.index + 1 >= prev.questions.length;
							return {
								...prev,
								responses: nextResponses,
								index: prev.index + 1,
								phase: isFinished ? "report" : "interview"
							};
						});
					},
					onEndInterview: () => {
						setSession((prev) => ({
							...prev,
							phase: "report"
						}));
					}
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportView, {
					session,
					onRestart: resetAll,
					onRetry: () => {
						setSession((prev) => ({
							...createFreshSession(),
							config: prev.config
						}));
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "no-print mt-auto border-t border-border/60 bg-card/40 py-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-5xl px-4 text-center text-xs text-muted-foreground space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "leading-relaxed",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Educational Practice Simulation:" }), " InterviewMate AI simulates an automated technical screening interview inspired by placement screening standards (such as general HCLTech screening structures). It is an independent college practice tool and does not claim to reproduce proprietary platforms (e.g. BerriBot) or internal enterprise evaluation algorithms."]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-muted-foreground/75",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Privacy & Integrity Notice:" }), " Voice recognition and speech synthesis run locally in your browser. No video, eye-tracking, or identity surveillance is performed. Resumes and Job Descriptions are parsed solely for real-time practice question alignment."]
					})]
				})
			})
		]
	});
}
var formFieldStyle = "w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition shadow-xs";
function SetupView({ initialConfig, onStart }) {
	const [cfg, setCfg] = (0, import_react.useState)(initialConfig);
	const [analyzing, setAnalyzing] = (0, import_react.useState)(false);
	const [analysisError, setAnalysisError] = (0, import_react.useState)("");
	const [activeTab, setActiveTab] = (0, import_react.useState)("documents");
	const [voices, setVoices] = (0, import_react.useState)([]);
	const [previewingVoice, setPreviewingVoice] = (0, import_react.useState)(false);
	const [presetSearch, setPresetSearch] = (0, import_react.useState)("");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const filteredPresets = (0, import_react.useMemo)(() => {
		return SAMPLE_PRESETS.filter((preset) => {
			if (selectedCategory !== "all" && preset.category !== selectedCategory) return false;
			if (!presetSearch.trim()) return true;
			const q = presetSearch.toLowerCase().trim();
			return preset.title.toLowerCase().includes(q) || preset.role.toLowerCase().includes(q) || preset.description.toLowerCase().includes(q) || preset.tags && preset.tags.some((t) => t.toLowerCase().includes(q)) || preset.resumeText.toLowerCase().includes(q);
		});
	}, [presetSearch, selectedCategory]);
	const update = (key, val) => setCfg((p) => ({
		...p,
		[key]: val
	}));
	(0, import_react.useEffect)(() => {
		const refreshVoices = () => {
			if (ttsSupported()) {
				const loadedVoices = getAvailableVoices();
				setVoices(loadedVoices);
				if (!cfg.selectedVoiceURI && loadedVoices.length > 0) {
					const recommended = pickRecommendedVoice(getLocaleCode(cfg.lang));
					if (recommended && recommended.voice) update("selectedVoiceURI", recommended.voice.voiceURI);
				}
			}
		};
		refreshVoices();
		if (ttsSupported()) window.speechSynthesis.onvoiceschanged = refreshVoices;
	}, [cfg.lang]);
	const handlePreviewVoice = () => {
		if (!ttsSupported()) return;
		setPreviewingVoice(true);
		speak(cfg.lang === "hi" ? "नमस्ते! मैं आपका वर्चुअल साक्षात्कारकर्ता टेस्ला हूँ। क्या आप साक्षात्कार के लिए तैयार हैं?" : cfg.lang === "te" ? "నమస్కారం! నేను మీ ఇంటర్వ్యూవర్ టెస్లా. మీరు ఇంటర్వ్యూకు సిద్ధంగా ఉన్నారా?" : "Hello! I am Tesla, your virtual interviewer for today's technical screening session.", getLocaleCode(cfg.lang), {
			voiceURI: cfg.selectedVoiceURI,
			rate: cfg.speechRate,
			onStart: () => setPreviewingVoice(true),
			onEnd: () => setPreviewingVoice(false),
			onError: () => setPreviewingVoice(false)
		});
	};
	const handleResumeUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setAnalysisError("");
		try {
			const parsed = await parseDocumentFile(file);
			update("resumeFileName", parsed.name);
			update("resumeText", parsed.text);
		} catch (err) {
			setAnalysisError(err instanceof Error ? err.message : "Failed to parse resume document.");
		}
	};
	const handleJdUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setAnalysisError("");
		try {
			const parsed = await parseDocumentFile(file);
			update("jdFileName", parsed.name);
			update("jdText", parsed.text);
		} catch (err) {
			setAnalysisError(err instanceof Error ? err.message : "Failed to parse Job Description document.");
		}
	};
	const handleApplyPreset = (preset) => {
		setAnalysisError("");
		setCfg((prev) => ({
			...prev,
			role: preset.role,
			resumeFileName: preset.resumeFileName,
			resumeText: preset.resumeText,
			jdFileName: "Job_Description.txt",
			jdText: preset.jdText
		}));
	};
	const handleBeginInterview = async () => {
		setAnalysisError("");
		if (cfg.mode === "quick_role" || !cfg.resumeText && !cfg.jdText) {
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
				jdText: cfg.jdText
			});
			onStart(cfg, structuredPlan);
			return;
		}
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
					count: cfg.questionCount
				})
			});
			if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
			const data = await res.json();
			const updatedConfig = {
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
					keyTopics: []
				}
			};
			const finalQuestions = (data.questions || []).map((q) => ({
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
				sampleInputOutput: q.sampleInputOutput
			}));
			if (finalQuestions.length > 0 && finalQuestions[0].stage !== "stage_1_greeting") onStart(updatedConfig, buildStructuredInterviewPlan(updatedConfig));
			else onStart(updatedConfig, finalQuestions.length ? finalQuestions : buildStructuredInterviewPlan(updatedConfig));
		} catch (err) {
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
				jdText: cfg.jdText
			});
			onStart(cfg, fallbackPlan);
		} finally {
			setAnalyzing(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid items-start gap-8 lg:grid-cols-[1.05fr_1.15fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden rounded-3xl bg-hero p-6 text-navy-foreground shadow-soft sm:p-8 flex flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center gap-2 rounded-full bg-navy-foreground/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-navy-foreground/80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrainCircuit, { className: "h-3.5 w-3.5 text-violet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Automated Technical Screening" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-2xl font-bold leading-tight sm:text-3xl text-balance",
					children: "Meet Tesla, your executive mock interviewer."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2.5 max-w-md text-xs sm:text-sm text-navy-foreground/80 leading-relaxed",
					children: "Practice a realistic campus technical screening interview with Tesla. Respond via voice or text and receive comprehensive performance evaluation."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "my-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						size: 200,
						showStatusBadge: true,
						interviewerName: "Tesla"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full grid grid-cols-3 gap-2.5 text-xs text-navy-foreground/90",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-navy-foreground/10 p-3 flex flex-col items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm font-bold",
								children: "Voice & Text"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-navy-foreground/75",
								children: "Natural Interaction"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-navy-foreground/10 p-3 flex flex-col items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm font-bold",
								children: "Code Sandbox"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-navy-foreground/75",
								children: "Live Problems"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-navy-foreground/10 p-3 flex flex-col items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm font-bold",
								children: "Multilingual"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-navy-foreground/75",
								children: "EN / HI / TE"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 w-full rounded-2xl bg-navy-foreground/10 p-4 text-left border border-white/10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4 text-violet" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interviewer Voice" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handlePreviewVoice,
							disabled: previewingVoice || !ttsSupported(),
							className: "rounded-lg bg-navy-foreground/20 px-2.5 py-1 text-xs font-medium hover:bg-navy-foreground/30 transition flex items-center gap-1.5",
							children: previewingVoice ? "Playing…" : "Test Voice"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] text-navy-foreground/70 block",
							children: "Selected Voice"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium mt-0.5",
							children: voices.find((v) => v.voiceURI === cfg.selectedVoiceURI)?.name || "Natural Indian English Male (System)"
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold font-display",
						children: "Configure Interview Session"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Upload your documents or select target role to begin"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex rounded-xl bg-muted p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("documents"),
							className: cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition", activeTab === "documents" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
							children: "Documents & Presets"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setActiveTab("settings"),
							className: cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition", activeTab === "settings" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
							children: "Role & Voice"
						})]
					})]
				}),
				activeTab === "documents" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider block",
										children: [
											"Placement Role Presets (",
											SAMPLE_PRESETS.length,
											" Roles)"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: "1-click load matching candidate resume and job description"
									})] }), cfg.resumeFileName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 self-start sm:self-auto bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Active: ", cfg.role] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: presetSearch,
											onChange: (e) => setPresetSearch(e.target.value),
											placeholder: "Search presets by role, tech, or skill (e.g., Java, Python, AWS, React, SQL)...",
											className: "w-full rounded-xl border border-input bg-card pl-9 pr-8 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition shadow-2xs"
										}),
										presetSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setPresetSearch(""),
											className: "absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground",
											title: "Clear search",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]",
									children: [
										{
											id: "all",
											label: "All Roles"
										},
										{
											id: "fullstack",
											label: "Full-Stack"
										},
										{
											id: "backend",
											label: "Java"
										},
										{
											id: "python",
											label: "Python"
										},
										{
											id: "aiml",
											label: "AI / ML"
										},
										{
											id: "data",
											label: "Data"
										},
										{
											id: "cloud",
											label: "DevOps"
										},
										{
											id: "qa",
											label: "QA / SDET"
										},
										{
											id: "frontend",
											label: "Frontend"
										}
									].map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setSelectedCategory(cat.id),
										className: cn("rounded-lg px-2.5 py-1 font-medium transition shrink-0", selectedCategory === cat.id ? "bg-primary text-primary-foreground shadow-2xs" : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"),
										children: cat.label
									}, cat.id))
								}),
								filteredPresets.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-2 sm:grid-cols-2 md:grid-cols-3 max-h-56 overflow-y-auto pr-1",
									children: filteredPresets.map((preset) => {
										const isSelected = cfg.resumeFileName === preset.resumeFileName;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleApplyPreset(preset),
											className: cn("flex flex-col text-left rounded-xl border p-2.5 transition text-xs group relative", isSelected ? "border-primary bg-primary/10 shadow-2xs" : "border-border/80 bg-muted/30 hover:border-primary/50 hover:bg-muted/70"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-start justify-between gap-1 w-full",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: cn("font-semibold line-clamp-1 transition", isSelected ? "text-primary" : "text-foreground group-hover:text-primary"),
														children: preset.title.split("(")[0]
													}), isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary shrink-0 mt-0.5" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground mt-0.5 line-clamp-1",
													children: preset.role
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap gap-1 mt-1.5",
													children: [preset.tags.slice(0, 3).map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded bg-muted/80 px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground",
														children: tag
													}, tag)), preset.tags.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[9px] text-muted-foreground/60 self-center",
														children: ["+", preset.tags.length - 3]
													})]
												})
											]
										}, preset.id);
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"No presets match \"",
										presetSearch,
										"\"."
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setPresetSearch("");
											setSelectedCategory("all");
										},
										className: "ml-2 text-primary font-semibold underline hover:opacity-80",
										children: "Clear filters"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs font-semibold text-foreground block mb-1",
							children: "Candidate Name (Optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "e.g. Manideep or leave blank for general candidate",
							value: cfg.name,
							onChange: (e) => update("name", e.target.value),
							className: formFieldStyle
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-3.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold text-foreground uppercase tracking-wider",
											children: "Target Role & Experience Level"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: "Customizable for any role & seniority"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-semibold text-foreground",
											children: "Target Role Title"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "Type any role or choose a suggestion"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											list: "role-suggestions",
											placeholder: "Enter any role (e.g. Full-Stack Developer, Data Engineer, Cybersecurity, iOS...)",
											value: cfg.role,
											onChange: (e) => update("role", e.target.value),
											className: cn(formFieldStyle, "pr-8")
										}), cfg.role && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => update("role", ""),
											className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs",
											title: "Clear role",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("datalist", {
										id: "role-suggestions",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Full-Stack Developer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Frontend Developer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Java Developer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Python Developer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "AI / ML Engineer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Data Analyst" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Data Engineer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Cloud & DevOps Engineer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "QA & SDET Engineer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Cybersecurity Analyst" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Mobile App Developer (Flutter / React Native)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Embedded Systems & C++ Engineer" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Site Reliability Engineer (SRE)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Product Analyst" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Database Administrator (DBA)" })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-1.5 mt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground uppercase tracking-wider font-semibold mr-0.5",
											children: "Popular:"
										}), [
											"Full-Stack",
											"Java",
											"Python",
											"Frontend",
											"AI / ML",
											"Data Analyst",
											"DevOps",
											"QA / SDET",
											"Cybersecurity"
										].map((chip) => {
											const fullRole = chip === "Full-Stack" ? "Full-Stack Developer" : chip === "Java" ? "Java Developer" : chip === "Python" ? "Python Developer" : chip === "Frontend" ? "Frontend Developer" : chip === "AI / ML" ? "AI / ML Engineer" : chip === "Data Analyst" ? "Data Analyst" : chip === "DevOps" ? "Cloud & DevOps Engineer" : chip === "QA / SDET" ? "QA & SDET Engineer" : "Cybersecurity Analyst";
											const isSelected = cfg.role.toLowerCase() === fullRole.toLowerCase();
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => update("role", fullRole),
												className: cn("rounded-lg px-2 py-0.5 text-[10px] font-medium transition", isSelected ? "bg-primary text-primary-foreground font-semibold" : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted"),
												children: chip
											}, chip);
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-foreground",
										children: "Experience Level"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Calibrates question difficulty & expectations"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 sm:grid-cols-5 gap-1.5",
									children: [
										{
											id: "fresher",
											label: "Fresher",
											years: "0–1 yrs",
											desc: "College / Campus"
										},
										{
											id: "junior",
											label: "Junior",
											years: "1–3 yrs",
											desc: "Early career"
										},
										{
											id: "mid",
											label: "Mid-Level",
											years: "3–5 yrs",
											desc: "Independent"
										},
										{
											id: "senior",
											label: "Senior",
											years: "5–8 yrs",
											desc: "Architecture"
										},
										{
											id: "lead",
											label: "Lead / Staff",
											years: "8+ yrs",
											desc: "Leadership"
										}
									].map((lvl) => {
										const isSelected = cfg.level === lvl.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => update("level", lvl.id),
											className: cn("flex flex-col items-center justify-center rounded-xl border p-2 text-center transition", isSelected ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/40 shadow-2xs" : "border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold leading-tight",
												children: lvl.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] opacity-80 mt-0.5",
												children: lvl.years
											})]
										}, lvl.id);
									})
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-dashed border-border p-4 bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold",
											children: "Candidate Resume"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: "(PDF, DOCX, TXT)"
										})
									]
								}), cfg.resumeText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										update("resumeFileName", "");
										update("resumeText", "");
									},
									className: "text-muted-foreground hover:text-destructive transition p-1",
									title: "Remove resume",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							}), cfg.resumeFileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-primary truncate max-w-[240px]",
									children: ["✓ ", cfg.resumeFileName]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "cursor-pointer text-[11px] font-semibold text-primary underline",
									children: ["Replace file", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: ".pdf,.docx,.doc,.txt",
										className: "hidden",
										onChange: handleResumeUpload
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-muted/50 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-muted-foreground mb-1" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: "Upload Resume"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Personalizes questions based on your background and skills"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: ".pdf,.docx,.doc,.txt",
										className: "hidden",
										onChange: handleResumeUpload
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-dashed border-border p-4 bg-muted/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4 text-primary" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold",
											children: "Target Job Description"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: "(PDF, DOCX, TXT)"
										})
									]
								}), cfg.jdText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										update("jdFileName", "");
										update("jdText", "");
									},
									className: "text-muted-foreground hover:text-destructive transition p-1",
									title: "Remove JD",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							}), cfg.jdFileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-3 py-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-primary truncate max-w-[240px]",
									children: ["✓ ", cfg.jdFileName]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "cursor-pointer text-[11px] font-semibold text-primary underline",
									children: ["Replace file", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: ".pdf,.docx,.doc,.txt",
										className: "hidden",
										onChange: handleJdUpload
									})]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-3 flex flex-col items-center justify-center rounded-xl border border-border bg-card p-4 cursor-pointer hover:bg-muted/50 transition",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-muted-foreground mb-1" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: "Upload Target Job Description"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Aligns technical screening questions to target job requirements"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: ".pdf,.docx,.doc,.txt",
										className: "hidden",
										onChange: handleJdUpload
									})
								]
							})]
						}),
						analysisError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl",
							children: analysisError
						})
					]
				}),
				activeTab === "settings" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold block mb-1",
									children: "Target Role Title"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										list: "role-suggestions-settings",
										placeholder: "Enter any role (e.g. Data Engineer, DevOps, Cybersecurity...)",
										value: cfg.role,
										onChange: (e) => update("role", e.target.value),
										className: cn(formFieldStyle, "pr-8")
									}), cfg.role && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => update("role", ""),
										className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs",
										title: "Clear role",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("datalist", {
									id: "role-suggestions-settings",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Full-Stack Developer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Frontend Developer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Java Developer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Python Developer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "AI / ML Engineer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Data Analyst" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Data Engineer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Cloud & DevOps Engineer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "QA & SDET Engineer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Cybersecurity Analyst" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Mobile App Developer (Flutter/React Native)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Embedded Systems & C++ Engineer" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Site Reliability Engineer (SRE)" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "Product Analyst" })
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold block mb-1",
								children: "Experience Level"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: cfg.level,
								onChange: (e) => update("level", e.target.value),
								className: cn(formFieldStyle),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "fresher",
										children: "Fresher / Graduate (0–1 yrs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "junior",
										children: "Junior (1–3 yrs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "mid",
										children: "Mid-Level (3–5 yrs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "senior",
										children: "Senior (5–8 yrs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "lead",
										children: "Lead / Staff / Principal (8+ yrs)"
									})
								]
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs font-semibold block",
							children: ["Interview Evaluation Focus", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: cfg.type,
								onChange: (e) => update("type", e.target.value),
								className: cn(formFieldStyle, "mt-1.5"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "mixed",
									children: "Comprehensive Screening (Technical + Coding + HR)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "technical",
									children: "Technical Only (Omits HR Stage)"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold block mb-1.5",
							children: "Interview Language"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-3 gap-2",
							children: Object.keys(LANG_NAMES).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => update("lang", l),
								className: cn("rounded-xl border px-3 py-2 text-xs font-semibold transition", cfg.lang === l ? "border-violet bg-violet/10 text-violet" : "border-border hover:bg-muted text-muted-foreground"),
								children: LANG_NAMES[l].split(" (")[0]
							}, l))
						})] }),
						ttsSupported() && voices.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold block mb-1",
								children: "Browser Text-to-Speech Voice (Natural Male Preferred)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: cfg.selectedVoiceURI,
								onChange: (e) => update("selectedVoiceURI", e.target.value),
								className: cn(formFieldStyle, "text-xs"),
								children: voices.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: v.voiceURI,
									children: [
										v.name,
										" (",
										v.lang,
										")"
									]
								}, v.voiceURI))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-1",
								children: "Default prioritizes Indian English (en-IN) natural male voices when available."
							})
						] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleBeginInterview,
					disabled: analyzing,
					className: "w-full rounded-2xl bg-primary py-3.5 px-6 font-display text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50",
					children: analyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Analyzing Documents & Calibrating Screening Stages…" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Start Technical Screening with Tesla" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })] })
				})
			]
		})]
	});
}
function LiveInterviewView({ session, onAnswer, onEndInterview }) {
	const { config, questions, index } = session;
	const currentQ = questions[index];
	const [avatarState, setAvatarState] = (0, import_react.useState)("idle");
	const [activeInputMode, setActiveInputMode] = (0, import_react.useState)("voice");
	const [candidateAnswer, setCandidateAnswer] = (0, import_react.useState)("");
	const [codeAnswer, setCodeAnswer] = (0, import_react.useState)(currentQ?.starterCode || "");
	const [interimTranscript, setInterimTranscript] = (0, import_react.useState)("");
	const [listening, setListening] = (0, import_react.useState)(false);
	const [micError, setMicError] = (0, import_react.useState)("");
	const [evaluating, setEvaluating] = (0, import_react.useState)(false);
	const recognizerRef = (0, import_react.useRef)(null);
	const startTimeRef = (0, import_react.useRef)(Date.now());
	const stt = (0, import_react.useMemo)(() => sttSupported(), []);
	const localizedQuestionText = (0, import_react.useMemo)(() => {
		if (!currentQ) return "";
		if (config.lang === "hi" && currentQ.hindiText) return currentQ.hindiText;
		if (config.lang === "te" && currentQ.teluguText) return currentQ.teluguText;
		return currentQ.text;
	}, [currentQ, config.lang]);
	const localizedTransitionIntro = (0, import_react.useMemo)(() => {
		if (!currentQ) return "";
		if (config.lang === "hi" && currentQ.hindiTransitionIntro) return currentQ.hindiTransitionIntro;
		if (config.lang === "te" && currentQ.teluguTransitionIntro) return currentQ.teluguTransitionIntro;
		return currentQ.transitionIntro || "";
	}, [currentQ, config.lang]);
	const speakCurrentQuestion = () => {
		if (!currentQ || !ttsSupported()) return;
		speak(localizedTransitionIntro ? `${localizedTransitionIntro} ${localizedQuestionText}` : localizedQuestionText, getLocaleCode(config.lang), {
			voiceURI: config.selectedVoiceURI,
			rate: config.speechRate,
			onStart: () => setAvatarState("speaking"),
			onEnd: () => setAvatarState("idle"),
			onError: () => setAvatarState("idle")
		});
	};
	(0, import_react.useEffect)(() => {
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
	if (!currentQ) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "text-center py-16 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground text-sm",
			children: "All screening stages completed."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: onEndInterview,
			className: "rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground",
			children: "View Comprehensive Report →"
		})]
	});
	const handleToggleMic = () => {
		setMicError("");
		if (listening) {
			recognizerRef.current?.stop();
			setListening(false);
			setAvatarState("idle");
			return;
		}
		stopSpeaking();
		setAvatarState("listening");
		try {
			const rec = createRecognizer(getLocaleCode(config.lang), {
				onFinalChunk: (finalText) => {
					setCandidateAnswer((prev) => prev ? `${prev.trim()} ${finalText.trim()}` : finalText.trim());
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
				}
			});
			recognizerRef.current = rec;
			rec.start();
			setListening(true);
		} catch {
			setMicError("Microphone could not be started in this browser. Please type your response.");
			setAvatarState("idle");
		}
	};
	const handleSubmitAnswer = async (skip = false, forceEnd = false) => {
		recognizerRef.current?.abort();
		stopSpeaking();
		setListening(false);
		setAvatarState("thinking");
		setEvaluating(true);
		const verbalAnswer = skip ? "" : candidateAnswer.trim();
		const combinedAnswer = currentQ.isCodingChallenge && codeAnswer.trim() ? `CODE IMPLEMENTATION:\n\`\`\`${currentQ.codingLanguage || "text"}\n${codeAnswer.trim()}\n\`\`\`\n\nVERBAL EXPLANATION:\n${verbalAnswer || "Candidate submitted code without separate verbal notes."}` : verbalAnswer;
		const timeSpent = Math.max(5, Math.round((Date.now() - startTimeRef.current) / 1e3));
		try {
			const response = await fetch("/api/interview/evaluate-response", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					question: currentQ.text,
					answer: combinedAnswer,
					contextWhyAsked: currentQ.contextWhyAsked,
					expectedKeywords: currentQ.expectedKeywords,
					lang: config.lang
				})
			});
			if (!response.ok) throw new Error("Evaluation endpoint failed");
			const evalData = await response.json();
			const detailedEval = {
				score: evalData.score ?? 5,
				metrics: evalData.metrics ?? {
					technicalKnowledge: 5,
					communication: 5,
					problemSolving: 5,
					jdRelevance: 5
				},
				strengths: evalData.strengths ?? ["Addressed question."],
				areasToImprove: evalData.areasToImprove ?? ["Expand on concepts."],
				coachingFeedback: evalData.coachingFeedback ?? "Solid effort.",
				sampleModelAnswer: evalData.sampleModelAnswer ?? "Structured example."
			};
			onAnswer({
				qid: currentQ.id,
				stageNumber: currentQ.stageNumber,
				category: currentQ.category,
				questionText: localizedQuestionText,
				answer: combinedAnswer,
				codeSnippet: currentQ.isCodingChallenge ? codeAnswer : void 0,
				evaluation: detailedEval,
				timeSpentSec: timeSpent
			}, forceEnd);
		} catch {
			const localEval = evaluate({
				id: currentQ.id,
				role: "general",
				level: "fresher",
				type: "technical",
				category: "technical",
				question: currentQ.text,
				keywords: currentQ.expectedKeywords,
				tip: currentQ.tip,
				minWords: 20
			}, combinedAnswer);
			onAnswer({
				qid: currentQ.id,
				stageNumber: currentQ.stageNumber,
				category: currentQ.category,
				questionText: localizedQuestionText,
				answer: combinedAnswer,
				codeSnippet: currentQ.isCodingChallenge ? codeAnswer : void 0,
				evaluation: {
					score: localEval.score,
					metrics: {
						technicalKnowledge: localEval.score,
						communication: Math.min(10, Math.round(combinedAnswer.split(/\s+/).length / 4)),
						problemSolving: 6,
						jdRelevance: localEval.score
					},
					strengths: ["Attempted response under practice conditions."],
					areasToImprove: ["Incorporate more concrete examples and STAR framework."],
					coachingFeedback: localEval.feedback,
					sampleModelAnswer: currentQ.tip
				},
				timeSpentSec: timeSpent
			}, forceEnd);
		} finally {
			setEvaluating(false);
			setAvatarState("idle");
		}
	};
	const progressPercent = Math.round((index + 1) / questions.length * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageProgressIndicator, {
			currentStage: currentQ.stage,
			interviewType: config.type,
			currentIndex: index,
			totalQuestions: questions.length,
			isCodingChallenge: currentQ.isCodingChallenge
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[340px_1fr] items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "rounded-3xl bg-hero p-6 text-navy-foreground shadow-soft flex flex-col items-center border border-white/10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full flex items-center justify-between text-xs text-navy-foreground/75 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold uppercase tracking-wider text-[11px]",
							children: "Live Interview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono tabular-nums",
							children: [
								index + 1,
								" of ",
								questions.length
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						size: 200,
						state: avatarState,
						showStatusBadge: true,
						interviewerName: "Tesla"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 w-full text-xs text-navy-foreground/80 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Screening Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono font-bold",
									children: [progressPercent, "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 w-full rounded-full bg-navy-foreground/15 overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-emerald-400 transition-all duration-300",
									style: { width: `${progressPercent}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between pt-1",
								children: questions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									title: `Question ${i + 1}`,
									className: cn("h-1.5 rounded-full transition-all duration-300", i === index ? "w-4 bg-emerald-400" : i < index ? "w-2 bg-emerald-400/70" : "w-2 bg-navy-foreground/20")
								}, q.id))
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 w-full pt-4 border-t border-white/10 flex flex-col gap-1.5 text-xs text-navy-foreground/75",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-navy-foreground/60",
									children: "Target Role:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium truncate max-w-[170px]",
									children: config.role
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-navy-foreground/60",
									children: "Language:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: LANG_NAMES[config.lang]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-navy-foreground/60",
									children: "Privacy:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-emerald-400",
									children: "Local Client Audio"
								})]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 mb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-lg",
							children: [
								"Question ",
								index + 1,
								" of ",
								questions.length
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: speakCurrentQuestion,
							disabled: avatarState === "speaking" || !ttsSupported(),
							className: "text-xs font-semibold text-muted-foreground hover:text-foreground transition flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Repeat Tesla's Question" })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl sm:text-2xl font-bold leading-snug font-display text-foreground",
						children: localizedQuestionText
					}, currentQ.id)] }),
					currentQ.isCodingChallenge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-muted/30 p-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border/80 pb-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeXml, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold uppercase tracking-wider",
										children: [
											"Live Coding / SQL Workspace (",
											currentQ.codingLanguage?.toUpperCase() || "CODE",
											")"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-mono text-muted-foreground",
									children: "Type code solution below"
								})]
							}),
							currentQ.sampleInputOutput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl bg-card p-2.5 border border-border/60 text-[11px] font-mono text-muted-foreground whitespace-pre-wrap",
								children: currentQ.sampleInputOutput
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 8,
								value: codeAnswer,
								onChange: (e) => setCodeAnswer(e.target.value),
								placeholder: "Write your code or SQL query solution here...",
								className: cn(formFieldStyle, "font-mono text-xs leading-relaxed bg-slate-950 text-emerald-400 border-slate-800 resize-y"),
								spellCheck: false
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-foreground",
								children: currentQ.isCodingChallenge ? "Candidate Verbal Explanation & Approach" : "Candidate Response (Microphone or Type)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex rounded-lg bg-muted p-0.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveInputMode("voice"),
									className: cn("rounded-md px-2.5 py-1 font-medium transition", activeInputMode === "voice" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
									children: "Microphone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setActiveInputMode("text"),
									className: cn("rounded-md px-2.5 py-1 font-medium transition", activeInputMode === "text" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"),
									children: "Type Answer"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: 4,
							value: candidateAnswer + (interimTranscript ? ` ${interimTranscript}` : ""),
							onChange: (e) => setCandidateAnswer(e.target.value),
							placeholder: activeInputMode === "voice" ? currentQ.isCodingChallenge ? "Click 'Start Speaking' to verbally explain your time complexity and algorithm, or type notes here…" : "Click 'Start Speaking' below to answer with your microphone, or type your response directly…" : "Type your structured answer here (using clear points or the STAR method)…",
							className: cn(formFieldStyle, "resize-y leading-relaxed font-sans", listening && "ring-2 ring-emerald-500 border-emerald-500/50")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1.5 flex items-center justify-between text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0, " words"] }), listening && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-emerald-500 font-semibold animate-pulse flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-emerald-500" }), "Listening attentively…"]
							})]
						}),
						micError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 rounded-xl bg-destructive/10 border border-destructive/20 p-2.5 text-xs text-destructive",
							children: micError
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [stt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleToggleMic,
								disabled: evaluating,
								className: cn("rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs transition flex items-center gap-2", listening ? "bg-destructive text-destructive-foreground hover:opacity-90" : "bg-emerald-600 text-white hover:bg-emerald-700"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: cn("h-4 w-4", listening && "animate-pulse") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: listening ? "Stop Recording" : "Start Speaking" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleSubmitAnswer(true),
								disabled: evaluating,
								className: "rounded-xl border border-border px-3.5 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted transition",
								children: "Skip Stage"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleSubmitAnswer(false),
								disabled: evaluating || !candidateAnswer.trim() && !interimTranscript && (!currentQ.isCodingChallenge || !codeAnswer.trim()),
								className: "rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-soft hover:opacity-90 transition disabled:opacity-40 flex items-center gap-1.5",
								children: evaluating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Evaluating Answer…" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: index + 1 === questions.length ? "Complete Screening & View Report" : "Submit Answer →" }) })
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-center pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								if (candidateAnswer.trim() || currentQ.isCodingChallenge && codeAnswer.trim()) handleSubmitAnswer(false, true);
								else onEndInterview();
							},
							className: "text-xs text-muted-foreground hover:text-destructive underline-offset-4 hover:underline transition",
							children: "Conclude interview early and generate report"
						})
					})
				]
			})]
		})]
	});
}
function ReportView({ session, onRestart, onRetry }) {
	const { responses, config, questions } = session;
	const answeredCount = responses.filter((r) => r.answer.trim().length > 0).length;
	const totalScore = responses.reduce((acc, r) => acc + r.evaluation.score, 0);
	const overallScore = responses.length ? Math.round(totalScore / responses.length * 10) / 10 : 0;
	const avgTechnical = Math.round(responses.reduce((acc, r) => acc + r.evaluation.metrics.technicalKnowledge, 0) / Math.max(1, responses.length) * 10) / 10;
	const avgCommunication = Math.round(responses.reduce((acc, r) => acc + r.evaluation.metrics.communication, 0) / Math.max(1, responses.length) * 10) / 10;
	const avgProblemSolving = Math.round(responses.reduce((acc, r) => acc + r.evaluation.metrics.problemSolving, 0) / Math.max(1, responses.length) * 10) / 10;
	const avgJdRelevance = Math.round(responses.reduce((acc, r) => acc + r.evaluation.metrics.jdRelevance, 0) / Math.max(1, responses.length) * 10) / 10;
	const verdict = overallScore >= 8 ? "Outstanding Screening Readiness" : overallScore >= 6.5 ? "Placement Ready with Refinements" : overallScore >= 5 ? "Developing Technical Foundations" : "Needs Focused Preparation";
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
			...responses.map((r, i) => [
				`\n[STAGE ${r.stageNumber ?? i + 1} - ${r.category.toUpperCase()}]`,
				`Question: ${r.questionText}`,
				`Candidate Answer: ${r.answer || "(Skipped)"}`,
				`Score: ${r.evaluation.score} / 10`,
				`Feedback: ${r.evaluation.coachingFeedback}`,
				`Recommended Answer Model: ${r.evaluation.sampleModelAnswer}`,
				"-----------------------------------------------------------"
			]).flat(),
			"",
			"DISCLAIMER: This report is an educational mock interview simulation inspired by campus automated screening patterns. It is an independent practice tool and does not represent an official corporate hiring decision or endorse proprietary vendor metrics."
		];
		const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `InterviewMate-Screening-Report-${Date.now()}.txt`;
		a.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "print-card rounded-3xl bg-hero p-6 text-navy-foreground shadow-soft sm:p-8 grid gap-6 sm:grid-cols-[auto_1fr] items-center border border-white/10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center rounded-2xl bg-navy-foreground/10 p-5 h-36 w-36 border border-white/10 mx-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-4xl font-extrabold",
						children: overallScore
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-navy-foreground/70 mt-1",
						children: "out of 10"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-center sm:text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-1.5 rounded-full bg-navy-foreground/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy-foreground/80",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3.5 w-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Automated Technical Screening Report" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "text-2xl sm:text-3xl font-bold font-display",
							children: [verdict, config.name ? `, ${config.name}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs sm:text-sm text-navy-foreground/80 leading-relaxed",
							children: [
								config.role,
								" · ",
								config.level.toUpperCase(),
								" · ",
								LANG_NAMES[config.lang],
								" ·",
								" ",
								answeredCount,
								"/",
								questions.length,
								" Stages Completed"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "no-print pt-3 flex flex-wrap gap-2 justify-center sm:justify-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => window.print(),
									className: "rounded-xl bg-navy-foreground px-4 py-2 text-xs font-semibold text-navy hover:opacity-90 transition flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Print / Save PDF" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleDownloadReport,
									className: "rounded-xl border border-navy-foreground/30 px-4 py-2 text-xs font-semibold hover:bg-navy-foreground/10 transition flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download Report (.txt)" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: onRetry,
									className: "rounded-xl border border-navy-foreground/30 px-4 py-2 text-xs font-semibold hover:bg-navy-foreground/10 transition",
									children: "Practice Again"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: onRestart,
									className: "rounded-xl px-3 py-2 text-xs font-medium text-navy-foreground/70 hover:underline",
									children: "Clear & Restart"
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-4",
				children: [
					{
						label: "Technical Knowledge",
						val: avgTechnical,
						desc: "Accuracy & depth of technical concepts & code"
					},
					{
						label: "Communication",
						val: avgCommunication,
						desc: "Clarity, conciseness, and articulation"
					},
					{
						label: "Problem Solving",
						val: avgProblemSolving,
						desc: "Algorithmic logic & diagnostic reasoning"
					},
					{
						label: "JD Relevance",
						val: avgJdRelevance,
						desc: "Alignment with job requirements"
					}
				].map((metric) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-4 shadow-xs space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold text-muted-foreground block truncate",
							children: metric.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-2xl font-bold",
								children: metric.val
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "/ 10"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground leading-tight",
							children: metric.desc
						})
					]
				}, metric.label))
			}),
			config.analysis && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border bg-card p-5 shadow-xs space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-bold uppercase tracking-wider text-foreground",
						children: "Resume-to-JD Skill Alignment Matrix"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-emerald-500 block mb-1",
								children: [
									"Matched Strengths (",
									config.analysis.matchedSkills.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground text-[11px] leading-relaxed",
								children: config.analysis.matchedSkills.join(", ") || "Foundational concepts aligned"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-amber-500/10 border border-amber-500/20 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-amber-500 block mb-1",
								children: [
									"Candidate Skills (",
									config.analysis.candidateSkills.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground text-[11px] leading-relaxed",
								children: config.analysis.candidateSkills.join(", ") || "Software development basics"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-violet/10 border border-violet/20 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-violet block mb-1",
								children: [
									"JD Growth Areas (",
									config.analysis.gapSkills.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground text-[11px] leading-relaxed",
								children: config.analysis.gapSkills.join(", ") || "Advanced system scalability"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-base font-bold font-display",
					children: "Stage-by-Stage Performance & Coaching Breakdown"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: responses.map((resp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-muted/20 p-5 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 border-b border-border/80 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded-lg bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary",
										children: [
											"Stage ",
											resp.stageNumber ?? i + 1,
											" · ",
											resp.category.replace("_", " ")
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [
											"Time: ",
											resp.timeSpentSec,
											"s"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 font-display text-sm font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Score:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: cn(resp.evaluation.score >= 7.5 ? "text-emerald-500" : resp.evaluation.score >= 5.5 ? "text-amber-500" : "text-rose-500"),
										children: [resp.evaluation.score, " / 10"]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-foreground",
								children: resp.questionText
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 rounded-xl bg-card p-3 border border-border text-xs text-muted-foreground space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-bold uppercase tracking-wider text-foreground block",
									children: "Candidate Response:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "whitespace-pre-wrap leading-relaxed",
									children: resp.answer || "(No response recorded)"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-2 text-xs pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-card p-3 border border-border/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-emerald-500 block mb-1",
										children: "✓ Identified Strengths"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "list-disc list-inside text-muted-foreground text-[11px] space-y-0.5",
										children: resp.evaluation.strengths.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: s }, idx))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-card p-3 border border-border/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-amber-500 block mb-1",
										children: "↗ Coaching Recommendation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground text-[11px] leading-relaxed",
										children: resp.evaluation.coachingFeedback
									})]
								})]
							})
						]
					}, resp.qid || i))
				})]
			})
		]
	});
}
//#endregion
export { App as component };
