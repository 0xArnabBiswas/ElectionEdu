/**
 * @file Quiz module unit tests
 * @description Tests for quiz scoring logic and result messages.
 */

import { describe, it, expect } from 'vitest';
import { calculateScore, getResultMessage, QUIZ_DATA } from '../modules/quiz.js';

describe('calculateScore', () => {
  it('returns perfect score when all answers are correct', () => {
    const correctAnswers = QUIZ_DATA.map((q) => q.correct);
    const result = calculateScore(correctAnswers);
    expect(result.score).toBe(10);
    expect(result.total).toBe(10);
    expect(result.percentage).toBe(100);
  });

  it('returns zero score when all answers are wrong', () => {
    const wrongAnswers = QUIZ_DATA.map((q) => (q.correct + 1) % q.options.length);
    const result = calculateScore(wrongAnswers);
    expect(result.score).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it('handles partial correct answers', () => {
    const answers = QUIZ_DATA.map((q, i) => (i < 5 ? q.correct : (q.correct + 1) % q.options.length));
    const result = calculateScore(answers);
    expect(result.score).toBe(5);
    expect(result.percentage).toBe(50);
  });

  it('handles empty answers array', () => {
    const result = calculateScore([]);
    expect(result.score).toBe(0);
    expect(result.total).toBe(10);
  });
});

describe('getResultMessage', () => {
  it('returns expert message for 100%', () => {
    expect(getResultMessage(100)).toContain('Perfect');
  });

  it('returns excellent for 80%+', () => {
    expect(getResultMessage(80)).toContain('Excellent');
  });

  it('returns good for 60%+', () => {
    expect(getResultMessage(60)).toContain('Good');
  });

  it('returns learning message for low scores', () => {
    expect(getResultMessage(20)).toContain('learn');
  });
});
