import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { VoiceCampaignList } from './components/voice/VoiceCampaignList';
import { CreateCampaignDialog } from './components/voice/CreateCampaignDialog';
import { AIAgentSettings } from './components/voice/AIAgentSettings';
import { VoiceAnalytics } from './components/voice/VoiceAnalytics';
import { TermsDialog } from './components/voice/TermsDialog';
import { useSettings } from '../../../contexts/SettingsContext';
import { VoiceCampaignStats } from './components/voice/VoiceCampaignStats';
import { useToast } from '../../../components/ui/use-toast';
import { VoiceCampaignService } from '../../../services/voiceCampaignService';

const VoiceCampaigns = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);
  const [showAgentSettings, setShowAgentSettings] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryProgress, setRetryProgress] = useState(0);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const { state } = useSettings();
  const { toast } = useToast();

  // Check if terms have been accepted
  React.useEffect(() => {
    const termsAccepted = localStorage.getItem('voiceTermsAccepted');
    if (!termsAccepted) {
      setShowTermsDialog(true);
    }
  }, []);

  async function handleRetryFailed() {
    try {
      setIsRetrying(true);
      setRetryProgress(0);

      const response = await VoiceCampaignService.retryFailedCalls({
        campaignIds: selectedCampaigns,
        maxAttempts: 3,
        delayMs: 1000
      });

      const interval = setInterval(() => {
        setRetryProgress((prev) => Math.min(prev + 10, 100));
      }, 400);

      setTimeout(() => {
        clearInterval(interval);
        setIsRetrying(false);

        if (response.data.success) {
          toast({
            title: '✅ Retry Complete',
            description: `${response.data.retried} calls successfully retried`,
            className: 'bg-green-50 border-green-100'
          });
        } else {
          toast({
            variant: 'destructive',
            title: '⚠️ Partial Success',
            description: response.data.error || 'Some calls failed',
            className: 'bg-gold-50 border-gold-100'
          });
        }
      }, 3000);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '🚨 Retry Failed',
        description: error.message || 'Unknown error',
        className: 'bg-red-50 border-red-100'
      });
      setIsRetrying(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Voice Campaigns</h1>
          <p className="text-gray-500">Manage outbound calls and AI voice agent settings</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowAgentSettings(true)}
          >
            <Icons.Settings className="w-4 h-4 mr-2" />
            AI Agent Settings
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
          <Button
            onClick={handleRetryFailed}
            disabled={isRetrying || !selectedCampaigns.length}
            className="bg-navy hover:bg-navy-light text-white"
          >
            {isRetrying ? (
              <>
                <Icons.RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                Retrying...
              </>
            ) : (
              'Retry Failed Calls'
            )}
          </Button>
        </div>
      </div>

      {/* Retry Section */}
      <div className="p-4 bg-slate-50 rounded-lg shadow-glow">
        {isRetrying && (
          <div className="mt-4 p-4 bg-white rounded-xl shadow-sm">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-700 rounded-full transition-all"
                style={{ width: `${retryProgress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
              <Icons.Loader2 className="w-4 h-4 animate-spin text-gold" />
              Retrying {selectedCampaigns.length} campaign(s)...
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="space-y-6">
        <VoiceCampaignStats />
        
        {/* Analytics Dashboard */}
        <VoiceAnalytics />
      </div>

      {/* Campaign List */}
      <VoiceCampaignList setSelectedCampaigns={setSelectedCampaigns} />

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />

      {/* AI Agent Settings Dialog */}
      <AIAgentSettings
        open={showAgentSettings}
        onClose={() => setShowAgentSettings(false)}
      />

      {/* Terms and Conditions Dialog */}
      <TermsDialog
        open={showTermsDialog}
        onClose={() => {
          setShowTermsDialog(false);
          localStorage.setItem('voiceTermsAccepted', 'true');
        }}
      />
    </div>
  );
};

export default VoiceCampaigns;