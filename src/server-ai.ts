import { GoogleGenAI } from "@google/genai";
import { getRoleCodingChallenge } from "./lib/interview-controller";

let genAIClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  genAIClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
  return genAIClient;
}

/**
 * Safely calls Gemini API with model fallback: primary gemini-3.8-flash, fallback gemini-3.1-flash-lite
 */
async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  const ai = getAIClient();
  if (!ai) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
  let lastError: Error | null = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction:
            systemInstruction ??
            "You are Tesla, an expert human technical interviewer and campus talent assessor conducting an automated placement screening interview. Your demeanor is confident, articulate, respectful, and encouraging. Never ask technical questions during the greeting stage.",
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (text) return text;
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.warn(`[AI Studio] Model ${model} failed, trying next fallback:`, lastError.message);
    }
  }

  throw lastError || new Error("Failed to generate AI response.");
}

export type InterviewStage =
  | "1_introduction"
  | "2_resume"
  | "3_technical"
  | "4_coding_sql"
  | "5_scenario"
  | "6_behavioral"
  | "7_closing";

export interface GeneratedQuestion {
  id: string;
  stage: InterviewStage;
  stageNumber: number;
  totalStages: number;
  category:
    | "introduction"
    | "resume_discussion"
    | "technical"
    | "coding_sql"
    | "scenario"
    | "behavioral"
    | "closing";
  text: string;
  hindiText?: string;
  teluguText?: string;
  transitionIntro?: string;
  contextWhyAsked: string;
  expectedKeywords: string[];
  tip: string;
  difficulty?: "foundational" | "intermediate" | "advanced";
  isCodingChallenge?: boolean;
  codingLanguage?: string;
  starterCode?: string;
  sampleInputOutput?: string;
}

export interface DocumentAnalysisResponse {
  detectedRole: string;
  detectedLevel: "fresher" | "junior" | "mid" | "senior" | "lead";
  summary: string;
  requiredSkills: string[];
  candidateSkills: string[];
  matchedSkills: string[];
  gapSkills: string[];
  questions: GeneratedQuestion[];
}

/**
 * Analyzes resume and JD documents, constructing the strict multi-stage automated screening interview
 */
export async function analyzeDocumentsAI(params: {
  resumeText: string;
  jdText: string;
  interviewType: string;
  experienceLevel: string;
  lang: string;
  count: number;
}): Promise<DocumentAnalysisResponse> {
  const { resumeText, jdText, interviewType, experienceLevel, lang } = params;

  const isTechnicalOnly = interviewType === "technical";
  const totalStages = isTechnicalOnly ? 6 : 7;

  const prompt = `
You are Tesla, a professional AI interviewer conducting an automated technical screening interview inspired by placement screening standards.
Construct a rigorous, structured interview following this EXACT SEQUENCE:

STAGE 1: Greeting & Self-Introduction
- Greet candidate politely as Tesla.
- Explain the interview structure: introduction, resume review, core technical concepts, hands-on coding or SQL challenge, problem-solving scenario, behavioral questions, and closing.
- Ask: "Could you please introduce yourself and walk me through your background?"
- NEVER ask technical questions at this stage.

STAGE 2: Education & Resume Projects
- Discuss genuine projects, tools, or education from candidate's resume text.
- NEVER fabricate skills, projects, or experiences not in the resume.

STAGE 3: JD & Technical Foundations
- Address core technical requirements in the target role and JD.
- Start with foundational principles before probing deeper.

STAGE 4: Hands-on Coding or SQL Challenge
- Present a concrete coding snippet or SQL query problem tailored to the role.
- Provide starter code and sample input/output.

STAGE 5: Practical Problem-Solving Scenario
- Present a realistic engineering incident or production trade-off.
- Probe diagnostic reasoning and decision trade-offs.

STAGE 6: HR & Behavioral (STAR Method)
- Omit if interviewType is "technical".
- Ask about teamwork, deadlines, feedback, or conflict resolution.

STAGE 7: Professional Closing & Candidate Reflection
- Ask if the candidate has any questions or final highlights before concluding.

CANDIDATE RESUME:
${resumeText.slice(0, 4000)}

JOB DESCRIPTION:
${jdText.slice(0, 4000)}

SETTINGS:
- Target Experience: ${experienceLevel}
- Interview Type: ${interviewType}
- Language: ${lang}

Return ONLY valid JSON (no markdown formatting, no code blocks):
{
  "detectedRole": "e.g. Full-Stack Developer",
  "detectedLevel": "fresher" | "junior" | "mid" | "senior",
  "summary": "2-3 sentences analyzing resume fit with JD",
  "requiredSkills": ["skill1", "skill2"],
  "candidateSkills": ["skill1", "skill2"],
  "matchedSkills": ["skill1"],
  "gapSkills": ["skill2"],
  "questions": [
    {
      "id": "q1",
      "stage": "1_introduction",
      "stageNumber": 1,
      "totalStages": ${totalStages},
      "category": "introduction",
      "text": "Hello! I am Tesla...",
      "hindiText": "नमस्ते!...",
      "teluguText": "నమస్కారం!...",
      "contextWhyAsked": "Stage 1: Greeting & introduction.",
      "expectedKeywords": ["background", "education", "passion"],
      "tip": "Present-Past-Future structure"
    }
  ]
}
`;

  try {
    const rawText = await callGemini(
      prompt,
      "You are Tesla, an expert human-like technical talent assessor. Output strictly valid JSON with ordered stages starting with Stage 1 Greeting.",
    );
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned) as DocumentAnalysisResponse;

    if (parsed.questions && parsed.questions.length >= 4) {
      // Ensure Stage 1 is guaranteed greeting
      const firstQ = parsed.questions[0];
      if (firstQ && firstQ.stage !== "1_introduction") {
        firstQ.stage = "1_introduction";
        firstQ.category = "introduction";
      }
      return parsed;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn("[AI Studio] AI analysis fallback triggered:", msg);
  }

  // Resilient Heuristic Fallback
  return fallbackDocumentAnalysis(resumeText, jdText, isTechnicalOnly, experienceLevel);
}

/**
 * Intelligent local fallback constructing the complete screening interview
 */
function fallbackDocumentAnalysis(
  resumeText: string,
  jdText: string,
  isTechnicalOnly: boolean,
  experienceLevel: string = "fresher",
): DocumentAnalysisResponse {
  const commonTech = [
    "react",
    "angular",
    "vue",
    "next.js",
    "node.js",
    "express",
    "python",
    "fastapi",
    "django",
    "java",
    "spring boot",
    "c++",
    "c#",
    ".net",
    "sql",
    "postgresql",
    "mongodb",
    "mysql",
    "redis",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "git",
    "ci/cd",
    "rest api",
    "graphql",
    "microservices",
    "typescript",
    "javascript",
    "pytorch",
    "tensorflow",
    "pandas",
    "tableau",
    "power bi",
    "agile",
    "scrum",
    "linux",
  ];

  const resumeLower = resumeText.toLowerCase();
  const jdLower = jdText.toLowerCase();

  const candidateSkills = commonTech.filter((t) => resumeLower.includes(t));
  const requiredSkills = commonTech.filter((t) => jdLower.includes(t));
  const matchedSkills = candidateSkills.filter((s) => requiredSkills.includes(s));
  const gapSkills = requiredSkills.filter((s) => !candidateSkills.includes(s));

  // Detect role
  let detectedRole = "Software Engineer";
  if (jdLower.includes("full-stack") || jdLower.includes("full stack"))
    detectedRole = "Full-Stack Developer";
  else if (jdLower.includes("frontend") || jdLower.includes("front end"))
    detectedRole = "Frontend Developer";
  else if (jdLower.includes("backend") || jdLower.includes("back end"))
    detectedRole = "Backend Developer";
  else if (jdLower.includes("ai") || jdLower.includes("machine learning") || jdLower.includes("ml"))
    detectedRole = "AI/ML Engineer";
  else if (jdLower.includes("data") || jdLower.includes("analyst")) detectedRole = "Data Engineer";

  const totalStages = isTechnicalOnly ? 6 : 7;
  const primeSkill = matchedSkills[0] || candidateSkills[0] || "core software principles";
  const gapSkill = gapSkills[0] || requiredSkills[1] || "scalability and clean code";

  const codingChallenge = getRoleCodingChallenge(detectedRole, resumeText, jdText);

  const questions: GeneratedQuestion[] = [
    // STAGE 1: Greeting & Self-Introduction
    {
      id: "stage1_intro",
      stage: "1_introduction",
      stageNumber: 1,
      totalStages,
      category: "introduction",
      text: `Hello! I am Tesla, your virtual AI interviewer today for this automated screening interview for the ${detectedRole} role. In this session, we will explore your academic background, discuss projects from your resume, evaluate core technical foundations, complete a hands-on coding or SQL challenge, solve a practical engineering scenario, and conclude with behavioral questions. To begin, could you please introduce yourself and walk me through your background?`,
      hindiText: `नमस्ते! मैं आज ${detectedRole} पद के लिए आपके तकनीकी स्क्रीनिंग साक्षात्कार का वर्चुअल AI साक्षात्कारकर्ता टेस्ला हूँ। इस सत्र में, हम आपकी पृष्ठभूमि, प्रोजेक्ट्स, तकनीकी अवधारणाओं, कोडिंग और समस्या-समाधान पर चर्चा करेंगे। शुरू करने के लिए, क्या आप कृपया अपना परिचय दे सकते हैं?`,
      teluguText: `నమస్కారం! నేను ఈ రోజు ${detectedRole} ఉద్యోగం కోసం మీ వర్చువల్ AI ఇంటర్వ్యూవర్ టెస్లాను. ఈ సెషన్‌లో మనం మీ నేపథ్యం, ప్రాజెక్ట్‌లు, సాంకేతిక అంశాలు మరియు సమస్య-పరిష్కార నైపుణ్యాలను చర్చిస్తాము. ప్రారంభించడానికి, దయచేసి మిమ్మల్ని మీరు పరిచయం చేసుకోగలరా?`,
      contextWhyAsked:
        "Stage 1: Greeting and self-introduction. Establishes rapport and evaluates presentation clarity.",
      expectedKeywords: ["background", "education", "passion", "skills", "experience", "interest"],
      tip: "Structure your response into 3 parts: 1) Who you are, 2) Academic and project highlights, 3) Why you are eager for this position.",
    },

    // STAGE 2: Education & Resume Projects
    {
      id: "stage2_resume",
      stage: "2_resume",
      stageNumber: 2,
      totalStages,
      category: "resume_discussion",
      text: `Looking at your background, you highlighted work involving ${primeSkill}. Could you walk me through the architecture of your primary project, the core problem it addressed, and your specific personal technical contributions?`,
      hindiText: `आपके बायोडाटा में ${primeSkill} पर कार्य का उल्लेख है। क्या आप अपने मुख्य प्रोजेक्ट की रूपरेखा (architecture), उसके उद्देश्य और अपनी व्यक्तिगत तकनीकी भूमिका के बारे में विस्तार से बता सकते हैं?`,
      teluguText: `మీ రెజ్యూమ్‌లో ${primeSkill} ప్రాజెక్ట్ ఉంది. మీ ప్రాజెక్ట్ ఆర్కిటెక్చర్, అది పరిష్కరించిన సమస్య మరియు మీ సాంకేతిక బాధ్యతలను వివరించగలరా?`,
      contextWhyAsked: `Stage 2: Resume deep-dive on verified skill: ${primeSkill}. Evaluates real implementation ownership without inventing details.`,
      expectedKeywords: [
        primeSkill,
        "architecture",
        "database",
        "api",
        "implemented",
        "scaled",
        "contributions",
      ],
      tip: "State the problem statement -> Architecture chosen -> Your specific role -> Tangible outcomes.",
    },

    // STAGE 3: JD & Technical Foundations
    {
      id: "stage3_technical",
      stage: "3_technical",
      stageNumber: 3,
      totalStages,
      category: "technical",
      text: `The Job Description for this ${detectedRole} position emphasizes solid understanding of ${primeSkill} and ${gapSkill}. Can you explain foundational concepts in these areas, and how you ensure clean, maintainable, and reliable code in production?`,
      hindiText: `इस पद के लिए ${primeSkill} और ${gapSkill} में दक्षता आवश्यक है। कोड की गुणवत्ता, विश्वसनीयता और उच्च प्रदर्शन बनाए रखने के लिए आप क्या रणनीति अपनाते हैं?`,
      teluguText: `ఈ ఉద్యోగంలో ${primeSkill} మరియు ${gapSkill} ముఖ్యం. హై-పెర్ఫార్మెన్స్ మరియు క్లీన్ కోడ్ కోసం మీ విధానం ఏమిటి?`,
      contextWhyAsked: `Stage 3: Technical foundations aligned to JD requirement: ${gapSkill}.`,
      expectedKeywords: [
        primeSkill,
        gapSkill,
        "clean code",
        "modularity",
        "testing",
        "design patterns",
        "performance",
      ],
      tip: "Explain the definition first, why it matters in real production environments, then cite a practical pattern.",
      difficulty: "foundational",
    },

    // STAGE 4: Hands-on Coding or SQL Challenge
    {
      id: "stage4_coding_sql",
      stage: "4_coding_sql",
      stageNumber: 4,
      totalStages,
      category: "coding_sql",
      text: codingChallenge.text,
      hindiText: codingChallenge.hindiText,
      teluguText: codingChallenge.teluguText,
      contextWhyAsked:
        "Stage 4: Hands-on coding and query design. Evaluates syntax correctness, logic, and algorithmic complexity.",
      expectedKeywords: codingChallenge.expectedKeywords,
      tip: codingChallenge.tip,
      difficulty: "intermediate",
      isCodingChallenge: true,
      codingLanguage: codingChallenge.codingLanguage,
      starterCode: codingChallenge.starterCode,
      sampleInputOutput: codingChallenge.sampleInputOutput,
    },

    // STAGE 5: Practical Problem-Solving Scenario
    {
      id: "stage5_scenario",
      stage: "5_scenario",
      stageNumber: 5,
      totalStages,
      category: "scenario",
      text: "Imagine a critical service you maintain in production suddenly experiences high latency and database connection timeouts during a peak traffic event. What systematic diagnostic workflow would you follow to isolate the root cause, mitigate the immediate issue, and restore normal operation?",
      hindiText:
        "मान लीजिए कि अचानक भारी ट्रैफिक के दौरान सिस्टम बहुत धीमा हो जाता है और डेटाबेस टाइमआउट आने लगते हैं। मूल कारण पहचानने और समस्या हल करने के लिए आप क्या कदम उठाएंगे?",
      teluguText:
        "ఊహించండి, అధిక ట్రాఫిక్ సమయంలో సర్వర్ డేటాబేస్ సమస్యలు వచ్చాయి. మూల కారణాన్ని కనుగొనడానికి మరియు సమస్యను పరిష్కరించడానికి మీరు ఏ క్రమపద్ధతిని ఉపయోగిస్తారు?",
      contextWhyAsked:
        "Stage 5: Practical problem-solving scenario evaluating reasoning, diagnostic telemetry, and triage under pressure.",
      expectedKeywords: [
        "logs",
        "metrics",
        "monitoring",
        "database",
        "connection pool",
        "isolate",
        "rollback",
        "mitigate",
      ],
      tip: "Structure your response into: 1) Triage & stabilize, 2) Inspect logs & metrics, 3) Formulate hypothesis, 4) Post-incident prevention.",
      difficulty: "intermediate",
    },
  ];

  // STAGE 6: HR & Behavioral (if not technical-only)
  if (!isTechnicalOnly) {
    questions.push({
      id: "stage6_behavioral",
      stage: "6_behavioral",
      stageNumber: 6,
      totalStages,
      category: "behavioral",
      text: "Can you describe a situation where you had a disagreement with a team member or faced a very tight sprint deadline? How did you communicate, resolve the issue, and ensure the deliverable stayed on track?",
      hindiText:
        "क्या आप किसी ऐसी स्थिति का वर्णन कर सकते हैं जब किसी टीम के सदस्य के साथ मतभेद हुआ हो या कड़ी समय सीमा रही हो? आपने इसे कैसे सुलझाया?",
      teluguText:
        "మీరు జట్టు సభ్యునితో భిన్నాభిప్రాయాలు లేదా కఠినమైన డెడ్‌లైన్‌ను ఎదుర్కొన్న సందర్భం గురించి చెప్పండి. మీరు దానిని ఎలా పరిష్కరించారు?",
      contextWhyAsked:
        "Stage 6: Behavioral evaluation assessing teamwork, maturity, and STAR structure.",
      expectedKeywords: [
        "communication",
        "collaboration",
        "resolution",
        "deadline",
        "outcome",
        "learning",
      ],
      tip: "Use the STAR method: Situation, Task, Action you took, and final measurable Result.",
    });
  }

  // STAGE 7: Closing & Candidate Reflection
  const closingStageNumber = isTechnicalOnly ? 6 : 7;
  questions.push({
    id: "stage7_closing",
    stage: "7_closing",
    stageNumber: closingStageNumber,
    totalStages,
    category: "closing",
    text: "We have covered your background, resume projects, technical depth, hands-on coding, and problem-solving methodology. Before we conclude our interview today, is there anything else you would like to highlight regarding your background, or any questions you have for me regarding this role?",
    hindiText:
      "साक्षात्कार समाप्त करने से पहले, क्या कुछ ऐसा है जो आप अपनी पृष्ठभूमि के बारे में साझा करना चाहते हैं, या कोई प्रश्न पूछना चाहते हैं?",
    teluguText:
      "ఇంటర్వ్యూ ముగించే ముందు, మీరు మీ గురించి చెప్పాలనుకుంటున్నారా లేదా నన్ను ఏమైనా అడగాలనుకుంటున్నారా?",
    contextWhyAsked: "Stage 7: Professional closing and candidate reflection.",
    expectedKeywords: ["questions", "growth", "culture", "thank you", "opportunity", "contribute"],
    tip: "Reiterate your enthusiasm for the role and highlight any key strength not yet covered.",
  });

  return {
    detectedRole,
    detectedLevel: (experienceLevel as "fresher" | "junior" | "mid" | "senior" | "lead") || "fresher",
    summary: `Candidate profile analyzed for ${detectedRole}. Found alignment on ${candidateSkills.slice(0, 3).join(", ") || "core fundamentals"}. Structured 7-stage automated screening covers background, resume projects, technical foundations, hands-on coding, scenario reasoning, and behavioral competencies.`,
    requiredSkills: requiredSkills.length
      ? requiredSkills
      : ["React", "TypeScript", "Node.js", "SQL", "Git"],
    candidateSkills: candidateSkills.length
      ? candidateSkills
      : ["JavaScript", "HTML/CSS", "Python", "Git"],
    matchedSkills: matchedSkills.length ? matchedSkills : ["Git", "JavaScript"],
    gapSkills: gapSkills.length ? gapSkills : ["System Design", "Cloud Infrastructure"],
    questions,
  };
}

/**
 * Generates natural, varied, short conversational acknowledgements
 */
export function getConversationalAcknowledgement(
  stage: string,
  answer: string,
  candidateName?: string,
): string {
  const nameGreeting = candidateName ? `, ${candidateName}` : "";
  const words = answer.trim().split(/\s+/).filter(Boolean).length;

  if (words < 5) {
    return "Understood, thank you. Let's move directly to the next topic.";
  }

  if (stage.includes("1") || stage.includes("intro")) {
    const options = [
      `Thank you for that comprehensive introduction${nameGreeting}. It's great to understand your journey.`,
      `I appreciate you walking me through your background${nameGreeting}. Let's dive right into your experience.`,
      `Thank you for sharing your journey${nameGreeting}. You've built a solid foundation.`,
    ];
    return options[Math.floor(Math.random() * options.length)] ?? options[0]!;
  }

  if (stage.includes("2") || stage.includes("resume")) {
    const options = [
      "That is a very clear breakdown of your project architecture and responsibilities.",
      "Thank you for walking me through the technical implementation details.",
      "Understood. It's great to hear how you approached that challenge in practice.",
    ];
    return options[Math.floor(Math.random() * options.length)] ?? options[0]!;
  }

  if (stage.includes("3") || stage.includes("technical")) {
    const options = [
      "Good explanation of those core principles.",
      "That makes solid sense regarding how you ensure reliability and clean code.",
      "Thank you for explaining your technical reasoning on that concept.",
    ];
    return options[Math.floor(Math.random() * options.length)] ?? options[0]!;
  }

  if (stage.includes("4") || stage.includes("coding")) {
    const options = [
      "Thank you for that code implementation and walkthrough.",
      "Good logical structure in your code solution.",
      "I appreciate the attention to time and space complexity in your approach.",
    ];
    return options[Math.floor(Math.random() * options.length)] ?? options[0]!;
  }

  if (stage.includes("5") || stage.includes("scenario")) {
    const options = [
      "I appreciate your systematic approach to diagnosing the issue under pressure.",
      "That's a logical and methodical triage strategy.",
      "Good reasoning around isolating root causes and mitigating downtime.",
    ];
    return options[Math.floor(Math.random() * options.length)] ?? options[0]!;
  }

  if (stage.includes("6") || stage.includes("behavioral")) {
    const options = [
      "Thank you for sharing that experience; constructive communication is vital in engineering teams.",
      "That highlights good professional maturity and problem resolution.",
      "I appreciate your honesty and focus on collaboration.",
    ];
    return options[Math.floor(Math.random() * options.length)] ?? options[0]!;
  }

  if (stage.includes("7") || stage.includes("closing")) {
    return `Thank you very much for your time and thoughtful responses today${nameGreeting}. It was a pleasure speaking with you.`;
  }

  return "Thank you for that response. Let us continue.";
}

/**
 * Evaluates candidate's actual answer against question, resume, and JD criteria
 */
export async function evaluateAnswerAI(params: {
  question: string;
  answer: string;
  contextWhyAsked?: string;
  expectedKeywords?: string[];
  lang: string;
}): Promise<{
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
}> {
  const { question, answer, contextWhyAsked, expectedKeywords, lang } = params;

  if (!answer || answer.trim().length < 5) {
    return {
      score: 0,
      metrics: {
        technicalKnowledge: 0,
        communication: 0,
        problemSolving: 0,
        jdRelevance: 0,
      },
      strengths: [],
      areasToImprove: ["Question was skipped or no answer was recorded."],
      coachingFeedback:
        "A partial answer is always better than skipping. Try articulating your thought process or high-level intuition even if you are uncertain.",
      sampleModelAnswer:
        "Begin by defining the core concept, explaining your technical strategy, and walking through a concrete example.",
    };
  }

  const prompt = `
Evaluate the candidate's interview answer.
QUESTION: ${question}
CONTEXT WHY ASKED: ${contextWhyAsked || "Role requirement"}
KEY CONCEPTS/KEYWORDS: ${(expectedKeywords || []).join(", ")}
CANDIDATE'S ACTUAL ANSWER:
"${answer}"

INTERVIEW LANGUAGE: ${lang}

RULES:
1. Provide fair, constructive feedback. Do NOT penalize Indian English accents, local phrasing, or minor grammatical slips if meaning is clear.
2. Score on 4 dimensions (each 0 to 10):
   - technicalKnowledge: accuracy and depth of concepts or code logic
   - communication: clarity, structure (e.g. STAR method), conciseness
   - problemSolving: decision-making rationale, algorithmic clarity, and analytical approach
   - jdRelevance: direct relevance to the question and practical engineering application
3. Compute overall composite score (0 to 10).
4. Provide 1-2 concrete strengths, 1-2 actionable improvement points, an encouraging coaching tip, and a concise 2-sentence model answer.

Return ONLY valid JSON (no markdown formatting):
{
  "score": 7.5,
  "metrics": {
    "technicalKnowledge": 7.5,
    "communication": 8.0,
    "problemSolving": 7.0,
    "jdRelevance": 7.5
  },
  "strengths": ["Clear explanation of core principles", "Good practical example cited"],
  "areasToImprove": ["Could mention time complexity or trade-offs"],
  "coachingFeedback": "Solid response. In future rounds, explicitly state trade-offs between memory and CPU.",
  "sampleModelAnswer": "A complete answer clearly defines the concept, gives a real-world scenario, and discusses performance."
}
`;

  try {
    const rawText = await callGemini(
      prompt,
      "You are an encouraging, objective technical interviewer evaluating candidate practice responses. Output strictly valid JSON.",
    );
    const cleaned = rawText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();
    const parsed = JSON.parse(cleaned);

    return {
      score: typeof parsed.score === "number" ? Math.min(10, Math.max(0, parsed.score)) : 6.5,
      metrics: {
        technicalKnowledge: parsed.metrics?.technicalKnowledge ?? 6.5,
        communication: parsed.metrics?.communication ?? 7.0,
        problemSolving: parsed.metrics?.problemSolving ?? 6.5,
        jdRelevance: parsed.metrics?.jdRelevance ?? 7.0,
      },
      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths
        : ["Demonstrated solid understanding."],
      areasToImprove: Array.isArray(parsed.areasToImprove)
        ? parsed.areasToImprove
        : ["Incorporate more architectural trade-offs."],
      coachingFeedback: parsed.coachingFeedback ?? "Good effort. Focus on concrete examples.",
      sampleModelAnswer:
        parsed.sampleModelAnswer ?? "Structure responses with clear context, action, and results.",
    };
  } catch (err: unknown) {
    const words = answer.trim().split(/\s+/).length;
    const baseScore = Math.min(9, Math.max(4, Math.round(words / 15) + 3));

    return {
      score: baseScore,
      metrics: {
        technicalKnowledge: baseScore,
        communication: Math.min(10, baseScore + 1),
        problemSolving: baseScore,
        jdRelevance: baseScore,
      },
      strengths: ["Clear effort and relevant vocabulary used in response."],
      areasToImprove: ["Consider expanding on edge cases and scalability."],
      coachingFeedback:
        "Good response. Structuring with the STAR framework will strengthen your delivery.",
      sampleModelAnswer:
        "Clearly articulate the core concept, implementation details, and trade-offs.",
    };
  }
}
