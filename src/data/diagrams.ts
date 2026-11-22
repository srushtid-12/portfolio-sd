export type Shape = "sphere" | "box" | "octa" | "torus" | "cyl" | "ico";
export type Tone = "a" | "b" | "c" | "good" | "bad";
export type DNode = { id: string; label: string; sub?: string; pos: [number, number, number]; shape: Shape; tone?: Tone; detail: string };
export type Diagram = {
  id: string; title: string; hint: string;
  nodes: DNode[]; edges: [string, string][];
  metric?: { label: string; from: number; to: number };
};

export const diagrams: Record<string, Diagram> = {
  esolutions: {
    id: "esolutions",
    title: "From manual clicks to a self-reporting AI test pipeline",
    hint: "The main line is the automation pipeline; the loop shows how AI answers get checked.",
    nodes: [
      { id: "manual", label: "Manual testing", sub: "the starting point", pos: [-4.2, 1.1, 0], shape: "cyl", tone: "c", detail: "The team tested by hand: slow, hard to repeat, and invisible to everyone else." },
      { id: "pw", label: "Playwright framework", sub: "built from scratch", pos: [-1.4, 1.1, 0.3], shape: "ico", tone: "a", detail: "I designed and built an AI-first end-to-end framework for acceptance and regression tests." },
      { id: "ci", label: "CI/CD pipeline", sub: "every build", pos: [1.4, 1.1, 0.3], shape: "box", tone: "b", detail: "The suite runs automatically on every build, so regressions are caught before release." },
      { id: "testiny", label: "Testiny reports", sub: "real-time", pos: [4.2, 1.1, 0], shape: "octa", tone: "a", detail: "Results go straight to Testiny, so the whole team sees quality in real time with no manual reporting." },
      { id: "ai", label: "AI feature", sub: "under test", pos: [-2.8, -1.5, 0.6], shape: "sphere", tone: "b", detail: "AI-driven features are covered by automated regression plus manual exploratory testing." },
      { id: "eval", label: "Prompts + checks", sub: "evaluation criteria", pos: [0, -1.5, 1], shape: "torus", tone: "a", detail: "Targeted test prompts, validation checks and evaluation criteria catch hallucinated answers." },
      { id: "debug", label: "Root-cause fixes", sub: "with engineers", pos: [2.8, -1.5, 0.6], shape: "octa", tone: "good", detail: "When a model fails on specific prompts, I trace it to the root cause and work with engineers on the fix. Fixes feed back into the suite." },
    ],
    edges: [["manual", "pw"], ["pw", "ci"], ["ci", "testiny"], ["pw", "ai"], ["ai", "eval"], ["eval", "debug"], ["debug", "pw"]],
  },
  capgemini: {
    id: "capgemini",
    title: "Testing a microservice landscape from every side",
    hint: "Each tool tests the services from a different angle.",
    nodes: [
      { id: "soap", label: "SOAP UI", sub: "API tests", pos: [-3.4, 1.4, 0], shape: "octa", tone: "a", detail: "Manual and scripted API tests check that every service contract behaves as specified." },
      { id: "jmeter", label: "JMeter", sub: "performance & load", pos: [3.4, 1.4, 0], shape: "cyl", tone: "b", detail: "Performance and load tests show how the services behave under real traffic." },
      { id: "jenkins", label: "Jenkins", sub: "CI/CD", pos: [-3.2, -1.6, 0.6], shape: "box", tone: "a", detail: "Tests are integrated into Jenkins pipelines so they run continuously." },
      { id: "xray", label: "Xray", sub: "test management", pos: [3.2, -1.6, 0.6], shape: "ico", tone: "b", detail: "Test cases and runs are organised and traced in Xray inside Jira." },
      { id: "team", label: "Agile team", sub: "defect triage", pos: [0, 2.4, -0.8], shape: "torus", tone: "c", detail: "Together with developers I found and resolved defects, improving microservice performance." },
      { id: "ms", label: "Microservices", sub: "more stable", pos: [0, -0.1, 0.4], shape: "sphere", tone: "good", detail: "The result: a more stable system, with the test pass rate rising from 62% to 78% over three years." },
    ],
    edges: [["soap", "ms"], ["jmeter", "ms"], ["jenkins", "ms"], ["xray", "ms"], ["team", "ms"]],
    metric: { label: "Test pass rate", from: 62, to: 78 },
  },
  techciti: {
    id: "techciti",
    title: "A warehouse management app, end to end",
    hint: "From sprint planning to a tested Java backend.",
    nodes: [
      { id: "req", label: "Requirements", sub: "sprint planning", pos: [-4, 0.4, 0], shape: "torus", tone: "c", detail: "I helped with requirements analysis and sprint planning in an agile team." },
      { id: "fe", label: "Frontend", sub: "HTML · CSS · JS", pos: [-1.3, 1.2, 0.4], shape: "box", tone: "a", detail: "Warehouse staff manage stock through a web interface." },
      { id: "be", label: "Java backend", sub: "business logic", pos: [1.3, 0.2, 0.4], shape: "ico", tone: "b", detail: "The backend handles inventory, orders and stock movements." },
      { id: "db", label: "Inventory data", sub: "stock & orders", pos: [4, -0.6, 0], shape: "cyl", tone: "a", detail: "Stock and order data stay persistent and consistent." },
      { id: "test", label: "Unit tests", sub: "debug · optimise", pos: [0, -1.8, 0.8], shape: "octa", tone: "good", detail: "Unit testing, debugging and performance improvements kept the app reliable." },
    ],
    edges: [["req", "fe"], ["fe", "be"], ["be", "db"], ["test", "be"]],
  },
  security: {
    id: "security",
    title: "How the gate decides who gets in",
    hint: "Follow a car from the camera to the gate.",
    nodes: [
      { id: "cam", label: "Gate camera", sub: "captures car", pos: [-4.6, 0.2, 0], shape: "cyl", tone: "c", detail: "A camera at the security gate captures each arriving vehicle." },
      { id: "yolo", label: "YOLOv4", sub: "finds the plate", pos: [-2.3, 0.8, 0.4], shape: "ico", tone: "a", detail: "A YOLOv4 model detects and locates the license plate in the frame." },
      { id: "ocr", label: "OpenCV + OCR", sub: "reads the number", pos: [0, 0.2, 0.6], shape: "box", tone: "b", detail: "OpenCV cleans up the plate image and OCR turns it into text." },
      { id: "db", label: "Known vehicles", sub: "lookup", pos: [2.2, 0.2, 0.3], shape: "torus", tone: "a", detail: "The plate number is checked against the list of registered vehicles." },
      { id: "open", label: "Entry granted", sub: "known", pos: [4.4, 1.4, 0], shape: "sphere", tone: "good", detail: "Known vehicle: the gate opens automatically." },
      { id: "block", label: "Entry blocked", sub: "unknown", pos: [4.4, -1.1, 0], shape: "sphere", tone: "bad", detail: "Unknown vehicle: entry is blocked for a manual check." },
    ],
    edges: [["cam", "yolo"], ["yolo", "ocr"], ["ocr", "db"], ["db", "open"], ["db", "block"]],
  },
  traffic: {
    id: "traffic",
    title: "A crossroads that counts its own traffic",
    hint: "Four lane sensors feed one controller.",
    nodes: [
      { id: "n", label: "North IR", sub: "lane sensor", pos: [0, 2.3, -0.4], shape: "cyl", tone: "a", detail: "IR sensors on each road measure how dense the traffic queue is." },
      { id: "e", label: "East IR", sub: "lane sensor", pos: [2.8, 0, 0], shape: "cyl", tone: "a", detail: "Each approach has its own sensor, so the controller knows where cars are piling up." },
      { id: "s", label: "South IR", sub: "lane sensor", pos: [0, -2.3, 0.4], shape: "cyl", tone: "a", detail: "Readings are sent continuously to the Arduino." },
      { id: "w", label: "West IR", sub: "lane sensor", pos: [-2.8, 0, 0], shape: "cyl", tone: "a", detail: "All four directions are covered." },
      { id: "ard", label: "Arduino (C++)", sub: "density logic", pos: [0, 0, 0.3], shape: "box", tone: "b", detail: "C++ logic on the Arduino compares densities and decides how long each green phase lasts." },
      { id: "light", label: "Signals", sub: "adaptive timing", pos: [4.4, 2, 0], shape: "sphere", tone: "good", detail: "Busier roads get longer green lights, so waiting time drops." },
    ],
    edges: [["n", "ard"], ["e", "ard"], ["s", "ard"], ["w", "ard"], ["ard", "light"]],
  },
  website: {
    id: "website",
    title: "From code to a live site in the cloud",
    hint: "How a visitor reaches the site.",
    nodes: [
      { id: "user", label: "Visitor", sub: "browser", pos: [-3.4, 0, 0], shape: "sphere", tone: "c", detail: "A customer opens the WeRCakeys site in their browser." },
      { id: "ec2", label: "Amazon EC2", sub: "hosting", pos: [0, 0.7, 0.5], shape: "box", tone: "b", detail: "The site is deployed and served from an Amazon EC2 instance." },
      { id: "site", label: "WeRCakeys", sub: "HTML · CSS", pos: [3.4, 0, 0], shape: "ico", tone: "a", detail: "A dynamic bakery website I designed and built." },
    ],
    edges: [["user", "ec2"], ["ec2", "site"]],
  },
};
