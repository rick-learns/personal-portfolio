import React from 'react';
import { Skill } from '@/lib/data';

interface SkillBarProps {
  skill: Skill;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill }) => {
  // Create a progress visualization with '#' characters for terminal style
  const totalChars = 20; // Total width of progress bar in characters
  const filledChars = Math.round((skill.percentage / 100) * totalChars);
  const progressBar = Array(filledChars).fill('#').join('') + Array(totalChars - filledChars).fill('-').join('');

  return (
    <div className="mb-5 font-mono">
      <div className="flex justify-between items-center mb-1">
        <span className="text-white">{skill.name}</span>
        <span className="text-xs text-slate-400">{skill.percentage}%</span>
      </div>
      
      <div className="terminal-skill-bar">
        <span className="text-slate-500">[</span>
        <span className="text-orange-500">{progressBar.substring(0, filledChars)}</span>
        <span className="text-slate-700">{progressBar.substring(filledChars)}</span>
        <span className="text-slate-500">]</span>
      </div>
      
      {/* Traditional visual progress bar as backup */}
      <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-1 hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" 
          style={{ width: `${skill.percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;
