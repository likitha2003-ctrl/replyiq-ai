import { useState } from 'react';
import { useInboxStore } from '../../store/inboxStore';
import { useAIModeStore } from '../../store/aiModeStore';
import { generateReply as generateAIReply } from '../ai/gemini';

export function useAIReply() {
  const [isGenerating, setIsGenerating] = useState(false);
  const updateDraft = useInboxStore((state) => state.updateConversationAIDraft);
  const aiSettings = useAIModeStore((state) => state.settings);

  const generateReply = async (conversationId: string, messageContent: string) => {
    setIsGenerating(true);
    try {
      const formattedHistory = [{ role: 'customer', content: messageContent }];
      const draft = await generateAIReply(
        formattedHistory,
        aiSettings.customInstructions,
        aiSettings.tone
      );
      updateDraft(conversationId, draft);
      return draft;
    } catch (e) {
      console.error(e);
      return '';
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateReply,
  };
}
