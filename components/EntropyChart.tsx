import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { step: 'Start', vibe: 10, chaos: 10 },
  { step: 'Prompt 1', vibe: 30, chaos: 20 },
  { step: 'Prompt 2', vibe: 50, chaos: 60 },
  { step: 'Bug Fix', vibe: 60, chaos: 90 },
  { step: 'Rewrite', vibe: 85, chaos: 20 }, // SOP kicks in
  { step: 'Final', vibe: 95, chaos: 15 },
];

const EntropyChart: React.FC = () => {
  return (
    <div className="w-full h-64 bg-vibe-card/50 rounded-xl p-4 border border-vibe-accent/20">
      <h3 className="text-sm font-mono text-vibe-muted mb-4 uppercase tracking-wider">Entropy vs. Vibe Trajectory</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="step" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', color: '#f8fafc' }}
            itemStyle={{ color: '#f8fafc' }}
          />
          <Legend />
          <Line type="monotone" dataKey="chaos" name="Typical Chaos" stroke="#ef4444" strokeWidth={2} dot={{r: 4}} />
          <Line type="monotone" dataKey="vibe" name="Vibe SOP" stroke="#6366f1" strokeWidth={3} dot={{r: 4}} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EntropyChart;