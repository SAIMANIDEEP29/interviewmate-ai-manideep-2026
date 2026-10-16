import { t as GoogleGenAI } from "../_libs/@google/genai.mjs";
//#region node_modules/.nitro/vite/services/ssr/index.js
var lastCapturedError;
var TTL_MS = 5e3;
function record(error) {
	lastCapturedError = {
		error,
		at: Date.now()
	};
}
var CAUSE_DEPTH_LIMIT = 5;
var DESCRIPTION_LENGTH_LIMIT = 8e3;
function describeError(error) {
	const parts = [];
	let current = error;
	for (let depth = 0; depth < CAUSE_DEPTH_LIMIT && current != null; depth++) {
		if (!(current instanceof Error)) {
			parts.push(typeof current === "string" ? current : safeStringify(current));
			break;
		}
		const label = depth === 0 ? "" : "caused by: ";
		const status = describeStatus(current);
		parts.push(`${label}${current.stack ?? `${current.name}: ${current.message}`}${status}`);
		current = current.cause;
	}
	return parts.join("\n").slice(0, DESCRIPTION_LENGTH_LIMIT);
}
function describeStatus(error) {
	const { status, statusCode } = error;
	const value = status ?? statusCode;
	return typeof value === "number" ? ` (status ${value})` : "";
}
function safeStringify(value) {
	try {
		return JSON.stringify(value) ?? String(value);
	} catch {
		return String(value);
	}
}
function isErrorLike(value) {
	return value instanceof Error;
}
var originalConsoleError = console.error.bind(console);
console.error = (...args) => {
	originalConsoleError(...args.map((arg) => {
		if (!isErrorLike(arg)) return arg;
		record(arg);
		return describeError(arg);
	}));
};
if (typeof globalThis.addEventListener === "function") {
	globalThis.addEventListener("error", (event) => record(event.error ?? event));
	globalThis.addEventListener("unhandledrejection", (event) => record(event.reason));
}
function consumeLastCapturedError() {
	if (!lastCapturedError) return void 0;
	if (Date.now() - lastCapturedError.at > TTL_MS) {
		lastCapturedError = void 0;
		return;
	}
	const { error } = lastCapturedError;
	lastCapturedError = void 0;
	return error;
}
function renderErrorPage() {
	return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page didn't load</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>This page didn't load</h1>
      <p>Something went wrong on our end. You can try refreshing or head back home.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Try again</button>
        <a class="secondary" href="/">Go home</a>
      </div>
    </div>
  </body>
</html>`;
}
/**
* Extracts key skills from resume text without hallucinating
*/
function extractSkillsFromText(text) {
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
		"Scrum"
	];
	const lower = text.toLowerCase();
	return knownTech.filter((t) => {
		const escaped = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		return new RegExp(`\\b${escaped}\\b`, "i").test(lower);
	});
}
/**
* Builds role-specific coding or SQL challenge
*/
function getRoleCodingChallenge(role, resumeText, jdText) {
	const combined = `${role} ${resumeText} ${jdText}`.toLowerCase();
	if (combined.includes("data") || combined.includes("sql") || combined.includes("backend") || combined.includes("database")) return {
		text: "Write an SQL query to retrieve the top 3 highest-earning employees in each department from an `employees` table (id, name, department_id, salary) and a `departments` table (id, name). Explain your choice between window functions like DENSE_RANK() versus subqueries.",
		hindiText: "एक SQL क्वेरी लिखें जो प्रत्येक विभाग में शीर्ष 3 सर्वाधिक वेतन पाने वाले कर्मचारियों को 'employees' और 'departments' टेबल से निकाले। DENSE_RANK() और सब-क्वेरी के बीच अपने चयन का कारण स्पष्ट करें।",
		teluguText: "ప్రతి విభాగంలో టాప్ 3 అత్యధిక వేతనం పొందే ఉద్యోగులను కనుగొనడానికి ఒక SQL ప్రశ్న రాయండి. DENSE_RANK() విండో ఫంక్షన్ మరియు సబ్‌క్వెరీ మధ్య మీ ఎంపికను వివరించండి.",
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
		sampleInputOutput: "Input: employees table with (id, name, department_id, salary)\nOutput: department_name, employee_name, salary (Ranked 1 to 3 per department)",
		expectedKeywords: [
			"DENSE_RANK",
			"PARTITION BY",
			"CTE",
			"JOIN",
			"ORDER BY",
			"subquery"
		],
		tip: "Use a Common Table Expression (WITH ranked_emp AS ...) with DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) to handle ties gracefully."
	};
	if (combined.includes("python") || combined.includes("ai") || combined.includes("machine learning")) return {
		text: "Write a function in Python that takes a list of integers and returns all unique pairs that sum up to a specific target value. What is the time and space complexity of your approach, and how does using a hash set optimize lookup?",
		hindiText: "पायथन में एक फंक्शन लिखें जो पूर्णांकों की सूची लेता है और उन सभी अनूठे जोड़ों (pairs) को लौटाता है जिनका योग एक विशिष्ट लक्ष्य मान (target) के बराबर हो। अपनी विधि की समय और स्थान जटिलता (complexity) समझाएं।",
		teluguText: "పైథాన్‌లో పూర్ణాంకాల జాబితా ఆధారంగా ఒక నిర్దిష్ట టార్గెట్ మొత్తానికి సమానమయ్యే జంటలను (pairs) తిరిగి ఇచ్చే ఫంక్షన్ రాయండి. దీని టైమ్ మరియు స్పేస్ కాంప్లెక్సిటీని వివరించండి.",
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
		sampleInputOutput: "Input: nums = [2, 7, 11, 15, -2, 6, 3], target = 9\nOutput: [(2, 7), (6, 3)]",
		expectedKeywords: [
			"hash set",
			"complement",
			"O(n)",
			"space complexity",
			"lookup",
			"time complexity"
		],
		tip: "Explain why a single-pass hash set is O(N) time compared to a brute-force nested loop of O(N^2)."
	};
	return {
		text: "Write a utility function in JavaScript or TypeScript that implements a debounced version of an asynchronous search handler. Explain how you manage timers, prevent race conditions from out-of-order network responses, and clean up active requests.",
		hindiText: "जावास्क्रिप्ट या टाइपस्क्रिप्ट में एक ऐसा फंक्शन लिखें जो डिबाउंस (debounce) लागू करता हो। आप टाइमर कैसे प्रबंधित करते हैं और पुराने नेटवर्क अनुरोधों से होने वाली समस्याओं (race conditions) से कैसे बचते हैं?",
		teluguText: "జావాస్క్రిప్ట్ లేదా టైప్‌స్క్రిప్ట్‌లో డిబౌన్స్ (debounce) ఫంక్షన్ రాయండి. టైమర్‌లను ఎలా నిర్వహిస్తారు మరియు నెట్‌వర్క్ రేస్ కండిషన్‌లను ఎలా నివారిస్తారో వివరించండి.",
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
		sampleInputOutput: "Input: Multiple rapid keystrokes within 300ms window\nOutput: Single executed network query after user pauses typing",
		expectedKeywords: [
			"clearTimeout",
			"setTimeout",
			"closure",
			"AbortController",
			"race condition",
			"timer"
		],
		tip: "Mention AbortController for cancelling previous in-flight HTTP requests when a newer input arrives."
	};
}
/**
* Infers core primary and secondary competencies for any arbitrary custom role
*/
function inferRoleSkills(role) {
	const r = (role || "").toLowerCase();
	if (r.includes("python") || r.includes("django") || r.includes("fastapi")) return {
		primary: "Python",
		secondary: "FastAPI / Django & Database ORMs"
	};
	if (r.includes("java") || r.includes("spring")) return {
		primary: "Java & Spring Boot",
		secondary: "Microservices & Hibernate / JPA"
	};
	if (r.includes("frontend") || r.includes("react") || r.includes("vue") || r.includes("angular") || r.includes("ui") || r.includes("web")) return {
		primary: "React & TypeScript",
		secondary: "Modern State Management & CSS Architecture"
	};
	if (r.includes("full") || r.includes("stack")) return {
		primary: "Full-Stack Web Architecture",
		secondary: "RESTful APIs & Database Design"
	};
	if (r.includes("data") && (r.includes("analyst") || r.includes("bi"))) return {
		primary: "SQL & Relational Databases",
		secondary: "Data Warehousing & BI Analytics"
	};
	if (r.includes("ai") || r.includes("ml") || r.includes("machine learning") || r.includes("data scientist")) return {
		primary: "Machine Learning & Model Evaluation",
		secondary: "Python Data Pipelines & Deep Learning"
	};
	if (r.includes("devops") || r.includes("cloud") || r.includes("sre") || r.includes("infrastructure")) return {
		primary: "Docker & Kubernetes",
		secondary: "CI/CD Pipelines & Cloud Infrastructure"
	};
	if (r.includes("qa") || r.includes("sdet") || r.includes("test")) return {
		primary: "Test Automation (Selenium/Playwright)",
		secondary: "API Testing & Quality Engineering"
	};
	if (r.includes("cyber") || r.includes("security")) return {
		primary: "Application Security & OWASP Top 10",
		secondary: "Threat Modeling & Vulnerability Management"
	};
	if (r.includes("mobile") || r.includes("ios") || r.includes("android") || r.includes("flutter")) return {
		primary: "Mobile Architecture & State Management",
		secondary: "Native Device APIs & Performance"
	};
	return {
		primary: role || "Software Engineering",
		secondary: "System Architecture & Engineering Best Practices"
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
function buildStructuredInterviewPlan(context) {
	const isTechnicalOnly = context.type === "technical";
	const totalStages = isTechnicalOnly ? 6 : 7;
	const candidateName = context.name?.trim();
	const resumeSkills = extractSkillsFromText(context.resumeText || "");
	const jdSkills = extractSkillsFromText(context.jdText || "");
	const matched = resumeSkills.filter((s) => jdSkills.map((j) => j.toLowerCase()).includes(s.toLowerCase()));
	const roleSkills = inferRoleSkills(context.role);
	const primarySkill = matched[0] || resumeSkills[0] || roleSkills.primary;
	const secondarySkill = matched[1] || jdSkills[0] || resumeSkills[1] || roleSkills.secondary;
	const questions = [];
	const level = context.level || "fresher";
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
		expectedKeywords: [
			"background",
			"education",
			"passion",
			"skills",
			"projects",
			"interest"
		],
		tip: "Use the Present-Past-Future structure: 1) Who you are now, 2) Relevant academic/project highlights, 3) Why you are excited for this role."
	});
	const resumeHasContent = (context.resumeText || "").trim().length > 50;
	let projectPromptEn = "";
	let projectPromptHi = "";
	let projectPromptTe = "";
	if (level === "fresher") {
		projectPromptEn = resumeHasContent ? `Looking at your resume, you have highlighted your work with ${primarySkill}. Could you walk me through the architecture of your primary project, the core problem it solved, your specific contributions, and the biggest technical challenge you had to overcome while building it?` : `In your academic coursework or personal practice for a ${context.role} position, what is the most interesting project or application you have built, and what specific technical hurdles did you solve while implementing it?`;
		projectPromptHi = resumeHasContent ? `आपके बायोडाटा में ${primarySkill} पर कार्य का उल्लेख है। क्या आप अपने मुख्य प्रोजेक्ट की रूपरेखा, उसके उद्देश्य, आपकी व्यक्तिगत भूमिका और निर्माण के दौरान आई सबसे बड़ी तकनीकी चुनौती के बारे में बता सकते हैं?` : `${context.role} की तैयारी में आपने जो सबसे रुचिकर प्रोजेक्ट बनाया है, उसके उद्देश्य और तकनीकी चुनौतियों के बारे में बताइए।`;
		projectPromptTe = resumeHasContent ? `మీ రెజ్యూమ్‌లో ${primarySkill} ప్రాజెక్ట్ ఉంది. మీ ప్రధాన ప్రాజెక్ట్ ఆర్కిటెక్చర్, అది పరిష్కరించిన సమస్య మరియు మీరు ఎదుర్కొన్న సాంకేతిక సవాళ్లను వివరించగలరా?` : `${context.role} కొరకు మీరు నిర్మించిన ప్రాజెక్ట్ మరియు ఎదురైన సవాళ్లను వివరించగలరా?`;
	} else if (level === "junior" || level === "mid") {
		projectPromptEn = resumeHasContent ? `Reviewing your resume projects featuring ${primarySkill}: Can you explain the end-to-end architecture of a production feature or service you developed? What trade-offs did you make regarding data storage, API design, and error handling?` : `In your engineering journey as a ${context.role}, walk me through a major system or feature you implemented using ${primarySkill}. What architectural choices and testing strategies did you employ to ensure reliability?`;
		projectPromptHi = `आपके प्रोजेक्ट्स में ${primarySkill} का उल्लेख है। क्या आप किसी महत्वपूर्ण प्रोडक्शन फीचर के आर्किटेक्चर, डेटाबेस डिजाइन और एरर हैंडलिंग के बारे में विस्तार से बता सकते हैं?`;
		projectPromptTe = `మీ ప్రాజెక్ట్‌లలో ${primarySkill} అనుభవం ఉంది. మీరు అభివృద్ధి చేసిన ప్రొడక్షన్ ఫీచర్ ఆర్కిటెక్చర్, డేటాబేస్ మరియు ఎర్రర్ హ్యాండ్లింగ్ వివరాలను వివరించండి.`;
	} else {
		projectPromptEn = resumeHasContent ? `Analyzing your experience with ${primarySkill}: Walk me through a complex distributed system or mission-critical initiative you designed. What were the scalability constraints, latency requirements, and how did you navigate architectural trade-offs under production load?` : `For a senior ${context.role}: Can you walk me through an end-to-end system you architected that scaled to high throughput? How did you address fault tolerance, service boundaries, and state management?`;
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
			"trade-offs"
		],
		tip: "Clearly articulate: Problem statement -> Architecture / tech stack chosen -> Your individual role -> Tangible results."
	});
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
			"modular"
		],
		tip: "State definitions clearly, provide real code or design patterns, and explain how they prevent bugs in production.",
		difficulty: level === "fresher" ? "foundational" : level === "junior" ? "intermediate" : "advanced"
	});
	const codingChallenge = getRoleCodingChallenge(context.role, context.resumeText || "", context.jdText || "");
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
		contextWhyAsked: "Stage 4: Hands-on coding and algorithm/query design. Evaluates code correctness, algorithmic complexity, and structure.",
		expectedKeywords: codingChallenge.expectedKeywords,
		tip: codingChallenge.tip,
		difficulty: level === "fresher" ? "foundational" : "intermediate",
		isCodingChallenge: true,
		codingLanguage: codingChallenge.codingLanguage,
		starterCode: codingChallenge.starterCode,
		sampleInputOutput: codingChallenge.sampleInputOutput
	});
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
			"rollback"
		],
		tip: "Structure your response into 4 phases: 1) Triage & stabilize, 2) Diagnostic telemetry & logs, 3) Formulate hypothesis & verify fix, 4) Post-mortem prevention.",
		difficulty: level === "fresher" ? "intermediate" : "advanced"
	});
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
				"learning"
			],
			tip: "Use the STAR method: Situation (context), Task (goal), Action (what YOU did specifically), Result (measurable positive outcome)."
		});
	}
	const closingStageNumber = isTechnicalOnly ? 6 : 7;
	const closingEn = `We have covered your background, resume projects, technical foundations, hands-on coding, and problem-solving methodology for the ${context.role} role. Before we conclude today's screening session, is there anything else you would like to highlight regarding your skills, or any questions you have for me?`;
	questions.push({
		id: "stage_7_closing",
		stage: "stage_7_closing",
		stageNumber: closingStageNumber,
		totalStages,
		category: "closing",
		text: closingEn,
		hindiText: `हमने आपकी पृष्ठभूमि, प्रोजेक्ट्स, तकनीकी कौशल, कोडिंग और समस्या समाधान दृष्टिकोण पर विस्तार से चर्चा कर ली है। आज का साक्षात्कार समाप्त करने से पहले, क्या कुछ ऐसा है जो आप अपनी क्षमताओं के बारे में जोड़ना चाहते हैं, या कोई प्रश्न पूछना चाहते हैं?`,
		teluguText: `మనం మీ నేపథ్యం, ప్రాజెక్ట్‌లు, సాంకేతిక నైపుణ్యాలు, కోడింగ్ మరియు సమస్య పరిష్కార విధానాన్ని సమగ్రంగా పరిశీలించాము. ముగించే ముందు, మీరు ఇంకా ఏదైనా చెప్పాలనుకుంటున్నారా లేదా ఏమైనా అడగాలనుకుంటున్నారా?`,
		transitionIntro: "Stage 7: Professional Closing & Candidate Reflection",
		hindiTransitionIntro: "चरण 7: साक्षात्कार समापन",
		teluguTransitionIntro: "దశ 7: ముగింపు",
		contextWhyAsked: "Stage 7: Professional closing and candidate reflection. Provides candidate opportunity for final thoughts.",
		expectedKeywords: [
			"thank you",
			"opportunity",
			"growth",
			"culture",
			"enthusiasm",
			"contribute"
		],
		tip: "Reiterate genuine enthusiasm for the role, mention any unique strength not yet covered, or ask an insightful question about engineering culture."
	});
	return questions;
}
var genAIClient = null;
function getAIClient() {
	if (genAIClient) return genAIClient;
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) return null;
	genAIClient = new GoogleGenAI({
		apiKey,
		httpOptions: { headers: { "User-Agent": "aistudio-build" } }
	});
	return genAIClient;
}
/**
* Safely calls Gemini API with model fallback: primary gemini-3.8-flash, fallback gemini-3.1-flash-lite
*/
async function callGemini(prompt, systemInstruction) {
	const ai = getAIClient();
	if (!ai) throw new Error("GEMINI_API_KEY is not configured on the server.");
	const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
	let lastError = null;
	for (const model of modelsToTry) try {
		const text = (await ai.models.generateContent({
			model,
			contents: prompt,
			config: {
				systemInstruction: systemInstruction ?? "You are Tesla, an expert human technical interviewer and campus talent assessor conducting an automated placement screening interview. Your demeanor is confident, articulate, respectful, and encouraging. Never ask technical questions during the greeting stage.",
				temperature: .7
			}
		})).text;
		if (text) return text;
	} catch (err) {
		lastError = err instanceof Error ? err : new Error(String(err));
		console.warn(`[AI Studio] Model ${model} failed, trying next fallback:`, lastError.message);
	}
	throw lastError || /* @__PURE__ */ new Error("Failed to generate AI response.");
}
/**
* Analyzes resume and JD documents, constructing the strict multi-stage automated screening interview
*/
async function analyzeDocumentsAI(params) {
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
${resumeText.slice(0, 4e3)}

JOB DESCRIPTION:
${jdText.slice(0, 4e3)}

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
		const cleaned = (await callGemini(prompt, "You are Tesla, an expert human-like technical talent assessor. Output strictly valid JSON with ordered stages starting with Stage 1 Greeting.")).replace(/```json/gi, "").replace(/```/g, "").trim();
		const parsed = JSON.parse(cleaned);
		if (parsed.questions && parsed.questions.length >= 4) {
			const firstQ = parsed.questions[0];
			if (firstQ && firstQ.stage !== "1_introduction") {
				firstQ.stage = "1_introduction";
				firstQ.category = "introduction";
			}
			return parsed;
		}
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		console.warn("[AI Studio] AI analysis fallback triggered:", msg);
	}
	return fallbackDocumentAnalysis(resumeText, jdText, isTechnicalOnly, experienceLevel);
}
/**
* Intelligent local fallback constructing the complete screening interview
*/
function fallbackDocumentAnalysis(resumeText, jdText, isTechnicalOnly, experienceLevel = "fresher") {
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
		"linux"
	];
	const resumeLower = resumeText.toLowerCase();
	const jdLower = jdText.toLowerCase();
	const candidateSkills = commonTech.filter((t) => resumeLower.includes(t));
	const requiredSkills = commonTech.filter((t) => jdLower.includes(t));
	const matchedSkills = candidateSkills.filter((s) => requiredSkills.includes(s));
	const gapSkills = requiredSkills.filter((s) => !candidateSkills.includes(s));
	let detectedRole = "Software Engineer";
	if (jdLower.includes("full-stack") || jdLower.includes("full stack")) detectedRole = "Full-Stack Developer";
	else if (jdLower.includes("frontend") || jdLower.includes("front end")) detectedRole = "Frontend Developer";
	else if (jdLower.includes("backend") || jdLower.includes("back end")) detectedRole = "Backend Developer";
	else if (jdLower.includes("ai") || jdLower.includes("machine learning") || jdLower.includes("ml")) detectedRole = "AI/ML Engineer";
	else if (jdLower.includes("data") || jdLower.includes("analyst")) detectedRole = "Data Engineer";
	const totalStages = isTechnicalOnly ? 6 : 7;
	const primeSkill = matchedSkills[0] || candidateSkills[0] || "core software principles";
	const gapSkill = gapSkills[0] || requiredSkills[1] || "scalability and clean code";
	const codingChallenge = getRoleCodingChallenge(detectedRole, resumeText, jdText);
	const questions = [
		{
			id: "stage1_intro",
			stage: "1_introduction",
			stageNumber: 1,
			totalStages,
			category: "introduction",
			text: `Hello! I am Tesla, your virtual AI interviewer today for this automated screening interview for the ${detectedRole} role. In this session, we will explore your academic background, discuss projects from your resume, evaluate core technical foundations, complete a hands-on coding or SQL challenge, solve a practical engineering scenario, and conclude with behavioral questions. To begin, could you please introduce yourself and walk me through your background?`,
			hindiText: `नमस्ते! मैं आज ${detectedRole} पद के लिए आपके तकनीकी स्क्रीनिंग साक्षात्कार का वर्चुअल AI साक्षात्कारकर्ता टेस्ला हूँ। इस सत्र में, हम आपकी पृष्ठभूमि, प्रोजेक्ट्स, तकनीकी अवधारणाओं, कोडिंग और समस्या-समाधान पर चर्चा करेंगे। शुरू करने के लिए, क्या आप कृपया अपना परिचय दे सकते हैं?`,
			teluguText: `నమస్కారం! నేను ఈ రోజు ${detectedRole} ఉద్యోగం కోసం మీ వర్చువల్ AI ఇంటర్వ్యూవర్ టెస్లాను. ఈ సెషన్‌లో మనం మీ నేపథ్యం, ప్రాజెక్ట్‌లు, సాంకేతిక అంశాలు మరియు సమస్య-పరిష్కార నైపుణ్యాలను చర్చిస్తాము. ప్రారంభించడానికి, దయచేసి మిమ్మల్ని మీరు పరిచయం చేసుకోగలరా?`,
			contextWhyAsked: "Stage 1: Greeting and self-introduction. Establishes rapport and evaluates presentation clarity.",
			expectedKeywords: [
				"background",
				"education",
				"passion",
				"skills",
				"experience",
				"interest"
			],
			tip: "Structure your response into 3 parts: 1) Who you are, 2) Academic and project highlights, 3) Why you are eager for this position."
		},
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
				"contributions"
			],
			tip: "State the problem statement -> Architecture chosen -> Your specific role -> Tangible outcomes."
		},
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
				"performance"
			],
			tip: "Explain the definition first, why it matters in real production environments, then cite a practical pattern.",
			difficulty: "foundational"
		},
		{
			id: "stage4_coding_sql",
			stage: "4_coding_sql",
			stageNumber: 4,
			totalStages,
			category: "coding_sql",
			text: codingChallenge.text,
			hindiText: codingChallenge.hindiText,
			teluguText: codingChallenge.teluguText,
			contextWhyAsked: "Stage 4: Hands-on coding and query design. Evaluates syntax correctness, logic, and algorithmic complexity.",
			expectedKeywords: codingChallenge.expectedKeywords,
			tip: codingChallenge.tip,
			difficulty: "intermediate",
			isCodingChallenge: true,
			codingLanguage: codingChallenge.codingLanguage,
			starterCode: codingChallenge.starterCode,
			sampleInputOutput: codingChallenge.sampleInputOutput
		},
		{
			id: "stage5_scenario",
			stage: "5_scenario",
			stageNumber: 5,
			totalStages,
			category: "scenario",
			text: "Imagine a critical service you maintain in production suddenly experiences high latency and database connection timeouts during a peak traffic event. What systematic diagnostic workflow would you follow to isolate the root cause, mitigate the immediate issue, and restore normal operation?",
			hindiText: "मान लीजिए कि अचानक भारी ट्रैफिक के दौरान सिस्टम बहुत धीमा हो जाता है और डेटाबेस टाइमआउट आने लगते हैं। मूल कारण पहचानने और समस्या हल करने के लिए आप क्या कदम उठाएंगे?",
			teluguText: "ఊహించండి, అధిక ట్రాఫిక్ సమయంలో సర్వర్ డేటాబేస్ సమస్యలు వచ్చాయి. మూల కారణాన్ని కనుగొనడానికి మరియు సమస్యను పరిష్కరించడానికి మీరు ఏ క్రమపద్ధతిని ఉపయోగిస్తారు?",
			contextWhyAsked: "Stage 5: Practical problem-solving scenario evaluating reasoning, diagnostic telemetry, and triage under pressure.",
			expectedKeywords: [
				"logs",
				"metrics",
				"monitoring",
				"database",
				"connection pool",
				"isolate",
				"rollback",
				"mitigate"
			],
			tip: "Structure your response into: 1) Triage & stabilize, 2) Inspect logs & metrics, 3) Formulate hypothesis, 4) Post-incident prevention.",
			difficulty: "intermediate"
		}
	];
	if (!isTechnicalOnly) questions.push({
		id: "stage6_behavioral",
		stage: "6_behavioral",
		stageNumber: 6,
		totalStages,
		category: "behavioral",
		text: "Can you describe a situation where you had a disagreement with a team member or faced a very tight sprint deadline? How did you communicate, resolve the issue, and ensure the deliverable stayed on track?",
		hindiText: "क्या आप किसी ऐसी स्थिति का वर्णन कर सकते हैं जब किसी टीम के सदस्य के साथ मतभेद हुआ हो या कड़ी समय सीमा रही हो? आपने इसे कैसे सुलझाया?",
		teluguText: "మీరు జట్టు సభ్యునితో భిన్నాభిప్రాయాలు లేదా కఠినమైన డెడ్‌లైన్‌ను ఎదుర్కొన్న సందర్భం గురించి చెప్పండి. మీరు దానిని ఎలా పరిష్కరించారు?",
		contextWhyAsked: "Stage 6: Behavioral evaluation assessing teamwork, maturity, and STAR structure.",
		expectedKeywords: [
			"communication",
			"collaboration",
			"resolution",
			"deadline",
			"outcome",
			"learning"
		],
		tip: "Use the STAR method: Situation, Task, Action you took, and final measurable Result."
	});
	const closingStageNumber = isTechnicalOnly ? 6 : 7;
	questions.push({
		id: "stage7_closing",
		stage: "7_closing",
		stageNumber: closingStageNumber,
		totalStages,
		category: "closing",
		text: "We have covered your background, resume projects, technical depth, hands-on coding, and problem-solving methodology. Before we conclude our interview today, is there anything else you would like to highlight regarding your background, or any questions you have for me regarding this role?",
		hindiText: "साक्षात्कार समाप्त करने से पहले, क्या कुछ ऐसा है जो आप अपनी पृष्ठभूमि के बारे में साझा करना चाहते हैं, या कोई प्रश्न पूछना चाहते हैं?",
		teluguText: "ఇంటర్వ్యూ ముగించే ముందు, మీరు మీ గురించి చెప్పాలనుకుంటున్నారా లేదా నన్ను ఏమైనా అడగాలనుకుంటున్నారా?",
		contextWhyAsked: "Stage 7: Professional closing and candidate reflection.",
		expectedKeywords: [
			"questions",
			"growth",
			"culture",
			"thank you",
			"opportunity",
			"contribute"
		],
		tip: "Reiterate your enthusiasm for the role and highlight any key strength not yet covered."
	});
	return {
		detectedRole,
		detectedLevel: experienceLevel || "fresher",
		summary: `Candidate profile analyzed for ${detectedRole}. Found alignment on ${candidateSkills.slice(0, 3).join(", ") || "core fundamentals"}. Structured 7-stage automated screening covers background, resume projects, technical foundations, hands-on coding, scenario reasoning, and behavioral competencies.`,
		requiredSkills: requiredSkills.length ? requiredSkills : [
			"React",
			"TypeScript",
			"Node.js",
			"SQL",
			"Git"
		],
		candidateSkills: candidateSkills.length ? candidateSkills : [
			"JavaScript",
			"HTML/CSS",
			"Python",
			"Git"
		],
		matchedSkills: matchedSkills.length ? matchedSkills : ["Git", "JavaScript"],
		gapSkills: gapSkills.length ? gapSkills : ["System Design", "Cloud Infrastructure"],
		questions
	};
}
/**
* Generates natural, varied, short conversational acknowledgements
*/
function getConversationalAcknowledgement(stage, answer, candidateName) {
	const nameGreeting = candidateName ? `, ${candidateName}` : "";
	if (answer.trim().split(/\s+/).filter(Boolean).length < 5) return "Understood, thank you. Let's move directly to the next topic.";
	if (stage.includes("1") || stage.includes("intro")) {
		const options = [
			`Thank you for that comprehensive introduction${nameGreeting}. It's great to understand your journey.`,
			`I appreciate you walking me through your background${nameGreeting}. Let's dive right into your experience.`,
			`Thank you for sharing your journey${nameGreeting}. You've built a solid foundation.`
		];
		return options[Math.floor(Math.random() * options.length)] ?? options[0];
	}
	if (stage.includes("2") || stage.includes("resume")) {
		const options = [
			"That is a very clear breakdown of your project architecture and responsibilities.",
			"Thank you for walking me through the technical implementation details.",
			"Understood. It's great to hear how you approached that challenge in practice."
		];
		return options[Math.floor(Math.random() * options.length)] ?? options[0];
	}
	if (stage.includes("3") || stage.includes("technical")) {
		const options = [
			"Good explanation of those core principles.",
			"That makes solid sense regarding how you ensure reliability and clean code.",
			"Thank you for explaining your technical reasoning on that concept."
		];
		return options[Math.floor(Math.random() * options.length)] ?? options[0];
	}
	if (stage.includes("4") || stage.includes("coding")) {
		const options = [
			"Thank you for that code implementation and walkthrough.",
			"Good logical structure in your code solution.",
			"I appreciate the attention to time and space complexity in your approach."
		];
		return options[Math.floor(Math.random() * options.length)] ?? options[0];
	}
	if (stage.includes("5") || stage.includes("scenario")) {
		const options = [
			"I appreciate your systematic approach to diagnosing the issue under pressure.",
			"That's a logical and methodical triage strategy.",
			"Good reasoning around isolating root causes and mitigating downtime."
		];
		return options[Math.floor(Math.random() * options.length)] ?? options[0];
	}
	if (stage.includes("6") || stage.includes("behavioral")) {
		const options = [
			"Thank you for sharing that experience; constructive communication is vital in engineering teams.",
			"That highlights good professional maturity and problem resolution.",
			"I appreciate your honesty and focus on collaboration."
		];
		return options[Math.floor(Math.random() * options.length)] ?? options[0];
	}
	if (stage.includes("7") || stage.includes("closing")) return `Thank you very much for your time and thoughtful responses today${nameGreeting}. It was a pleasure speaking with you.`;
	return "Thank you for that response. Let us continue.";
}
/**
* Evaluates candidate's actual answer against question, resume, and JD criteria
*/
async function evaluateAnswerAI(params) {
	const { question, answer, contextWhyAsked, expectedKeywords, lang } = params;
	if (!answer || answer.trim().length < 5) return {
		score: 0,
		metrics: {
			technicalKnowledge: 0,
			communication: 0,
			problemSolving: 0,
			jdRelevance: 0
		},
		strengths: [],
		areasToImprove: ["Question was skipped or no answer was recorded."],
		coachingFeedback: "A partial answer is always better than skipping. Try articulating your thought process or high-level intuition even if you are uncertain.",
		sampleModelAnswer: "Begin by defining the core concept, explaining your technical strategy, and walking through a concrete example."
	};
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
		const cleaned = (await callGemini(prompt, "You are an encouraging, objective technical interviewer evaluating candidate practice responses. Output strictly valid JSON.")).replace(/```json/gi, "").replace(/```/g, "").trim();
		const parsed = JSON.parse(cleaned);
		return {
			score: typeof parsed.score === "number" ? Math.min(10, Math.max(0, parsed.score)) : 6.5,
			metrics: {
				technicalKnowledge: parsed.metrics?.technicalKnowledge ?? 6.5,
				communication: parsed.metrics?.communication ?? 7,
				problemSolving: parsed.metrics?.problemSolving ?? 6.5,
				jdRelevance: parsed.metrics?.jdRelevance ?? 7
			},
			strengths: Array.isArray(parsed.strengths) ? parsed.strengths : ["Demonstrated solid understanding."],
			areasToImprove: Array.isArray(parsed.areasToImprove) ? parsed.areasToImprove : ["Incorporate more architectural trade-offs."],
			coachingFeedback: parsed.coachingFeedback ?? "Good effort. Focus on concrete examples.",
			sampleModelAnswer: parsed.sampleModelAnswer ?? "Structure responses with clear context, action, and results."
		};
	} catch (err) {
		const words = answer.trim().split(/\s+/).length;
		const baseScore = Math.min(9, Math.max(4, Math.round(words / 15) + 3));
		return {
			score: baseScore,
			metrics: {
				technicalKnowledge: baseScore,
				communication: Math.min(10, baseScore + 1),
				problemSolving: baseScore,
				jdRelevance: baseScore
			},
			strengths: ["Clear effort and relevant vocabulary used in response."],
			areasToImprove: ["Consider expanding on edge cases and scalability."],
			coachingFeedback: "Good response. Structuring with the STAR framework will strengthen your delivery.",
			sampleModelAnswer: "Clearly articulate the core concept, implementation details, and trade-offs."
		};
	}
}
var serverEntryPromise;
async function getServerEntry() {
	if (!serverEntryPromise) serverEntryPromise = import("./server-DCg6MtwC.mjs").then((m) => m.default ?? m);
	return serverEntryPromise;
}
async function normalizeCatastrophicSsrResponse(response) {
	if (response.status < 500) return response;
	if (!(response.headers.get("content-type") ?? "").includes("application/json")) return response;
	const body = await response.clone().text();
	if (!isH3SwallowedErrorBody(body)) return response;
	console.error(consumeLastCapturedError() ?? /* @__PURE__ */ new Error(`h3 swallowed SSR error: ${body}`));
	return new Response(renderErrorPage(), {
		status: 500,
		headers: { "content-type": "text/html; charset=utf-8" }
	});
}
function isH3SwallowedErrorBody(body) {
	try {
		const payload = JSON.parse(body);
		return payload.unhandled === true && payload.message === "HTTPError";
	} catch {
		return false;
	}
}
/**
* Handles server-side API proxy routes for Interview AI features
*/
async function handleApiRoute(request) {
	const url = new URL(request.url);
	if (url.pathname === "/api/interview/health") return new Response(JSON.stringify({
		status: "ok",
		geminiConfigured: !!process.env.GEMINI_API_KEY,
		timestamp: Date.now()
	}), { headers: { "content-type": "application/json" } });
	if (url.pathname === "/api/interview/analyze-documents" && request.method === "POST") try {
		const body = await request.json();
		const analysis = await analyzeDocumentsAI({
			resumeText: body.resumeText || "",
			jdText: body.jdText || "",
			interviewType: body.interviewType || "mixed",
			experienceLevel: body.experienceLevel || "fresher",
			lang: body.lang || "en",
			count: body.count || 5
		});
		return new Response(JSON.stringify(analysis), { headers: { "content-type": "application/json" } });
	} catch (err) {
		console.error("[API] analyze-documents error:", err);
		const msg = err instanceof Error ? err.message : "Failed to analyze documents";
		return new Response(JSON.stringify({ error: msg }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
	if (url.pathname === "/api/interview/evaluate-response" && request.method === "POST") try {
		const body = await request.json();
		const evaluation = await evaluateAnswerAI({
			question: body.question,
			answer: body.answer,
			contextWhyAsked: body.contextWhyAsked,
			expectedKeywords: body.expectedKeywords,
			lang: body.lang || "en"
		});
		return new Response(JSON.stringify(evaluation), { headers: { "content-type": "application/json" } });
	} catch (err) {
		console.error("[API] evaluate-response error:", err);
		const msg = err instanceof Error ? err.message : "Failed to evaluate response";
		return new Response(JSON.stringify({ error: msg }), {
			status: 500,
			headers: { "content-type": "application/json" }
		});
	}
	if (url.pathname === "/api/interview/acknowledgement" && request.method === "POST") try {
		const body = await request.json();
		const acknowledgement = getConversationalAcknowledgement(body.stage || "1_introduction", body.answer || "", body.candidateName);
		return new Response(JSON.stringify({ acknowledgement }), { headers: { "content-type": "application/json" } });
	} catch (err) {
		return new Response(JSON.stringify({ acknowledgement: "Thank you. Let us proceed." }), { headers: { "content-type": "application/json" } });
	}
	return null;
}
var server_default = { async fetch(request, env, ctx) {
	try {
		const apiResponse = await handleApiRoute(request);
		if (apiResponse) return apiResponse;
		return await normalizeCatastrophicSsrResponse(await (await getServerEntry()).fetch(request, env, ctx));
	} catch (error) {
		console.error(error);
		return new Response(renderErrorPage(), {
			status: 500,
			headers: { "content-type": "text/html; charset=utf-8" }
		});
	}
} };
//#endregion
export { server_default as default, renderErrorPage as n, buildStructuredInterviewPlan as t };
