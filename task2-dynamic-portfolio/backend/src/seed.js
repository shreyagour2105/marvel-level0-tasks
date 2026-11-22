const bcrypt = require('bcryptjs');

function createSeedData() {
  return {
    ...{
  "profile": {
    "id": "profile",
    "name": "Shreya S Gour",
    "role": "Information Science & Engineering Student",
    "location": "Bengaluru, Karnataka, India",
    "email": "shreyagour2105@gmail.com",
    "headline": "Building, breaking and understanding technology.",
    "bio": "I'm a first-year Information Science and Engineering student at UVCE, Bengaluru, interested in cybersecurity, AI security and emerging technologies. I enjoy building practical applications and understanding how systems work. I'm currently developing my skills through independent projects, hackathons and hands-on experimentation.",
    "availability": "Open to internships, collaborations and hackathons.",
    "social": {
      "github": "https://github.com/shreyagour2105",
      "linkedin": "https://www.linkedin.com/in/shreya-s-gour-4820762b1/"
    }
  },
  "projects": [
    {
      "id": "project-1",
      "title": "Bankism Firewall",
      "summary": "An AI security firewall prototype for banking applications.",
      "description": "Evaluates user intent, enforces security policies and uses single-use authorization tokens to prevent unauthorized operations and replay attacks.",
      "technologies": [
        "JavaScript",
        "HMAC",
        "Node.js",
        "REST API"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/bankism-firewall",
      "liveUrl": "https://bankism-firewall.vercel.app",
      "featured": true,
      "color": "#64748b",
      "year": 2026
    },
    {
      "id": "project-2",
      "title": "Acadence",
      "summary": "An offline-first attendance management system.",
      "description": "An ongoing project exploring RFID-based attendance collection and a dedicated teacher interface without requiring continuous internet connectivity.",
      "technologies": [
        "Flutter",
        "Dart",
        "ESP8266",
        "RFID"
      ],
      "repositoryUrl": "",
      "liveUrl": "",
      "featured": true,
      "color": "#0f766e",
      "year": 2026
    },
    {
      "id": "project-3",
      "title": "SkyCast",
      "summary": "A responsive weather forecasting application.",
      "description": "Displays current weather conditions and forecasts using the Open-Meteo API.",
      "technologies": [
        "HTML",
        "CSS",
        "JavaScript",
        "REST API"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/skycast-weather-app",
      "liveUrl": "https://shreyagour2105.github.io/skycast-weather-app/",
      "featured": true,
      "color": "#2563eb",
      "year": 2026
    },
    {
      "id": "project-4",
      "title": "Alexa + StudyMate",
      "summary": "An AI-assisted study planning application.",
      "description": "Combines web and voice interfaces to help students organize academic tasks and study schedules.",
      "technologies": [
        "Node.js",
        "Express",
        "Gemini API",
        "Alexa Skills Kit"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/alexa-studymate",
      "liveUrl": "",
      "featured": false,
      "color": "#b45309",
      "year": 2026
    },
    {
      "id": "project-5",
      "title": "Moltbook CyberBuddy",
      "summary": "A cybersecurity-focused AI agent prototype.",
      "description": "Explores AI safety, controlled agent interactions and topic-based filtering.",
      "technologies": [
        "Python",
        "REST API",
        "AI Safety"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/moltbook-cyberbuddy",
      "liveUrl": "",
      "featured": false,
      "color": "#475569",
      "year": 2026
    },
    {
      "id": "project-6",
      "title": "SUPERPOWER.OS",
      "summary": "An experimental retro operating system-inspired portfolio.",
      "description": "Explores creative web interfaces, desktop-style navigation and interactive experiences.",
      "technologies": [
        "JavaScript",
        "CSS",
        "Vite"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/superpower-os",
      "liveUrl": "",
      "featured": true,
      "color": "#7c3aed",
      "year": 2026
    }
  ],
  "skills": [
    {"id":"skill-1","name":"Python (Basics)","category":"Programming","level":40},
    {"id":"skill-2","name":"C (Basics)","category":"Programming","level":40},
    {"id":"skill-3","name":"Java (Basics)","category":"Programming","level":40},
    {"id":"skill-4","name":"Cybersecurity Fundamentals","category":"Security","level":40},
    {"id":"skill-5","name":"Git","category":"Developer Tools","level":40},
    {"id":"skill-6","name":"GitHub","category":"Developer Tools","level":40},
    {"id":"skill-7","name":"HTML & CSS (Basics)","category":"Web Development","level":40}
  ],
  "achievements": [
    {
      "id": "achievement-1",
      "title": "Implement Speech and Language Solutions with Pre-trained APIs",
      "issuer": "Google Cloud",
      "year": 2026,
      "description": "Earned a skill badge by working with pre-trained APIs for speech recognition, speech synthesis and natural language processing."
    },
    {
      "id": "achievement-2",
      "title": "PromptWars – AI Security Hackathon",
      "issuer": "UVCE Codes",
      "year": 2026,
      "description": "Developed Bankism Firewall, an AI security prototype exploring intent detection, policy enforcement and prevention of unauthorized banking operations."
    },
    {
      "id": "achievement-3",
      "title": "Top 1% - MCP Quiz",
      "issuer": "Evam Labs",
      "year": 2026,
      "description": "Ranked among the top 1% of participants in the LLMs Talk to Your Data quiz focused on Model Context Protocol."
    },
    {
      "id": "achievement-4",
      "title": "Future Builders Connect",
      "issuer": "AWS Builder Center",
      "year": 2026,
      "description": "Participated in a technical event exploring AWS, cloud computing, Docker and Kubernetes."
    }
  ]
},
    users: [
      {
        id: 'admin',
        email: (process.env.ADMIN_EMAIL || 'admin@portfolio.dev').toLowerCase(),
        passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'ChangeMe123!', 10),
        role: 'admin',
      },
    ],
  };
}

module.exports = { createSeedData };
