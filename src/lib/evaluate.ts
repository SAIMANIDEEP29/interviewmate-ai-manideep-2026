import type { Question } from "./questions";

export interface Evaluation {
  score: number; // 0-10
  matched: string[];
  feedback: string;
  skipped: boolean;
}

const norm = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}@\s-]/gu, " ").replace(/\s+/g, " ").trim();

export function evaluate(q: Question, raw: string): Evaluation {
  const answer = norm(raw);
  if (!answer) return { score: 0, matched: [], skipped: true, feedback: `Skipped. ${q.tip}` };

  if (q.answer) {
    const ok = q.answer.some((a) => new RegExp(`(^|\\s)${a.toLowerCase()}(\\s|$|%)`, "u").test(answer));
    return ok
      ? { score: 10, matched: [q.answer[0]], skipped: false, feedback: `Correct! ${q.tip}` }
      : { score: 2, matched: [], skipped: false, feedback: `Not quite. ${q.tip}` };
  }

  const words = answer.split(" ").filter(Boolean).length;
  const matched = q.keywords.filter((k) => answer.includes(k.toLowerCase()));
  const uniqueMatched = [...new Set(matched)];

  const completeness = Math.min(1, words / q.minWords) * 4; // 0-4
  const relevance = Math.min(1, uniqueMatched.length / 4) * 5; // 0-5
  const structure = /(because|for example|example|such as|first|then|finally|so that|which|उदाहरण|क्योंकि|ఉదాహరణకు|ఎందుకంటే)/u.test(answer) ? 1 : 0;
  const score = Math.round((completeness + relevance + structure) * 10) / 10;

  const parts: string[] = [];
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

  return { score: Math.min(10, score), matched: uniqueMatched, skipped: false, feedback: parts.join(" ") };
}
