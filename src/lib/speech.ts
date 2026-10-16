export const ttsSupported = (): boolean =>
  typeof window !== "undefined" && "speechSynthesis" in window;

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

export const sttSupported = (): boolean => {
  if (typeof window === "undefined") return false;
  const win = window as SpeechRecognitionWindow;
  return !!(win.SpeechRecognition || win.webkitSpeechRecognition);
};

export type VoiceGender = "male" | "female" | "unknown";

export interface EnrichedVoice {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  voiceURI: string;
  gender: VoiceGender;
  isRecommendedMale: boolean;
  isNaturalHD: boolean;
  isRegionalMatch: boolean;
  score: number;
}

/**
 * Known male voice names across Google, Microsoft, Apple, Android, and Web synthesizers
 */
const MALE_VOICE_KEYWORDS = [
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
  "natural (male)",
];

/**
 * Female voice names to distinguish gender
 */
const FEMALE_VOICE_KEYWORDS = [
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
  "natural (female)",
];

/**
 * Detects voice gender based on voice name and URI
 */
export function getVoiceGender(voice: SpeechSynthesisVoice): VoiceGender {
  const label = `${voice.name} ${voice.voiceURI}`.toLowerCase();

  for (const femaleName of FEMALE_VOICE_KEYWORDS) {
    if (label.includes(femaleName)) return "female";
  }

  for (const maleName of MALE_VOICE_KEYWORDS) {
    if (label.includes(maleName)) return "male";
  }

  return "unknown";
}

/**
 * Detects if a voice is a high-fidelity Neural / Natural HD browser voice
 */
export function isNaturalVoice(voice: SpeechSynthesisVoice): boolean {
  const label = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  return (
    label.includes("natural") ||
    label.includes("online") ||
    label.includes("neural") ||
    label.includes("enhanced") ||
    label.includes("google") ||
    label.includes("premium") ||
    label.includes("studio")
  );
}

/**
 * Returns all currently loaded browser voices
 */
export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!ttsSupported()) return [];
  return window.speechSynthesis.getVoices() || [];
}

/**
 * Normalizes language codes like "en", "hi", "te" to regional browser tags
 */
export function getLocaleCode(lang: string): string {
  switch (lang) {
    case "hi":
      return "hi-IN";
    case "te":
      return "te-IN";
    case "en":
    default:
      return "en-IN";
  }
}

/**
 * Calculates a quality score for an available voice.
 * Prioritizes high-fidelity Natural / Neural voices over robotic legacy local synthesizers.
 */
function scoreVoice(voice: SpeechSynthesisVoice, targetLocale: string, baseLang: string): number {
  const vName = voice.name.toLowerCase();
  const vLang = voice.lang.replace("_", "-").toLowerCase();
  const isMale = getVoiceGender(voice) === "male";
  const isNatural = isNaturalVoice(voice);

  let score = 0;

  // Heavily penalize robotic local engines (eSpeak, archaic SAPI voices)
  if (vName.includes("espeak") || vName.includes("speech-dispatcher")) {
    return -1000;
  }

  // High bonus for modern neural / natural cloud voices
  if (vName.includes("online (natural)")) score += 1200;
  else if (vName.includes("natural")) score += 1000;
  else if (vName.includes("neural")) score += 900;
  else if (vName.includes("enhanced")) score += 750;
  else if (vName.includes("google")) score += 600;

  // Language & Regional matching
  if (vLang === targetLocale) {
    score += 500;
  } else if (vLang.startsWith(baseLang)) {
    score += 300;
  } else if (baseLang === "en" && vLang.startsWith("en")) {
    score += 200;
  }

  // Interviewer gender preference (Tesla virtual interviewer)
  if (isMale) {
    score += 250;
  }

  // Browser default voice bonus
  if (voice.default) {
    score += 50;
  }

  return score;
}

/**
 * Returns enriched list of available browser voices sorted by natural quality
 */
export function getEnrichedVoices(currentLang: string): EnrichedVoice[] {
  const voices = getAvailableVoices();
  const targetLocale = getLocaleCode(currentLang).toLowerCase();
  const baseLang = currentLang.toLowerCase();

  const enriched = voices.map((v) => {
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
      score,
    };
  });

  // Sort best quality first
  return enriched.sort((a, b) => b.score - a.score);
}

/**
 * Picks the highest-fidelity natural voice for the target language.
 * Avoids robotic synthesizers and prioritizes Natural / Neural voices.
 */
export function pickRecommendedVoice(
  langCode: string,
  specificVoiceURI?: string,
): { voice: SpeechSynthesisVoice | undefined; isConfirmedMale: boolean; note?: string } {
  if (!ttsSupported()) return { voice: undefined, isConfirmedMale: false };
  const voices = getAvailableVoices();
  if (!voices.length) return { voice: undefined, isConfirmedMale: false };

  // 1. If user previously selected a specific voice, use that
  if (specificVoiceURI) {
    const selected = voices.find((v) => v.voiceURI === specificVoiceURI);
    if (selected) {
      return {
        voice: selected,
        isConfirmedMale: getVoiceGender(selected) === "male",
      };
    }
  }

  const baseLang = langCode.split("-")[0]?.toLowerCase() ?? langCode.toLowerCase();
  const ranked = getEnrichedVoices(baseLang);

  if (ranked.length > 0 && ranked[0].score > -500) {
    const best = ranked[0];
    return {
      voice: best.voice,
      isConfirmedMale: best.gender === "male",
      note: best.isNaturalHD ? `Using Natural HD Voice (${best.name})` : undefined,
    };
  }

  const fallback = voices[0];
  return {
    voice: fallback,
    isConfirmedMale: fallback ? getVoiceGender(fallback) === "male" : false,
  };
}

export function hasVoiceFor(langCode: string): boolean {
  if (!ttsSupported()) return false;
  const voices = getAvailableVoices();
  const base = langCode.split("-")[0]?.toLowerCase() ?? langCode.toLowerCase();
  return voices.some((v) => v.lang.toLowerCase().replace("_", "-").startsWith(base));
}

/**
 * Session tracking to guarantee previous speech is instantly cancelled
 * and cannot resurrect or duplicate sentences.
 */
let activeSpeechSession = 0;
let keepAliveTimer: number | null = null;

/**
 * Cleans raw question text to produce human, natural-sounding speech
 * without markdown symbols, raw brackets, or repetitive filler.
 */
export function sanitizeSpeechText(text: string): string {
  if (!text) return "";

  return (
    text
      // Remove code blocks and inline code markers
      .replace(/```[\s\S]*?```/g, " [coding problem displayed on screen] ")
      .replace(/`([^`]+)`/g, "$1")
      // Remove markdown headings, bold, italics, links
      .replace(/[*_#~[\]]/g, "")
      .replace(/\(http[^)]+\)/g, "")
      // Convert common technical acronyms and symbols into natural spoken phrases
      .replace(/\bAPI\b/g, "A P I")
      .replace(/\bSQL\b/g, "S Q L")
      .replace(/\bRESTful\b/g, "REST-ful")
      .replace(/\bUI\b/g, "U I")
      .replace(/\bUX\b/g, "U X")
      .replace(/\bAI\b/g, "A I")
      .replace(/\bML\b/g, "M L")
      .replace(/\bvs\.?\b/gi, "versus")
      .replace(/\be\.g\.,?\b/gi, "for example,")
      .replace(/\bi\.e\.,?\b/gi, "that is,")
      .replace(/\betc\.\b/gi, "and so on")
      .replace(/&/g, " and ")
      .replace(/\+/g, " plus ")
      // Clean up whitespace
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Speaks text using the browser's native SpeechSynthesis API.
 * Uses a single cohesive utterance with natural prosody, pitch, and speed.
 * Uses strict session tracking to prevent duplicate or overlapping speech.
 */
export function speak(
  text: string,
  langCode: string,
  options: {
    voiceURI?: string;
    rate?: number;
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: string) => void;
  } = {},
) {
  if (!ttsSupported()) {
    options.onEnd?.();
    return;
  }

  const synth = window.speechSynthesis;

  // 1. Immediately cancel active speech and invalidate old sessions
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

  // 2. Select high-quality natural voice
  const voiceResult = pickRecommendedVoice(langCode, options.voiceURI);
  const voice = voiceResult.voice;

  // Natural human conversational defaults:
  // Rate: 1.0 (smooth, confident pace, not robotic dragging)
  // Pitch: 1.0 (natural human vocal pitch, not lowered monotone drone)
  const speechRate = Math.max(0.85, Math.min(1.2, options.rate ?? 1.0));
  const speechPitch = Math.max(0.9, Math.min(1.1, options.pitch ?? 1.0));

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
    if (e.error !== "interrupted" && e.error !== "canceled") {
      options.onError?.(`Speech issue: ${e.error}`);
    }
    options.onEnd?.();
  };

  // Chrome on desktop has a known bug where speech > 15s can pause unexpectedly.
  // This lightweight interval keeps the synthesis active without interrupting audio.
  keepAliveTimer = window.setInterval(() => {
    if (sessionId !== activeSpeechSession) {
      if (keepAliveTimer) clearInterval(keepAliveTimer);
      return;
    }
    if (synth.speaking && !synth.paused) {
      synth.pause();
      synth.resume();
    }
  }, 10000);

  // Short microtask delay before speak ensures previous cancellation completed in browser
  setTimeout(() => {
    if (sessionId === activeSpeechSession) {
      synth.speak(utterance);
    }
  }, 20);
}

/**
 * Speaks an audition sample of the selected voice so candidate can verify tone and cadence
 */
export function playVoiceSample(
  voiceURI: string,
  lang: string,
  rate = 1.0,
  pitch = 1.0,
  callbacks?: { onStart?: () => void; onEnd?: () => void },
) {
  const samplePhrase =
    lang === "hi"
      ? "नमस्ते, मैं टेस्ला हूँ। मैं आज आपका वर्चुअल साक्षात्कारकर्ता रहूँगा। चलिए शुरू करते हैं।"
      : lang === "te"
        ? "నమస్కారం, నేను టెస్లా. నేను ఈ రోజు మీ వర్చువల్ ఇంటర్వ్యూవర్‌గా ఉంటాను. ప్రారంభిద్దాం."
        : "Hello, I am Tesla. I will be your virtual AI interviewer today. I look forward to exploring your background and technical projects.";

  speak(samplePhrase, getLocaleCode(lang), {
    voiceURI,
    rate,
    pitch,
    onStart: callbacks?.onStart,
    onEnd: callbacks?.onEnd,
    onError: callbacks?.onEnd,
  });
}

/**
 * Immediately terminates all active browser speech synthesis
 */
export function stopSpeaking() {
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
export function createRecognizer(
  langCode: string,
  handlers: {
    onFinalChunk: (finalText: string) => void;
    onInterimChunk: (interimText: string) => void;
    onEnd: () => void;
    onError: (msg: string) => void;
  },
) {
  const win = typeof window !== "undefined" ? (window as SpeechRecognitionWindow) : {};
  const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

  if (!SpeechRec) {
    throw new Error("Speech recognition is not supported in this browser.");
  }

  const rec = new SpeechRec();
  rec.lang = langCode;
  rec.continuous = true;
  rec.interimResults = true;
  rec.maxAlternatives = 1;

  rec.onresult = (e: SpeechRecognitionEventLike) => {
    let finalAccum = "";
    let interimAccum = "";

    for (let i = e.resultIndex; i < e.results.length; i++) {
      const result = e.results[i];
      const text = result?.[0]?.transcript ?? "";
      if (result.isFinal) {
        finalAccum += text + " ";
      } else {
        interimAccum += text;
      }
    }

    if (finalAccum) {
      handlers.onFinalChunk(finalAccum);
    }
    handlers.onInterimChunk(interimAccum);
  };

  rec.onerror = (e: SpeechRecognitionErrorEventLike) => {
    const errorMap: Record<string, string> = {
      "not-allowed":
        "Microphone access was denied. Please allow microphone permissions in your browser or switch to the 'Type Answer' tab.",
      "no-speech":
        "No speech was detected. Please speak closer to your microphone or type your response.",
      network: "Speech recognition service encountered a network glitch. Please type your answer.",
      "language-not-supported":
        "This language is not supported for voice recognition in your browser. Please type your response.",
      "audio-capture": "No microphone found or device is busy in another program.",
    };
    handlers.onError(errorMap[e.error] ?? `Voice input notification: ${e.error}`);
  };

  rec.onend = () => {
    handlers.onEnd();
  };

  return rec as { start: () => void; stop: () => void; abort: () => void };
}
