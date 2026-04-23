/**
 * @module quiz
 * @description Election knowledge quiz with scoring, explanations, and confetti.
 * Pure logic functions are exported separately for unit testing.
 */

/** @type {Array<{question:string, options:string[], correct:number, explanation:string}>} */
export const QUIZ_DATA = [
  {
    question: 'What is the minimum voting age in India?',
    options: ['16 years', '18 years', '21 years', '25 years'],
    correct: 1,
    explanation: 'The 61st Amendment Act of 1988 lowered the voting age from 21 to 18 years.',
  },
  {
    question: 'Which body conducts elections in India?',
    options: ['Supreme Court', 'Parliament', 'Election Commission of India', 'President of India'],
    correct: 2,
    explanation: 'The Election Commission of India (ECI), established under Article 324 of the Constitution, supervises all elections.',
  },
  {
    question: 'What does EVM stand for?',
    options: ['Electronic Voting Machine', 'Electoral Verification Method', 'Election Vote Manager', 'Electronic Voter Module'],
    correct: 0,
    explanation: 'EVMs (Electronic Voting Machines) have been used in all general elections since 2004.',
  },
  {
    question: 'What is VVPAT?',
    options: ['Voter Verified Paper Audit Trail', 'Virtual Voting Platform', 'Vote Verification Process', 'Voter Validity Authentication Test'],
    correct: 0,
    explanation: 'VVPAT generates a paper slip showing the candidate and symbol the voter chose, providing an additional verification layer.',
  },
  {
    question: 'How many seats are there in the Lok Sabha?',
    options: ['245', '435', '543', '600'],
    correct: 2,
    explanation: 'The Lok Sabha has 543 elected seats. 2 additional seats were historically nominated by the President.',
  },
  {
    question: 'What is the "Model Code of Conduct"?',
    options: ['A law passed by Parliament', 'Guidelines for parties during elections', 'Rules for counting votes', 'The Constitution preamble'],
    correct: 1,
    explanation: 'The MCC is a set of guidelines that political parties and candidates must follow from the announcement of elections until results are declared.',
  },
  {
    question: 'When must election campaigning stop before polling?',
    options: ['24 hours before', '48 hours before', '72 hours before', 'On polling day morning'],
    correct: 1,
    explanation: 'The "silence period" requires all campaigning to cease 48 hours before the polling station closes.',
  },
  {
    question: 'What is NOTA?',
    options: ['A political party', 'None of the Above option on ballot', 'National Online Testing Agency', 'New Online Transfer Act'],
    correct: 1,
    explanation: 'NOTA allows voters to officially reject all candidates. It was introduced by the Supreme Court in 2013.',
  },
  {
    question: 'What is the security deposit for a Lok Sabha general candidate?',
    options: ['₹10,000', '₹25,000', '₹50,000', '₹1,00,000'],
    correct: 1,
    explanation: 'General candidates must deposit ₹25,000, while SC/ST candidates deposit ₹12,500. The deposit is forfeited if the candidate gets less than 1/6th of total valid votes.',
  },
  {
    question: 'How many seats are needed for a simple majority in Lok Sabha?',
    options: ['200', '250', '272', '300'],
    correct: 2,
    explanation: 'A simple majority requires 272 seats out of 543 (half of total seats + 1). The party or coalition reaching this forms the government.',
  },
];

/**
 * Calculates the score for answered questions.
 * @param {number[]} answers - Array of selected option indices
 * @returns {{score:number, total:number, percentage:number}}
 */
export function calculateScore(answers) {
  let score = 0;
  const total = QUIZ_DATA.length;
  answers.forEach((ans, i) => {
    if (i < total && ans === QUIZ_DATA[i].correct) score++;
  });
  return { score, total, percentage: Math.round((score / total) * 100) };
}

/**
 * Returns a message based on the score percentage.
 * @param {number} percentage
 * @returns {string}
 */
export function getResultMessage(percentage) {
  if (percentage === 100) return '🏆 Perfect! You\'re an election expert!';
  if (percentage >= 80) return '🌟 Excellent! You know your democracy well!';
  if (percentage >= 60) return '👍 Good job! Keep learning about elections.';
  if (percentage >= 40) return '📚 Not bad, but there\'s more to learn!';
  return '💡 Time to explore the timeline section and learn more!';
}

/** @type {number} */
let currentQuestion = 0;
/** @type {number[]} */
let userAnswers = [];

/**
 * Initializes the quiz UI and event handling.
 */
export function initQuiz() {
  const container = document.getElementById('quiz-container');
  if (!container) return;
  showStartScreen(container);
}

function showStartScreen(container) {
  container.innerHTML = `
    <div class="glass-card quiz-start-card">
      <h3 style="font-family:var(--font-heading);font-size:1.4rem;">🧠 Test Your Knowledge</h3>
      <p>10 questions about India's election process. Think you can ace it?</p>
      <button class="btn btn-primary" id="quiz-start-btn">Start Quiz</button>
    </div>
  `;
  document.getElementById('quiz-start-btn').addEventListener('click', () => {
    currentQuestion = 0;
    userAnswers = [];
    showQuestion(container);
  });
}

function showQuestion(container) {
  const q = QUIZ_DATA[currentQuestion];
  container.innerHTML = `
    <div class="glass-card">
      <div class="quiz-progress">
        <div class="quiz-progress-bar">
          <div class="quiz-progress-fill" style="width:${(currentQuestion / QUIZ_DATA.length) * 100}%"></div>
        </div>
        <div class="quiz-progress-text">
          <span>Question ${currentQuestion + 1} of ${QUIZ_DATA.length}</span>
          <span>${Math.round((currentQuestion / QUIZ_DATA.length) * 100)}%</span>
        </div>
      </div>
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options" role="radiogroup" aria-label="Answer options">
        ${q.options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" role="radio" aria-checked="false">${opt}</button>
        `).join('')}
      </div>
      <div id="quiz-feedback"></div>
    </div>
  `;

  const options = container.querySelectorAll('.quiz-option');
  options.forEach((btn) => {
    btn.addEventListener('click', () => handleAnswer(container, parseInt(btn.dataset.index, 10), options));
  });
}

function handleAnswer(container, selected, options) {
  const q = QUIZ_DATA[currentQuestion];
  userAnswers.push(selected);

  options.forEach((btn) => {
    btn.disabled = true;
    const idx = parseInt(btn.dataset.index, 10);
    if (idx === q.correct) btn.classList.add('correct');
    if (idx === selected && idx !== q.correct) btn.classList.add('wrong');
  });

  const feedback = document.getElementById('quiz-feedback');
  feedback.innerHTML = `
    <div class="quiz-explanation">💡 ${q.explanation}</div>
    <button class="btn btn-primary quiz-next-btn" id="quiz-next">
      ${currentQuestion < QUIZ_DATA.length - 1 ? 'Next Question →' : 'See Results'}
    </button>
  `;

  document.getElementById('quiz-next').addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion < QUIZ_DATA.length) {
      showQuestion(container);
    } else {
      showResults(container);
    }
  });

  // Announce for screen readers
  const announcer = document.getElementById('sr-announcer');
  if (announcer) {
    announcer.textContent = selected === q.correct ? 'Correct!' : 'Incorrect. ' + q.explanation;
  }
}

function showResults(container) {
  const result = calculateScore(userAnswers);
  const msg = getResultMessage(result.percentage);

  container.innerHTML = `
    <div class="glass-card quiz-result">
      <div class="quiz-score">${result.score}/${result.total}</div>
      <div class="quiz-result-text">${msg}</div>
      <p style="color:var(--text-secondary);margin-bottom:24px;">You scored ${result.percentage}%</p>
      <button class="btn btn-primary" id="quiz-retry">Try Again</button>
    </div>
  `;

  document.getElementById('quiz-retry').addEventListener('click', () => {
    currentQuestion = 0;
    userAnswers = [];
    showQuestion(container);
  });

  // Fire confetti if score is good
  if (result.percentage >= 60) fireConfetti();
}

function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#7c3aed', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#ec4899'];

  for (let i = 0; i < 150; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: Math.random() * 3 + 2,
      vx: (Math.random() - 0.5) * 2,
      rot: Math.random() * 360,
      rv: (Math.random() - 0.5) * 8,
    });
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    pieces.forEach((p) => {
      if (p.y < canvas.height + 20) {
        active = true;
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.rv;
        p.vy += 0.05;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });
    frame++;
    if (active && frame < 300) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  requestAnimationFrame(draw);
}
