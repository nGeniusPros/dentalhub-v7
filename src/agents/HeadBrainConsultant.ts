import { DataRetrievalAgent } from './DataRetrievalAgent';
import { HygieneAnalyticsAgent } from './HygieneAnalyticsAgent';

export class HeadBrainConsultant {
  async handleUserQuery(userInput: string) {
    const relevantAgents = this.decideAgents(userInput);
    const results = [];

    for (const agent of relevantAgents) {
      results.push(await agent.processQuery(userInput));
    }

    return results;
  }

  private decideAgents(userInput: string) {
    const agents = [];
    if (userInput.toLowerCase().includes('hygiene')) {
      agents.push(new HygieneAnalyticsAgent());
    }
    if (userInput.toLowerCase().match(/data|analytics/)) {
      agents.push(new DataRetrievalAgent());
    }
    return agents;
  }
}
