import mammoth from "mammoth";

export interface ParsedDocument {
  name: string;
  type: "pdf" | "docx" | "txt";
  size: number;
  text: string;
}

export interface DocumentAnalysisResult {
  detectedRole: string;
  detectedLevel: "fresher" | "junior" | "mid" | "senior" | "lead";
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
  category: "fullstack" | "backend" | "python" | "aiml" | "data" | "cloud" | "qa" | "frontend";
  tags: string[];
  resumeFileName: string;
  resumeText: string;
  jdText: string;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "fullstack-react-node",
    title: "Full-Stack Software Engineer (React / Node.js)",
    role: "Full-Stack Developer",
    category: "fullstack",
    tags: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker"],
    description:
      "Matches a Computer Science graduate against an enterprise Full-Stack Associate opening.",
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
- Familiarity with Git, Docker, and Linux environments.`,
  },
  {
    id: "java-backend-spring",
    title: "Java Backend Engineer (Spring Boot / Microservices)",
    role: "Java Developer",
    category: "backend",
    tags: ["Java", "Spring Boot", "Microservices", "PostgreSQL", "Kafka"],
    description:
      "Core enterprise Java backend role covering OOP, Spring Boot, transactions, and REST APIs.",
    resumeFileName: "Rohan_Kulkarni_Java_Resume.pdf",
    resumeText: `ROHAN KULKARNI
Email: rohan.kulkarni.java@gmail.com | Pune, India
B.Tech in Computer Engineering | CGPA: 8.8/10 (2021 – 2025)

TECHNICAL SKILLS:
Languages: Java (8/11/17), SQL, C++
Frameworks: Spring Boot, Spring Data JPA, Spring Security, Hibernate, JUnit 5, Mockito
Architecture: RESTful APIs, Microservices, Event-Driven Architecture, Kafka, Docker
Databases: PostgreSQL, MySQL, Redis
Tools: Maven, Git, Docker, Postman, SonarQube

PROJECTS:
1. Distributed Banking Transaction Processing Engine (Java 17, Spring Boot, PostgreSQL, Kafka)
- Engineered idempotent payment transfer microservice handling 800+ transactions/sec with two-phase commit logic.
- Built distributed messaging pipeline using Apache Kafka for async transaction notifications and audit trails.
- Enforced role-based authentication with Spring Security and OAuth2 JWT tokens.

2. Inventory Management Microservices Platform (Spring Boot, Hibernate, Docker)
- Designed normalized schema with 18 relational tables, indexing critical foreign keys to slash query response times by 60%.
- Achieved 91% code coverage with comprehensive JUnit 5 and Mockito test suites.`,
    jdText: `Role: Associate Java Software Engineer
Company: Global IT & Digital Solutions (Campus Placement)
Location: Pune / Chennai / Bengaluru

Responsibilities:
- Build resilient backend microservices using Java 17, Spring Boot, and Hibernate.
- Write clean, well-tested code following SOLID principles and design patterns.
- Design database schemas, write complex SQL queries, and optimize query plans in PostgreSQL.
- Integrate message queues (Kafka / RabbitMQ) for asynchronous workflows.
- Participate in code reviews, bug fixes, and continuous delivery with Docker and Jenkins.

Requirements:
- Strong core Java fundamentals (Collections, Multithreading, Streams, Exception Handling).
- Solid grasp of Spring Boot, Dependency Injection, JPA, and REST API conventions.
- Strong knowledge of relational SQL databases and ACID transactions.`,
  },
  {
    id: "python-backend-fastapi",
    title: "Python Software Engineer (FastAPI / Django / SQL)",
    role: "Python Developer",
    category: "python",
    tags: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
    description:
      "Modern Python engineer profile testing async programming, REST APIs, and database design.",
    resumeFileName: "Ananya_Sen_Python_Resume.pdf",
    resumeText: `ANANYA SEN
Email: ananya.sen.python@gmail.com | Kolkata, India
B.Tech in Information Technology | CGPA: 8.7/10 (2021 – 2025)

TECHNICAL SKILLS:
Languages: Python 3.11+, SQL, JavaScript
Frameworks: FastAPI, Django, Flask, SQLAlchemy, Pydantic, Celery
Databases: PostgreSQL, Redis, MongoDB
DevOps: Docker, Docker Compose, Git, Linux, GitHub Actions, AWS EC2

PROJECTS:
1. Asynchronous Task Orchestration Service (FastAPI, Celery, Redis, PostgreSQL)
- Developed async API server using FastAPI and Celery handling 5,000+ background analytics jobs daily.
- Implemented connection pooling with SQLAlchemy and Pydantic schema validation.
- Built rate-limiting middleware using Redis token-bucket algorithm.

2. Healthcare Appointment & Teleconsult Booking System (Django, PostgreSQL, Stripe)
- Implemented secure REST APIs with JWT authentication, transaction isolation, and database migrations.
- Configured automated unit and integration tests using Pytest with 88% test coverage.`,
    jdText: `Role: Python Backend Developer
Company: Enterprise Digital Engineering Services
Location: Hyderabad / Bengaluru / Remote

Responsibilities:
- Develop and maintain scalable REST APIs and microservices using Python and modern web frameworks (FastAPI/Django).
- Design and optimize relational databases (PostgreSQL) and write efficient ORM / raw SQL queries.
- Build asynchronous job workers with Celery and Redis.
- Package and deploy applications using Docker containers.

Requirements:
- Strong core Python skills (OOP, Generators, Decorators, Concurrency, Asyncio).
- Experience building RESTful APIs with FastAPI or Django REST Framework.
- Good understanding of relational databases, indexing, and SQL queries.`,
  },
  {
    id: "aiml-engineer",
    title: "AI & Machine Learning Engineer (Python / PyTorch)",
    role: "AI / ML Engineer",
    category: "aiml",
    tags: ["Python", "PyTorch", "RAG", "LLMs", "Vector DB"],
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
    category: "data",
    tags: ["SQL", "Power BI", "Python", "Tableau", "ETL"],
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
  {
    id: "cloud-devops-aws",
    title: "Cloud & DevOps Engineer (AWS / Docker / K8s)",
    role: "Cloud & DevOps Engineer",
    category: "cloud",
    tags: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
    description:
      "Infrastructure, container orchestration, Linux networking, and automated deployment pipelines.",
    resumeFileName: "Karthik_Raman_DevOps_Resume.pdf",
    resumeText: `KARTHIK RAMAN
Email: karthik.devops@gmail.com | Chennai, India
B.Tech in Computer Science and Engineering | CGPA: 8.5/10 (2021 – 2025)

TECHNICAL SKILLS:
Cloud: AWS (EC2, S3, VPC, IAM, RDS, EKS, CloudWatch)
Containers & Orchestration: Docker, Kubernetes, Helm
CI/CD & Automation: GitHub Actions, Jenkins, Terraform, Bash scripting
Operating Systems: Linux (Ubuntu, RHEL), Shell scripting, Networking (TCP/IP, DNS, SSL)

PROJECTS:
1. Multi-Tier Microservices Deployment on AWS EKS (Kubernetes, Helm, Terraform)
- Authored Terraform IaC provisioning high-availability VPC across 3 Availability Zones.
- Configured automated rolling deployments with Kubernetes Ingress and cert-manager SSL certificates.
- Set up Prometheus & Grafana monitoring dashboards tracking pod memory, CPU, and request latency.

2. Automated Zero-Downtime CI/CD Pipeline (GitHub Actions, Docker, AWS)
- Reduced build and deployment turnaround from 35 minutes to 6 minutes using multi-stage Docker caching.`,
    jdText: `Role: Associate Cloud & DevOps Engineer
Company: Cloud Infrastructure Services
Location: Chennai / Bengaluru / Hyderabad

Responsibilities:
- Automate provisioning of cloud infrastructure on AWS using Terraform or CloudFormation.
- Maintain and troubleshoot containerized services running on Docker and Kubernetes.
- Implement robust CI/CD pipelines for automated testing, container scanning, and zero-downtime deployment.
- Monitor system health, logs, and performance metrics across enterprise services.

Requirements:
- Solid understanding of Linux system administration, bash scripting, and networking fundamentals.
- Hands-on experience with Docker containerization and Kubernetes concepts (Pods, Services, Ingress).
- Familiarity with AWS core services (VPC, EC2, S3, IAM) and CI/CD tools.`,
  },
  {
    id: "qa-sdet-automation",
    title: "QA Automation & SDET (Selenium / Pytest / API)",
    role: "QA & SDET Engineer",
    category: "qa",
    tags: ["Selenium", "Pytest", "Java", "API Testing", "Postman"],
    description:
      "Software testing methodologies, test automation frameworks, API validation, and bug reporting.",
    resumeFileName: "Sneha_Patel_QA_Resume.pdf",
    resumeText: `SNEHA PATEL
Email: sneha.patel.qa@gmail.com | Ahmedabad, India
B.Tech in Computer Engineering | CGPA: 8.4/10 (2021 – 2025)

TECHNICAL SKILLS:
Testing Methodologies: Functional, Regression, Smoke, Sanity, Integration, Performance Testing
Automation Tools: Selenium WebDriver (Java/Python), Pytest, TestNG, Postman, RestAssured
Languages: Java, Python, SQL
CI/CD & Management: Git, Jenkins, Jira, Allure Reporting

PROJECTS:
1. Automated Regression Suite for Financial Web Portal (Selenium, Java, TestNG)
- Developed Page Object Model (POM) automation framework running 250+ end-to-end regression tests.
- Integrated parallel test execution reducing regression test run time by 65%.
- Automated REST API testing with RestAssured validating status codes, payloads, and schema compliance.

2. Load & Performance Testing of E-Commerce APIs (JMeter, Postman)
- Simulated 500 concurrent virtual users measuring response latency, throughput, and error rates.`,
    jdText: `Role: Associate QA Automation Engineer (SDET)
Company: Enterprise Quality Engineering CoE
Location: Bengaluru / Pune / Remote

Responsibilities:
- Design, write, and execute automated test scripts for web applications and REST APIs.
- Work closely with developers to identify edge cases, defects, and performance bottlenecks.
- Build and maintain Page Object Model automation suites in Selenium with Java or Python.
- Integrate automated test suites into CI/CD delivery pipelines.

Requirements:
- Strong grasp of software testing lifecycle (STLC), defect tracking, and test case design.
- Hands-on experience with Selenium WebDriver and test runners (TestNG / Pytest).
- Experience validating REST APIs using Postman or automation libraries.
- Basic SQL proficiency for database validation.`,
  },
  {
    id: "frontend-react-nextjs",
    title: "Frontend Web Developer (React / Next.js / Tailwind)",
    role: "Frontend Developer",
    category: "frontend",
    tags: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux"],
    description:
      "Modern client-side engineering, responsive web applications, state management, and web performance.",
    resumeFileName: "Vikas_Verma_Frontend_Resume.pdf",
    resumeText: `VIKAS VERMA
Email: vikas.verma.fe@gmail.com | Delhi NCR, India
B.Tech in Computer Science | CGPA: 8.7/10 (2021 – 2025)

TECHNICAL SKILLS:
Languages: TypeScript, JavaScript (ES2023), HTML5, CSS3/SCSS
Frameworks: React.js, Next.js (App Router), Redux Toolkit, Zustand, TanStack Query
Styling: Tailwind CSS, CSS Modules, Radix UI, Framer Motion
Performance & Tools: Web Vitals, Lighthouse, Vite, Webpack, Git, Jest, React Testing Library

PROJECTS:
1. High-Performance Financial Dashboard (Next.js 14, TypeScript, Tailwind, Chart.js)
- Built responsive analytics portal achieving 98/100 Lighthouse performance score.
- Implemented optimistic UI updates, debounced search filters, and virtualization for 10,000+ data rows.
- Structured component library with atomic design and strict TypeScript typings.

2. Interactive Quiz & Assessment Web App (React, Tailwind CSS, Zustand)
- Created engaging assessment engine with live timers, keyboard navigation, and audio feedback.`,
    jdText: `Role: Associate Frontend Developer
Company: Enterprise Experience Engineering
Location: Hyderabad / Bengaluru / Gurgaon

Responsibilities:
- Build pixel-perfect, responsive web interfaces using React.js, TypeScript, and modern CSS frameworks.
- Optimize frontend web performance, accessibility (WCAG), and responsive cross-browser compatibility.
- Integrate REST and GraphQL endpoints with robust error handling and loading skeletons.
- Write clean component tests with Jest and React Testing Library.

Requirements:
- Strong proficiency in modern JavaScript/TypeScript, React fundamentals, hooks, and virtual DOM.
- Deep familiarity with Tailwind CSS or modern CSS layout techniques (Flexbox, Grid).
- Understanding of state management, client routing, and asynchronous data fetching.`,
  },
];
