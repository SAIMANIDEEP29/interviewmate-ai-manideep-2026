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
 * Infers core primary and secondary competencies for any arbitrary custom role
 */
export function inferRoleSkills(role: string): { primary: string; secondary: string } {
  const r = (role || "").toLowerCase();
  if (r.includes("python") || r.includes("django") || r.includes("fastapi")) {
    return { primary: "Python", secondary: "FastAPI / Django & Database ORMs" };
  }
  if (r.includes("java") || r.includes("spring")) {
    return { primary: "Java & Spring Boot", secondary: "Microservices & Hibernate / JPA" };
  }
  if (
    r.includes("frontend") ||
    r.includes("react") ||
    r.includes("vue") ||
    r.includes("angular") ||
    r.includes("ui") ||
    r.includes("web")
  ) {
    return { primary: "React & TypeScript", secondary: "Modern State Management & CSS Architecture" };
  }
  if (r.includes("full") || r.includes("stack")) {
    return { primary: "Full-Stack Web Architecture", secondary: "RESTful APIs & Database Design" };
  }
  if (r.includes("data") && (r.includes("analyst") || r.includes("bi"))) {
    return { primary: "SQL & Relational Databases", secondary: "Data Warehousing & BI Analytics" };
  }
  if (
    r.includes("ai") ||
    r.includes("ml") ||
    r.includes("machine learning") ||
    r.includes("data scientist")
  ) {
    return { primary: "Machine Learning & Model Evaluation", secondary: "Python Data Pipelines & Deep Learning" };
  }
  if (
    r.includes("devops") ||
    r.includes("cloud") ||
    r.includes("sre") ||
    r.includes("infrastructure")
  ) {
    return { primary: "Docker & Kubernetes", secondary: "CI/CD Pipelines & Cloud Infrastructure" };
  }
  if (r.includes("qa") || r.includes("sdet") || r.includes("test")) {
    return { primary: "Test Automation (Selenium/Playwright)", secondary: "API Testing & Quality Engineering" };
  }
  if (r.includes("cyber") || r.includes("security")) {
    return { primary: "Application Security & OWASP Top 10", secondary: "Threat Modeling & Vulnerability Management" };
  }
  if (
    r.includes("mobile") ||
    r.includes("ios") ||
    r.includes("android") ||
    r.includes("flutter")
  ) {
    return { primary: "Mobile Architecture & State Management", secondary: "Native Device APIs & Performance" };
  }
  return { primary: role || "Software Engineering", secondary: "System Architecture & Engineering Best Practices" };
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

  const roleSkills = inferRoleSkills(context.role);
  const primarySkill =
    matched[0] ||
    resumeSkills[0] ||
    roleSkills.primary;
  const secondarySkill =
    matched[1] || jdSkills[0] || resumeSkills[1] || roleSkills.secondary;

  const questions: StageQuestion[] = [];
  const level = context.level || "fresher";

  // ==========================================
  // STAGE 1: Greeting & Self-Introduction
  // ==========================================
  const candidateGreetingEn = candidateName ? `Hello ${candidateName}` : "Hello";
  const candidateGreetingHi = candidateName ? `नमस्ते ${candidateName}` : "नमस्ते";
  const candidateGreetingTe = candidateName ? `నమస్కారం ${candidateName}` : "నమస్కారం";

  let stage1TextEn = `${candidateGreetingEn}! I am Tesla, your virtual AI interviewer for the ${context.role} position. `;
  let stage1TextHi = `${candidateGreetingHi}! मैं आज ${context.role} पद के लिए आपका वर्चुअल AI साक्षात्कारकर्ता टेस्ला हूँ। `;
  let stage1TextTe = `${candidateGreetingTe}! నేను ఈ రోజు ${context.role} ఉద్యోగం కోసం మీ వర్చువల్ AI ఇంటర్వ్యూవర్ టెస్లాను. `;

  if (level === "fresher") {
    stage1TextEn += `As an entry-level candidate, we would love to learn about your academic journey, personal projects, and core interests. Could you please introduce yourself, share what sparked your enthusiasm for software, and highlight the technical areas you enjoy working on most?`;
    stage1TextHi += `एक फ्रेशर के रूप में, हम आपकी शैक्षणिक यात्रा, व्यक्तिगत प्रोजेक्ट्स और मुख्य रुचियों के बारे में जानना चाहते हैं। क्या आप अपना परिचय दे सकते हैं और बता सकते हैं कि आपको इस क्षेत्र में काम करने की प्रेरणा कहाँ से मिली?`;
    stage1TextTe += `ఒక ఫ్రెషర్‌గా, మీ విద్యా ప్రయాణం, వ్యక్తిగత ప్రాజెక్ట్‌లు మరియు ఆసక్తుల గురించి తెలుసుకోవాలనుకుంటున్నాము. దయచేసి మిమ్మల్ని మీరు పరిచయం చేసుకొని, మీకు ప్రోగ్రామింగ్‌పై ఆసక్తి ఎలా కలిగిందో వివరించగలరా?`;
  } else if (level === "junior") {
    stage1TextEn += `We will be reviewing your hands-on engineering experience, project contributions, and core competencies. To start off, could you please introduce yourself and walk me through your key technical experiences and favorite stack so far?`;
    stage1TextHi += `हम आपके व्यावहारिक इंजीनियरिंग अनुभव और प्रोजेक्ट्स की समीक्षा करेंगे। शुरू करने के लिए, क्या आप कृपया अपना परिचय दे सकते हैं और अपने तकनीकी अनुभव के बारे में बता सकते हैं?`;
    stage1TextTe += `మేము మీ ప్రాక్టికల్ ఇంజనీరింగ్ అనుభవం మరియు ప్రాజెక్ట్ భాగస్వామ్యాన్ని సమీక్షిస్తాము. ప్రారంభించడానికి, దయచేసి మిమ్మల్ని మీరు పరిచయం చేసుకొని మీ సాంకేతిక ప్రయాణాన్ని వివరించగలరా?`;
  } else if (level === "mid") {
    stage1TextEn += `For this mid-level screening, we will focus on system ownership, engineering best practices, and practical problem-solving. To begin, please introduce yourself and summarize the most impactful production systems or features you have built.`;
    stage1TextHi += `इस साक्षात्कार में हम सिस्टम ओनरशिप और इंजीनियरिंग कार्यप्रणालियों पर ध्यान देंगे। शुरू करने के लिए, कृपया अपना परिचय दें और अपने मुख्य प्रोजेक्ट्स का सारांश बताएं।`;
    stage1TextTe += `ఈ ఇంటర్వ్యూలో మనం సిస్టమ్ యాజమాన్యం మరియు ఇంజనీరింగ్ పద్ధతులపై దృష్టి పెడతాము. ప్రారంభించడానికి, దయచేసి మీ పరిచయం మరియు మీరు నిర్మించిన ముఖ్యమైన సిస్టమ్‌ల గురించి చెప్పండి.`;
  } else if (level === "senior") {
    stage1TextEn += `For this senior engineering evaluation, our discussion will center on architectural decisions, scalability, trade-offs, and system resilience. To begin, could you walk me through your engineering background and the scale of systems you have architected or maintained?`;
    stage1TextHi += `इस वरिष्ठ इंजीनियरिंग मूल्यांकन में, हम सिस्टम आर्किटेक्चर, स्केलेबिलिटी और निर्णय लेने की क्षमता पर चर्चा करेंगे। शुरू करने के लिए, कृपया अपनी पृष्ठभूमि और अपने द्वारा प्रबंधित सिस्टम्स के बारे में बताएं।`;
    stage1TextTe += `ఈ సీనియర్ ఇంజనీరింగ్ ఇంటర్వ్యూలో మనం సిస్టమ్ ఆర్కిటెక్చర్, స్కేలబిలిటీ మరియు ముఖ్యమైన నిర్ణయాలను చర్చిస్తాము. ప్రారంభించడానికి, దయచేసి మీ ఇంజనీరింగ్ నేపథ్యాన్ని వివరించండి.`;
  } else {
    // lead / staff
    stage1TextEn += `As a lead or staff candidate, we will explore high-level technical vision, cross-team engineering leadership, and large-scale platform strategy. To start, please introduce yourself and describe the scope of technical leadership and architectural direction you currently drive.`;
    stage1TextHi += `एक तकनीकी लीड के रूप में, हम समग्र तकनीकी दृष्टिकोण और बड़े पैमाने के प्लेटफॉर्म्स पर चर्चा करेंगे। कृपया अपना परिचय दें और अपने तकनीकी नेतृत्व के बारे में बताएं।`;
    stage1TextTe += `ఒక టెక్ లీడ్‌గా, ఉన్నత స్థాయి ఆర్కిటెక్చర్ మరియు బృంద నాయకత్వ అంశాలపై చర్చిస్తాము. దయచేసి మీ పరిచయం మరియు నాయకత్వ అనుభవాన్ని పంచుకోండి.`;
  }

  questions.push({
    id: "stage_1_intro",
    stage: "stage_1_greeting",
    stageNumber: 1,
    totalStages,
    category: "introduction",
    text: stage1TextEn,
    hindiText: stage1TextHi,
    teluguText: stage1TextTe,
    transitionIntro: "Stage 1: Greeting & Self-Introduction",
    hindiTransitionIntro: "चरण 1: अभिवादन और आत्म-परिचय",
    teluguTransitionIntro: "దశ 1: పరిచయం",
    contextWhyAsked: `Stage 1: Greeting & self-introduction calibrated for ${level} level. Establishes rapport and evaluates verbal communication clarity.`,
    expectedKeywords: ["background", "education", "passion", "skills", "projects", "interest"],
    tip: "Use the Present-Past-Future structure: 1) Who you are now, 2) Relevant academic/project highlights, 3) Why you are excited for this role.",
  });

  // ==========================================
  // STAGE 2: Education & Resume Projects
  // ==========================================
  const resumeHasContent = (context.resumeText || "").trim().length > 50;
  let projectPromptEn = "";
  let projectPromptHi = "";
  let projectPromptTe = "";

  if (level === "fresher") {
    projectPromptEn = resumeHasContent
      ? `Looking at your resume, you have highlighted your work with ${primarySkill}. Could you walk me through the architecture of your primary project, the core problem it solved, your specific contributions, and the biggest technical challenge you had to overcome while building it?`
      : `In your academic coursework or personal practice for a ${context.role} position, what is the most interesting project or application you have built, and what specific technical hurdles did you solve while implementing it?`;
    projectPromptHi = resumeHasContent
      ? `आपके बायोडाटा में ${primarySkill} पर कार्य का उल्लेख है। क्या आप अपने मुख्य प्रोजेक्ट की रूपरेखा, उसके उद्देश्य, आपकी व्यक्तिगत भूमिका और निर्माण के दौरान आई सबसे बड़ी तकनीकी चुनौती के बारे में बता सकते हैं?`
      : `${context.role} की तैयारी में आपने जो सबसे रुचिकर प्रोजेक्ट बनाया है, उसके उद्देश्य और तकनीकी चुनौतियों के बारे में बताइए।`;
    projectPromptTe = resumeHasContent
      ? `మీ రెజ్యూమ్‌లో ${primarySkill} ప్రాజెక్ట్ ఉంది. మీ ప్రధాన ప్రాజెక్ట్ ఆర్కిటెక్చర్, అది పరిష్కరించిన సమస్య మరియు మీరు ఎదుర్కొన్న సాంకేతిక సవాళ్లను వివరించగలరా?`
      : `${context.role} కొరకు మీరు నిర్మించిన ప్రాజెక్ట్ మరియు ఎదురైన సవాళ్లను వివరించగలరా?`;
  } else if (level === "junior" || level === "mid") {
    projectPromptEn = resumeHasContent
      ? `Reviewing your resume projects featuring ${primarySkill}: Can you explain the end-to-end architecture of a production feature or service you developed? What trade-offs did you make regarding data storage, API design, and error handling?`
      : `In your engineering journey as a ${context.role}, walk me through a major system or feature you implemented using ${primarySkill}. What architectural choices and testing strategies did you employ to ensure reliability?`;
    projectPromptHi = `आपके प्रोजेक्ट्स में ${primarySkill} का उल्लेख है। क्या आप किसी महत्वपूर्ण प्रोडक्शन फीचर के आर्किटेक्चर, डेटाबेस डिजाइन और एरर हैंडलिंग के बारे में विस्तार से बता सकते हैं?`;
    projectPromptTe = `మీ ప్రాజెక్ట్‌లలో ${primarySkill} అనుభవం ఉంది. మీరు అభివృద్ధి చేసిన ప్రొడక్షన్ ఫీచర్ ఆర్కిటెక్చర్, డేటాబేస్ మరియు ఎర్రర్ హ్యాండ్లింగ్ వివరాలను వివరించండి.`;
  } else {
    // Senior & Lead
    projectPromptEn = resumeHasContent
      ? `Analyzing your experience with ${primarySkill}: Walk me through a complex distributed system or mission-critical initiative you designed. What were the scalability constraints, latency requirements, and how did you navigate architectural trade-offs under production load?`
      : `For a senior ${context.role}: Can you walk me through an end-to-end system you architected that scaled to high throughput? How did you address fault tolerance, service boundaries, and state management?`;
    projectPromptHi = `${primarySkill} के साथ आपके अनुभव को देखते हुए, किसी बड़े पैमाने के डिस्ट्रीब्यूटेड सिस्टम के आर्किटेक्चर, स्केलेबिलिटी और फॉल्ट टॉलरेंस रणनीतियों के बारे में विस्तार से बताइए।`;
    projectPromptTe = `${primarySkill}తో మీ సీనియర్ అనుభవం ఆధారంగా, మీరు రూపొందించిన పెద్ద స్థాయి డిస్ట్రిబ్యూటెడ్ సిస్టమ్ ఆర్కిటెక్చర్ మరియు స్కేలబిలిటీని వివరించండి.`;
  }

  questions.push({
    id: "stage_2_resume",
    stage: "stage_2_resume",
    stageNumber: 2,
    totalStages,
    category: "resume_discussion",
    text: projectPromptEn,
    hindiText: projectPromptHi,
    teluguText: projectPromptTe,
    transitionIntro: "Stage 2: Resume & Technical Project Deep-Dive",
    hindiTransitionIntro: "चरण 2: प्रोजेक्ट्स और बायोडाटा पर चर्चा",
    teluguTransitionIntro: "దశ 2: ప్రాజెక్ట్ వివరాలు",
    contextWhyAsked: `Stage 2: Resume deep-dive on ${primarySkill} calibrated for ${level} level. Evaluates implementation ownership and architecture clarity.`,
    expectedKeywords: [
      primarySkill,
      "architecture",
      "implemented",
      "database",
      "api",
      "challenges",
      "trade-offs",
    ],
    tip: "Clearly articulate: Problem statement -> Architecture / tech stack chosen -> Your individual role -> Tangible results.",
  });

  // ==========================================
  // STAGE 3: JD & Technical Foundations
  // ==========================================
  let techQuestionEn = "";
  let techQuestionHi = "";
  let techQuestionTe = "";

  if (level === "fresher") {
    techQuestionEn = `Turning to technical fundamentals for the ${context.role} role: Can you explain core principles in ${primarySkill} and ${secondarySkill}? For example, how memory or state is managed, and what practices you follow to keep your code clean, modular, and bug-free?`;
    techQuestionHi = `${context.role} के तकनीकी सिद्धांतों पर आते हैं: क्या आप ${primarySkill} और ${secondarySkill} के बुनियादी सिद्धांतों और क्लीन कोड लिखने के तरीकों को समझा सकते हैं?`;
    techQuestionTe = `${context.role} యొక్క ప్రాథమిక సాంకేతిక సూత్రాలు: ${primarySkill} మరియు ${secondarySkill} లోని ముఖ్య భావనలు మరియు క్లీన్ కోడ్ పద్ధతులను వివరించగలరా?`;
  } else if (level === "junior" || level === "mid") {
    techQuestionEn = `Exploring technical depth for ${context.role}: How do you approach concurrency, asynchronous processing, and caching when developing services with ${primarySkill}? Can you share an example of how you optimized query performance or memory consumption?`;
    techQuestionHi = `${context.role} में तकनीकी गहराई पर: ${primarySkill} के साथ काम करते समय आप कॉनकरेंसी (concurrency), कैशिंग और परफॉरमेंस ऑप्टिमाइज़ेशन को कैसे संभालते हैं?`;
    techQuestionTe = `${context.role} లో సాంకేతిక నైపుణ్యాలు: ${primarySkill} లో కాన్కరెన్సీ, క్యాషింగ్ మరియు పెర్ఫార్మెన్స్ ఆప్టిమైజేషన్ ఎలా చేస్తారో ఉదాహరణతో చెప్పగలరా?`;
  } else {
    // Senior & Lead
    techQuestionEn = `Assessing senior engineering foundations for ${context.role}: In a distributed environment using ${primarySkill} and ${secondarySkill}, how do you guarantee data consistency versus availability during network partitions? Walk me through your approach to idempotency, schema migrations, and zero-downtime deployments.`;
    techQuestionHi = `${context.role} के वरिष्ठ तकनीकी स्तर पर: डिस्ट्रीब्यूटेड वातावरण में डेटा निरंतरता (consistency), आइडमपोटेंसी (idempotency) और जीरो-डाउनटाइम डिप्लॉयमेंट को आप कैसे डिजाइन करते हैं?`;
    techQuestionTe = `సీనియర్ ఇంజనీరింగ్ సూత్రాలు: డిస్ట్రిబ్యూటెడ్ ఆర్కిటెక్చర్‌లో డేటా కన్సిస్టెన్సీ, ఐడెంపోటెన్సీ మరియు జీరో-డౌన్‌టైమ్ డిప్లాయ్‌మెంట్ ఎలా సాధిస్తారు?`;
  }

  questions.push({
    id: "stage_3_tech_1",
    stage: "stage_3_technical",
    stageNumber: 3,
    totalStages,
    category: "technical",
    text: techQuestionEn,
    hindiText: techQuestionHi,
    teluguText: techQuestionTe,
    transitionIntro: "Stage 3: Technical Fundamentals & Depth",
    hindiTransitionIntro: "चरण 3: तकनीकी बुनियादी सिद्धांत",
    teluguTransitionIntro: "దశ 3: సాంకేతిక నైపుణ్యాలు",
    contextWhyAsked: `Stage 3: Technical foundations aligned to ${context.role} competencies (${primarySkill}, ${secondarySkill}) at ${level} seniority.`,
    expectedKeywords: [
      primarySkill,
      secondarySkill,
      "performance",
      "clean code",
      "scalability",
      "concurrency",
      "modular",
    ],
    tip: "State definitions clearly, provide real code or design patterns, and explain how they prevent bugs in production.",
    difficulty: level === "fresher" ? "foundational" : level === "junior" ? "intermediate" : "advanced",
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
    transitionIntro: "Stage 4: Hands-on Coding & Algorithm Challenge",
    hindiTransitionIntro: "चरण 4: व्यावहारिक कोडिंग चुनौती",
    teluguTransitionIntro: "దశ 4: కోడింగ్ సవాలు",
    contextWhyAsked:
      "Stage 4: Hands-on coding and algorithm/query design. Evaluates code correctness, algorithmic complexity, and structure.",
    expectedKeywords: codingChallenge.expectedKeywords,
    tip: codingChallenge.tip,
    difficulty: level === "fresher" ? "foundational" : "intermediate",
    isCodingChallenge: true,
    codingLanguage: codingChallenge.codingLanguage,
    starterCode: codingChallenge.starterCode,
    sampleInputOutput: codingChallenge.sampleInputOutput,
  });

  // ==========================================
  // STAGE 5: Practical Problem-Solving Scenario
  // ==========================================
  let scenarioEn = "";
  let scenarioHi = "";
  let scenarioTe = "";

  if (level === "fresher") {
    scenarioEn = `Imagine you are working on a new feature for ${context.role}, and your unit test or local server fails with an unexpected exception that you have never seen before. Walk me through how you systematically debug the issue, inspect stack traces, search documentation, and verify your fix.`;
    scenarioHi = `कल्पना कीजिए कि आप ${context.role} के लिए एक नया फीचर बना रहे हैं और एक अज्ञात एरर आ जाता है। आप इस समस्या को चरणबद्ध तरीके से कैसे डीबग करेंगे, लॉग्स कैसे देखेंगे और समाधान कैसे सत्यापित करेंगे?`;
    scenarioTe = `మీరు ${context.role} కోసం కోడ్ రాస్తున్నప్పుడు ఊహించని ఎర్రర్ వస్తే, దాన్ని క్రమపద్ధతిలో ఎలా డీబగ్ చేస్తారు మరియు సరిచూస్తారు?`;
  } else if (level === "junior" || level === "mid") {
    scenarioEn = `Let's consider a realistic scenario for ${context.role}: After deploying a new release to staging or production, API response times jump by 500% and database connection pool exhaustion errors appear in the logs. What step-by-step diagnostic workflow would you follow to triage the incident, roll back or mitigate, and isolate the root cause?`;
    scenarioHi = `एक वास्तविक परिदृश्य: प्रोडक्शन रिलीज के बाद API रिस्पॉन्स टाइम 500% बढ़ जाता है और डेटाबेस कनेक्शन एरर आने लगते हैं। आप घटना को संभालने, तुरंत सुधारने और मूल कारण ढूंढने के लिए क्या कदम उठाएंगे?`;
    scenarioTe = `ప్రొడక్షన్ రిలీజ్ తర్వాత API చాలా స్లో అయ్యి డేటాబేస్ ఎర్రర్స్ వస్తే, మీరు ఎలా స్పందిస్తారు మరియు మూల కారణాన్ని ఎలా పరిష్కరిస్తారు?`;
  } else {
    // Senior & Lead
    scenarioEn = `During a major high-traffic flash event, your distributed service experiences cascading failures, downstream dependency timeouts, and intermittent memory leaks leading to container OOM kills. As the senior technical lead for ${context.role}, how do you manage the active incident, enforce circuit breakers, shed non-critical load, and lead the subsequent post-mortem investigation?`;
    scenarioHi = `भारी ट्रैफिक के दौरान आपकी डिस्ट्रीब्यूटेड सेवा में कैस्केडिंग विफलताएं और मेमोरी लीक होने लगते हैं। एक सीनियर लीड के रूप में, आप तत्काल लोड शेडिंग, सर्किट ब्रेकर और पोस्ट-मॉर्टम जांच का नेतृत्व कैसे करेंगे?`;
    scenarioTe = `భారీ ట్రాఫిక్ సమయంలో సర్వర్లు డౌన్ అయ్యి మెమరీ లీక్స్ వస్తే, సీనియర్ టెక్ లీడ్‌గా మీరు ఇన్సిడెంట్ మేనేజ్‌మెంట్ మరియు సర్క్యూట్ బ్రేకింగ్ ఎలా అమలు చేస్తారు?`;
  }

  questions.push({
    id: "stage_5_scenario",
    stage: "stage_5_scenario",
    stageNumber: 5,
    totalStages,
    category: "scenario",
    text: scenarioEn,
    hindiText: scenarioHi,
    teluguText: scenarioTe,
    transitionIntro: "Stage 5: Practical Problem-Solving & Production Scenario",
    hindiTransitionIntro: "चरण 5: व्यावहारिक समस्या-समाधान परिदृश्य",
    teluguTransitionIntro: "దశ 5: సమస్య పరిష్కార దృష్టాంతం",
    contextWhyAsked: `Stage 5: Practical scenario calibrated for ${level} level. Evaluates diagnostic reasoning, triage under pressure, and mitigation strategies.`,
    expectedKeywords: [
      "logs",
      "metrics",
      "monitoring",
      "root cause",
      "mitigate",
      "reproduce",
      "rollback",
    ],
    tip: "Structure your response into 4 phases: 1) Triage & stabilize, 2) Diagnostic telemetry & logs, 3) Formulate hypothesis & verify fix, 4) Post-mortem prevention.",
    difficulty: level === "fresher" ? "intermediate" : "advanced",
  });

  // ==========================================
  // STAGE 6: HR & Behavioral (STAR Method)
  // Omitted if interviewType is "technical"
  // ==========================================
  if (!isTechnicalOnly) {
    let behavioralEn = "";
    let behavioralHi = "";
    let behavioralTe = "";

    if (level === "fresher") {
      behavioralEn = `Can you describe a situation from your college group projects, internship, or hackathons where you and a teammate had differing opinions on how to build a feature, or faced an impending deadline? How did you communicate, reach an agreement, and ensure the project was delivered?`;
      behavioralHi = `कॉलेज प्रोजेक्ट या हैकथॉन से ऐसी स्थिति बताएं जब किसी तकनीकी बात पर साथी से अलग राय थी या समय कम था। आपने संवाद कैसे किया और प्रोजेक्ट को सफल कैसे बनाया?`;
      behavioralTe = `కాలేజ్ ప్రాజెక్ట్ లేదా ఇంటర్న్‌షిప్‌లో సహోద్యోగితో అభిప్రాయ భేదాలు వచ్చినప్పుడు మీరు ఎలా మాట్లాడి సమస్యను పరిష్కరించారో చెప్పండి?`;
    } else if (level === "junior" || level === "mid") {
      behavioralEn = `Tell me about a time in your engineering career where requirements changed late in a sprint or you discovered that an initial technical approach would not scale in time for a deadline. How did you communicate with product stakeholders, negotiate trade-offs, and align the team?`;
      behavioralHi = `अपने करियर का ऐसा उदाहरण बताएं जब प्रोजेक्ट की आवश्यकताएं अचानक बदल गईं। आपने स्टेकहोल्डर्स के साथ कैसे समन्वय किया और समय पर काम पूरा किया?`;
      behavioralTe = `ప్రాజెక్ట్ అవసరాలు మారినప్పుడు మీరు టీమ్‌తో ఎలా మాట్లాడి ప్రాజెక్ట్‌ను విజయవంతం చేశారో వివరించండి.`;
    } else {
      // Senior & Lead
      behavioralEn = `As a senior technical leader for ${context.role}, describe a situation where you had to push back against a high-pressure stakeholder request to prevent severe architectural debt, or navigate a strong technical disagreement between senior engineers. How did you build consensus and guide the engineering culture?`;
      behavioralHi = `एक वरिष्ठ इंजीनियर के रूप में, किसी ऐसी स्थिति का वर्णन करें जब आपको तकनीकी ऋण (tech debt) रोकने के लिए किसी निर्णय का विरोध करना पड़ा या दो टीमों के बीच मतभेद सुलझाना पड़ा। आपने सहमति कैसे बनाई?`;
      behavioralTe = `ఒక సీనియర్ ఇంజనీర్‌గా, సాంకేతిక విభేదాలను పరిష్కరించి అందరినీ ఒకే తాటిపైకి తెచ్చిన సందర్భాన్ని వివరించండి.`;
    }

    questions.push({
      id: "stage_6_behavioral",
      stage: "stage_6_behavioral",
      stageNumber: 6,
      totalStages,
      category: "behavioral",
      text: behavioralEn,
      hindiText: behavioralHi,
      teluguText: behavioralTe,
      transitionIntro: "Stage 6: Behavioral & Cross-Functional Dynamics",
      hindiTransitionIntro: "चरण 6: व्यावहारिक और टीमवर्क कौशल",
      teluguTransitionIntro: "దశ 6: ప్రవర్తనా నైపుణ్యాలు",
      contextWhyAsked: `Stage 6: Behavioral evaluation using STAR method calibrated for ${level} engineering level.`,
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
  const closingEn = `We have covered your background, resume projects, technical foundations, hands-on coding, and problem-solving methodology for the ${context.role} role. Before we conclude today's screening session, is there anything else you would like to highlight regarding your skills, or any questions you have for me?`;
  const closingHi = `हमने आपकी पृष्ठभूमि, प्रोजेक्ट्स, तकनीकी कौशल, कोडिंग और समस्या समाधान दृष्टिकोण पर विस्तार से चर्चा कर ली है। आज का साक्षात्कार समाप्त करने से पहले, क्या कुछ ऐसा है जो आप अपनी क्षमताओं के बारे में जोड़ना चाहते हैं, या कोई प्रश्न पूछना चाहते हैं?`;
  const closingTe = `మనం మీ నేపథ్యం, ప్రాజెక్ట్‌లు, సాంకేతిక నైపుణ్యాలు, కోడింగ్ మరియు సమస్య పరిష్కార విధానాన్ని సమగ్రంగా పరిశీలించాము. ముగించే ముందు, మీరు ఇంకా ఏదైనా చెప్పాలనుకుంటున్నారా లేదా ఏమైనా అడగాలనుకుంటున్నారా?`;

  questions.push({
    id: "stage_7_closing",
    stage: "stage_7_closing",
    stageNumber: closingStageNumber,
    totalStages,
    category: "closing",
    text: closingEn,
    hindiText: closingHi,
    teluguText: closingTe,
    transitionIntro: "Stage 7: Professional Closing & Candidate Reflection",
    hindiTransitionIntro: "चरण 7: साक्षात्कार समापन",
    teluguTransitionIntro: "దశ 7: ముగింపు",
    contextWhyAsked:
      "Stage 7: Professional closing and candidate reflection. Provides candidate opportunity for final thoughts.",
    expectedKeywords: ["thank you", "opportunity", "growth", "culture", "enthusiasm", "contribute"],
    tip: "Reiterate genuine enthusiasm for the role, mention any unique strength not yet covered, or ask an insightful question about engineering culture.",
  });

  return questions;
}

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
