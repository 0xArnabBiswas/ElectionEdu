/**
 * @module chatbot
 * @description AI-powered election chatbot using Google Gemini REST API.
 * Features: conversation history, suggestion chips, typing indicator,
 * response caching, debounced input, and fallback knowledge base.
 */

import { sanitizeChatInput } from './sanitize.js';

/** @type {string|null} */
let apiKey = null;

/** @type {Array<{role:string, parts:Array<{text:string}>}>} */
let conversationHistory = [];

/** @type {Map<string, string>} */
const responseCache = new Map();

/** @type {boolean} */
let isProcessing = false;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const SYSTEM_PROMPT = `You are "Election AI", a friendly, knowledgeable, and impartial election education assistant for Indian elections.

YOUR ROLE:
- Help users understand India's election process, from voter registration to government formation.
- Explain complex topics in simple, easy-to-understand language.
- Be factual, neutral, and non-partisan — never express political opinions or support any party/candidate.
- Provide accurate information sourced from the Election Commission of India (ECI).

YOUR KNOWLEDGE COVERS:
1. Voter registration (eligibility, EPIC card, NVSP portal, Form 6)
2. Election announcement and schedule (phases, Model Code of Conduct)
3. Candidate nomination (filing, scrutiny, withdrawal, deposits)
4. Election campaigns (rules, expenditure limits, silence period)
5. Polling process (EVMs, VVPAT, NOTA, polling stations, voter ID)
6. Vote counting and result declaration (strong rooms, transparency)
7. Government formation (majority, PM selection, coalition)
8. Electoral reforms, RTI in elections, and key amendments
9. Key statistics (543 Lok Sabha seats, 970M+ voters, etc.)
10. Historical context (key elections, landmark judgments)

RESPONSE GUIDELINES:
- Keep responses concise (3-5 sentences for simple questions, more for complex ones).
- Use bullet points for lists.
- Include relevant numbers and facts.
- If you don't know something, say so honestly.
- If asked about non-election topics, politely redirect to election-related topics.
- Use emojis sparingly for friendliness (🗳️ 📋 ✅).
- Format responses in plain text (no markdown headings).`;

const SUGGESTION_CHIPS = [
  'How do I register to vote?',
  'What is an EVM?',
  'Explain NOTA',
  'Election timeline steps',
  'Who can contest elections?',
  'What is VVPAT?',
];

/**
 * Fallback knowledge base for when Gemini API is unavailable.
 * @type {Array<{keywords:string[], response:string}>}
 */
const FALLBACK_KB = [
  {
    keywords: ['register', 'registration', 'voter id', 'epic', 'nvsp', 'enroll'],
    response: '🗳️ To register as a voter in India:\n\n• You must be an Indian citizen aged 18+\n• Visit nvsp.in or your nearest Electoral Registration Officer\n• Fill out Form 6 with proof of age and address\n• You\'ll receive your EPIC (Electors Photo Identity Card)\n• You can only be registered in one constituency',
  },
  {
    keywords: ['evm', 'electronic voting', 'machine', 'voting machine'],
    response: '🗳️ EVMs (Electronic Voting Machines) are used in all Indian elections since 2004:\n\n• They consist of a Control Unit and a Ballot Unit\n• Each EVM can record up to 3,840 votes\n• They run on batteries and don\'t need electricity\n• EVMs are tested and sealed before elections\n• They\'re paired with VVPAT for verification',
  },
  {
    keywords: ['nota', 'none of the above', 'reject'],
    response: '🗳️ NOTA (None of the Above) lets voters reject all candidates:\n\n• Introduced by Supreme Court in 2013 (PUCL v. Union of India)\n• It appears as the last option on the EVM\n• Even if NOTA gets the most votes, the candidate with the highest votes among parties still wins\n• It\'s a way to express dissatisfaction with all candidates',
  },
  {
    keywords: ['vvpat', 'paper', 'audit', 'trail', 'verify'],
    response: '🗳️ VVPAT (Voter Verifiable Paper Audit Trail):\n\n• A printer attached to the EVM that generates a paper slip\n• The slip shows the candidate name and party symbol you voted for\n• It\'s visible for 7 seconds before dropping into a sealed box\n• 5 random VVPATs per constituency are cross-verified with EVMs\n• Introduced to increase transparency and voter confidence',
  },
  {
    keywords: ['timeline', 'steps', 'process', 'phases', 'stages'],
    response: '🗳️ India\'s election process has 7 key phases:\n\n1. Voter Registration — citizens enroll on electoral rolls\n2. Election Announcement — ECI declares schedule, MCC begins\n3. Nomination — candidates file papers with Returning Officer\n4. Campaign — parties and candidates canvass for votes\n5. Polling Day — voters cast ballots on EVMs\n6. Counting — votes tallied at counting centres\n7. Government Formation — majority party forms government',
  },
  {
    keywords: ['contest', 'candidate', 'run', 'stand', 'nominate', 'nomination'],
    response: '🗳️ To contest elections in India:\n\n• Must be an Indian citizen\n• Minimum age: 25 for Lok Sabha/Vidhan Sabha, 30 for Rajya Sabha\n• Must be a registered voter in any constituency in India\n• Security deposit: ₹25,000 (General), ₹12,500 (SC/ST)\n• Must file nomination with affidavits on assets and criminal cases\n• Cannot hold any office of profit under the government',
  },
  {
    keywords: ['model code', 'mcc', 'conduct', 'rules'],
    response: '🗳️ The Model Code of Conduct (MCC):\n\n• A set of guidelines for parties/candidates during elections\n• Comes into effect the moment elections are announced\n• Prohibits government from announcing new policies or schemes\n• Restricts use of government resources for campaigning\n• ECI can take action against violators\n• Remains in force until results are declared',
  },
  {
    keywords: ['hello', 'hi', 'hey', 'greetings', 'namaste'],
    response: '👋 Hello! I\'m your Election AI assistant. How can I help you understand India\'s election process today?\n\nYou can ask me about voter registration, EVMs, the election timeline, or how government is formed!',
  },
];

/**
 * Initializes the chatbot — sets up Gemini client, UI events, and welcome message.
 */
export function initChatbot() {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (key && key !== 'your_api_key_here') {
    apiKey = key;
    console.info('Gemini API key loaded successfully.');
  } else {
    console.info('No Gemini API key found. Using fallback knowledge base. Set VITE_GEMINI_API_KEY in .env');
  }

  setupUI();
  addBotMessage('Hello! 👋 I\'m your Election AI assistant, powered by Google Gemini. Ask me anything about India\'s election process — voter registration, EVMs, timelines, and more!');
  renderSuggestions();
}

function setupUI() {
  const fab = document.getElementById('chatbot-fab');
  const widget = document.getElementById('chatbot-widget');
  const closeBtn = document.getElementById('chatbot-close');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');

  // Open / close chat
  fab.addEventListener('click', () => toggleChat(true));
  closeBtn.addEventListener('click', () => toggleChat(false));

  // Also open chat from hero CTA
  const heroChatBtn = document.getElementById('hero-cta-chat');
  if (heroChatBtn) heroChatBtn.addEventListener('click', () => toggleChat(true));

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('open')) toggleChat(false);
  });

  // Send message
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || isProcessing) return;
    input.value = '';
    await handleUserMessage(text);
  });
}

function toggleChat(open) {
  const widget = document.getElementById('chatbot-widget');
  const fab = document.getElementById('chatbot-fab');
  const input = document.getElementById('chatbot-input');

  widget.classList.toggle('open', open);
  widget.setAttribute('aria-hidden', String(!open));
  fab.setAttribute('aria-expanded', String(open));

  if (open) {
    input.focus();
  }
}

/**
 * Handles a user message — sanitizes, displays, and gets AI response.
 * @param {string} rawText - Raw user input
 */
async function handleUserMessage(rawText) {
  const text = sanitizeChatInput(rawText);
  if (!text) return;

  addUserMessage(text);
  clearSuggestions();
  isProcessing = true;
  showTypingIndicator();

  try {
    let response;

    // Check cache first
    const cacheKey = text.toLowerCase().trim();
    if (responseCache.has(cacheKey)) {
      response = responseCache.get(cacheKey);
    } else if (apiKey) {
      response = await getGeminiResponse(text);
    } else {
      response = getFallbackResponse(text);
    }

    removeTypingIndicator();
    addBotMessage(response);
    responseCache.set(cacheKey, response);
  } catch (err) {
    console.error('Chatbot error:', err);
    removeTypingIndicator();
    
    // Silent fallback to built-in knowledge
    const fallback = getFallbackResponse(text);
    addBotMessage(fallback);
  }

  isProcessing = false;
  renderSuggestions();
}

/**
 * Gets a response from Google Gemini API.
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
export async function getGeminiResponse(userMessage) {
  conversationHistory.push({
    role: 'user',
    parts: [{ text: userMessage }],
  });

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: conversationHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `API returned ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    || 'I apologize, I could not generate a response. Please try again.';

  conversationHistory.push({
    role: 'model',
    parts: [{ text }],
  });

  // Keep conversation history manageable
  if (conversationHistory.length > 20) {
    conversationHistory = conversationHistory.slice(-16);
  }

  return text;
}

/**
 * Gets a response from the fallback knowledge base using keyword matching.
 * @param {string} userMessage
 * @returns {string}
 */
export function getFallbackResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of FALLBACK_KB) {
    const score = entry.keywords.filter((kw) => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch) return bestMatch.response;

  const defaultMsg = apiKey
    ? "🗳️ That's an interesting question! I have built-in knowledge about voter registration, EVMs, VVPAT, NOTA, and the election timeline. Try asking about those! 💡"
    : "🗳️ That's an interesting question! I have built-in knowledge about voter registration, EVMs, VVPAT, NOTA, and the election timeline. 💡 For the best experience, add your Gemini API key to unlock AI-powered responses.";

  return defaultMsg;
}

function addBotMessage(text) {
  const container = document.getElementById('chatbot-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-message bot';
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
  const container = document.getElementById('chatbot-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-message user';
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('chatbot-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-message bot typing';
  msg.id = 'typing-indicator';
  msg.innerHTML = '<div class="typing-dots"><span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function renderSuggestions() {
  const container = document.getElementById('chatbot-suggestions');
  container.innerHTML = '';
  SUGGESTION_CHIPS.forEach((text) => {
    const chip = document.createElement('button');
    chip.className = 'suggestion-chip';
    chip.textContent = text;
    chip.setAttribute('aria-label', `Ask: ${text}`);
    chip.addEventListener('click', () => {
      if (!isProcessing) handleUserMessage(text);
    });
    container.appendChild(chip);
  });
}

function clearSuggestions() {
  const container = document.getElementById('chatbot-suggestions');
  container.innerHTML = '';
}
