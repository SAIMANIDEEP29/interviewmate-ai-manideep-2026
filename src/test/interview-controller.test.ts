import { describe, expect, it } from "vitest";
import {
  buildStructuredInterviewPlan,
  extractSkillsFromText,
  getRoleCodingChallenge,
  getStageTransitionSpeech,
} from "../lib/interview-controller";

describe("InterviewController — Automated Screening Sequence", () => {
  it("always begins strictly with Stage 1 Greeting & Self-Introduction", () => {
    const plan = buildStructuredInterviewPlan({
      role: "Full-Stack Developer",
      level: "fresher",
      type: "mixed",
      lang: "en",
      questionCount: 6,
    });

    expect(plan.length).toBeGreaterThanOrEqual(6);
    expect(plan[0].stage).toBe("stage_1_greeting");
    expect(plan[0].category).toBe("introduction");
    expect(plan[0].stageNumber).toBe(1);
    expect(plan[0].text).toContain("Tesla");
    expect(plan[0].text).toContain("introduce yourself");
  });

  it("advances to Stage 2 Resume discussion without inventing unmentioned tools", () => {
    const sampleResume = "Experienced in Python and Django backend APIs with PostgreSQL.";
    const plan = buildStructuredInterviewPlan({
      role: "Backend Developer",
      level: "junior",
      type: "mixed",
      lang: "en",
      questionCount: 6,
      resumeText: sampleResume,
    });

    expect(plan[1].stage).toBe("stage_2_resume");
    expect(plan[1].stageNumber).toBe(2);
    expect(plan[1].text).toContain("Python");
  });

  it("includes Stage 4 Hands-on Coding or SQL challenge with starter code", () => {
    const plan = buildStructuredInterviewPlan({
      role: "Data Engineer",
      level: "fresher",
      type: "technical",
      lang: "en",
      questionCount: 6,
    });

    const codingStage = plan.find((q) => q.isCodingChallenge || q.stage === "stage_4_coding_sql");
    expect(codingStage).toBeDefined();
    expect(codingStage?.starterCode).toBeTruthy();
    expect(codingStage?.sampleInputOutput).toBeTruthy();
  });

  it("omits behavioral stage when technical-only interview is selected", () => {
    const technicalPlan = buildStructuredInterviewPlan({
      role: "Software Engineer",
      level: "mid",
      type: "technical",
      lang: "en",
      questionCount: 6,
    });

    const hasBehavioral = technicalPlan.some((q) => q.stage === "stage_6_behavioral");
    expect(hasBehavioral).toBe(false);
  });

  it("generates natural localized transition speech", () => {
    const speechEn = getStageTransitionSpeech(
      "stage_1_greeting",
      "My name is John, I graduated in CS.",
      "John",
      "en",
    );
    expect(speechEn).toContain("John");
    expect(speechEn).toContain("resume and project");

    const speechHi = getStageTransitionSpeech(
      "stage_1_greeting",
      "मेरा नाम राहुल है",
      "राहुल",
      "hi",
    );
    expect(speechHi).toContain("धन्यवाद");
  });

  it("correctly extracts known tech skills from raw text", () => {
    const skills = extractSkillsFromText(
      "Built a full stack platform using React, TypeScript, FastAPI, and Docker.",
    );
    expect(skills).toContain("React");
    expect(skills).toContain("TypeScript");
    expect(skills).toContain("FastAPI");
    expect(skills).toContain("Docker");
  });
});
