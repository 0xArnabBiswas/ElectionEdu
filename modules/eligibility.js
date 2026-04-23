/**
 * @module eligibility
 * @description Voter eligibility checker with step-by-step form validation.
 * Checks age, citizenship, and registration status.
 */

import { sanitizeInput } from './sanitize.js';

/**
 * Checks voter eligibility based on age, citizenship, and residency.
 * @param {{age:number, citizenship:string, registered:string}} data
 * @returns {{eligible:boolean, message:string, details:string}}
 */
export function checkEligibility(data) {
  if (!data || typeof data.age !== 'number') {
    return { eligible: false, message: 'Invalid input', details: 'Please provide valid information.' };
  }
  if (data.citizenship !== 'indian') {
    return {
      eligible: false,
      message: 'Not Eligible',
      details: 'Only Indian citizens are eligible to vote in Indian elections. If you are a citizen but hold an overseas passport, you may register as an overseas voter at nvsp.in.',
    };
  }
  if (data.age < 18) {
    return {
      eligible: false,
      message: 'Not Yet Eligible',
      details: `You will become eligible to vote when you turn 18. That's in approximately ${18 - data.age} year(s). Start learning about the process now so you're ready!`,
    };
  }
  if (data.registered === 'yes') {
    return {
      eligible: true,
      message: 'You\'re All Set! ✅',
      details: 'You are eligible and already registered to vote. Make sure your details are up to date on the electoral roll. Check at nvsp.in.',
    };
  }
  return {
    eligible: true,
    message: 'You\'re Eligible! 🎉',
    details: 'Great news — you are eligible to vote! Register now at nvsp.in or visit your nearest Electoral Registration Officer with Form 6.',
  };
}

/**
 * Renders the eligibility checker form and handles submission.
 */
export function initEligibility() {
  const container = document.getElementById('eligibility-container');
  if (!container) return;

  container.innerHTML = `
    <div class="glass-card">
      <form class="eligibility-form" id="eligibility-form" novalidate>
        <div class="form-group">
          <label for="elig-age" class="form-label">Your Age</label>
          <input type="number" id="elig-age" class="form-input" min="1" max="150"
                 placeholder="Enter your age" required aria-required="true" />
        </div>
        <div class="form-group">
          <label for="elig-citizenship" class="form-label">Citizenship</label>
          <select id="elig-citizenship" class="form-select" required aria-required="true">
            <option value="">Select citizenship</option>
            <option value="indian">Indian Citizen</option>
            <option value="nri">NRI / Overseas Indian</option>
            <option value="other">Foreign National</option>
          </select>
        </div>
        <div class="form-group">
          <label for="elig-registered" class="form-label">Already registered to vote?</label>
          <select id="elig-registered" class="form-select" required aria-required="true">
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="unsure">Not Sure</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" id="elig-submit" style="width:100%;justify-content:center;">
          Check Eligibility
        </button>
      </form>
      <div id="eligibility-result" role="alert"></div>
    </div>
  `;

  const form = document.getElementById('eligibility-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const age = parseInt(document.getElementById('elig-age').value, 10);
    const citizenship = sanitizeInput(document.getElementById('elig-citizenship').value);
    const registered = sanitizeInput(document.getElementById('elig-registered').value);

    if (isNaN(age) || !citizenship) {
      announce('Please fill in all required fields.');
      return;
    }

    // NRI can also vote as overseas voter
    const effectiveCitizenship = (citizenship === 'nri') ? 'indian' : citizenship;
    const result = checkEligibility({ age, citizenship: effectiveCitizenship, registered });
    renderResult(result);
    announce(result.message);
  });
}

function renderResult(result) {
  const el = document.getElementById('eligibility-result');
  el.innerHTML = `
    <div class="eligibility-result ${result.eligible ? 'eligible' : 'not-eligible'}">
      <div class="eligibility-result-icon">${result.eligible ? '✅' : '❌'}</div>
      <h3>${result.message}</h3>
      <p>${result.details}</p>
      ${!result.eligible ? '' : '<p style="margin-top:12px;"><a href="https://www.nvsp.in/" target="_blank" rel="noopener noreferrer">Visit NVSP Portal →</a></p>'}
    </div>
  `;
}

/** @description Announces message to screen readers */
function announce(msg) {
  const el = document.getElementById('sr-announcer');
  if (el) el.textContent = msg;
}
