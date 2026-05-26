import { useInboxStore } from '../../store/inboxStore';

export function useLeads() {
  const store = useInboxStore();

  const leads = store.leads;
  const activeLeadId = store.activeLeadId;
  const activeLead = leads.find((l) => l.id === activeLeadId) || null;

  // Calculate totals
  const totalPipelineValue = leads.reduce((sum, lead) => sum + lead.dealValue, 0);
  
  const leadsByStatus = {
    new: leads.filter((l) => l.status === 'new'),
    contacted: leads.filter((l) => l.status === 'contacted'),
    qualified: leads.filter((l) => l.status === 'qualified'),
    won: leads.filter((l) => l.status === 'won'),
    lost: leads.filter((l) => l.status === 'lost'),
  };

  const leadsByPriority = {
    hot: leads.filter((l) => l.priority === 'hot'),
    warm: leads.filter((l) => l.priority === 'warm'),
    cold: leads.filter((l) => l.priority === 'cold'),
  };

  const thisWeekLeads = leads.filter((l) => {
    const created = new Date(l.dateCreated);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 3600000);
    return created >= weekAgo;
  });

  return {
    leads,
    leadsByStatus,
    leadsByPriority,
    thisWeekLeads,
    activeLead,
    setActiveLeadId: store.setActiveLeadId,
    updateLeadStatus: store.updateLeadStatus,
    updateLead: store.updateLead,
    addLead: store.addLead,
    totalPipelineValue,
  };
}
