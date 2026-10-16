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
  isRegionalMatch: boolean;
}

/**
 * Known male voice names across Google, Microsoft, Apple, Android, and Linux synthesizers
 */
const MALE_VOICE_KEYWORDS = [
  "male",
  "rishi",
  "ravi",
  "pradeep",
  "madhur",
  "hemant",
  "mohan",
  "chaitanya",
  "david",
  "mark",
  "george",
  "daniel",
  "guy",
  "james",
  "alex",
  "fred",
  "brian",
  "arthur",
  "thomas",
  "paul",
  "tom",
  "jack",
  "william",
  "richard",
  "anthony",
  "alvaro",
  "jorge",
  "diego",
  "nils",
  "stefan",
  "martin",
  "tarik",
  "natural (male)",
  "online (natural) - english",
];

/**
 * Known female voice names to strictly exclude from male selection
 */
const FEMALE_VOICE_KEYWORDS = [
  "female",
  "aditi",
  "kalpana",
  "veena",
  "neerja",
  "sangeeta",
  "swara",
  "zira",
  "samantha",
  "victoria",
  "karen",
  "moira",
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
  "cathy",
  "elena",
  "luciana",
  "yuri",
  "kyoko",
  "tingting",
  "sinji",
  "natural (female)",
];

/**
 * Detects voice gender based on browser voice metadata and known name registries
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
 * Returns all currently loaded browser voices, handling async loading
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
 * Returns enriched list of available browser voices with gender & recommendation metadata
 */
export function getEnrichedVoices(currentLang: string): EnrichedVoice[] {
  const voices = getAvailableVoices();
  const targetLocale = getLocaleCode(currentLang).toLowerCase();
  const baseLang = currentLang.toLowerCase();

  return voices.map((v) => {
    const vLang = v.lang.replace("_", "-").toLowerCase();
    const gender = getVoiceGender(v);
    const isRegionalMatch = vLang === targetLocale || vLang.startsWith(baseLang);
    const isMale = gender === "male";

    return {
      voice: v,
      name: v.name,
      lang: v.lang,
      voiceURI: v.voiceURI,
      gender,
      isRecommendedMale: isMale && isRegionalMatch,
      isRegionalMatch,
    };
  });
}

/**
 * Picks the best available male voice for the selected language
 */
export function pickRecommendedVoice(
  langCode: string,
  specificVoiceURI?: string,
): { voice: SpeechSynthesisVoice | undefined; isConfirmedMale: boolean; note?: string } {
  if (!ttsSupported()) return { voice: undefined, isConfirmedMale: false };
  const voices = getAvailableVoices();
  if (!voices.length) return { voice: undefined, isConfirmedMale: false };

  // 1. If user previously chose a specific voice, respect it
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
  const targetLocale = langCode.replace("_", "-").toLowerCase();

  // 2. Look for exact locale male voice (e.g. en-IN male)
  const exactLocaleVoices = voices.filter(
    (v) => v.lang.replace("_", "-").toLowerCase() === targetLocale,
  );
  const exactMale = exactLocaleVoices.find((v) => getVoiceGender(v) === "male");
  if (exactMale) {
    return { voice: exactMale, isConfirmedMale: true };
  }

  // 3. Look for base language male voice (e.g. any English male for en-IN, or any Hindi male)
  const baseLangVoices = voices.filter((v) =>
    v.lang.toLowerCase().replace("_", "-").startsWith(baseLang),
  );
  const baseMale = baseLangVoices.find((v) => getVoiceGender(v) === "male");
  if (baseMale) {
    return {
      voice: baseMale,
      isConfirmedMale: true,
      note: `Using natural male voice (${baseMale.name}).`,
    };
  }

  // 4. For Indian English or regional Indian languages, fallback to high-quality general English male voice
  if (baseLang === "en") {
    const anyEnglishMale = voices.find(
      (v) => v.lang.toLowerCase().startsWith("en") && getVoiceGender(v) === "male",
    );
    if (anyEnglishMale) {
      return {
        voice: anyEnglishMale,
        isConfirmedMale: true,
        note: `Using clear English male voice (${anyEnglishMale.name}).`,
      };
    }
  }

  // 5. Fallback: non-female voice or first available voice in language
  const nonFemaleInLocale = exactLocaleVoices.find((v) => getVoiceGender(v) !== "female");
  if (nonFemaleInLocale) {
    return {
      voice: nonFemaleInLocale,
      isConfirmedMale: false,
      note: `Selected default voice for ${langCode}. You can adjust pitch/rate or choose another voice.`,
    };
  }

  const fallback = baseLangVoices[0] ?? voices[0];
  return {
    voice: fallback,
    isConfirmedMale: fallback ? getVoiceGender(fallback) === "male" : false,
    note: `Using system default voice (${fallback?.name ?? "Default"}).`,
  };
}

export function hasVoiceFor(langCode: string): boolean {
  if (!ttsSupported()) return false;
  const voices = getAvailableVoices();
  const base = langCode.split("-")[0]?.toLowerCase() ?? langCode.toLowerCase();
  return voices.some((v) => v.lang.toLowerCase().replace("_", "-").startsWith(base));
}

let activeUtteranceQueue: SpeechSynthesisUtterance[] = [];
let isCancelled = false;

/**
 * Splits text into natural sentence-sized chunks with short micro-pauses
 */
function splitIntoSentenceChunks(text: string): string[] {
  // Clean markup, asterisks, brackets before speech
  const sanitized = text
    .replace(/[*_#`~[\]]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = sanitized
    .split(/(?<=[.?!;।])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return sentences.length ? sentences : [sanitized];
}

/**
 * Speaks text using browser SpeechSynthesis with natural sentence chunking,
 * cancellation of previous utterances, rate control, pitch control, and selected male voice.
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
  // Always cleanly cancel existing speech
  synth.cancel();
  activeUtteranceQueue = [];
  isCancelled = false;

  const chunks = splitIntoSentenceChunks(text);
  if (!chunks.length) {
    options.onEnd?.();
    return;
  }

  const voiceResult = pickRecommendedVoice(langCode, options.voiceURI);
  const voice = voiceResult.voice;

  // Professional male placement interviewer settings:
  // Rate: ~0.92 (calm, authoritative, clear)
  // Pitch: ~0.95 (natural masculine resonance)
  const speechRate = Math.max(0.75, Math.min(1.25, options.rate ?? 0.92));
  const speechPitch = Math.max(0.8, Math.min(1.15, options.pitch ?? 0.95));

  let currentIndex = 0;
  options.onStart?.();

  const speakNextChunk = () => {
    if (isCancelled || currentIndex >= chunks.length) {
      if (!isCancelled) {
        options.onEnd?.();
      }
      return;
    }

    const chunkText = chunks[currentIndex];
    currentIndex++;

    const utterance = new SpeechSynthesisUtterance(chunkText);
    utterance.lang = langCode;
    if (voice) utterance.voice = voice;
    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    utterance.onend = () => {
      if (currentIndex < chunks.length) {
        // Natural brief micro-pause between sentences (140ms)
        setTimeout(() => {
          if (!isCancelled) speakNextChunk();
        }, 140);
      } else {
        options.onEnd?.();
      }
    };

    utterance.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") {
        options.onError?.(`Speech synthesis issue: ${e.error}`);
      }
      options.onEnd?.();
    };

    activeUtteranceQueue.push(utterance);
    synth.speak(utterance);
  };

  setTimeout(() => {
    if (!isCancelled) speakNextChunk();
  }, 40);
}

/**
 * Speaks an audition sample of the selected voice so user can verify tone and cadence
 */
export function playVoiceSample(
  voiceURI: string,
  lang: string,
  rate = 0.92,
  pitch = 0.95,
  callbacks?: { onStart?: () => void; onEnd?: () => void },
) {
  const samplePhrase =
    lang === "hi"
      ? "नमस्ते, मैं टेस्ला हूँ। आज मैं आपका साक्षात्कारकर्ता रहूँगा। चलिए शुरू करते हैं।"
      : lang === "te"
        ? "నమస్కారం, నేను టెస్లా. ఈ రోజు నేను మీ ఇంటర్వ్యూవర్‌గా ఉంటాను. ప్రారంభిద్దాం."
        : "Hello, I am Tesla. I will be conducting your mock interview today. I look forward to exploring your background and technical projects.";

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
    isCancelled = true;
    activeUtteranceQueue = [];
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
