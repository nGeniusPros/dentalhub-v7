import axios from 'axios';
import { z } from 'zod';

/**
 * Service for managing voice campaign operations
 * @module VoiceCampaignService
 * @see {@link https://api.dentalhub.com/docs Voice Campaigns API Documentation}
 */

/**
 * Retry configuration schema for failed call attempts
 * @typedef {Object} RetryConfig
 * @property {string[]} campaignIds - Array of valid UUID campaign identifiers
 * @property {number} maxAttempts - Maximum retry attempts (1-5)
 * @property {number} delayMs - Minimum delay between attempts (≥1000ms)
 */

const RetrySchema = z.object({
  campaignIds: z.array(z.string().uuid()),
  maxAttempts: z.number().int().positive().max(5),
  delayMs: z.number().int().min(1000)
});

/**
 * @typedef {Object} RetryResult
 * @property {number} retried - Successfully retried calls
 * @property {number} failures - Permanent failures
 * @property {string|null} error - Error message if partial failure
 */

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE}/voice-campaigns`,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('authToken')}`
  }
});

export const VoiceCampaignService = {
  /**
   * Retries failed calls for specified campaigns
   * @async
   * @param {RetryConfig} config - Retry configuration parameters
   * @returns {Promise<RetryResult>} - Retry operation results
   * @throws {Error} - Validation errors or API failures
   * @example
   * try {
   *   const result = await VoiceCampaignService.retryFailedCalls({
   *     campaignIds: ['7f14b5e4-69ea-4803-9c62-a5946bc2cc9c'],
   *     maxAttempts: 3,
   *     delayMs: 1500
   *   });
   * } catch (error) {
   *   // Handle error
   * }
   */
  async retryFailedCalls(config: z.infer<typeof RetrySchema>) {
    const validated = RetrySchema.parse(config);
    
    const response = await API.post('/retry', validated, {
      timeout: 10000,
      validateStatus: (status) => status < 500
    });

    if (!response.data.success) {
      throw new Error(response.data.error || 'Retry operation failed');
    }

    return response;
  }
};
