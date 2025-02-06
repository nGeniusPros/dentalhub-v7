import { LLMService } from '../lib/LLMService';

export class DataRetrievalAgent {
  async processQuery(userQuery: string) {
    const prompt = `Analyze this business query and identify required data points:
"${userQuery}"

Return JSON format with data requirements.`;
    
    return {
      content: await LLMService.infer(prompt),
      agent: 'DataRetrieval'
    };
  }
}
