export const profile = {
  name: "Srushti Desai",
  roles: ["AI Test Automation", "Quality Engineering", "Digital Transformation"],
  location: "Nürnberg, Germany",
  email: "srushti.j.desai@gmail.com",
  linkedin: "https://linkedin.com/in/srushti-desai12",
  tagline: "I find what's broken, and I help teams stop breaking it.",
  intro: "Hi, I'm Srushti.",
  summary:
    "I spent three years at Capgemini testing microservices, and now I'm the person at e.solutions who got a whole team to stop clicking through tests by hand. Along the way I got curious about why some teams change easily and others don't, which is why I'm doing a Master's in International Information Systems at FAU Erlangen-Nürnberg. I like the space where the technical work meets the people and strategy around it.",
  learning: "Right now I'm learning how to test AI with AI: MCP, RAG and fine-tuning.",
  stats: [
    { value: "3+", label: "years in industry" },
    { value: "62→78%", label: "test pass rate at Capgemini" },
    { value: "4", label: "certifications" },
  ],
};

/** "How I work": first-person beliefs, each backed by something real. Edit freely. */
export const principles = [
  { title: "Quality is a habit, not a phase.", body: "Tests that only run before a release get skipped. Tests that run on every build become part of how a team works. That's why I wired my suite into CI/CD.", proof: "e.solutions" },
  { title: "Automate the boring, explore the interesting.", body: "Scripts are great at repeating things. People are great at noticing odd things. I use regression suites for the first and exploratory testing for the second.", proof: "AI features at e.solutions" },
  { title: "If nobody sees the results, they don't exist.", body: "A green test run in someone's terminal changes nothing. Connecting results to Testiny meant the whole team could see quality in real time.", proof: "Testiny reporting" },
];

export type Job = {
  id: string; role: string; company: string; period: string; place: string;
  summary: string; challenge: string; bullets: string[]; tags: string[];
};

export const experience: Job[] = [
  {
    id: "esolutions",
    role: "Working Student, AI Test Automation",
    company: "e.solutions",
    period: "05/2025 – Present",
    place: "Germany",
    summary: "I walked in to a team that tested by hand. Now an AI-first Playwright suite I built from scratch runs on every build.",
    challenge: "Doing it alone: there was no framework and no automation habit yet, so I had to build both the tool and the trust in it.",
    bullets: [
      "Designed and built the end-to-end frontend automation framework (acceptance & regression) in Playwright.",
      "Wired the suite into CI/CD so it runs on every build.",
      "Connected results to Testiny for real-time reporting, with no manual effort.",
      "Reduced hallucinations in AI responses with targeted prompts, validation checks and evaluation criteria.",
      "Debugged failing AI models down to root cause together with engineers.",
    ],
    tags: ["Playwright", "CI/CD", "Testiny", "LLM evaluation", "Exploratory testing"],
  },
  {
    id: "capgemini",
    role: "Software Tester",
    company: "Capgemini",
    period: "09/2021 – 08/2024",
    place: "Pune, India",
    summary: "Three years of keeping a microservice landscape honest with API, regression and performance tests.",
    challenge: "Pass rates don't jump. Getting from 62% to 78% took three years of steady defect hunting alongside the developers.",
    bullets: [
      "API, regression and performance testing with SOAP UI and JMeter.",
      "Integrated CI/CD pipelines in Jenkins; improved test management with Xray.",
      "Worked with agile teams to resolve defects and improve microservice performance.",
      "Recognised with the Delivery Star award (2023).",
    ],
    tags: ["SOAP UI", "JMeter", "Jenkins", "Xray", "Microservices"],
  },
  {
    id: "techciti",
    role: "Software Development Intern",
    company: "TechCiti Software Consulting",
    period: "09/2020 – 12/2020",
    place: "Remote",
    summary: "My first real codebase: a warehouse management app, built end to end in an agile team.",
    challenge: "Learning that writing code and trusting code are two different jobs. This is where testing first hooked me.",
    bullets: [
      "Java backend with an HTML, CSS and JavaScript frontend.",
      "Unit testing, debugging and performance improvements.",
      "Contributed to requirements analysis and sprint planning.",
    ],
    tags: ["Java", "JavaScript", "Unit testing", "Agile"],
  },
];

export type Project = { id: string; name: string; period: string; summary: string; tags: string[] };

export const projects: Project[] = [
  { id: "security", name: "Automated Security Entry System", period: "08/2021 – 12/2021", summary: "Team of four. License-plate recognition at security gates: known vehicles are let in, unknown ones are stopped.", tags: ["Python", "YOLOv4", "OpenCV", "OCR"] },
  { id: "traffic", name: "Density-Based Traffic Light Control", period: "07/2020 – 09/2020", summary: "IoT team project: signal timing at a four-way intersection adapts to the traffic density that sensors detect.", tags: ["Arduino", "IR sensors", "C++"] },
  { id: "website", name: "WeRCakeys: Dynamic Website Hosting", period: "07/2021 – 09/2021", summary: "Built and published a dynamic bakery website and hosted it on Amazon EC2.", tags: ["HTML", "CSS", "AWS EC2"] },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "AI & test automation", items: ["Playwright (AI-first)", "Prompt evaluation", "Hallucination reduction", "AI model debugging", "Testiny", "CI/CD integration"] },
  { group: "Software testing", items: ["Manual", "Regression", "Integration", "Unit", "Smoke", "Functional", "Performance & load", "Root-cause analysis"] },
  { group: "Integration & APIs", items: ["MuleSoft (Mule 4, Anypoint)", "SOAP UI", "Postman", "Rest Assured", "RabbitMQ", "Spring Boot"] },
  { group: "DevOps & cloud", items: ["Jenkins", "Docker", "Kubernetes", "Harbor", "Azure", "AWS"] },
  { group: "Programming & data", items: ["Java", "Python", "Shell", "JavaScript", "HTML/CSS", "MySQL", "Oracle", "MongoDB", "DynamoDB"] },
  { group: "Monitoring & tools", items: ["Kibana", "Grafana", "Prometheus", "Jira", "Confluence", "Xray", "Git", "JMeter", "Appian"] },
];

export const education = [
  {
    degree: "MSc International Information Systems",
    school: "Friedrich-Alexander-Universität Erlangen-Nürnberg",
    period: "10/2024 – Present",
    note: "Bridging management and IT in large international organisations.",
    highlights: ["Digital Change Management (case study 1.3)", "Service Innovation (presentation 1.7)", "Enterprise-wide IT Architectures", "Business Strategy", "Federated Learning Management", "Enterprise Knowledge Management"],
  },
  {
    degree: "BE Computer Engineering",
    school: "Zeal College, Pune University",
    period: "2017 – 2021",
    note: "Cloud Computing, Artificial Intelligence, Software Testing, Machine Learning.",
    highlights: [] as string[],
  },
];

export const certificates = [
  "Salesforce Certified MuleSoft Developer (MCD) Level 1",
  "Salesforce Certified MuleSoft Associate",
  "Salesforce AI Associate",
  "Microsoft Certified: Azure Fundamentals (AZ-900)",
];

export const award = { name: "Delivery Star, Capgemini", date: "April 2023", note: "Recognised for on-time, high-quality delivery and project success." };

export const languages = [
  { name: "English", level: "C1 (IELTS)" },
  { name: "German", level: "B1.1, continuing" },
  { name: "Marathi", level: "Native" },
];

export const interests = ["Photography", "Mandala art"];

/** Pune → Nürnberg. `at` = how far along the drawn path (0–1) each stop sits; `side` = label above or below the line. */
export const journey = {
  from: { city: "Pune", country: "India" },
  to: { city: "Nürnberg", country: "Germany" },
  distance: "≈ 6,500 km",
  stops: [
    { year: "2017", title: "Computer Engineering", place: "Zeal College, Pune", at: 0.06, side: "up" },
    { year: "2020", title: "First codebase", place: "TechCiti internship", at: 0.2, side: "down" },
    { year: "2021", title: "Software Tester", place: "Capgemini, Pune", at: 0.34, side: "up" },
    { year: "2023", title: "Delivery Star award", place: "Capgemini", at: 0.47, side: "down" },
    { year: "2024", title: "Moved to Germany", place: "MSc at FAU", at: 0.62, side: "up" },
    { year: "2025", title: "AI Test Automation", place: "e.solutions", at: 0.845, side: "up" },
    { year: "Now", title: "Testing AI with AI", place: "MCP · RAG · fine-tuning", at: 0.95, side: "down" },
  ],
};

/**
 * Photography slots. Drop files into /public/images/photos/ with these names
 * and fill in place/year. Empty slots show a soft placeholder.
 * `shape` controls the frame: "tall" (3:4), "wide" (3:2) or "square".
 */
export const photos: { file: string; place: string; year: string; shape: "tall" | "wide" | "square" }[] = [
  { file: "01.jpg", place: "Place, City", year: "2025", shape: "tall" },
  { file: "02.jpg", place: "Place, City", year: "2025", shape: "wide" },
  { file: "03.jpg", place: "Place, City", year: "2024", shape: "square" },
  { file: "04.jpg", place: "Place, City", year: "2024", shape: "wide" },
  { file: "05.jpg", place: "Place, City", year: "2023", shape: "tall" },
];
