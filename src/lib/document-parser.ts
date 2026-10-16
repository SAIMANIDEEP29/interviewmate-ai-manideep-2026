import mammoth from "mammoth";

export interface ParsedDocument {
  name: string;
  type: "pdf" | "docx" | "txt";
  size: number;
  text: string;
}

export interface DocumentAnalysisResult {
  detectedRole: string;
  detectedLevel: "fresher" | "junior" | "mid" | "senior";
  summary: string;
  requiredSkills: string[];
  candidateSkills: string[];
  matchedSkills: string[];
  gapSkills: string[];
  keyTopics: string[];
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const validExtensions = ["pdf", "docx", "txt", "doc"];
  if (!extension || !validExtensions.includes(extension)) {
    return {
      valid: false,
      error: `Unsupported file type ".${extension}". Please upload a PDF, DOCX, or TXT file.`,
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeMb} MB) exceeds the 5 MB limit. Please upload a smaller document.`,
    };
  }
  return { valid: true };
}

/**
 * Extracts raw readable text from a PDF file using text stream parsing
 */
async function extractTextFromPdf(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const textDecoder = new TextDecoder("utf-8", { fatal: false });
  const rawString = textDecoder.decode(bytes);

  // Look for text streams (/Filter /FlateDecode or raw text objects)
  // Extract text within standard PDF parentheses (text) Tj or [(text)] TJ
  const matches: string[] = [];
  const textBlockRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
  let match;
  while ((match = textBlockRegex.exec(rawString)) !== null) {
    if (match[1] && match[1].length > 1) {
      matches.push(match[1]);
    }
  }

  if (matches.length > 15) {
    return matches
      .join(" ")
      .replace(/\\r|\\n/g, " ")
      .trim();
  }

  // Fallback: extract continuous ASCII/printable strings
  const printableRegex = /[\x20-\x7E\s]{4,}/g;
  const printableMatches = rawString.match(printableRegex) || [];
  const filtered = printableMatches.filter(
    (chunk) =>
      !chunk.startsWith("xref") &&
      !chunk.startsWith("trailer") &&
      !chunk.includes("obj") &&
      !chunk.includes("endobj") &&
      !chunk.includes("Font") &&
      chunk.trim().length > 3,
  );

  const result = filtered.join(" ").replace(/\s+/g, " ").trim();
  if (result.length > 50) return result;

  throw new Error(
    "Could not extract readable text from this PDF. Please copy and paste the document text directly.",
  );
}

/**
 * Extracts readable text from a DOCX file using mammoth
 */
async function extractTextFromDocx(buffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    if (result.value && result.value.trim().length > 20) {
      return result.value.trim();
    }
  } catch (err: unknown) {
    console.warn("Mammoth extraction warning:", err);
  }
  throw new Error(
    "Could not extract readable text from this DOCX. Please paste your text directly.",
  );
}

/**
 * High-level parser that processes any supported File object into a ParsedDocument
 */
export async function parseDocumentFile(file: File): Promise<ParsedDocument> {
  const validation = validateDocumentFile(file);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  const buffer = await file.arrayBuffer();
  let text = "";

  if (ext === "txt") {
    text = new TextDecoder().decode(buffer);
  } else if (ext === "docx" || ext === "doc") {
    text = await extractTextFromDocx(buffer);
  } else if (ext === "pdf") {
    text = await extractTextFromPdf(buffer);
  }

  if (!text || text.trim().length < 20) {
    throw new Error(
      `Document "${file.name}" appears to be empty or unscannable. Please paste the text directly.`,
    );
  }

  return {
    name: file.name,
    type: ext === "pdf" ? "pdf" : ext === "docx" ? "docx" : "txt",
    size: file.size,
    text: text.trim(),
  };
}

/* ---------------- Built-in Sample Presets ---------------- */

export interface SamplePreset {
  id: string;
  title: string;
  role: string;
  description: string;
  resumeFileName: string;
  resumeText: string;
  jdText: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "fullstack-react-node",
    title: "Full-Stack Software Engineer (React / Node.js)",
    role: "Full-Stack Developer",
    description:
      "Matches a Computer Science graduate against an HCLTech Senior Associate Engineer opening.",
    resumeFileName: "Aditya_Sharma_Resume.pdf",
    resumeText: `ADITYA SHARMA
Email: aditya.sharma.dev@gmail.com | Phone: +91 98765 43210 | Bengaluru, India
GitHub: github.com/aditya-dev | LinkedIn: linkedin.com/in/adityasharma-dev

EDUCATION
B.Tech in Computer Science and Engineering | CGPA: 8.6/10
Vellore Institute of Technology (VIT), 2021 – 2025

TECHNICAL SKILLS
Languages: JavaScript (ES6+), TypeScript, Python, SQL, HTML5, CSS3
Frontend: React.js, Next.js, Redux Toolkit, Tailwind CSS, TanStack Query
Backend: Node.js, Express.js, REST APIs, Microservices, Socket.io
Databases: PostgreSQL, MongoDB, Redis (caching)
DevOps & Tools: Docker, Git, GitHub Actions, AWS (S3, EC2, CloudFront), Postman

PROJECTS
1. E-Commerce Microservices Platform (React, Node.js, PostgreSQL, Redis, Docker)
- Architected a scalable order-processing engine handling 1,200+ concurrent requests with sub-100ms latency.
- Implemented JWT authentication with refresh token rotation and RBAC access control.
- Designed Redis caching layer reducing database read load by 45%.

2. Collaborative Real-Time Code Editor (React, TypeScript, WebSockets, Express)
- Developed a live collaborative markdown and code editor supporting multiple concurrent typers using Operational Transformation algorithms.
- Integrated Monaco editor with syntax highlighting and syntax error validation.

EXPERIENCE
Software Development Intern | InnoTech Labs, Hyderabad (June 2024 – Nov 2024)
- Built automated CI/CD pipeline reducing deployment cycle from 40 minutes to 8 minutes.
- Refactored legacy REST APIs in Express to TypeScript, improving test coverage to 84%.`,
    jdText: `Role: Full-Stack Software Engineer (Associate / Mid-Level)
Company: HCLTech Engineering & R&D Services
Location: Bengaluru / Hyderabad / Remote

About The Role:
We are seeking an energetic Full-Stack Engineer with strong computer science fundamentals to develop mission-critical enterprise web applications for global Fortune 500 clients.

Key Responsibilities:
- Design, build, and maintain high-performance frontend interfaces using React, TypeScript, and modern state management.
- Develop secure, highly scalable backend services and RESTful APIs using Node.js and Express.
- Work closely with relational databases (PostgreSQL/MySQL) and caching stores (Redis).
- Implement robust CI/CD pipelines, containerization using Docker, and cloud deployments on AWS.
- Collaborate in an Agile team with peer code reviews and automated testing (Jest, Vitest).

Required Qualifications:
- Bachelor's degree in Computer Science, IT, or equivalent experience.
- Strong proficiency in modern JavaScript, TypeScript, React.js, and Node.js.
- Solid understanding of data structures, algorithms, object-oriented design, and REST APIs.
- Experience with relational SQL databases and schema design.
- Familiarity with Git, Docker, and Linux environments.

Preferred Skills:
- Experience with Next.js, GraphQL, Kubernetes, or AWS serverless architectures.
- Experience with real-time communications (WebSockets).`,
  },
  {
    id: "aiml-engineer",
    title: "AI & Machine Learning Engineer (Python / PyTorch)",
    role: "AI/ML Engineer",
    description:
      "Evaluates an AI enthusiast against an Enterprise GenAI & Deep Learning job posting.",
    resumeFileName: "Priya_Nair_AI_Resume.docx",
    resumeText: `PRIYA NAIR
Email: priya.nair.ai@gmail.com | Hyderabad, India
B.Tech in Artificial Intelligence & Data Science | CGPA: 9.1/10 (2021 – 2025)

SKILLS:
Python, PyTorch, TensorFlow, Scikit-Learn, Hugging Face, LangChain, RAG Systems, Vector Databases (ChromaDB, Pinecone), FastAPI, Docker, Pandas, NumPy.

PROJECTS:
1. Enterprise Document QA with Hybrid RAG (LangChain, ChromaDB, FastAPI)
- Built an intelligent RAG pipeline parsing 10,000+ medical and technical PDFs with semantic chunking and reciprocal rank fusion.
- Deployed FastAPI microservice processing queries with 94% citation accuracy.

2. Fine-Tuned LLaMA-3 for Code Generation
- Fine-tuned 8B parameter model using LoRA and QLoRA on curated Python datasets, achieving a 14% improvement on HumanEval benchmark.`,
    jdText: `Role: Junior AI / ML Solutions Engineer
Company: HCLTech Digital Enterprise AI
Requirements:
- Deep proficiency in Python and modern ML frameworks (PyTorch or TensorFlow).
- Hands-on experience developing Retrieval-Augmented Generation (RAG) pipelines and working with Vector DBs.
- Experience deploying ML models via REST APIs (FastAPI/Flask) with Docker.
- Strong understanding of Transformer architectures, attention mechanisms, and fine-tuning techniques.`,
  },
  {
    id: "data-analyst",
    title: "Data Analyst & Business Intelligence",
    role: "Data Analyst",
    description: "Tests data modeling, SQL queries, dashboarding, and business analytics skills.",
    resumeFileName: "Rahul_Varma_Data_Resume.pdf",
    resumeText: `RAHUL VARMA
Email: rahul.varma.data@gmail.com | Chennai, India
Education: B.Tech in Information Technology | 2021 - 2025

TECHNICAL SKILLS:
SQL (Advanced queries, CTEs, Window Functions), Python (Pandas, NumPy, Seaborn), Power BI, Tableau, Excel (VBA, Power Query), Data Modeling, ETL.

PROJECTS:
1. Retail Sales Performance Dashboard (Power BI, SQL)
- Analyzed 1.5 million transaction records across 40 stores. Created interactive KPIs for revenue growth, customer retention, and inventory churn.
2. Customer Churn Prediction & Analysis (Python, Scikit-Learn)
- Performed EDA, feature engineering, and logistic regression identifying top 3 factors driving churn with 82% recall.`,
    jdText: `Role: Associate Data Analyst
Company: HCLTech Analytics CoE
Responsibilities:
- Write complex SQL queries, stored procedures, and transformations for high-volume datasets.
- Build executive dashboards and visual reports in Power BI and Tableau.
- Collaborate with business stakeholders to extract actionable metrics and KPIs.
- Present data-driven recommendations with clear business communication.`,
  },
];
