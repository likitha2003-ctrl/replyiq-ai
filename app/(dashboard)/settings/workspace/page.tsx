'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings2, UserPlus, Trash2, Mail, Shield, CheckCircle2, AlertTriangle, Users } from 'lucide-react';
import { useWorkspaceStore } from '../../../../store/workspaceStore';

export default function WorkspaceSettingsPage() {
  const { workspaces, activeWorkspaceId } = useWorkspaceStore();
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId)!;

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('agent');

  const getPlanStyle = (plan: string) => {
    switch(plan.toLowerCase()) {
      case 'pro': return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
      case 'enterprise': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const members = [
    { id: 1, name: 'Alex Director', email: 'alex@example.com', role: 'Owner', status: 'Active' },
    { id: 2, name: 'Sarah Jenkins', email: 'sarah@example.com', role: 'Admin', status: 'Active' },
    { id: 3, name: 'Michael Chen', email: 'michael@example.com', role: 'Agent', status: 'Invited' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-3 shrink-0">
        <Settings2 className="text-zinc-400" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-white font-heading">Workspace Settings</h1>
          <p className="text-sm text-zinc-400">Manage your workspace details, plan, and team access.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 shrink-0">
        
        {/* Current Workspace Card */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 lg:col-span-1 shadow-sm flex flex-col">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Current Context</h2>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg" style={{ backgroundColor: activeWorkspace.avatarColor }}>
              {activeWorkspace.name.substring(0,2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{activeWorkspace.name}</h3>
              <div className="text-xs text-zinc-400 mt-1">ID: {activeWorkspace.id}</div>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/50 border border-white/5">
              <span className="text-xs font-semibold text-zinc-500 uppercase">Plan</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPlanStyle(activeWorkspace.plan)}`}>
                {activeWorkspace.plan}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/50 border border-white/5">
              <span className="text-xs font-semibold text-zinc-500 uppercase">Members</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5"><Users size={14} className="text-blue-400" /> {members.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-zinc-950/50 border border-white/5">
              <span className="text-xs font-semibold text-zinc-500 uppercase">Created</span>
              <span className="text-sm font-semibold text-white">{new Date(activeWorkspace.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {activeWorkspace.plan === 'starter' && (
            <div className="mt-6 p-4 rounded-xl bg-zinc-500/10 border border-zinc-500/20 text-center">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">Upgrade Available</div>
              <p className="text-[10px] text-zinc-200/70 mb-3">Upgrade to Pro — AI features locked in Starter plan.</p>
              <button className="w-full py-2 bg-zinc-600 hover:bg-zinc-500 text-white text-xs font-bold rounded-lg transition-colors">Upgrade to Pro</button>
            </div>
          )}
        </div>

        {/* Team Members Table */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-2xl flex flex-col lg:col-span-2 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/60 shrink-0">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Users size={16} className="text-blue-400" /> Team Access
            </h2>
            <button onClick={() => setShowInviteModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <UserPlus size={14} /> Invite Member
            </button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-950/50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5">
                  <th className="px-6 py-4">Member</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {members.map(member => (
                  <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-300 text-xs">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{member.name}</div>
                          <div className="text-[10px] text-zinc-400">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
                        {member.role === 'Owner' && <Shield size={12} className="text-amber-400" />}
                        {member.role}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${member.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {member.role !== 'Owner' && (
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors">Edit Role</button>
                          <button className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors">Remove</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2 mb-1"><AlertTriangle size={16} /> Danger Zone</h3>
          <p className="text-xs text-rose-200/60">Permanently delete this workspace and all of its data. This action cannot be undone.</p>
        </div>
        <button className="px-5 py-2.5 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-colors whitespace-nowrap">
          Delete Workspace
        </button>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-1">Invite Team Member</h3>
              <p className="text-xs text-zinc-400 mb-6">Send an email invitation to join {activeWorkspace.name}.</p>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@example.com" className="w-full bg-zinc-950 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Role</label>
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors">
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowInviteModal(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors">Cancel</button>
                <button onClick={() => setShowInviteModal(false)} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-colors">Send Invite</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
