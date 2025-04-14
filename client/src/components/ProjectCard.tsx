import React from 'react';
import { Link, Github } from 'lucide-react';
import { Project } from '@/lib/data';

interface ProjectCardProps {
  project: Project;
  imageIndex: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, imageIndex }) => {
  const getProjectLink = (title: string, type: 'demo' | 'code') => {
    if (title === "My Personal Portfolio Website") {
      return type === 'demo' ? "https://www.rick-learns.dev" : "https://github.com/rick-learns/personal-portfolio";
    }
    return "#";
  };

  return (
    <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-all group hover:-translate-y-2 hover:shadow-lg hover:shadow-orange-500/10">      
      <div className="p-6">
        <div className="font-mono text-xs text-slate-400 mb-2">{project.fileType}</div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors">{project.title}</h3>
        <p className="text-slate-300 text-sm mb-4">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag, index) => (
            <span key={index} className="bg-slate-800/50 text-slate-300 px-2 py-1 rounded text-xs">{tag}</span>
          ))}
        </div>
        
        <div className="flex gap-3">
          <a 
            href={getProjectLink(project.title, 'demo')} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1 text-sm text-white hover:text-orange-500 transition-colors"
          >
            <Link className="h-4 w-4" />
            Live Demo
          </a>
          <a 
            href={getProjectLink(project.title, 'code')} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-1 text-sm text-white hover:text-orange-500 transition-colors"
          >
            <Github className="h-4 w-4" />
            Source Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;