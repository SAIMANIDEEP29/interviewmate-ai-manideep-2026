/* eslint-disable @typescript-eslint/no-explicit-any */
export const ttsSupported = () => typeof window !== "undefined" && "speechSynthesis" in window;
export const sttSupported = () =>
  typeof window !== "undefined" && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

function pickVoice(langCode: string): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const base = langCode.split("-")[0] ?? langCode;
  const exact = voices.filter((v) => v.lang.replace("_", "-").toLowerCase() === langCode.toLowerCase());
  const loose = voices.filter((v) => v.lang.toLowerCase().startsWith(base));
  const pool = exact.length ? exact : loose;
  return pool.find((v) => /google|natural|neural|premium|enhanced/i.test(v.name)) ?? pool[0];
}

export function hasVoiceFor(langCode: string) {
  if (!ttsSupported()) return false;
  return !!pickVoice(langCode);
}

export function speak(text: string, langCode: string, on: { start?: () => void; end?: () => void }) {
  if (!ttsSupported()) { on.end?.(); return; }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = langCode;
  const v = pickVoice(langCode);
  if (v) u.voice = v;
  u.rate = 0.95;
  u.onstart = () => on.start?.();
  u.onend = () => on.end?.();
  u.onerror = () => on.end?.();
  // Some browsers load voices async
  setTimeout(() => synth.speak(u), 60);
}

export function stopSpeaking() { if (ttsSupported()) window.speechSynthesis.cancel(); }

export function createRecognizer(langCode: string, handlers: {
  onText: (finalText: string, interim: string) => void;
  onEnd: () => void;
  onError: (msg: string) => void;
}) {
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = langCode;
  rec.continuous = true;
  rec.interimResults = true;
  rec.onresult = (e: any) => {
    let fin = "", interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript;
      if (e.results[i].isFinal) fin += t + " "; else interim += t;
    }
    handlers.onText(fin, interim);
  };
  rec.onerror = (e: any) => {
    const map: Record<string, string> = {
      "not-allowed": "Microphone permission was denied. Allow mic access or type your answer.",
      "no-speech": "No speech detected. Try again or type your answer.",
      "network": "Speech service unavailable (network). Please type your answer.",
      "language-not-supported": "This language isn't supported for voice input in your browser. Please type.",
    };
    handlers.onError(map[e.error] ?? `Voice input error: ${e.error}`);
  };
  rec.onend = () => handlers.onEnd();
  return rec as { start: () => void; stop: () => void; abort: () => void };
}
