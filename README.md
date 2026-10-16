# Interviewmate Ai Manideep

Build a polished, fully functional, mobile-responsive web app named InterviewMate AI for a college assignment due today. It should feel like a premium HCL-style AI interview bot, but use its own branding. Use React + TypeScript + Tailwind/shadcn. Design: premium minimal deep navy/indigo/white with subtle violet/emerald accents, no neon. Main screen should show a friendly animated interviewer avatar (CSS/SVG face with idle blink, speaking pulse and audio wave animations), candidate setup form (name optional, job role, experience level, interview type: HR/technical/aptitude, language: English/Hindi/Telugu, question count), and start interview button. Interview flow: show one question at a time with progress, question text translated/selected by language, browser speech synthesis to speak questions using best available voice and appropriate lang code; speech recognition using Web Speech API where available, clear unsupported-browser message and text answer fallback; controls for repeat question, start/stop microphone, submit answer, skip, end interview. Build a realistic question bank across HR, Python, Java, SQL, web development, AI/ML and aptitude, with language-specific questions at least English/Hindi/Telugu for common HR questions and some common technical questions. Do not pretend to call a remote LLM if no API configured. Provide deterministic local evaluation based on answer completeness/relevant keywords and constructive feedback, score out of 10, and final report with overall score, per-question responses/feedback, strengths, improvement areas, and print/download-friendly result. Include clear disclosure that this is a practice demo and browser speech availability varies. Persist only session data in localStorage if useful, with clear reset. Ensure all buttons work, accessible contrast, loading/error/empty states, responsive design, tasteful animations, clean code. Do not require paid API keys or a database. Build the working app, not just a landing page.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://interviewmate-ai-manideep-2026.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/551fb002-5487-4741-9746-123c12e746f0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
