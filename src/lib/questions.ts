export type Lang = "en" | "hi" | "te";
export type Category = "hr" | "python" | "java" | "sql" | "web" | "aiml" | "aptitude";
export type InterviewType = "hr" | "technical" | "aptitude";
export type Level = "fresher" | "junior" | "mid" | "senior";

export interface Question {
  id: string;
  category: Category;
  text: Partial<Record<Lang, string>> & { en: string };
  keywords: string[];
  /** For aptitude: accepted answer tokens */
  answer?: string[];
  tip: string;
  minWords: number;
}

export const LANG_CODES: Record<Lang, string> = { en: "en-IN", hi: "hi-IN", te: "te-IN" };
export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  hi: "हिन्दी (Hindi)",
  te: "తెలుగు (Telugu)",
};

export const ROLES: { id: string; label: string; categories: Category[] }[] = [
  { id: "python", label: "Python Developer", categories: ["python", "sql"] },
  { id: "java", label: "Java Developer", categories: ["java", "sql"] },
  { id: "web", label: "Web Developer", categories: ["web"] },
  { id: "data", label: "Data Analyst", categories: ["sql", "python"] },
  { id: "aiml", label: "AI / ML Engineer", categories: ["aiml", "python"] },
  { id: "fullstack", label: "Full-Stack Engineer", categories: ["web", "sql", "java", "python"] },
];

export const BANK: Question[] = [
  // ---------- HR ----------
  {
    id: "hr1",
    category: "hr",
    minWords: 40,
    text: {
      en: "Tell me about yourself.",
      hi: "अपने बारे में कुछ बताइए।",
      te: "మీ గురించి చెప్పండి.",
    },
    keywords: [
      "degree",
      "college",
      "experience",
      "project",
      "skills",
      "passion",
      "learn",
      "team",
      "role",
      "internship",
      "डिग्री",
      "कॉलेज",
      "प्रोजेक्ट",
      "अनुभव",
      "కాలేజీ",
      "ప్రాజెక్ట్",
      "అనుభవం",
      "నైపుణ్యాలు",
    ],
    tip: "Use a present–past–future structure: who you are, what you've done, why this role.",
  },
  {
    id: "hr2",
    category: "hr",
    minWords: 35,
    text: {
      en: "What are your greatest strengths?",
      hi: "आपकी सबसे बड़ी ताकत क्या है?",
      te: "మీ అతిపెద్ద బలాలు ఏమిటి?",
    },
    keywords: [
      "example",
      "problem",
      "team",
      "communication",
      "hardworking",
      "learn",
      "adapt",
      "leadership",
      "result",
      "उदाहरण",
      "टीम",
      "సమస్య",
      "ఉదాహరణ",
      "బృందం",
    ],
    tip: "Name 2–3 strengths and back each with a concrete example.",
  },
  {
    id: "hr3",
    category: "hr",
    minWords: 35,
    text: {
      en: "What is your biggest weakness and how are you working on it?",
      hi: "आपकी सबसे बड़ी कमजोरी क्या है और आप उस पर कैसे काम कर रहे हैं?",
      te: "మీ అతిపెద్ద బలహీనత ఏమిటి, దానిని ఎలా మెరుగుపరుచుకుంటున్నారు?",
    },
    keywords: [
      "improve",
      "working",
      "learn",
      "practice",
      "feedback",
      "course",
      "habit",
      "progress",
      "सुधार",
      "अभ्यास",
      "మెరుగు",
      "సాధన",
    ],
    tip: "Pick a real but non-critical weakness and show the steps you're taking.",
  },
  {
    id: "hr4",
    category: "hr",
    minWords: 30,
    text: {
      en: "Why do you want to join our company?",
      hi: "आप हमारी कंपनी क्यों जॉइन करना चाहते हैं?",
      te: "మీరు మా కంపెనీలో ఎందుకు చేరాలనుకుంటున్నారు?",
    },
    keywords: [
      "growth",
      "culture",
      "learn",
      "technology",
      "values",
      "clients",
      "innovation",
      "career",
      "opportunity",
      "विकास",
      "अवसर",
      "అవకాశం",
      "వృద్ధి",
    ],
    tip: "Connect the company's work and values to your own goals.",
  },
  {
    id: "hr5",
    category: "hr",
    minWords: 30,
    text: {
      en: "Where do you see yourself in five years?",
      hi: "पाँच साल बाद आप खुद को कहाँ देखते हैं?",
      te: "ఐదేళ్ల తర్వాత మిమ్మల్ని మీరు ఎక్కడ చూస్తారు?",
    },
    keywords: [
      "grow",
      "lead",
      "expert",
      "skills",
      "responsibility",
      "contribute",
      "team",
      "certification",
      "लीड",
      "జట్టు",
      "నాయకత్వం",
    ],
    tip: "Show ambition that aligns with the role, not a plan to leave.",
  },
  {
    id: "hr6",
    category: "hr",
    minWords: 40,
    text: {
      en: "Describe a challenging situation you faced and how you handled it.",
      hi: "किसी चुनौतीपूर्ण स्थिति के बारे में बताइए और आपने उसे कैसे संभाला।",
      te: "మీరు ఎదుర్కొన్న ఒక కష్టమైన పరిస్థితిని, దానిని ఎలా ఎదుర్కొన్నారో వివరించండి.",
    },
    keywords: [
      "situation",
      "task",
      "action",
      "result",
      "deadline",
      "team",
      "solved",
      "learned",
      "स्थिति",
      "परिणाम",
      "పరిస్థితి",
      "ఫలితం",
    ],
    tip: "Use the STAR method: Situation, Task, Action, Result.",
  },
  {
    id: "hr7",
    category: "hr",
    minWords: 30,
    text: {
      en: "How do you handle pressure and tight deadlines?",
      hi: "आप दबाव और कम समय सीमा को कैसे संभालते हैं?",
      te: "ఒత్తిడి, గడువులను మీరు ఎలా నిర్వహిస్తారు?",
    },
    keywords: [
      "prioritize",
      "plan",
      "calm",
      "schedule",
      "communicate",
      "break",
      "focus",
      "list",
      "प्राथमिकता",
      "योजना",
      "ప్రణాళిక",
      "ప్రాధాన్యత",
    ],
    tip: "Describe your prioritisation method with a short example.",
  },
  {
    id: "hr8",
    category: "hr",
    minWords: 25,
    text: {
      en: "Are you comfortable working in a team? Give an example.",
      hi: "क्या आप टीम में काम करने में सहज हैं? एक उदाहरण दीजिए।",
      te: "మీరు బృందంలో పని చేయడానికి సౌకర్యంగా ఉంటారా? ఒక ఉదాహరణ ఇవ్వండి.",
    },
    keywords: [
      "team",
      "collaborate",
      "project",
      "role",
      "help",
      "conflict",
      "together",
      "communication",
      "टीम",
      "सहयोग",
      "బృందం",
      "సహకారం",
    ],
    tip: "Highlight your specific role and how you supported others.",
  },
  {
    id: "hr9",
    category: "hr",
    minWords: 20,
    text: {
      en: "Are you willing to relocate or work in shifts?",
      hi: "क्या आप स्थानांतरण या शिफ्ट में काम करने के लिए तैयार हैं?",
      te: "మీరు వేరే ఊరికి వెళ్ళడానికి లేదా షిఫ్టుల్లో పని చేయడానికి సిద్ధమా?",
    },
    keywords: ["yes", "flexible", "willing", "open", "adapt", "हाँ", "तैयार", "అవును", "సిద్ధం"],
    tip: "Be honest and positive; mention any genuine constraints politely.",
  },

  // ---------- Python ----------
  {
    id: "py1",
    category: "python",
    minWords: 25,
    text: {
      en: "What is the difference between a list and a tuple in Python?",
      hi: "Python में list और tuple में क्या अंतर है?",
      te: "Python లో list మరియు tuple మధ్య తేడా ఏమిటి?",
    },
    keywords: [
      "mutable",
      "immutable",
      "brackets",
      "parentheses",
      "faster",
      "hashable",
      "dictionary key",
      "memory",
    ],
    tip: "Mention mutability, syntax, performance and use as dict keys.",
  },
  {
    id: "py2",
    category: "python",
    minWords: 25,
    text: { en: "Explain decorators in Python with a use case." },
    keywords: [
      "function",
      "wrap",
      "@",
      "higher order",
      "logging",
      "timing",
      "authentication",
      "closure",
      "wrapper",
    ],
    tip: "Define it as a function that wraps another, then give logging/auth as an example.",
  },
  {
    id: "py3",
    category: "python",
    minWords: 25,
    text: { en: "What are generators and why would you use them?" },
    keywords: ["yield", "lazy", "memory", "iterator", "next", "large", "stream", "on demand"],
    tip: "Focus on yield, lazy evaluation and memory efficiency.",
  },
  {
    id: "py4",
    category: "python",
    minWords: 25,
    text: { en: "What is the GIL and how does it affect multithreading?" },
    keywords: [
      "global interpreter lock",
      "thread",
      "cpu",
      "io",
      "multiprocessing",
      "one thread",
      "bytecode",
      "asyncio",
    ],
    tip: "Explain CPU-bound vs IO-bound and alternatives like multiprocessing.",
  },
  {
    id: "py5",
    category: "python",
    minWords: 20,
    text: { en: "How do you handle exceptions in Python?" },
    keywords: ["try", "except", "finally", "else", "raise", "custom exception", "error", "logging"],
    tip: "Cover try/except/else/finally and raising custom exceptions.",
  },

  // ---------- Java ----------
  {
    id: "jv1",
    category: "java",
    minWords: 30,
    text: {
      en: "Explain the four pillars of object-oriented programming.",
      hi: "ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग के चार स्तंभ समझाइए।",
      te: "ఆబ్జెక్ట్-ఓరియెంటెడ్ ప్రోగ్రామింగ్ యొక్క నాలుగు స్తంభాలను వివరించండి.",
    },
    keywords: [
      "encapsulation",
      "inheritance",
      "polymorphism",
      "abstraction",
      "class",
      "object",
      "interface",
      "overriding",
    ],
    tip: "Name all four and give a one-line example for each.",
  },
  {
    id: "jv2",
    category: "java",
    minWords: 25,
    text: { en: "What is the difference between an abstract class and an interface in Java?" },
    keywords: [
      "abstract",
      "interface",
      "multiple inheritance",
      "implements",
      "extends",
      "default method",
      "constructor",
      "state",
    ],
    tip: "Compare state, constructors, multiple inheritance and default methods.",
  },
  {
    id: "jv3",
    category: "java",
    minWords: 25,
    text: { en: "How does HashMap work internally?" },
    keywords: [
      "hash",
      "bucket",
      "equals",
      "hashcode",
      "collision",
      "linked list",
      "tree",
      "load factor",
      "resize",
    ],
    tip: "Walk through hashCode → bucket → equals, and collisions/treeification.",
  },
  {
    id: "jv4",
    category: "java",
    minWords: 20,
    text: { en: "What is the difference between == and equals() in Java?" },
    keywords: ["reference", "content", "object", "override", "string", "memory", "compare"],
    tip: "Reference equality vs logical equality, with a String example.",
  },
  {
    id: "jv5",
    category: "java",
    minWords: 25,
    text: { en: "Explain garbage collection in Java." },
    keywords: [
      "heap",
      "memory",
      "unreachable",
      "young",
      "old",
      "generation",
      "jvm",
      "automatic",
      "g1",
    ],
    tip: "Mention heap generations and that unreachable objects are reclaimed.",
  },

  // ---------- SQL ----------
  {
    id: "sq1",
    category: "sql",
    minWords: 25,
    text: {
      en: "What is the difference between INNER JOIN and LEFT JOIN?",
      hi: "INNER JOIN और LEFT JOIN में क्या अंतर है?",
      te: "INNER JOIN మరియు LEFT JOIN మధ్య తేడా ఏమిటి?",
    },
    keywords: ["matching", "rows", "both tables", "null", "left table", "all rows", "records"],
    tip: "Matching rows only vs all rows from the left with NULLs.",
  },
  {
    id: "sq2",
    category: "sql",
    minWords: 25,
    text: { en: "What is normalization? Explain 1NF, 2NF and 3NF briefly." },
    keywords: [
      "redundancy",
      "atomic",
      "partial dependency",
      "transitive",
      "primary key",
      "anomaly",
      "1nf",
      "2nf",
      "3nf",
    ],
    tip: "Explain the goal (reduce redundancy) and each normal form's rule.",
  },
  {
    id: "sq3",
    category: "sql",
    minWords: 20,
    text: { en: "What is the difference between WHERE and HAVING?" },
    keywords: [
      "filter",
      "group by",
      "aggregate",
      "rows",
      "groups",
      "before",
      "after",
      "count",
      "sum",
    ],
    tip: "WHERE filters rows before grouping; HAVING filters groups after.",
  },
  {
    id: "sq4",
    category: "sql",
    minWords: 20,
    text: { en: "What are indexes and when can they hurt performance?" },
    keywords: [
      "faster",
      "lookup",
      "b-tree",
      "read",
      "write",
      "insert",
      "update",
      "storage",
      "query",
    ],
    tip: "Faster reads, slower writes and extra storage.",
  },

  // ---------- Web ----------
  {
    id: "wb1",
    category: "web",
    minWords: 25,
    text: {
      en: "What happens when you type a URL into the browser and press Enter?",
      hi: "जब आप ब्राउज़र में URL टाइप करके Enter दबाते हैं तो क्या होता है?",
      te: "బ్రౌజర్‌లో URL టైప్ చేసి Enter నొక్కినప్పుడు ఏమి జరుగుతుంది?",
    },
    keywords: ["dns", "ip", "tcp", "http", "tls", "server", "response", "render", "html", "dom"],
    tip: "DNS → TCP/TLS → HTTP request → response → parsing & rendering.",
  },
  {
    id: "wb2",
    category: "web",
    minWords: 25,
    text: { en: "Explain the difference between let, const and var in JavaScript." },
    keywords: [
      "scope",
      "block",
      "function",
      "hoisting",
      "reassign",
      "temporal dead zone",
      "redeclare",
    ],
    tip: "Cover scope, hoisting and reassignment.",
  },
  {
    id: "wb3",
    category: "web",
    minWords: 25,
    text: { en: "What is the virtual DOM in React and why is it useful?" },
    keywords: [
      "diff",
      "reconciliation",
      "real dom",
      "update",
      "performance",
      "render",
      "state",
      "component",
    ],
    tip: "Describe diffing/reconciliation and batching of DOM updates.",
  },
  {
    id: "wb4",
    category: "web",
    minWords: 25,
    text: { en: "How do you make a website responsive?" },
    keywords: [
      "media query",
      "flexbox",
      "grid",
      "viewport",
      "mobile first",
      "relative units",
      "breakpoint",
      "rem",
    ],
    tip: "Mention viewport meta, fluid layouts, media queries and mobile-first.",
  },
  {
    id: "wb5",
    category: "web",
    minWords: 20,
    text: { en: "What is REST and what are common HTTP methods?" },
    keywords: [
      "get",
      "post",
      "put",
      "delete",
      "patch",
      "stateless",
      "resource",
      "status code",
      "json",
    ],
    tip: "Define REST principles and map methods to CRUD.",
  },

  // ---------- AI/ML ----------
  {
    id: "ml1",
    category: "aiml",
    minWords: 25,
    text: {
      en: "What is the difference between supervised and unsupervised learning?",
      hi: "सुपरवाइज़्ड और अनसुपरवाइज़्ड लर्निंग में क्या अंतर है?",
      te: "సూపర్వైజ్డ్ మరియు అన్‌సూపర్వైజ్డ్ లెర్నింగ్ మధ్య తేడా ఏమిటి?",
    },
    keywords: [
      "labeled",
      "unlabeled",
      "classification",
      "regression",
      "clustering",
      "target",
      "label",
      "k-means",
    ],
    tip: "Labeled vs unlabeled data, with an example algorithm for each.",
  },
  {
    id: "ml2",
    category: "aiml",
    minWords: 25,
    text: { en: "What is overfitting and how do you prevent it?" },
    keywords: [
      "training",
      "test",
      "generalize",
      "regularization",
      "dropout",
      "cross validation",
      "more data",
      "early stopping",
      "variance",
    ],
    tip: "Define it, then list 3+ prevention techniques.",
  },
  {
    id: "ml3",
    category: "aiml",
    minWords: 25,
    text: { en: "Explain precision, recall and when you would prefer one over the other." },
    keywords: [
      "true positive",
      "false positive",
      "false negative",
      "f1",
      "fraud",
      "medical",
      "spam",
      "trade-off",
    ],
    tip: "Give the formulas intuitively and a domain example for each.",
  },
  {
    id: "ml4",
    category: "aiml",
    minWords: 25,
    text: { en: "How does gradient descent work?" },
    keywords: [
      "loss",
      "gradient",
      "learning rate",
      "minimum",
      "derivative",
      "weights",
      "iteration",
      "step",
    ],
    tip: "Explain moving weights opposite the gradient scaled by learning rate.",
  },
  {
    id: "ml5",
    category: "aiml",
    minWords: 25,
    text: { en: "What is a transformer model and why is attention important?" },
    keywords: [
      "attention",
      "self-attention",
      "sequence",
      "parallel",
      "encoder",
      "decoder",
      "token",
      "context",
    ],
    tip: "Self-attention lets each token weigh context; enables parallelism.",
  },

  // ---------- Aptitude ----------
  {
    id: "ap1",
    category: "aptitude",
    minWords: 1,
    text: {
      en: "A train travels 360 km in 4 hours. What is its speed in km per hour?",
      hi: "एक ट्रेन 4 घंटे में 360 किमी चलती है। उसकी गति किमी प्रति घंटा में क्या है?",
      te: "ఒక రైలు 4 గంటల్లో 360 కి.మీ ప్రయాణిస్తుంది. దాని వేగం గంటకు ఎన్ని కి.మీ?",
    },
    keywords: ["90", "distance", "time"],
    answer: ["90", "ninety", "नब्बे", "తొంభై"],
    tip: "Speed = distance ÷ time = 360 ÷ 4 = 90 km/h.",
  },
  {
    id: "ap2",
    category: "aptitude",
    minWords: 1,
    text: {
      en: "What is 15 percent of 240?",
      hi: "240 का 15 प्रतिशत कितना है?",
      te: "240 లో 15 శాతం ఎంత?",
    },
    keywords: ["36"],
    answer: ["36", "thirty six", "thirty-six", "छत्तीस", "ముప్పై ఆరు"],
    tip: "10% is 24, 5% is 12 → 36.",
  },
  {
    id: "ap3",
    category: "aptitude",
    minWords: 1,
    text: {
      en: "Find the next number in the series: 2, 6, 12, 20, 30, ?",
      hi: "श्रृंखला में अगली संख्या ज्ञात करें: 2, 6, 12, 20, 30, ?",
      te: "శ్రేణిలో తదుపరి సంఖ్య: 2, 6, 12, 20, 30, ?",
    },
    keywords: ["42"],
    answer: ["42", "forty two", "forty-two", "बयालीस", "నలభై రెండు"],
    tip: "Differences are 4, 6, 8, 10, 12 → 42 (or n×(n+1)).",
  },
  {
    id: "ap4",
    category: "aptitude",
    minWords: 1,
    text: { en: "If 5 workers finish a job in 12 days, how many days will 6 workers take?" },
    keywords: ["10"],
    answer: ["10", "ten", "दस", "పది"],
    tip: "Total work = 60 worker-days; 60 ÷ 6 = 10 days.",
  },
  {
    id: "ap5",
    category: "aptitude",
    minWords: 1,
    text: {
      en: "A shopkeeper buys an item for 800 rupees and sells it for 1000. What is the profit percentage?",
    },
    keywords: ["25"],
    answer: ["25", "twenty five", "twenty-five", "पच्चीस", "ఇరవై ఐదు"],
    tip: "Profit 200 on cost 800 → 25%.",
  },
  {
    id: "ap6",
    category: "aptitude",
    minWords: 1,
    text: {
      en: "The average of 4 numbers is 25. If one number is removed, the average becomes 20. What number was removed?",
    },
    keywords: ["40"],
    answer: ["40", "forty", "चालीस", "నలభై"],
    tip: "Sum 100 → remaining 3 sum 60 → removed 40.",
  },
  {
    id: "ap7",
    category: "aptitude",
    minWords: 1,
    text: { en: "If CAT is coded as DBU, how is DOG coded?" },
    keywords: ["eph"],
    answer: ["eph"],
    tip: "Each letter shifts by +1: D→E, O→P, G→H.",
  },
];

/** Deterministic seeded shuffle so a session is reproducible */
function seeded(seed: number) {
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function pickQuestions(
  type: InterviewType,
  roleId: string,
  count: number,
  seed: number,
): Question[] {
  const rnd = seeded(seed);
  const shuffle = <T>(a: T[]) =>
    [...a]
      .map((v) => [rnd(), v] as const)
      .sort((x, y) => x[0] - y[0])
      .map((x) => x[1]);
  let pool: Question[];
  if (type === "hr") pool = BANK.filter((q) => q.category === "hr");
  else if (type === "aptitude") pool = BANK.filter((q) => q.category === "aptitude");
  else {
    const cats = ROLES.find((r) => r.id === roleId)?.categories ?? ["web"];
    pool = BANK.filter((q) => cats.includes(q.category));
  }
  return shuffle(pool).slice(0, Math.min(count, pool.length));
}

export function questionText(q: Question, lang: Lang): { text: string; lang: Lang } {
  const t = q.text[lang];
  return t ? { text: t, lang } : { text: q.text.en, lang: "en" };
}
