import React from 'react';
import { Link, Github } from 'lucide-react';
import { Project } from '@/lib/data';

interface ProjectCardProps {
  project: Project;
  imageIndex: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, imageIndex }) => {
  // A collection of placeholder colors for project thumbnails
  const placeholderColors = [
    'bg-gradient-to-br from-blue-700 to-indigo-900',
    'bg-gradient-to-br from-purple-700 to-blue-900',
    'bg-gradient-to-br from-indigo-700 to-purple-900',
  ];

  return (
    <div className="bg-slate-900/50 rounded-lg overflow-hidden border border-slate-800 hover:border-orange-500/50 transition-all group hover:-translate-y-2 hover:shadow-lg hover:shadow-orange-500/10">
      <div className="relative">
        <div className={`w-full h-48 ${placeholderColors[imageIndex % placeholderColors.length]} flex items-center justify-center text-gray-400`}>
          {project.title} Thumbnail
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-70"></div>
      </div>
      
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
          <a href="#" className="inline-flex items-center gap-1 text-sm text-white hover:text-orange-500 transition-colors">
            <Link className="h-4 w-4" />
            Live Demo
          </a>
          <a href="#" className="inline-flex items-center gap-1 text-sm text-white hover:text-orange-500 transition-colors">
            <Github className="h-4 w-4" />
            Source Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
