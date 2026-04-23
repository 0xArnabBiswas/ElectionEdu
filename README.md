# 🗳️ ElectionEdu — Interactive Indian Election Process Guide

An AI-powered web application that helps users understand India's election process through interactive timelines, quizzes, and an intelligent chatbot powered by **Google Gemini**.

> Built for the Hack2Skill Prompt Wars Competition

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chatbot** | Google Gemini-powered election Q&A assistant with conversation memory |
| 🗺️ **Interactive Timeline** | 7-phase animated journey from voter registration to government formation |
| 📊 **Election Quiz** | 10-question gamified quiz with instant feedback and confetti |
| 🗳️ **Eligibility Checker** | Check if you're eligible to vote with step-by-step guidance |
| 📈 **Stats Dashboard** | Animated counters showing India's election scale |
| 🌐 **Multi-Language** | Google Translate widget for 11 Indian languages |

## 🛠️ Tech Stack

- **Vite** — Build tool & dev server
- **Vanilla JavaScript (ES Modules)** — Modular, clean architecture
- **CSS Custom Properties** — Design system with glassmorphism
- **Google Gemini API** (`@google/genai`) — AI chatbot
- **Google Fonts** — Inter + Outfit typography
- **Google Translate** — Multi-language accessibility
- **Vitest** — Unit testing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A free Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Setup

```bash
# Clone the repository
git clone https://github.com/0xArnabBiswas/ElectionEdu.git
cd ElectionEdu

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your Gemini API key

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key |

## 🧪 Testing

```bash
npm test          # Run all tests
npm run test:watch # Watch mode
```

## 📁 Project Structure

```
ElectionEdu/
├── index.html              # Semantic HTML with ARIA
├── style.css               # Design system + glassmorphism
├── main.js                 # App entry point
├── modules/
│   ├── chatbot.js          # Gemini AI chatbot
│   ├── timeline.js         # Election timeline
│   ├── quiz.js             # Quiz engine
│   ├── eligibility.js      # Voter eligibility checker
│   ├── particles.js        # Canvas particle animation
│   ├── stats.js            # Animated statistics
│   └── sanitize.js         # Input sanitization
├── tests/
│   ├── quiz.test.js        # Quiz logic tests
│   ├── eligibility.test.js # Eligibility tests
│   └── sanitize.test.js    # Security tests
└── .env.example            # Environment template
```

## ♿ Accessibility

- ARIA labels on all interactive elements
- Full keyboard navigation
- Skip navigation link
- Screen reader announcements (`aria-live`)
- `prefers-reduced-motion` support
- WCAG AA color contrast
- Google Translate for multi-language support

## 🔒 Security

- API keys stored in `.env` (never committed)
- Input sanitization on all user inputs
- No `eval()` or `innerHTML` with user data
- CSP-friendly implementation

## 📄 License

MIT © Arnab Biswas
