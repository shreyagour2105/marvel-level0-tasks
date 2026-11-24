const bcrypt = require('bcryptjs');
const { randomUUID } = require('node:crypto');

const contentVersion = 1;
const content = {
  "profile": {
    "id": "profile",
    "name": "Shreya S Gour",
    "role": "Information Science & Engineering Student",
    "location": "Bengaluru, Karnataka, India",
    "email": "shreyagour2105@gmail.com",
    "headline": "Building. Learning. Exploring technology.",
    "bio": "I'm a first-year Information Science and Engineering student at UVCE, Bengaluru, interested in cybersecurity, AI security and emerging technologies. I enjoy exploring how systems work and applying what I learn through personal projects, hackathons and hands-on experimentation.",
    "social": {
      "github": "https://github.com/shreyagour2105",
      "linkedin": "https://www.linkedin.com/in/shreya-s-gour-4820762b1/"
    }
  },
  "projects": [
    {
      "id": "project-1",
      "title": "Bankism Firewall",
      "summary": "A prototype that checks requests sent to an AI banking assistant and applies transaction rules against a simulated ledger.",
      "description": "A prototype that checks requests sent to an AI banking assistant and applies transaction rules against a simulated ledger.",
      "technologies": [
        "React",
        "TypeScript",
        "Tailwind CSS",
        "Vercel Functions"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/bankism-firewall",
      "liveUrl": "https://bankism-firewall.vercel.app/",
      "imagePath": "/assets/projects/bankism-firewall.webp",
      "imageAlt": "Bankism Firewall dashboard showing sample policy decisions, request activity, and a mock ledger.",
      "featured": true,
      "color": "#64748b",
      "year": 2026
    },
    {
      "id": "lablink",
      "title": "LabLink",
      "summary": "A campus lab equipment catalogue where students can request booking slots and faculty can review those requests.",
      "description": "A campus lab equipment catalogue where students can request booking slots and faculty can review those requests.",
      "technologies": [
        "Python",
        "Django",
        "TypeScript",
        "Firebase Auth",
        "Firestore"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/lablink",
      "liveUrl": "https://shreyagour2105-lablink-yjmg.vercel.app/",
      "imagePath": "/assets/projects/lablink.webp",
      "imageAlt": "LabLink student demo showing equipment and recommended booking slots.",
      "featured": true,
      "color": "#0f766e",
      "year": 2026
    },
    {
      "id": "project-6",
      "title": "SUPERPOWER.OS",
      "summary": "An interactive portfolio with a browser terminal, a retro desktop mode, and a Canvas arcade game.",
      "description": "An interactive portfolio with a browser terminal, a retro desktop mode, and a Canvas arcade game.",
      "technologies": [
        "React",
        "TypeScript",
        "Vite",
        "Canvas"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/superpower-os",
      "liveUrl": "https://main.d1ydm7xwqwpeuj.amplifyapp.com/",
      "imagePath": "/assets/projects/superpower-os.webp",
      "imageAlt": "SUPERPOWER.OS home screen with project shortcuts and links to the terminal and retro desktop.",
      "featured": true,
      "color": "#7c3aed",
      "year": 2026
    },
    {
      "id": "project-3",
      "title": "SkyCast",
      "summary": "A weather dashboard for checking current conditions and a five-day forecast by city.",
      "description": "A weather dashboard for checking current conditions and a five-day forecast by city.",
      "technologies": [
        "HTML",
        "CSS",
        "JavaScript",
        "Open-Meteo API"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/skycast-weather-app",
      "liveUrl": "https://shreyagour2105.github.io/skycast-weather-app/",
      "imagePath": "/assets/projects/skycast.webp",
      "imageAlt": "SkyCast showing current conditions and a five-day forecast for Bengaluru.",
      "featured": true,
      "color": "#2563eb",
      "year": 2026
    },
    {
      "id": "project-4",
      "title": "Alexa + StudyMate",
      "summary": "An Alexa-inspired study tool with assignment tracking, a study planner, and a Gemini-powered chat interface.",
      "description": "An Alexa-inspired study tool with assignment tracking, a study planner, and a Gemini-powered chat interface.",
      "technologies": [
        "JavaScript",
        "Node.js",
        "Express",
        "Google Gemini",
        "Web Speech API"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/alexa-studymate",
      "liveUrl": "",
      "imagePath": "/assets/projects/alexa-studymate.webp",
      "imageAlt": "The Alexa + StudyMate overview showing assignment tracking and planning tools.",
      "featured": true,
      "color": "#b45309",
      "year": 2026
    },
    {
      "id": "project-5",
      "title": "Moltbook CyberBuddy",
      "summary": "A Python agent that uses Gemini to draft replies for cybersecurity discussions on Moltbook, with filters and daily posting limits.",
      "description": "A Python agent that uses Gemini to draft replies for cybersecurity discussions on Moltbook, with filters and daily posting limits.",
      "technologies": [
        "Python",
        "Google Gemini",
        "SQLite",
        "Moltbook API"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/moltbook-cyberbuddy",
      "liveUrl": "",
      "imagePath": "/assets/projects/moltbook-cyberbuddy.webp",
      "imageAlt": "The CyberBuddy agent profile, u/feheart, on Moltbook.",
      "featured": true,
      "color": "#475569",
      "year": 2026
    },
    {
      "id": "notice-helper-ai",
      "title": "Notice Helper AI",
      "summary": "A tool that extracts dates, venues, and other key details from college notices and turns them into short reminders.",
      "description": "A tool that extracts dates, venues, and other key details from college notices and turns them into short reminders.",
      "technologies": [
        "HTML",
        "CSS",
        "JavaScript",
        "Google Gemini",
        "Vercel Functions"
      ],
      "repositoryUrl": "https://github.com/shreyagour2105/notice-helper-ai",
      "liveUrl": "",
      "imagePath": "/assets/projects/notice-helper-ai.webp",
      "imageAlt": "College Notice Helper showing options to paste a notice or upload a PDF, image, or text file.",
      "featured": true,
      "color": "#6d5b9a",
      "year": 2026
    }
  ],
  "skills": [
    {
      "id": "skill-1",
      "name": "Python (Basics)",
      "category": "Programming",
      "level": 40
    },
    {
      "id": "skill-2",
      "name": "C (Basics)",
      "category": "Programming",
      "level": 40
    },
    {
      "id": "skill-3",
      "name": "Java (Basics)",
      "category": "Programming",
      "level": 40
    },
    {
      "id": "skill-4",
      "name": "Cybersecurity Fundamentals",
      "category": "Security",
      "level": 40
    },
    {
      "id": "skill-5",
      "name": "Git",
      "category": "Developer Tools",
      "level": 40
    },
    {
      "id": "skill-6",
      "name": "GitHub",
      "category": "Developer Tools",
      "level": 40
    },
    {
      "id": "skill-7",
      "name": "HTML & CSS (Basics)",
      "category": "Web Development",
      "level": 40
    }
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
};

function createSeedData() {
  return {
    ...content,
    contentVersion,
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

function refreshPortfolioContent(data) {
  if (data.contentVersion >= contentVersion) return false;

  data.contentVersion = contentVersion;
  data.profile = {
    ...data.profile,
    headline: content.profile.headline,
    bio: content.profile.bio,
  };
  delete data.profile.availability;

  const matches = (project, current) =>
    current.title?.trim().toLowerCase() === project.title.toLowerCase() ||
    current.repositoryUrl?.trim().replace(/\/$/, '') === project.repositoryUrl;
  const occupiedIds = new Set(data.projects.map(({ id }) => id));
  const reviewed = content.projects.map((project) => {
    const existing = data.projects.find((current) => matches(project, current));
    if (existing) return { ...existing, ...project, id: existing.id };
    return occupiedIds.has(project.id) ? { ...project, id: randomUUID() } : project;
  });

  const otherProjects = data.projects.filter((project) =>
    project.title?.trim().toLowerCase() !== 'acadence' &&
    !content.projects.some((item) => matches(item, project))
  );
  data.projects = [...reviewed, ...otherProjects];

  const removedMilestones = new Set([
    'Jigyasa Scientific Outreach Programme',
    'Take Charge - Global Battery Experiment',
  ]);
  data.achievements = data.achievements.filter(({ title }) => !removedMilestones.has(title));
  return true;
}

module.exports = { createSeedData, refreshPortfolioContent };
