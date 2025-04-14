import React, { useState, useEffect } from 'react';
import TerminalWindow from './TerminalWindow';
import { skillCategories } from '@/lib/data';

const SkillsSection = () => {
  const [animationState, setAnimationState] = useState<'typing' | 'running' | 'complete'>('typing');
  const [typedCommand, setTypedCommand] = useState('');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(-1);
  const [visibleSkillIndices, setVisibleSkillIndices] = useState<number[]>([]);
  
  const command = 'skills --';
  
  // Step 1: Type the command
  useEffect(() => {
    if (animationState !== 'typing') return;
    
    if (typedCommand.length < command.length) {
      const timerId = setTimeout(() => {
        setTypedCommand(prev => command.substring(0, prev.length + 1));
      }, 50);
      return () => clearTimeout(timerId);
    } else {
      // Command typed, start running after a short pause
      const timerId = setTimeout(() => {
        setAnimationState('running');
        setCurrentCategoryIndex(0);
      }, 300);
      return () => clearTimeout(timerId);
    }
  }, [typedCommand, animationState]);
  
  // Step 2: Show categories and skills sequentially
  useEffect(() => {
    if (animationState !== 'running') return;
    
    // If all categories are shown, we're done
    if (currentCategoryIndex >= skillCategories.length) {
      setAnimationState('complete');
      return;
    }
    
    // Get current category's skills
    const currentCategory = skillCategories[currentCategoryIndex];
    const skillsCount = currentCategory.skills.length;
    
    // If we've shown all skills in the current category, move to the next category
    if (visibleSkillIndices.length >= skillsCount) {
      const timerId = setTimeout(() => {
        setCurrentCategoryIndex(prevIndex => prevIndex + 1);
        setVisibleSkillIndices([]);
      }, 500); // Pause before showing next category
      return () => clearTimeout(timerId);
    }
    
    // Otherwise, show the next skill
    const timerId = setTimeout(() => {
      setVisibleSkillIndices(prev => [...prev, prev.length]);
    }, 100); // Fast skill appearance
    
    return () => clearTimeout(timerId);
  }, [currentCategoryIndex, visibleSkillIndices, animationState]);
  
  // Render the skills section
  return (
    <section id="skills" className="py-24 px-4 bg-slate-950">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            <span className="text-orange-500">~/</span>skills<span className="text-orange-500">_&_expertise</span>
          </h2>
          <div className="h-1 w-24 bg-orange-500 rounded-full mb-8"></div>
          <p className="text-center text-slate-300 max-w-2xl font-sans">
            A curated collection of technologies I work with to build modern, efficient, and scalable applications.
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <TerminalWindow title="~/skills/terminal.sh" className="w-full">
            <div className="font-mono text-base p-4">
              {/* Initial command prompt */}
              <div className="mb-6">
                <span className="text-green-500">rickcohen@portfolio</span>
                <span className="text-white">:~/skills$ </span>
                <span className="text-white">{typedCommand}</span>
                {animationState === 'typing' && 
                 <span className="inline-block w-2 h-4 bg-white ml-0.5 animate-blink"></span>}
              </div>
              
              {/* For screen readers - immediate access to content */}
              <div className="sr-only">
                <h3>Skills & Expertise</h3>
                {skillCategories.map((category) => (
                  <div key={category.title}>
                    <h4>{category.title}</h4>
                    <ul>
                      {category.skills.map((skill) => (
                        <li key={skill.name}>{skill.name}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              
              {/* Animation of skills display */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-3">
                {skillCategories.map((category, catIndex) => {
                  // Only show categories up to the current one
                  if (catIndex > currentCategoryIndex) return null;
                  
                  return (
                    <div key={catIndex} className="mb-8">
                      <div className="text-orange-500 font-bold text-lg mb-1">
                        <span className="text-orange-500 mr-1">▸</span> {category.title}
                      </div>
                      <div className="text-blue-400 text-sm mb-4">{category.fileName}</div>
                      
                      {/* Only show skills for the current category based on animation state */}
                      {catIndex === currentCategoryIndex ? (
                        <div className="space-y-6">
                          {category.skills
                            .slice(0, visibleSkillIndices.length)
                            .map((skill, skillIndex) => (
                              <div key={skillIndex} className="text-white">
                                <div className="mb-1">
                                  <span>{skill.name}</span>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        // For previous categories, show all skills
                        <div className="space-y-6">
                          {category.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className="text-white">
                              <div className="mb-1">
                                <span>{skill.name}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Final command prompt */}
              {animationState === 'complete' && (
                <div className="mt-6">
                  <span className="text-green-500">rickcohen@portfolio</span>
                  <span className="text-white">:~/skills$ </span>
                  <span className="inline-block w-2 h-4 bg-white ml-0.5 animate-blink"></span>
                </div>
              )}
            </div>
          </TerminalWindow>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;