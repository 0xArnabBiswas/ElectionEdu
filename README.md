# ElectionEdu — Interactive Indian Election Guide

[![CI](https://github.com/0xArnabBiswas/ElectionEdu/actions/workflows/ci.yml/badge.svg)](https://github.com/0xArnabBiswas/ElectionEdu/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://electionedu-193975227296.asia-south1.run.app/)

ElectionEdu is an advanced educational platform designed to empower Indian citizens with a deep understanding of their democratic rights and the electoral process. Using an AI-powered assistant, interactive timelines, and state-of-the-art UI/UX, ElectionEdu makes learning about democracy engaging and accessible.

## 🚀 Key Features

- **🤖 AI Election Assistant**: Powered by Google Gemini 1.5 Flash, providing real-time, factual answers to election-related queries.
- **🗺️ Interactive Election Journey**: A scroll-synchronized 7-phase timeline covering the entire process from registration to government formation.
- **🧠 Knowledge Quiz**: A gamified 10-question assessment with dynamic feedback and performance tracking.
- **🗳️ Eligibility Checker**: A logic-driven tool to verify voter registration requirements.
- **📈 Real-time Statistics**: Animated data dashboard showing the scale of the world's largest democracy.
- **🌐 Multilingual Support**: Integrated Google Translate for accessibility in major Indian languages (Hindi, Bengali, Tamil, etc.).

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), Vite, HTML5 (Semantic), CSS3 (Glassmorphism & Variables).
- **AI Engine**: Google Gemini 1.5 Flash REST API.
- **Deployment**: Google Cloud Run, Docker, Nginx.
- **Testing**: Vitest, Happy-DOM.
- **DevOps**: GitHub Actions (CI), Docker Desktop.

## 🛡️ Security & Performance

- **Strict CSP**: Comprehensive Content Security Policy meta tags.
- **Enterprise Headers**: Strict Nginx security headers (HSTS, XSS-Protection, No-Sniff).
- **Optimization**: Terser minification, chunk splitting, Gzip compression, and resource preloading.
- **Accessibility**: 100% ARIA-compliant components with AAA color contrast.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/0xArnabBiswas/ElectionEdu.git
   cd ElectionEdu
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file and add your Gemini API Key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

5. **Run Tests**:
   ```bash
   npm test
   ```

6. **Build for Production**:
   ```bash
   npm run build
   ```

## 📄 License
This project is for educational purposes as part of the Hack2Skill Prompt Wars Challenge.

---
Built with ❤️ by **Arnab Biswas**
