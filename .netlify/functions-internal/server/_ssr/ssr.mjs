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
	const primarySkill = matched[0] || resumeSkills[0] || (context.role.toLowerCase().includes("python") ? "Python" : "JavaScript/TypeScript");
	const secondarySkill = matched[1] || jdSkills[0] || resumeSkills[1] || "RESTful APIs & Database Design";
	const questions = [];
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
		contextWhyAsked: "Stage 1: Greeting & self-introduction. Establishes rapport and evaluates communication clarity.",
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
	const projectPromptEn = resumeHasContent ? `Thank you for sharing your background. Looking at your resume, you have highlighted work involving ${primarySkill}. Could you walk me through the architecture of your primary project, the core problem it addressed, and your specific technical contributions?` : `Thank you for sharing your background. In your journey toward a ${context.role} role, what is the most technically challenging project or application you have built, and what specific responsibilities did you personally handle?`;
	const projectPromptHi = resumeHasContent ? `अपने परिचय के लिए धन्यवाद। आपके बायोडाटा में ${primarySkill} पर कार्य का उल्लेख है। क्या आप अपने मुख्य प्रोजेक्ट की रूपरेखा (architecture), उसके उद्देश्य और अपनी व्यक्तिगत तकनीकी भूमिका के बारे में विस्तार से बता सकते हैं?` : `अपने परिचय के लिए धन्यवाद। ${context.role} के रूप में आपने अब तक जो सबसे चुनौतीपूर्ण प्रोजेक्ट बनाया है, उसका उद्देश्य और आपकी व्यक्तिगत तकनीकी भूमिका क्या थी?`;
	const projectPromptTe = resumeHasContent ? `మీ పరిచయానికి ధన్యవాదాలు. మీ రెజ్యూమ్‌లో ${primarySkill} ప్రాజెక్ట్ ఉంది. మీ ప్రధాన ప్రాజెక్ట్ ఆర్కిటెక్చర్, అది పరిష్కరించిన సమస్య మరియు మీ సాంకేతిక బాధ్యతలను వివరించగలరా?` : `మీ పరిచయానికి ధన్యవాదాలు. ${context.role} పాత్రకు సంబంధించి మీరు నిర్మించిన అత్యంత క్లిష్టమైన ప్రాజెక్ట్ ఆర్కిటెక్చర్ మరియు మీ అనుభవాన్ని వివరించగలరా?`;
	questions.push({
		id: "stage_2_resume",
		stage: "stage_2_resume",
		stageNumber: 2,
		totalStages,
		category: "resume_discussion",
		text: projectPromptEn,
		hindiText: projectPromptHi,
		teluguText: projectPromptTe,
		transitionIntro: "Thank you for that introduction. Let us now move to your education and resume projects.",
		hindiTransitionIntro: "परिचय के लिए धन्यवाद। अब चलिए आपकी शिक्षा और प्रोजेक्ट्स पर चर्चा करते हैं।",
		teluguTransitionIntro: "మీ పరిచయానికి ధన్యవాదాలు. ఇప్పుడు మీ విద్య మరియు ప్రాజెక్ట్ అనుభవం గురించి చర్చిద్దాం.",
		contextWhyAsked: `Stage 2: Resume & background deep-dive on stated skills (${primarySkill}). Evaluates real implementation ownership without inventing details.`,
		expectedKeywords: [
			primarySkill,
			"architecture",
			"implemented",
			"database",
			"api",
			"challenges",
			"components"
		],
		tip: "Clearly articulate: Problem statement -> Architecture / tech stack chosen -> Your individual role -> Tangible results."
	});
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
		transitionIntro: "Good explanation. Now let's explore your core technical competencies aligned with the role requirements.",
		hindiTransitionIntro: "बहुत बढ़िया। अब इस पद के लिए आवश्यक मुख्य तकनीकी योग्यताओं पर चर्चा करते हैं।",
		teluguTransitionIntro: "మంచిది. ఇప్పుడు ఈ ఉద్యోగానికి సంబంధించిన ముఖ్యమైన సాంకేతిక అంశాలను చూద్దాం.",
		contextWhyAsked: `Stage 3: Technical foundations aligned to ${context.role} competencies (${primarySkill}, ${secondarySkill}).`,
		expectedKeywords: [
			primarySkill,
			secondarySkill,
			"design patterns",
			"clean code",
			"testing",
			"modularity",
			"performance"
		],
		tip: "State definition first, explain why it matters in production, then share a practical code pattern.",
		difficulty: "foundational"
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
		transitionIntro: "Thank you. Now let's examine your hands-on problem solving with a practical coding challenge.",
		hindiTransitionIntro: "धन्यवाद। अब एक व्यावहारिक कोडिंग या SQL प्रश्न के माध्यम से आपकी समस्या-समाधान क्षमता का आकलन करते हैं।",
		teluguTransitionIntro: "ధన్యవాదాలు. ఇప్పుడు ఒక ప్రాక్టికల్ కోడింగ్ లేదా SQL సవాలుతో మీ సామర్థ్యాన్ని పరిశీలిద్దాం.",
		contextWhyAsked: "Stage 4: Hands-on coding and algorithm/query design. Evaluates code correctness, algorithmic complexity, and structure.",
		expectedKeywords: codingChallenge.expectedKeywords,
		tip: codingChallenge.tip,
		difficulty: "intermediate",
		isCodingChallenge: true,
		codingLanguage: codingChallenge.codingLanguage,
		starterCode: codingChallenge.starterCode,
		sampleInputOutput: codingChallenge.sampleInputOutput
	});
	const scenarioEn = `Let's work through a practical engineering scenario: Imagine a critical service in production for ${context.role} experiences sudden high latency, and users report intermittent timeouts during peak traffic. What step-by-step diagnostic workflow would you follow to isolate the root cause, mitigate the immediate issue, and prevent recurrence?`;
	questions.push({
		id: "stage_5_scenario",
		stage: "stage_5_scenario",
		stageNumber: 5,
		totalStages,
		category: "scenario",
		text: scenarioEn,
		hindiText: `आइए एक व्यावहारिक समस्या समाधान परिदृश्य पर विचार करते हैं: कल्पना करें कि प्रोडक्शन में भारी ट्रैफिक के दौरान आपकी सेवा अचानक बहुत धीमी हो जाती है और टाइमआउट एरर आने लगते हैं। मूल कारण (root cause) पहचानने, तुरंत समाधान करने और इसे दोबारा होने से रोकने के लिए आप क्या क्रमबद्ध कदम उठाएंगे?`,
		teluguText: `ఒక ప్రాక్టికల్ దృష్టాంతాన్ని పరిశీలిద్దాం: అధిక ట్రాఫిక్ సమయంలో సర్వర్ అకస్మాత్తుగా స్లో అయ్యి టైమౌట్ సమస్యలు వచ్చాయి అనుకుందాం. సమస్య యొక్క మూల కారణాన్ని గుర్తించడానికి మరియు శాశ్వత పరిష్కారం కనుగొనడానికి మీరు ఏ క్రమపద్ధతిని పాటిస్తారు?`,
		transitionIntro: "Thank you for the solution. Let's now evaluate your reasoning with a realistic engineering incident.",
		hindiTransitionIntro: "समाधान के लिए धन्यवाद। अब एक वास्तविक इंजीनियरिंग घटना पर आपकी विश्लेषणात्मक सोच का परीक्षण करते हैं।",
		teluguTransitionIntro: "మీ పరిష్కారానికి ధన్యవాదాలు. ఇప్పుడు ఒక వాస్తవిక సమస్యను ఎదుర్కొనే మీ నిర్ణయాధికారాన్ని చూద్దాం.",
		contextWhyAsked: "Stage 5: Practical problem-solving scenario. Evaluates structured diagnostic reasoning, triage under pressure, and mitigation strategies.",
		expectedKeywords: [
			"monitoring",
			"logs",
			"metrics",
			"reproduce",
			"database connection pool",
			"rollback",
			"mitigate",
			"root cause"
		],
		tip: "Structure your response into 4 phases: 1) Triage & stabilize, 2) Diagnostic telemetry & logs, 3) Formulate hypothesis & verify fix, 4) Post-mortem prevention.",
		difficulty: "intermediate"
	});
	if (!isTechnicalOnly) questions.push({
		id: "stage_6_behavioral",
		stage: "stage_6_behavioral",
		stageNumber: 6,
		totalStages,
		category: "behavioral",
		text: `Can you describe a situation from your past projects or academic teamwork where you faced a tight delivery deadline or had a disagreement with a peer regarding technical direction? How did you communicate, resolve the disagreement, and ensure the project succeeded?`,
		hindiText: `क्या आप अपने पिछले प्रोजेक्ट्स या कॉलेज टीम से ऐसी स्थिति का उदाहरण दे सकते हैं जब समय सीमा बहुत कम थी या किसी तकनीकी निर्णय पर साथी से मतभेद था? आपने संवाद कैसे किया, मतभेद कैसे सुलझाया और काम को सफल कैसे बनाया?`,
		teluguText: `మీరు గతంలో బృందంతో పనిచేసేటప్పుడు ఎదురైన డెడ్‌లైన్ ఒత్తిడి లేదా సాంకేతిక విభేదాల గురించి చెప్పగలరా? మీరు దానిని ఎలా పరిష్కరించారు మరియు ప్రాజెక్ట్ సఫలమయ్యేలా ఎలా చూశారు?`,
		transitionIntro: "Great explanation. Now let's turn to behavioral and teamwork dynamics.",
		hindiTransitionIntro: "बहुत अच्छा। अब टीमवर्क, संचार और व्यावहारिक कार्यशैली पर बात करते हैं।",
		teluguTransitionIntro: "చాలా బాగుంది. ఇప్పుడు జట్టులో పనిచేసే నైపుణ్యాలు మరియు ప్రవర్తనా అంశాలను పరిశీలిద్దాం.",
		contextWhyAsked: "Stage 6: HR and behavioral evaluation. Assesses emotional intelligence, collaboration, and conflict resolution using STAR.",
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
	const closingStageNumber = isTechnicalOnly ? 6 : 7;
	questions.push({
		id: "stage_7_closing",
		stage: "stage_7_closing",
		stageNumber: closingStageNumber,
		totalStages,
		category: "closing",
		text: `We have covered your background, resume projects, technical foundations, hands-on coding, and problem-solving methodology. Before we conclude today's screening session, is there anything else you would like to highlight regarding your background, or any questions you have for me regarding this role?`,
		hindiText: `हमने आपकी पृष्ठभूमि, प्रोजेक्ट्स, तकनीकी कौशल, कोडिंग और समस्या समाधान दृष्टिकोण पर विस्तार से चर्चा कर ली है। आज का साक्षात्कार समाप्त करने से पहले, क्या कुछ ऐसा है जो आप अपनी क्षमताओं के बारे में जोड़ना चाहते हैं, या कोई प्रश्न पूछना चाहते हैं?`,
		teluguText: `మనం మీ నేపథ్యం, ప్రాజెక్ట్‌లు, సాంకేతిక నైపుణ్యాలు, కోడింగ్ మరియు సమస్య పరిష్కార విధానాన్ని సమగ్రంగా పరిశీలించాము. ముగించే ముందు, మీరు ఇంకా ఏదైనా చెప్పాలనుకుంటున్నారా లేదా ఈ ఉద్యోగం గురించి ఏమైనా అడగాలనుకుంటున్నారా?`,
		transitionIntro: "Thank you. We are now approaching the concluding stage of the interview.",
		hindiTransitionIntro: "धन्यवाद। अब हम साक्षात्कार के अंतिम चरण पर पहुँच चुके हैं।",
		teluguTransitionIntro: "ధన్యవాదాలు. ఇప్పుడు మనం ఇంటర్వ్యూ ముగింపు దశకు చేరుకున్నాము.",
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
	if (!serverEntryPromise) serverEntryPromise = import("./server-CXLgWBRI.mjs").then((m) => m.default ?? m);
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
