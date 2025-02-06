import axios from 'axios';

export class LLMService {
  static async infer(prompt: string): Promise<string> {
    try {
      const response = await axios.post('http://localhost:8080/v1/chat/completions', {
        model: "deepseek-ai/deepseek-coder-7b-instruct-v1.5",
        messages: [{ role: "user", content: prompt }]
      }, {
        headers: {
          Authorization: 'Bearer your-api-key'
        }
      });
      return response.data.text;
    } catch (error) {
      console.error('LLMService error:', error);
      throw new Error('Failed to get AI response');
    }
  }
}
