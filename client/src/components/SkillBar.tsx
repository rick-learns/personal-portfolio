import React from 'react';
import { Skill } from '@/lib/data';

interface SkillBarProps {
  skill: Skill;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill }) => {
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-white">{skill.name}</span>
        <span className="text-xs text-gray-400 font-mono">{skill.percentage}%</span>
      </div>
      <div className="h-2 bg-blue-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" 
          style={{ width: `${skill.percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;
