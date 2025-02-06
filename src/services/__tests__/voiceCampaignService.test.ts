import { VoiceCampaignService } from '../voiceCampaignService';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { z } from 'zod';

const mock = new MockAdapter(axios);

describe('VoiceCampaignService', () => {
  beforeEach(() => {
    localStorage.setItem('authToken', 'test-token');
    mock.reset();
  });

  describe('retryFailedCalls', () => {
    const validConfig = {
      campaignIds: ['7f14b5e4-69ea-4803-9c62-a5946bc2cc9c'],
      maxAttempts: 3,
      delayMs: 1000
    };

    // Validation Tests
    test('accepts valid configuration', async () => {
      mock.onPost('/retry').reply(200, { success: true, retried: 5 });
      await expect(VoiceCampaignService.retryFailedCalls(validConfig))
        .resolves.toHaveProperty('data.retried', 5);
    });

    test('rejects invalid UUIDs', async () => {
      await expect(VoiceCampaignService.retryFailedCalls({
        ...validConfig,
        campaignIds: ['invalid-id']
      })).rejects.toThrow(z.ZodError);
    });

    test('enforces maxAttempts <= 5', async () => {
      await expect(VoiceCampaignService.retryFailedCalls({
        ...validConfig,
        maxAttempts: 6
      })).rejects.toThrow('Number must be less than or equal to 5');
    });

    test('requires delayMs >= 1000', async () => {
      await expect(VoiceCampaignService.retryFailedCalls({
        ...validConfig,
        delayMs: 999
      })).rejects.toThrow('Number must be greater than or equal to 1000');
    });

    // Security Tests
    test('injects auth token from localStorage', async () => {
      mock.onPost('/retry').reply(config => {
        expect(config.headers.Authorization).toBe('Bearer test-token');
        return [200, { success: true }];
      });

      await VoiceCampaignService.retryFailedCalls(validConfig);
    });

    // Error Handling
    test('throws on server error', async () => {
      mock.onPost('/retry').reply(500, { error: 'Internal server error' });
      await expect(VoiceCampaignService.retryFailedCalls(validConfig))
        .rejects.toThrow('Retry operation failed');
    });

    test('handles partial success response', async () => {
      mock.onPost('/retry').reply(200, {
        success: false,
        error: 'Partial failure'
      });

      await expect(VoiceCampaignService.retryFailedCalls(validConfig))
        .rejects.toThrow('Partial failure');
    });
  });
});
