import { type Lang, type Level, type InterviewType } from "./questions";

export type StageKey =
  | "stage_1_greeting"
  | "stage_2_resume"
  | "stage_3_technical"
  | "stage_4_coding_sql"
  | "stage_5_scenario"
  | "stage_6_behavioral"
  | "stage_7_closing";

export interface InterviewStageInfo {
  key: StageKey;
  stageNumber: number;
  totalStages: number;
  name: string;
  hindiName: string;
  teluguName: string;
  description: string;
}

export interface StageQuestion {
  id: string;
  stage: StageKey;
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
  hindiText: string;
  teluguText: string;
  transitionIntro?: string;
  hindiTransitionIntro?: string;
  teluguTransitionIntro?: string;
  contextWhyAsked: string;
  expectedKeywords: string[];
  tip: string;
  difficulty?: "foundational" | "intermediate" | "advanced";
  isCodingChallenge?: boolean;
  codingLanguage?: string;
  starterCode?: string;
  sampleInputOutput?: string;
}

export interface CandidateContext {
  name?: string;
  role: string;
  level: Level;
  type: InterviewType | "mixed";
  lang: Lang;
  questionCount: number;
  resumeFileName?: string;
  resumeText?: string;
  jdFileName?: string;
  jdText?: string;
  matchedSkills?: string[];
  candidateSkills?: string[];
  gapSkills?: string[];
}

export const STAGE_CONFIGS: Record<
  StageKey,
  { name: string; hindiName: string; teluguName: string; description: string }
> = {
  stage_1_greeting: {
    name: "Stage 1: Greeting & Self-Introduction",
    hindiName: "चरण 1: अभिवादन और आत्म-परिचय",
    teluguName: "దశ 1: ఆహ్వానం & స్వీయ పరిచయం",
    description: "Welcome, role overview, and candidate self-introduction. No technical questions.",
  },
  stage_2_resume: {
    name: "Stage 2: Education & Resume Projects",
    hindiName: "चरण 2: शिक्षा और प्रोजेक्ट्स पर चर्चा",
    teluguName: "దశ 2: విద్య & ప్రాజెక్ట్ అనుభవం",
    description:
      "Discussion of genuine education, projects, tools, and responsibilities mentioned in the resume.",
  },
  stage_3_technical: {
    name: "Stage 3: JD & Technical Foundations",
    hindiName: "चरण 3: तकनीकी अवधारणाएं और जॉब विवरण",
    teluguName: "దశ 3: జాబ్ వివరణ & సాంకేతిక అంశాలు",
    description: "Foundational to deep technical evaluation aligned with target role competencies.",
  },
  stage_4_coding_sql: {
    name: "Stage 4: Hands-on Coding or SQL Challenge",
    hindiName: "चरण 4: व्यावहारिक कोडिंग या SQL प्रश्न",
    teluguName: "దశ 4: ప్రాక్టికల్ కోడింగ్ లేదా SQL సవాలు",
    description:
      "Practical coding logic, data structure, or SQL query problem tailored to target role.",
  },
  stage_5_scenario: {
    name: "Stage 5: Practical Problem-Solving Scenario",
    hindiName: "चरण 5: व्यावहारिक समस्या समाधान परिदृश्य",
    teluguName: "దశ 5: ప్రాక్టికల్ సమస్య పరిష్కార దృష్టాంతం",
    description:
      "Engineering or workplace challenge testing diagnostic reasoning and decision trade-offs.",
  },
  stage_6_behavioral: {
    name: "Stage 6: HR & Behavioral (STAR)",
    hindiName: "चरण 6: एचआर और व्यावहारिक मूल्यांकन",
    teluguName: "దశ 6: హెచ్‌ఆర్ & ప్రవర్తనా విశ్లేషణ",
    description: "Team collaboration, conflict resolution, deadlines, and growth mindset.",
  },
  stage_7_closing: {
    name: "Stage 7: Closing & Candidate Reflection",
    hindiName: "चरण 7: समापन और निष्कर्ष",
    teluguName: "దశ 7: ముగింపు & అభ్యర్థి ప్రశ్నలు",
    description: "Candidate reflections, final questions for Tesla, and professional conclusion.",
  },
};

/**
 * Extracts key skills from resume text without hallucinating
 */
export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const knownTech = [
    "React",
    "Angular",
    "Vue",
    "Next.js",
    "Node.js",
    "Express",
    "TypeScript",
    "JavaScript",
    "Python",
    "Django",
    "FastAPI",
    "Flask",
    "Java",
    "Spring Boot",
    "C++",
    "C#",
    ".NET",
    "Go",
    "Rust",
    "SQL",
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "Redis",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Git",
    "REST API",
    "GraphQL",
    "Tailwind CSS",
    "HTML",
    "CSS",
    "CI/CD",
    "Linux",
    "Microservices",
    "Machine Learning",
    "PyTorch",
    "TensorFlow",
    "Pandas",
    "Data Structures",
    "Algorithms",
    "System Design",
    "Agile",
    "Scrum",
  ];

  const lower = text.toLowerCase();
  return knownTech.filter((t) => {
    const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const reg = new RegExp(`\\b${escaped}\\b`, "i");
    return reg.test(lower);
  });
}

/**
 * Builds role-specific coding or SQL challenge
 */
export function getRoleCodingChallenge(
  role: string,
  resumeText: string,
  jdText: string,
): {
  text: string;
  hindiText: string;
  teluguText: string;
  codingLanguage: string;
  starterCode: string;
  sampleInputOutput: string;
  expectedKeywords: string[];
  tip: string;
} {
  const combined = `${role} ${resumeText} ${jdText}`.toLowerCase();

  if (
    combined.includes("data") ||
    combined.includes("sql") ||
    combined.includes("backend") ||
    combined.includes("database")
  ) {
    return {
      text: "Write an SQL query to retrieve the top 3 highest-earning employees in each department from an `employees` table (id, name, department_id, salary) and a `departments` table (id, name). Explain your choice between window functions like DENSE_RANK() versus subqueries.",
      hindiText:
        "एक SQL क्वेरी लिखें जो प्रत्येक विभाग में शीर्ष 3 सर्वाधिक वेतन पाने वाले कर्मचारियों को 'employees' और 'departments' टेबल से निकाले। DENSE_RANK() और सब-क्वेरी के बीच अपने चयन का कारण स्पष्ट करें।",
      teluguText:
        "ప్రతి విభాగంలో టాప్ 3 అత్యధిక వేతనం పొందే ఉద్యోగులను కనుగొనడానికి ఒక SQL ప్రశ్న రాయండి. DENSE_RANK() విండో ఫంక్షన్ మరియు సబ్‌క్వెరీ మధ్య మీ ఎంపికను వివరించండి.",
      codingLanguage: "sql",
      starterCode: `-- Write your SQL solution below
SELECT 
    d.name AS department_name,
    e.name AS employee_name,
    e.salary
FROM employees e
JOIN departments d ON e.department_id = d.id
-- Use DENSE_RANK() or CTE below
;`,
      sampleInputOutput:
        "Input: employees table with (id, name, department_id, salary)\nOutput: department_name, employee_name, salary (Ranked 1 to 3 per department)",
      expectedKeywords: ["DENSE_RANK", "PARTITION BY", "CTE", "JOIN", "ORDER BY", "subquery"],
      tip: "Use a Common Table Expression (WITH ranked_emp AS ...) with DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) to handle ties gracefully.",
    };
  }

  if (
    combined.includes("python") ||
    combined.includes("ai") ||
    combined.includes("machine learning")
  ) {
    return {
      text: "Write a function in Python that takes a list of integers and returns all unique pairs that sum up to a specific target value. What is the time and space complexity of your approach, and how does using a hash set optimize lookup?",
      hindiText:
        "पायथन में एक फंक्शन लिखें जो पूर्णांकों की सूची लेता है और उन सभी अनूठे जोड़ों (pairs) को लौटाता है जिनका योग एक विशिष्ट लक्ष्य मान (target) के बराबर हो। अपनी विधि की समय और स्थान जटिलता (complexity) समझाएं।",
      teluguText:
        "పైథాన్‌లో పూర్ణాంకాల జాబితా ఆధారంగా ఒక నిర్దిష్ట టార్గెట్ మొత్తానికి సమానమయ్యే జంటలను (pairs) తిరిగి ఇచ్చే ఫంక్షన్ రాయండి. దీని టైమ్ మరియు స్పేస్ కాంప్లెక్సిటీని వివరించండి.",
      codingLanguage: "python",
      starterCode: `def find_target_pairs(nums: list[int], target: int) -> list[tuple[int, int]]:
    """
    Finds unique pairs of numbers that sum to target.
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    seen = set()
    pairs = set()
    
    # Write your logic here
    for num in nums:
        complement = target - num
        if complement in seen:
            pairs.add((min(num, complement), max(num, complement)))
        seen.add(num)
        
    return list(pairs)
`,
      sampleInputOutput:
        "Input: nums = [2, 7, 11, 15, -2, 6, 3], target = 9\nOutput: [(2, 7), (6, 3)]",
      expectedKeywords: [
        "hash set",
        "complement",
        "O(n)",
        "space complexity",
        "lookup",
        "time complexity",
      ],
      tip: "Explain why a single-pass hash set is O(N) time compared to a brute-force nested loop of O(N^2).",
    };
  }

  // Default Web / Frontend / Full-Stack coding problem
  return {
    text: "Write a utility function in JavaScript or TypeScript that implements a debounced version of an asynchronous search handler. Explain how you manage timers, prevent race conditions from out-of-order network responses, and clean up active requests.",
    hindiText:
      "जावास्क्रिप्ट या टाइपस्क्रिप्ट में एक ऐसा फंक्शन लिखें जो डिबाउंस (debounce) लागू करता हो। आप टाइमर कैसे प्रबंधित करते हैं और पुराने नेटवर्क अनुरोधों से होने वाली समस्याओं (race conditions) से कैसे बचते हैं?",
    teluguText:
      "జావాస్క్రిప్ట్ లేదా టైప్‌స్క్రిప్ట్‌లో డిబౌన్స్ (debounce) ఫంక్షన్ రాయండి. టైమర్‌లను ఎలా నిర్వహిస్తారు మరియు నెట్‌వర్క్ రేస్ కండిషన్‌లను ఎలా నివారిస్తారో వివరించండి.",
    codingLanguage: "typescript",
    starterCode: `// Implement a debounced async search utility
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timerId: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
    }, delayMs);
  };
}
`,
    sampleInputOutput:
      "Input: Multiple rapid keystrokes within 300ms window\nOutput: Single executed network query after user pauses typing",
    expectedKeywords: [
      "clearTimeout",
      "setTimeout",
      "closure",
      "AbortController",
      "race condition",
      "timer",
    ],
    tip: "Mention AbortController for cancelling previous in-flight HTTP requests when a newer input arrives.",
  };
}

/**
 * Builds the complete, ordered, sequential screening interview plan.
 * Guaranteed to execute strictly in order:
 * Stage 1: Greeting & Self-Introduction
 * Stage 2: Education & Resume Projects
 * Stage 3: JD & Technical Foundations
 * Stage 4: Hands-on Coding or SQL Challenge
 * Stage 5: Practical Problem-Solving Scenario
 * Stage 6: HR & Behavioral (STAR) (omitted if technical-only)
 * Stage 7: Professional Closing & Candidate Reflection
 */
export function buildStructuredInterviewPlan(context: CandidateContext): StageQuestion[] {
  const isTechnicalOnly = context.type === "technical";
  const totalStages = isTechnicalOnly ? 6 : 7;
  const candidateName = context.name?.trim();

  // Extract skills from resume
  const resumeSkills = extractSkillsFromText(context.resumeText || "");
  const jdSkills = extractSkillsFromText(context.jdText || "");
  const matched = resumeSkills.filter((s) =>
    jdSkills.map((j) => j.toLowerCase()).includes(s.toLowerCase()),
  );

  const primarySkill =
    matched[0] ||
    resumeSkills[0] ||
    (context.role.toLowerCase().includes("python") ? "Python" : "JavaScript/TypeScript");
  const secondarySkill =
    matched[1] || jdSkills[0] || resumeSkills[1] || "RESTful APIs & Database Design";

  const questions: StageQuestion[] = [];

  // ==========================================
  // STAGE 1: Greeting & Self-Introduction
  // ==========================================
  const candidateGreetingEn = candidateName ? `Hello ${candidateName}` : "Hello";
  const candidateGreetingHi = candidateName ? `नमस्ते ${candidateName}` : "नमस्ते";
  const candidateGreetingTe = candidateName ? `నమస్కారం ${candidateName}` : "నమస్కారం";

  questions.push({
    id: "stage_1_intro",
    stage: "stage_1_greeting",
    stageNumber: 1,
    totalStages,
    category: "introduction",
    text: `${candidateGreetingEn}! I am Tesla, your virtual AI interviewer for this automated screening interview for the ${context.role} position. Over the course of our session, we will first explore your academic background and journey, review your resume projects, assess core technical fundamentals, complete a hands-on coding problem, solve a realistic production scenario, and conclude with behavioral questions. To begin, could you please introduce yourself and walk me through your background?`,
    hindiText: `${candidateGreetingHi}! मैं आज ${context.role} पद के लिए आपके तकनीकी स्क्रीनिंग साक्षात्कार का वर्चुअल AI साक्षात्कारकर्ता टेस्ला हूँ। इस सत्र में, हम आपकी पृष्ठभूमि, प्रोजेक्ट्स, तकनीकी अवधारणाओं, व्यावहारिक कोडिंग और समस्या-समाधान पर चर्चा करेंगे। शुरू करने के लिए, क्या आप कृपया अपना परिचय दे सकते हैं और अपनी पृष्ठभूमि के बारे में बता सकते हैं?`,
    teluguText: `${candidateGreetingTe}! నేను ఈ రోజు ${context.role} ఉద్యోగం కోసం మీ వర్చువల్ AI ఇంటర్వ్యూవర్ టెస్లాను. ఈ సెషన్‌లో మనం మీ నేపథ్యం, ప్రాజెక్ట్‌లు, సాంకేతిక అంశాలు, కోడింగ్ సవాలు మరియు సమస్య-పరిష్కార నైపుణ్యాలను చర్చిస్తాము. ప్రారంభించడానికి, దయచేసి మిమ్మల్ని మీరు పరిచయం చేసుకొని మీ నేపథ్యం గురించి చెప్పగలరా?`,
    transitionIntro: "Welcome to your automated technical screening interview.",
    hindiTransitionIntro: "आपके तकनीकी स्क्रीनिंग साक्षात्कार में आपका स्वागत है।",
    teluguTransitionIntro: "మీ టెక్నికల్ స్క్రీనింగ్ ఇంటర్వ్యూకు స్వాగతం.",
    contextWhyAsked:
      "Stage 1: Greeting & self-introduction. Establishes rapport and evaluates communication clarity.",
    expectedKeywords: ["background", "education", "passion", "skills", "projects", "interest"],
    tip: "Use the Present-Past-Future structure: 1) Who you are now, 2) Relevant academic/project highlights, 3) Why you are excited for this role.",
  });

  // ==========================================
  // STAGE 2: Education & Resume Projects
  // ==========================================
  const resumeHasContent = (context.resumeText || "").trim().length > 50;
  const projectPromptEn = resumeHasContent
    ? `Thank you for sharing your background. Looking at your resume, you have highlighted work involving ${primarySkill}. Could you walk me through the architecture of your primary project, the core problem it addressed, and your specific technical contributions?`
    : `Thank you for sharing your background. In your journey toward a ${context.role} role, what is the most technically challenging project or application you have built, and what specific responsibilities did you personally handle?`;

  const projectPromptHi = resumeHasContent
    ? `अपने परिचय के लिए धन्यवाद। आपके बायोडाटा में ${primarySkill} पर कार्य का उल्लेख है। क्या आप अपने मुख्य प्रोजेक्ट की रूपरेखा (architecture), उसके उद्देश्य और अपनी व्यक्तिगत तकनीकी भूमिका के बारे में विस्तार से बता सकते हैं?`
    : `अपने परिचय के लिए धन्यवाद। ${context.role} के रूप में आपने अब तक जो सबसे चुनौतीपूर्ण प्रोजेक्ट बनाया है, उसका उद्देश्य और आपकी व्यक्तिगत तकनीकी भूमिका क्या थी?`;

  const projectPromptTe = resumeHasContent
    ? `మీ పరిచయానికి ధన్యవాదాలు. మీ రెజ్యూమ్‌లో ${primarySkill} ప్రాజెక్ట్ ఉంది. మీ ప్రధాన ప్రాజెక్ట్ ఆర్కిటెక్చర్, అది పరిష్కరించిన సమస్య మరియు మీ సాంకేతిక బాధ్యతలను వివరించగలరా?`
    : `మీ పరిచయానికి ధన్యవాదాలు. ${context.role} పాత్రకు సంబంధించి మీరు నిర్మించిన అత్యంత క్లిష్టమైన ప్రాజెక్ట్ ఆర్కిటెక్చర్ మరియు మీ అనుభవాన్ని వివరించగలరా?`;

  questions.push({
    id: "stage_2_resume",
    stage: "stage_2_resume",
    stageNumber: 2,
    totalStages,
    category: "resume_discussion",
    text: projectPromptEn,
    hindiText: projectPromptHi,
    teluguText: projectPromptTe,
    transitionIntro:
      "Thank you for that introduction. Let us now move to your education and resume projects.",
    hindiTransitionIntro:
      "परिचय के लिए धन्यवाद। अब चलिए आपकी शिक्षा और प्रोजेक्ट्स पर चर्चा करते हैं।",
    teluguTransitionIntro:
      "మీ పరిచయానికి ధన్యవాదాలు. ఇప్పుడు మీ విద్య మరియు ప్రాజెక్ట్ అనుభవం గురించి చర్చిద్దాం.",
    contextWhyAsked: `Stage 2: Resume & background deep-dive on stated skills (${primarySkill}). Evaluates real implementation ownership without inventing details.`,
    expectedKeywords: [
      primarySkill,
      "architecture",
      "implemented",
      "database",
      "api",
      "challenges",
      "components",
    ],
    tip: "Clearly articulate: Problem statement -> Architecture / tech stack chosen -> Your individual role -> Tangible results.",
  });

  // ==========================================
  // STAGE 3: JD & Technical Foundations
  // ==========================================
  const techQuestion1En = `Moving on to core technical competencies for the ${context.role} position: Can you explain foundational concepts in ${primarySkill} and ${secondarySkill}, and how you structure clean, maintainable code when designing services with them?`;
  const techQuestion1Hi = `${context.role} पद के लिए मुख्य तकनीकी योग्यताओं पर आते हैं: क्या आप ${primarySkill} और ${secondarySkill} के बुनियादी सिद्धांतों को समझा सकते हैं, और कोड को स्वच्छ व व्यवस्थित रखने के लिए आप क्या तरीके अपनाते हैं?`;
  const techQuestion1Te = `${context.role} ఉద్యోగానికి సంబంధించిన ముఖ్యమైన సాంకేతిక భావనలు: ${primarySkill} మరియు ${secondarySkill} యొక్క ప్రాథమిక సూత్రాలు మరియు క్లీన్ కోడ్ పద్ధతులను మీరు ఎలా పాటిస్తారో వివరించగలరా?`;

  questions.push({
    id: "stage_3_tech_1",
    stage: "stage_3_technical",
    stageNumber: 3,
    totalStages,
    category: "technical",
    text: techQuestion1En,
    hindiText: techQuestion1Hi,
    teluguText: techQuestion1Te,
    transitionIntro:
      "Good explanation. Now let's explore your core technical competencies aligned with the role requirements.",
    hindiTransitionIntro:
      "बहुत बढ़िया। अब इस पद के लिए आवश्यक मुख्य तकनीकी योग्यताओं पर चर्चा करते हैं।",
    teluguTransitionIntro:
      "మంచిది. ఇప్పుడు ఈ ఉద్యోగానికి సంబంధించిన ముఖ్యమైన సాంకేతిక అంశాలను చూద్దాం.",
    contextWhyAsked: `Stage 3: Technical foundations aligned to ${context.role} competencies (${primarySkill}, ${secondarySkill}).`,
    expectedKeywords: [
      primarySkill,
      secondarySkill,
      "design patterns",
      "clean code",
      "testing",
      "modularity",
      "performance",
    ],
    tip: "State definition first, explain why it matters in production, then share a practical code pattern.",
    difficulty: "foundational",
  });

  // ==========================================
  // STAGE 4: Hands-on Coding or SQL Challenge
  // ==========================================
  const codingChallenge = getRoleCodingChallenge(
    context.role,
    context.resumeText || "",
    context.jdText || "",
  );

  questions.push({
    id: "stage_4_coding",
    stage: "stage_4_coding_sql",
    stageNumber: 4,
    totalStages,
    category: "coding_sql",
    text: codingChallenge.text,
    hindiText: codingChallenge.hindiText,
    teluguText: codingChallenge.teluguText,
    transitionIntro:
      "Thank you. Now let's examine your hands-on problem solving with a practical coding challenge.",
    hindiTransitionIntro:
      "धन्यवाद। अब एक व्यावहारिक कोडिंग या SQL प्रश्न के माध्यम से आपकी समस्या-समाधान क्षमता का आकलन करते हैं।",
    teluguTransitionIntro:
      "ధన్యవాదాలు. ఇప్పుడు ఒక ప్రాక్టికల్ కోడింగ్ లేదా SQL సవాలుతో మీ సామర్థ్యాన్ని పరిశీలిద్దాం.",
    contextWhyAsked:
      "Stage 4: Hands-on coding and algorithm/query design. Evaluates code correctness, algorithmic complexity, and structure.",
    expectedKeywords: codingChallenge.expectedKeywords,
    tip: codingChallenge.tip,
    difficulty: "intermediate",
    isCodingChallenge: true,
    codingLanguage: codingChallenge.codingLanguage,
    starterCode: codingChallenge.starterCode,
    sampleInputOutput: codingChallenge.sampleInputOutput,
  });

  // ==========================================
  // STAGE 5: Practical Problem-Solving Scenario
  // ==========================================
  const scenarioEn = `Let's work through a practical engineering scenario: Imagine a critical service in production for ${context.role} experiences sudden high latency, and users report intermittent timeouts during peak traffic. What step-by-step diagnostic workflow would you follow to isolate the root cause, mitigate the immediate issue, and prevent recurrence?`;
  const scenarioHi = `आइए एक व्यावहारिक समस्या समाधान परिदृश्य पर विचार करते हैं: कल्पना करें कि प्रोडक्शन में भारी ट्रैफिक के दौरान आपकी सेवा अचानक बहुत धीमी हो जाती है और टाइमआउट एरर आने लगते हैं। मूल कारण (root cause) पहचानने, तुरंत समाधान करने और इसे दोबारा होने से रोकने के लिए आप क्या क्रमबद्ध कदम उठाएंगे?`;
  const scenarioTe = `ఒక ప్రాక్టికల్ దృష్టాంతాన్ని పరిశీలిద్దాం: అధిక ట్రాఫిక్ సమయంలో సర్వర్ అకస్మాత్తుగా స్లో అయ్యి టైమౌట్ సమస్యలు వచ్చాయి అనుకుందాం. సమస్య యొక్క మూల కారణాన్ని గుర్తించడానికి మరియు శాశ్వత పరిష్కారం కనుగొనడానికి మీరు ఏ క్రమపద్ధతిని పాటిస్తారు?`;

  questions.push({
    id: "stage_5_scenario",
    stage: "stage_5_scenario",
    stageNumber: 5,
    totalStages,
    category: "scenario",
    text: scenarioEn,
    hindiText: scenarioHi,
    teluguText: scenarioTe,
    transitionIntro:
      "Thank you for the solution. Let's now evaluate your reasoning with a realistic engineering incident.",
    hindiTransitionIntro:
      "समाधान के लिए धन्यवाद। अब एक वास्तविक इंजीनियरिंग घटना पर आपकी विश्लेषणात्मक सोच का परीक्षण करते हैं।",
    teluguTransitionIntro:
      "మీ పరిష్కారానికి ధన్యవాదాలు. ఇప్పుడు ఒక వాస్తవిక సమస్యను ఎదుర్కొనే మీ నిర్ణయాధికారాన్ని చూద్దాం.",
    contextWhyAsked:
      "Stage 5: Practical problem-solving scenario. Evaluates structured diagnostic reasoning, triage under pressure, and mitigation strategies.",
    expectedKeywords: [
      "monitoring",
      "logs",
      "metrics",
      "reproduce",
      "database connection pool",
      "rollback",
      "mitigate",
      "root cause",
    ],
    tip: "Structure your response into 4 phases: 1) Triage & stabilize, 2) Diagnostic telemetry & logs, 3) Formulate hypothesis & verify fix, 4) Post-mortem prevention.",
    difficulty: "intermediate",
  });

  // ==========================================
  // STAGE 6: HR & Behavioral (STAR Method)
  // Omitted if interviewType is "technical"
  // ==========================================
  if (!isTechnicalOnly) {
    const behavioralEn = `Can you describe a situation from your past projects or academic teamwork where you faced a tight delivery deadline or had a disagreement with a peer regarding technical direction? How did you communicate, resolve the disagreement, and ensure the project succeeded?`;
    const behavioralHi = `क्या आप अपने पिछले प्रोजेक्ट्स या कॉलेज टीम से ऐसी स्थिति का उदाहरण दे सकते हैं जब समय सीमा बहुत कम थी या किसी तकनीकी निर्णय पर साथी से मतभेद था? आपने संवाद कैसे किया, मतभेद कैसे सुलझाया और काम को सफल कैसे बनाया?`;
    const behavioralTe = `మీరు గతంలో బృందంతో పనిచేసేటప్పుడు ఎదురైన డెడ్‌లైన్ ఒత్తిడి లేదా సాంకేతిక విభేదాల గురించి చెప్పగలరా? మీరు దానిని ఎలా పరిష్కరించారు మరియు ప్రాజెక్ట్ సఫలమయ్యేలా ఎలా చూశారు?`;

    questions.push({
      id: "stage_6_behavioral",
      stage: "stage_6_behavioral",
      stageNumber: 6,
      totalStages,
      category: "behavioral",
      text: behavioralEn,
      hindiText: behavioralHi,
      teluguText: behavioralTe,
      transitionIntro: "Great explanation. Now let's turn to behavioral and teamwork dynamics.",
      hindiTransitionIntro:
        "बहुत अच्छा। अब टीमवर्क, संचार और व्यावहारिक कार्यशैली पर बात करते हैं।",
      teluguTransitionIntro:
        "చాలా బాగుంది. ఇప్పుడు జట్టులో పనిచేసే నైపుణ్యాలు మరియు ప్రవర్తనా అంశాలను పరిశీలిద్దాం.",
      contextWhyAsked:
        "Stage 6: HR and behavioral evaluation. Assesses emotional intelligence, collaboration, and conflict resolution using STAR.",
      expectedKeywords: [
        "situation",
        "task",
        "action",
        "result",
        "communication",
        "compromise",
        "collaboration",
        "learning",
      ],
      tip: "Use the STAR method: Situation (context), Task (goal), Action (what YOU did specifically), Result (measurable positive outcome).",
    });
  }

  // ==========================================
  // STAGE 7: Closing & Candidate Reflection
  // ==========================================
  const closingStageNumber = isTechnicalOnly ? 6 : 7;
  const closingEn = `We have covered your background, resume projects, technical foundations, hands-on coding, and problem-solving methodology. Before we conclude today's screening session, is there anything else you would like to highlight regarding your background, or any questions you have for me regarding this role?`;
  const closingHi = `हमने आपकी पृष्ठभूमि, प्रोजेक्ट्स, तकनीकी कौशल, कोडिंग और समस्या समाधान दृष्टिकोण पर विस्तार से चर्चा कर ली है। आज का साक्षात्कार समाप्त करने से पहले, क्या कुछ ऐसा है जो आप अपनी क्षमताओं के बारे में जोड़ना चाहते हैं, या कोई प्रश्न पूछना चाहते हैं?`;
  const closingTe = `మనం మీ నేపథ్యం, ప్రాజెక్ట్‌లు, సాంకేతిక నైపుణ్యాలు, కోడింగ్ మరియు సమస్య పరిష్కార విధానాన్ని సమగ్రంగా పరిశీలించాము. ముగించే ముందు, మీరు ఇంకా ఏదైనా చెప్పాలనుకుంటున్నారా లేదా ఈ ఉద్యోగం గురించి ఏమైనా అడగాలనుకుంటున్నారా?`;

  questions.push({
    id: "stage_7_closing",
    stage: "stage_7_closing",
    stageNumber: closingStageNumber,
    totalStages,
    category: "closing",
    text: closingEn,
    hindiText: closingHi,
    teluguText: closingTe,
    transitionIntro: "Thank you. We are now approaching the concluding stage of the interview.",
    hindiTransitionIntro: "धन्यवाद। अब हम साक्षात्कार के अंतिम चरण पर पहुँच चुके हैं।",
    teluguTransitionIntro: "ధన్యవాదాలు. ఇప్పుడు మనం ఇంటర్వ్యూ ముగింపు దశకు చేరుకున్నాము.",
    contextWhyAsked:
      "Stage 7: Professional closing and candidate reflection. Provides candidate opportunity for final thoughts.",
    expectedKeywords: ["thank you", "opportunity", "growth", "culture", "enthusiasm", "contribute"],
    tip: "Reiterate genuine enthusiasm for the role, mention any unique strength not yet covered, or ask an insightful question about engineering culture.",
  });

  return questions;
}

/**
 * Returns conversational acknowledgment and transition speech based on candidate answer and next stage
 */
export function getStageTransitionSpeech(
  currentStage: StageKey,
  candidateAnswer: string,
  candidateName?: string,
  lang: Lang = "en",
): string {
  const nameSuffixEn = candidateName ? `, ${candidateName}` : "";
  const nameSuffixHi = candidateName ? ` ${candidateName}` : "";
  const nameSuffixTe = candidateName ? ` ${candidateName}` : "";
  const wordCount = candidateAnswer.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount === 0) {
    if (lang === "hi") return "ठीक है, चलिए अगले विषय पर चलते हैं।";
    if (lang === "te") return "సరే, తదుపరి అంశానికి వెళ్దాం.";
    return "Understood. Let us proceed to the next topic.";
  }

  switch (currentStage) {
    case "stage_1_greeting":
      if (lang === "hi") {
        return `परिचय के लिए बहुत धन्यवाद${nameSuffixHi}। आपसे मिलकर अच्छा लगा। अब चलिए आपके बायोडाटा और मुख्य प्रोजेक्ट्स पर विस्तार से चर्चा करते हैं।`;
      }
      if (lang === "te") {
        return `మీ సమగ్ర పరిచయానికి చాలా ధన్యవాదాలు${nameSuffixTe}। మిమ్మల్ని కలవడం సంతోషంగా ఉంది. ఇప్పుడు మీ ప్రాజెక్ట్‌లు మరియు అనుభవం గురించి చర్చిద్దాం.`;
      }
      return `Thank you for that comprehensive introduction${nameSuffixEn}. It is great to learn about your journey. Let us now move to your resume and project experience.`;

    case "stage_2_resume":
      if (lang === "hi") {
        return `आपके प्रोजेक्ट की रूपरेखा और तकनीकी भूमिका का यह स्पष्ट विवरण बहुत अच्छा लगा। अब इस पद से जुड़े मुख्य तकनीकी सिद्धांतों की ओर बढ़ते हैं।`;
      }
      if (lang === "te") {
        return `మీ ప్రాజెక్ట్ ఆర్కిటెక్చర్ మరియు బాధ్యతల వివరణ చాలా బాగుంది. ఇప్పుడు ఈ పాత్రకు అవసరమైన ప్రధాన సాంకేతిక అంశాలను పరిశీలిద్దాం.`;
      }
      return `Thank you for walking me through your project architecture and responsibilities. Let us now examine your core technical competencies for this role.`;

    case "stage_3_technical":
      if (lang === "hi") {
        return `तकनीकी सिद्धांतों की आपकी व्याख्या बहुत संतोषजनक है। अब आइए एक व्यावहारिक कोडिंग या SQL प्रश्न पर आपकी कार्यशैली देखते हैं।`;
      }
      if (lang === "te") {
        return `సాంకేతిక అంశాలను చక్కగా వివరించారు. ఇప్పుడు ఒక ప్రాక్టికల్ కోడింగ్ లేదా SQL సవాలుతో మీ సామర్థ్యాన్ని చూద్దాం.`;
      }
      return `Good explanation of those technical concepts. Let us now test your hands-on problem solving with a practical coding challenge.`;

    case "stage_4_coding_sql":
      if (lang === "hi") {
        return `कोडिंग प्रश्न पर आपकी तार्किक समझ बहुत अच्छी है। अब आइए एक व्यावहारिक समस्या समाधान परिदृश्य पर आपका दृष्टिकोण देखते हैं।`;
      }
      if (lang === "te") {
        return `కోడింగ్ సవాలును మీరు పరిష్కరించిన తీరు బాగుంది. ఇప్పుడు ఒక వాస్తవిక ఇంజనీరింగ్ సమస్యను మీరు ఎలా ఎదుర్కొంటారో చూద్దాం.`;
      }
      return `I appreciate your structured approach to the coding challenge. Let's now examine your reasoning with a realistic engineering incident.`;

    case "stage_5_scenario":
      if (lang === "hi") {
        return `दबाव के समय समस्या को चरणबद्ध तरीके से सुलझाने की आपकी रणनीति बहुत अच्छी है। अब हम टीमवर्क और व्यावहारिक सहयोग पर चर्चा करेंगे।`;
      }
      if (lang === "te") {
        return `క్లిష్ట సమయంలో సమస్యను పరిష్కరించే మీ ఆలోచనా విధానం బాగుంది. ఇప్పుడు జట్టు సహకారం మరియు ప్రవర్తనా నైపుణ్యాల గురించి తెలుసుకుందాం.`;
      }
      return `I appreciate your methodical diagnostic approach under pressure. Now let us discuss your collaboration, communication, and team dynamics.`;

    case "stage_6_behavioral":
      if (lang === "hi") {
        return `अपने अनुभव को साझा करने के लिए धन्यवाद। सकारात्मक संचार और सहयोग किसी भी टीम के लिए बहुत महत्वपूर्ण हैं। अब हम साक्षात्कार के समापन की ओर बढ़ते हैं।`;
      }
      if (lang === "te") {
        return `మీ అనుభవాన్ని పంచుకున్నందుకు ధన్యవాదాలు. సమష్టి కృషి మరియు పరస్పర సహకారం చాలా ముఖ్యం. ఇప్పుడు మనం ముగింపు దశకు చేరుకున్నాము.`;
      }
      return `Thank you for sharing that experience; constructive communication and teamwork are vital in engineering. We are now at the concluding stage of the interview.`;

    case "stage_7_closing":
      if (lang === "hi") {
        return `आज के इस साक्षात्कार में भाग लेने और अपने विचार साझा करने के लिए आपका बहुत-बहुत धन्यवाद${nameSuffixHi}। मैंने आपका विस्तृत प्रदर्शन मूल्यांकन और कौशल विश्लेषण तैयार कर लिया है।`;
      }
      if (lang === "te") {
        return `ఈ రోజు ఈ మాక్ ఇంటర్వ్యూలో పాల్గొన్నందుకు మీకు చాలా ధన్యవాదాలు${nameSuffixTe}। మీ సమగ్ర పనితీరు నివేదిక మరియు స్కిల్ ఎనాలిసిస్ సిద్ధమైంది.`;
      }
      return `Thank you very much for your time and thoughtful responses today${nameSuffixEn}! It was a pleasure speaking with you. I have compiled your comprehensive performance report and skill analysis.`;

    default:
      return "Thank you for that response. Let us continue.";
  }
}
