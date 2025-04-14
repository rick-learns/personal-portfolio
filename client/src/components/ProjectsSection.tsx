import { Folder } from 'lucide-react';
import ProjectCard from './ProjectCard';
import { projects } from '@/lib/data';

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            <span className="text-orange-500">~/</span>featured<span className="text-orange-500">_projects</span>
          </h2>
          <div className="h-1 w-24 bg-orange-500 rounded-full mb-8"></div>
          <p className="text-center text-slate-300 max-w-2xl font-sans">
            A selection of my notable projects, showcasing my expertise in quality engineering and developmental work.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} imageIndex={index} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#" className="inline-flex items-center gap-2 bg-slate-900/50 border border-slate-800 hover:border-orange-500/80 px-6 py-3 rounded-md transition-all hover:bg-slate-800/80">
            <Folder className="h-5 w-5" />
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
