/**
 * @module timeline
 * @description Interactive election process timeline with 7 phases.
 * Each phase is expandable with detailed information.
 */

/** @type {Array<{phase:number, icon:string, title:string, summary:string, details:{heading:string, points:string[]}}>} */
const TIMELINE_DATA = [
  {
    phase: 1,
    icon: '📋',
    title: 'Voter Registration',
    summary: 'Every Indian citizen aged 18+ can register to vote. The Election Commission maintains electoral rolls for each constituency.',
    details: {
      heading: 'Key Facts',
      points: [
        'Eligibility: Indian citizen, 18 years or older on the qualifying date',
        'Register online at nvsp.in or via Form 6 at your local ERO office',
        'EPIC (Electors Photo Identity Card) is issued upon registration',
        'You can only be registered in one constituency at a time',
        'Electoral rolls are revised before every general election',
      ],
    },
  },
  {
    phase: 2,
    icon: '📢',
    title: 'Election Announcement',
    summary: 'The Election Commission announces the schedule — dates, phases, and the Model Code of Conduct kicks in immediately.',
    details: {
      heading: 'Key Facts',
      points: [
        'The Election Commission of India (ECI) announces polling dates and phases',
        'Model Code of Conduct (MCC) comes into effect immediately upon announcement',
        'MCC restricts government from announcing new policies or schemes',
        'Political parties must follow strict advertising and campaigning rules',
        'Security arrangements begin across all constituencies',
      ],
    },
  },
  {
    phase: 3,
    icon: '📝',
    title: 'Nomination of Candidates',
    summary: 'Aspiring candidates file nomination papers with mandatory disclosures of assets, qualifications, and criminal records.',
    details: {
      heading: 'Key Facts',
      points: [
        'Candidates file nominations with the Returning Officer of their constituency',
        'Must submit affidavits disclosing assets, liabilities, and criminal cases',
        'Security deposit: ₹25,000 for general candidates, ₹12,500 for SC/ST',
        'Returning Officer scrutinizes nominations for validity',
        'Candidates can withdraw within a specified window after scrutiny',
      ],
    },
  },
  {
    phase: 4,
    icon: '📣',
    title: 'Election Campaign',
    summary: 'Candidates and parties engage voters through rallies, media, social media, and door-to-door canvassing.',
    details: {
      heading: 'Key Facts',
      points: [
        'Campaigning period begins after final list of candidates is published',
        'Parties release manifestos outlining their agenda and promises',
        'Expenditure limits: ₹95 lakh for Lok Sabha, ₹40 lakh for Assembly',
        'Campaigning must stop 48 hours before polling (silence period)',
        'ECI monitors hate speech, paid news, and violation of MCC',
      ],
    },
  },
  {
    phase: 5,
    icon: '🗳️',
    title: 'Polling Day (Voting)',
    summary: 'Voters visit assigned polling stations, verify identity, get inked, and cast votes on EVMs with VVPAT verification.',
    details: {
      heading: 'Key Facts',
      points: [
        'Polling stations set up across every constituency (within 2 km of voters)',
        'Voter identity verified via EPIC or any of 12 approved ID documents',
        'Indelible ink applied on left index finger to prevent double voting',
        'Votes cast using Electronic Voting Machines (EVMs)',
        'VVPAT (Voter Verifiable Paper Audit Trail) slip lets voters verify their choice',
        'NOTA (None of the Above) option available on every ballot',
      ],
    },
  },
  {
    phase: 6,
    icon: '📊',
    title: 'Counting & Results',
    summary: 'Sealed EVMs are transported to counting centres. Votes are tallied constituency-wise with full transparency.',
    details: {
      heading: 'Key Facts',
      points: [
        'EVMs sealed and stored in strong rooms under 24/7 CCTV surveillance',
        'Counting happens in the presence of candidates or their agents',
        'VVPAT slips of 5 randomly selected polling stations per constituency are verified',
        'Returning Officer declares the winner — candidate with most votes',
        'Results are published on the ECI website in real-time',
      ],
    },
  },
  {
    phase: 7,
    icon: '🏛️',
    title: 'Government Formation',
    summary: 'The party or coalition with majority (272+ seats in Lok Sabha) is invited by the President to form the government.',
    details: {
      heading: 'Key Facts',
      points: [
        'A party/coalition needs 272+ seats (simple majority) in the 543-seat Lok Sabha',
        'The President invites the leader of the majority party to be Prime Minister',
        'The PM selects the Council of Ministers and the Cabinet is sworn in',
        'If no party gets majority, the President may invite the largest party to prove majority',
        'The new Lok Sabha has a term of 5 years unless dissolved earlier',
      ],
    },
  },
];

/**
 * Renders the election timeline and sets up interactivity.
 */
export function initTimeline() {
  const container = document.getElementById('timeline-container');
  if (!container) return;

  container.innerHTML = '';
  TIMELINE_DATA.forEach((item) => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.setAttribute('role', 'listitem');

    el.innerHTML = `
      <div class="timeline-dot" aria-hidden="true"></div>
      <div class="glass-card timeline-card" tabindex="0" role="button"
           aria-expanded="false" aria-label="Phase ${item.phase}: ${item.title}. Click to expand details.">
        <div class="timeline-card-header">
          <span class="timeline-phase">Phase ${item.phase}</span>
          <span class="timeline-icon" aria-hidden="true">${item.icon}</span>
        </div>
        <h3 class="timeline-title">${item.title}</h3>
        <p class="timeline-summary">${item.summary}</p>
        <div class="timeline-details" id="timeline-details-${item.phase}">
          <div class="timeline-details-inner">
            <h4>${item.details.heading}</h4>
            <ul>
              ${item.details.points.map((p) => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        </div>
        <button class="timeline-expand" aria-controls="timeline-details-${item.phase}">
          Learn more <span class="timeline-expand-icon" aria-hidden="true">▼</span>
        </button>
      </div>
    `;
    container.appendChild(el);

    // Click & keyboard toggle
    const card = el.querySelector('.timeline-card');
    const details = el.querySelector('.timeline-details');
    const expandBtn = el.querySelector('.timeline-expand');
    const toggle = () => {
      const isOpen = details.classList.toggle('open');
      expandBtn.classList.toggle('open', isOpen);
      card.setAttribute('aria-expanded', String(isOpen));
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  observeTimeline();
}

function observeTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  items.forEach((item) => observer.observe(item));
}
