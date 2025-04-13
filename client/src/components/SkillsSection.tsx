import { Code } from 'lucide-react';
import TerminalWindow from './TerminalWindow';
import SkillBar from './SkillBar';
import { skillCategories, techBadges } from '@/lib/data';

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 px-4 bg-blue-950">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            <span className="text-orange-500">~/</span>skills<span className="text-orange-500">_&_expertise</span>
          </h2>
          <div className="h-1 w-24 bg-orange-500 rounded-full mb-8"></div>
          <p className="text-center text-gray-300 max-w-2xl font-sans">
            A curated collection of technologies I work with to build modern, efficient, and scalable applications.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, index) => (
            <TerminalWindow key={index} title={category.fileName} className="h-full">
              <h3 className="text-xl font-bold text-orange-500 mb-6 font-mono">{category.title}</h3>
              
              {category.skills.map((skill, skillIndex) => (
                <SkillBar key={skillIndex} skill={skill} />
              ))}
            </TerminalWindow>
          ))}
        </div>
        
        {/* Technology badges */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-center mb-8 font-heading">Technologies I Work With</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {techBadges.map((badge, index) => (
              <div 
                key={index} 
                className="bg-blue-900/30 border border-gray-800 rounded-full px-4 py-2 flex items-center gap-2 hover:border-orange-500/50 transition-all hover:-translate-y-1"
              >
                <Code className="text-orange-500 h-4 w-4" />
                <span className="font-mono text-sm">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
