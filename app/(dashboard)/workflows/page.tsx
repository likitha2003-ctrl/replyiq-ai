'use client';

import React, { useState, useCallback } from 'react';
import { GitMerge, Plus, Edit2, Zap, AlertTriangle, Clock, UserPlus, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactFlow, { 
  Background, 
  Controls,
  Edge,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  Handle,
  Position,
  BackgroundVariant,
  addEdge,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useToast } from '../../../components/shared/ToastProvider';

// --- Custom Nodes ---

const TriggerNode = ({ data }: any) => (
  <div className="bg-zinc-900/80 backdrop-blur-md border-2 border-emerald-500 rounded-xl p-4 shadow-xl min-w-[200px] flex items-center gap-3 group relative">
    <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
      <Zap size={20} />
    </div>
    <div>
      <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Trigger</div>
      <div className="text-sm font-semibold text-white">{data.label}</div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-emerald-500 border-none" />
  </div>
);

const ConditionNode = ({ data }: any) => (
  <div className="bg-zinc-900/80 backdrop-blur-md border-2 border-amber-500 rounded-xl p-4 shadow-xl min-w-[200px] flex items-center gap-3 group relative">
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-amber-500 border-none" />
    <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
      <AlertTriangle size={20} />
    </div>
    <div>
      <div className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Condition</div>
      <div className="text-sm font-semibold text-white">{data.label}</div>
    </div>
    <Handle type="source" position={Position.Right} className="w-3 h-3 bg-amber-500 border-none" />
  </div>
);

const ActionNode = ({ data }: any) => (
  <div className="bg-zinc-900/80 backdrop-blur-md border-2 border-violet-500 rounded-xl p-4 shadow-xl min-w-[200px] flex items-center gap-3 group relative">
    <Handle type="target" position={Position.Left} className="w-3 h-3 bg-violet-500 border-none" />
    <div className="p-2 bg-violet-500/20 text-violet-400 rounded-lg">
      <GitMerge size={20} />
    </div>
    <div>
      <div className="text-[10px] font-bold text-violet-500 uppercase tracking-wider">Action</div>
      <div className="text-sm font-semibold text-white">{data.label}</div>
    </div>
  </div>
);

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode
};

// --- Initial Data ---

const templates = [
  {
    id: 't1',
    name: 'Hot Lead Fast Track',
    description: 'Trigger: Lead score > 80. Action: Instant AI reply + Create lead + Notify agent.',
    icon: Zap,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    active: true,
    nodes: [
      { id: '1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Lead score > 80' } },
      { id: '2', type: 'action', position: { x: 350, y: 100 }, data: { label: 'Instant AI reply' } },
      { id: '3', type: 'action', position: { x: 350, y: 200 }, data: { label: 'Notify agent' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } },
      { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }
    ]
  },
  {
    id: 't2',
    name: 'Frustrated Customer Recovery',
    description: 'Trigger: Sentiment = Frustrated. Action: Escalate + Send empathetic reply + Flag.',
    icon: AlertTriangle,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    active: false,
    nodes: [
      { id: '1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Sentiment == Frustrated' } },
      { id: '2', type: 'condition', position: { x: 350, y: 150 }, data: { label: 'Is VIP?' } },
      { id: '3', type: 'action', position: { x: 650, y: 80 }, data: { label: 'Escalate to Manager' } },
      { id: '4', type: 'action', position: { x: 650, y: 220 }, data: { label: 'Send empathetic reply' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 } },
      { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 }, label: 'Yes' },
      { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 }, label: 'No' }
    ]
  },
  {
    id: 't3',
    name: 'No-Reply Follow Up',
    description: 'Trigger: No customer reply in 2 hours. Action: Send follow-up + Update status.',
    icon: Clock,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    active: true,
    nodes: [
      { id: '1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'No reply in 2hrs' } },
      { id: '2', type: 'action', position: { x: 350, y: 150 }, data: { label: 'Send follow-up' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }
    ]
  },
  {
    id: 't4',
    name: 'New Lead Welcome',
    description: 'Trigger: Lead created. Action: Send welcome message + Book appointment prompt.',
    icon: UserPlus,
    color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20',
    active: false,
    nodes: [
      { id: '1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Lead Created' } },
      { id: '2', type: 'action', position: { x: 350, y: 150 }, data: { label: 'Send Welcome msg' } }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }
    ]
  }
];

// --- Components ---

function VisualBuilderModal({ template, onClose, onSave }: { template: any, onClose: () => void, onSave: (template: any) => void }) {
  const [nodes, setNodes] = useState<Node[]>(template?.nodes || []);
  const [edges, setEdges] = useState<Edge[]>(template?.edges || []);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      type: 'system',
      title: 'Workflow Saved',
      description: `Successfully updated ${template.name}.`
    });
    onSave({ ...template, nodes, edges });
    onClose();
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge({ ...connection, animated: true, style: { stroke: '#8b5cf6', strokeWidth: 2 } }, eds)),
    []
  );

  const addNode = (type: 'trigger' | 'condition' | 'action', label: string) => {
    const newNode: Node = {
      id: `node_${Date.now()}`,
      type,
      position: { x: 250, y: 150 + nodes.length * 60 },
      data: { label }
    };
    setNodes((nds) => [...nds, newNode]);
  };

  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full h-[85vh] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900 z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${template.color}`}>
              <template.icon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{template.name}</h2>
              <p className="text-xs text-zinc-400">Visual Workflow Editor</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleSave} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer">
              Save Workflow
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-zinc-400 transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 relative bg-[#0a0f1d]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="react-flow-custom"
          >
            <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#334155" />
            <Controls className="bg-zinc-900 border-white/10 fill-zinc-400" />
          </ReactFlow>

          {/* Palette / Toolbar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-2 shadow-2xl">
            <button onClick={() => addNode('trigger', 'New Trigger')} className="px-3 py-2 border border-dashed border-white/20 rounded-xl text-xs font-semibold text-zinc-400 flex items-center gap-2 cursor-pointer hover:bg-white/5 hover:text-white transition-colors">
              <Zap size={14} className="text-emerald-400" /> Trigger Node
            </button>
            <button onClick={() => addNode('condition', 'New Condition')} className="px-3 py-2 border border-dashed border-white/20 rounded-xl text-xs font-semibold text-zinc-400 flex items-center gap-2 cursor-pointer hover:bg-white/5 hover:text-white transition-colors">
              <AlertTriangle size={14} className="text-amber-400" /> Condition Node
            </button>
            <button onClick={() => addNode('action', 'New Action')} className="px-3 py-2 border border-dashed border-white/20 rounded-xl text-xs font-semibold text-zinc-400 flex items-center gap-2 cursor-pointer hover:bg-white/5 hover:text-white transition-colors">
              <GitMerge size={14} className="text-violet-400" /> Action Node
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function WorkflowsPage() {
  const [workflowList, setWorkflowList] = useState<any[]>(templates);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [activeStates, setActiveStates] = useState<Record<string, boolean>>(
    templates.reduce((acc, t) => ({ ...acc, [t.id]: t.active }), {})
  );

  const toggleActive = (id: string) => {
    setActiveStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const newWorkflowTemplate = {
    id: 'new',
    name: 'Custom Workflow',
    description: 'Create a new automated sequence from scratch.',
    icon: GitMerge,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    active: false,
    nodes: [],
    edges: []
  };

  return (
    <div className="flex flex-col h-full p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-2">
            <GitMerge className="text-violet-500" size={32} />
            Workflow Automation
          </h1>
          <p className="text-zinc-400">Build conditional flows to automate your conversations and lead generation.</p>
        </div>
        
        <button 
          onClick={() => setEditingTemplate(newWorkflowTemplate)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all"
        >
          <Plus size={18} />
          New Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {workflowList.map(template => (
          <motion.div
            key={template.id}
            whileHover={{ y: -4 }}
            className="bg-zinc-900/60 border border-white/5 hover:border-violet-500/30 rounded-2xl p-6 transition-all group shadow-sm flex flex-col h-full relative overflow-hidden"
          >
            {activeStates[template.id] && (
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl border ${template.color}`}>
                <template.icon size={24} />
              </div>
              
              {/* Toggle */}
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => toggleActive(template.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${activeStates[template.id] ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                >
                  <motion.div
                    layout
                    className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                    animate={{ x: activeStates[template.id] ? 20 : 0 }}
                  />
                </button>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${activeStates[template.id] ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {activeStates[template.id] ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed flex-1 mb-6">
              {template.description}
            </p>

            <button
              onClick={() => setEditingTemplate(template)}
              className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-zinc-300 hover:text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 size={16} />
              Edit Workflow
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editingTemplate && (
          <VisualBuilderModal 
            template={editingTemplate} 
            onClose={() => setEditingTemplate(null)} 
            onSave={(updatedTemplate) => {
              if (updatedTemplate.id === 'new') {
                const newId = `t${Date.now()}`;
                const newWorkflow = { ...updatedTemplate, id: newId, active: true };
                setWorkflowList(prev => [...prev, newWorkflow]);
                setActiveStates(prev => ({ ...prev, [newId]: true }));
              } else {
                setWorkflowList(prev => prev.map(w => w.id === updatedTemplate.id ? updatedTemplate : w));
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
