import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  analyzeDocumentsAI,
  evaluateAnswerAI,
  getConversationalAcknowledgement,
} from "./server-ai";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

/**
 * Handles server-side API proxy routes for Interview AI features
 */
async function handleApiRoute(request: Request): Promise<Response | null> {
  const url = new URL(request.url);

  if (url.pathname === "/api/interview/health") {
    return new Response(
      JSON.stringify({
        status: "ok",
        geminiConfigured: !!process.env.GEMINI_API_KEY,
        timestamp: Date.now(),
      }),
      {
        headers: { "content-type": "application/json" },
      },
    );
  }

  if (url.pathname === "/api/interview/analyze-documents" && request.method === "POST") {
    try {
      const body = await request.json();
      const analysis = await analyzeDocumentsAI({
        resumeText: body.resumeText || "",
        jdText: body.jdText || "",
        interviewType: body.interviewType || "mixed",
        experienceLevel: body.experienceLevel || "fresher",
        lang: body.lang || "en",
        count: body.count || 5,
      });

      return new Response(JSON.stringify(analysis), {
        headers: { "content-type": "application/json" },
      });
    } catch (err: unknown) {
      console.error("[API] analyze-documents error:", err);
      const msg = err instanceof Error ? err.message : "Failed to analyze documents";
      return new Response(JSON.stringify({ error: msg }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }

  if (url.pathname === "/api/interview/evaluate-response" && request.method === "POST") {
    try {
      const body = await request.json();
      const evaluation = await evaluateAnswerAI({
        question: body.question,
        answer: body.answer,
        contextWhyAsked: body.contextWhyAsked,
        expectedKeywords: body.expectedKeywords,
        lang: body.lang || "en",
      });

      return new Response(JSON.stringify(evaluation), {
        headers: { "content-type": "application/json" },
      });
    } catch (err: unknown) {
      console.error("[API] evaluate-response error:", err);
      const msg = err instanceof Error ? err.message : "Failed to evaluate response";
      return new Response(JSON.stringify({ error: msg }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }

  if (url.pathname === "/api/interview/acknowledgement" && request.method === "POST") {
    try {
      const body = await request.json();
      const acknowledgement = getConversationalAcknowledgement(
        body.stage || "1_introduction",
        body.answer || "",
        body.candidateName,
      );

      return new Response(JSON.stringify({ acknowledgement }), {
        headers: { "content-type": "application/json" },
      });
    } catch (err: unknown) {
      return new Response(JSON.stringify({ acknowledgement: "Thank you. Let us proceed." }), {
        headers: { "content-type": "application/json" },
      });
    }
  }

  return null;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      // 1. Check for custom API endpoints
      const apiResponse = await handleApiRoute(request);
      if (apiResponse) {
        return apiResponse;
      }

      // 2. Delegate to TanStack Start SSR handler
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
