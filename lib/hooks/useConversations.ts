import { useInboxStore } from '../../store/inboxStore';
import { Conversation } from '../../types';

export function useConversations() {
  const store = useInboxStore();
  
  const conversations = store.conversations;
  const activeConversationId = store.activeConversationId;
  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    // Search filter
    const matchesSearch =
      c.contactName.toLowerCase().includes(store.searchFilter.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(store.searchFilter.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(store.searchFilter.toLowerCase());

    // Status filter
    const matchesStatus = store.statusFilter === 'all' ? true : c.status === store.statusFilter;

    // Channel filter
    const matchesChannel = store.channelFilter === 'all' ? true : c.channel === store.channelFilter;

    // Sentiment filter
    const matchesSentiment = store.sentimentFilter === 'all' ? true : c.sentiment === store.sentimentFilter;

    return matchesSearch && matchesStatus && matchesChannel && matchesSentiment;
  });

  const sendMessage = (content: string, sender: 'agent' | 'ai' = 'agent') => {
    if (!activeConversationId) return;
    
    // Add message
    store.addMessageToConversation(activeConversationId, {
      conversationId: activeConversationId,
      sender,
      content,
      channel: activeConversation?.channel || 'email',
    });

    // Clear the active AI draft once a message is sent
    store.updateConversationAIDraft(activeConversationId, '');
  };

  const updateStatus = (status: Conversation['status']) => {
    if (!activeConversationId) return;
    store.updateConversationStatus(activeConversationId, status);
  };

  return {
    conversations: filteredConversations,
    allConversations: conversations,
    activeConversation,
    setActiveConversationId: store.setActiveConversationId,
    sendMessage,
    updateStatus,
    filters: {
      search: store.searchFilter,
      setSearch: store.setSearchFilter,
      status: store.statusFilter,
      setStatus: store.setStatusFilter,
      channel: store.channelFilter,
      setChannel: store.setChannelFilter,
      sentiment: store.sentimentFilter,
      setSentiment: store.setSentimentFilter,
    },
  };
}
