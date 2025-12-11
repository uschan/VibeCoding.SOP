import React, { useState } from 'react';
import { generateExecutionPlan } from '../services/geminiService';
import { PlannerResponse } from '../types';
import { Loader2, ArrowRight, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface PlannerToolProps {
  lang: 'en' | 'zh';
}

const PlannerTool: React.FC<PlannerToolProps> = ({ lang }) => {
  const [input, setInput] = useState('');
  const [plan, setPlan] = useState<PlannerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    title: lang === 'en' ? 'The Vibe Planner' : 'Vibe 规划器',
    desc: lang === 'en' 
      ? 'Input your complex feature requirement below. The AI will decompose it into a safe, iteration-proof execution plan based on the SOP.' 
      : '在下方输入复杂的开发需求。AI 将基于 SOP 将其拆解为安全的、防幻觉的执行计划。',
    placeholder: lang === 'en'
      ? 'e.g., I need a real-time dashboard with websocket updates, auth, and complex role-based filtering...'
      : '例如：我需要一个包含 Websocket 实时更新、身份验证和基于角色的复杂过滤功能的仪表盘...',
    button: lang === 'en' ? 'Decompose Task' : '拆解任务',
    blueprint: lang === 'en' ? 'Execution Blueprint' : '执行蓝图',
    strategy: lang === 'en' ? 'Prompt Strategy' : '提示词策略',
    risk: lang === 'en' ? 'Risk' : '潜在风险',
    error: lang === 'en' ? 'Generation failed. Please check your API Key or try again.' : '生成失败。请检查 API Key 或重试。'
  };

  const handlePlan = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setPlan(null);
    
    try {
      const result = await generateExecutionPlan(input, lang);
      if (result) {
        setPlan(result);
      } else {
        setError(t.error);
      }
    } catch (e) {
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 md:p-8 mt-8 border-t-4 border-t-vibe-accent shadow-2xl">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-2xl font-bold font-mono text-vibe-accent">
          <span className="mr-2">⚡</span>{t.title}
        </h2>
        <p className="text-vibe-muted">
          {t.desc}
        </p>
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.placeholder}
          className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-vibe-glow transition-all font-mono text-sm resize-none"
        />
        <button
          onClick={handlePlan}
          disabled={loading || !input}
          className="absolute bottom-4 right-4 bg-vibe-accent hover:bg-indigo-400 text-white px-4 py-2 rounded-md font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <span className="flex items-center gap-2">{t.button} <ArrowRight className="w-4 h-4" /></span>}
        </button>
      </div>

      {error && (
        <div className="mt-6 p-4 bg-red-950/30 border border-red-500/30 rounded-lg flex items-center gap-3 animate-in fade-in">
          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {plan && (
        <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-lg font-semibold text-white mb-4">{t.blueprint}</h3>
          <div className="grid gap-4">
            {plan.steps.map((step, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700 p-5 rounded-lg flex flex-col md:flex-row gap-4 hover:border-vibe-accent/50 transition-colors">
                <div className="flex-shrink-0">
                   <div className="w-8 h-8 rounded-full bg-vibe-accent/20 text-vibe-accent flex items-center justify-center font-bold font-mono">
                     {idx + 1}
                   </div>
                </div>
                <div className="flex-grow">
                  <h4 className="text-lg font-medium text-slate-100 mb-2">{step.title}</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-emerald-950/30 p-3 rounded border border-emerald-500/20">
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase mb-1">
                        <CheckCircle2 className="w-3 h-3" /> {t.strategy}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{step.promptStrategy}</p>
                    </div>
                    
                    <div className="bg-amber-950/30 p-3 rounded border border-amber-500/20">
                      <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase mb-1">
                        <AlertTriangle className="w-3 h-3" /> {t.risk}
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">{step.risk}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlannerTool;