import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getFallbackResponse, getGeminiResponse } from '../modules/chatbot.js';

describe('Chatbot Logic', () => {
  describe('getFallbackResponse', () => {
    it('returns registration info for "register" keyword', () => {
      const response = getFallbackResponse('how do I register to vote?');
      expect(response).toContain('nvsp.in');
      expect(response).toContain('Form 6');
    });

    it('returns EVM info for "evm" keyword', () => {
      const response = getFallbackResponse('What is an EVM?');
      expect(response).toContain('Electronic Voting Machines');
      expect(response).toContain('Control Unit');
    });

    it('returns NOTA info for "nota" keyword', () => {
      const response = getFallbackResponse('explain nota please');
      expect(response).toContain('None of the Above');
    });

    it('returns default fallback for unknown keywords', () => {
      const response = getFallbackResponse('who will win the election?');
      expect(response).toContain('That\'s an interesting question!');
      expect(response).toContain('built-in knowledge');
    });
  });

  describe('getGeminiResponse', () => {
    beforeEach(() => {
      // Mock global fetch
      global.fetch = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('returns AI text when API call is successful', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          candidates: [
            {
              content: {
                parts: [{ text: 'This is a mocked Gemini response.' }],
              },
            },
          ],
        }),
      });

      const text = await getGeminiResponse('Hello');
      expect(text).toBe('This is a mocked Gemini response.');
    });

    it('throws error when API returns non-ok status', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          error: { message: 'Bad Request' },
        }),
      });

      await expect(getGeminiResponse('Fail')).rejects.toThrow('Bad Request');
    });
  });
});
