// AIConsultantPage.tsx

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as Icons from 'lucide-react'
import { Button } from '../ui/button'
import { useAIConsultant } from '../../hooks/use-ai-consultant'
import type { AIConsultantPrompt } from '../../lib/types/ai'
import { SplineScene } from "../ui/spline"
import { Spotlight } from "../ui/spotlight"

// Export HeadOrchestratorChat for individual use
export function HeadOrchestratorChat({ selectedQuestion }: { selectedQuestion?: string }) {
  const [question, setQuestion] = useState(selectedQuestion || '')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const { generateInsight, loading, error } = useAIConsultant()

  React.useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion)
    }
  }, [selectedQuestion])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return

    setMessages((prev) => [...prev, { role: 'user', content: question }])

    const prompt: AIConsultantPrompt = {
      metrics: {
        monthlyRevenue: 150000,
        patientCount: 1200,
        appointmentFillRate: 75,
        treatmentAcceptance: 65,
      },
      focusArea: 'head-orchestrator',
      question: question,
    }

    const insight = await generateInsight(prompt)
    if (insight) {
      setMessages((prev) => [...prev, { role: 'assistant', content: insight.description }])
    }

    setQuestion('')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[400px] flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-corporate text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <Icons.Brain className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">Head Brain Consultant</h3>
            <p className="text-sm opacity-80">Ask anything for a top-level overview / orchestrator!</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-navy hover:bg-navy-light text-white ml-4'
                    : 'bg-gray-lighter text-gray-darker mr-4'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your practice performance..."
            className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 !p-1 hover:bg-gray-lighter"
          >
            {loading ? (
              <Icons.Loader2 className="w-5 h-5 animate-spin text-navy" />
            ) : (
              <Icons.Send className="w-5 h-5 text-navy" />
            )}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  )
}

// Export SUB_AGENTS array for reuse
export const SUB_AGENTS = [
  {
    id: 'data-retrieval',
    title: 'Data Retrieval Agent',
    description: 'Fetches raw data: production, schedules, AR, etc.',
    scene: 'https://prod.spline.design/test-scene-data-retrieval.splinecode',
    gradient: 'bg-gradient-ocean',
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis Agent',
    description: 'Analyzes KPI trends, identifies correlations.',
    scene: 'https://prod.spline.design/test-scene-data-analysis.splinecode',
    gradient: 'bg-gradient-royal',
  },
  {
    id: 'marketing-roi',
    title: 'Marketing ROI Agent',
    description: 'Evaluates campaign performance and ROI.',
    scene: 'https://prod.spline.design/test-scene-marketing.splinecode',
    gradient: 'bg-gradient-tropical',
  },
];

export function SubAgentCard({ agent, onAsk }: { agent: typeof SUB_AGENTS[0], onAsk: (question: string) => void }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    await onAsk(question);
    setQuestion('');
    setLoading(false);
  };

  return (
    <div className={`rounded-xl p-6 relative overflow-hidden ${agent.gradient} shadow-glow hover:shadow-glow-lg transition-all duration-300`}>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      
      <div className="flex flex-col h-full">
        <div className="flex-1 relative z-10">
          <h3 className="text-xl font-bold text-white">
            {agent.title}
          </h3>
          <p className="mt-2 text-white/80">
            {agent.description}
          </p>
          
          <div className="h-40 mt-4">
            <SplineScene 
              scene={agent.scene}
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="mt-4 relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="w-full px-4 py-2 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/30 focus:border-transparent"
          />
          <Button
            onClick={handleAsk}
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 !p-1 hover:bg-white/10"
          >
            {loading ? (
              <Icons.Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Icons.ArrowRight className="w-5 h-5 text-white" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SubAgentsGrid() {
  const handleAsk = async (question: string) => {
    // TODO: Implement agent-specific question handling
    console.log('Question:', question);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {SUB_AGENTS.map((agent) => (
        <SubAgentCard
          key={agent.id}
          agent={agent}
          onAsk={handleAsk}
        />
      ))}
    </div>
  );
}

export default function AIConsultantPage() {
  return (
    <div className="space-y-6 p-6">
      <HeadOrchestratorChat />

      <SubAgentsGrid />
    </div>
  )
}
