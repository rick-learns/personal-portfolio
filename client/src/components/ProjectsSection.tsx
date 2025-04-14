import { Folder, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { projects } from '@/lib/data';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const ProjectsSection = () => {
  // Extract all unique technologies from projects
  const allTechnologies = [...new Set(projects.flatMap(project => project.technologies))];
  
  // State for filtering
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [sortOrder, setSortOrder] = useState<'default' | 'a-z' | 'z-a'>('default');

  // Handle filter selection
  const toggleTechFilter = (tech: string) => {
    if (selectedTech.includes(tech)) {
      setSelectedTech(selectedTech.filter(t => t !== tech));
    } else {
      setSelectedTech([...selectedTech, tech]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedTech([]);
    setSortOrder('default');
  };

  // Change sort order
  const toggleSortOrder = () => {
    if (sortOrder === 'default') setSortOrder('a-z');
    else if (sortOrder === 'a-z') setSortOrder('z-a');
    else setSortOrder('default');
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...projects];
    
    // Apply technology filters
    if (selectedTech.length > 0) {
      result = result.filter(project => 
        selectedTech.some(tech => project.technologies.includes(tech))
      );
    }
    
    // Apply sorting
    if (sortOrder === 'a-z') {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'z-a') {
      result = result.sort((a, b) => b.title.localeCompare(a.title));
    }
    
    setFilteredProjects(result);
  }, [selectedTech, sortOrder]);

  return (
    <section id="projects" className="py-24 px-4 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            <span className="text-orange-500">~/</span>featured<span className="text-orange-500">_projects</span>
          </h2>
          <div className="h-1 w-24 bg-orange-500 rounded-full mb-8"></div>
          <p className="text-center text-slate-300 max-w-2xl font-sans">
            A selection of my notable projects, showcasing my expertise in quality engineering and developmental work.
          </p>
        </div>
        
        {/* Filter Controls */}
        <div className="mb-10 bg-slate-900/70 border border-slate-800 rounded-lg p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex items-center mb-4 md:mb-0">
              <Filter className="h-5 w-5 mr-2 text-orange-500" />
              <h3 className="text-lg font-semibold">Filter & Sort Projects</h3>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleSortOrder}
                className={sortOrder !== 'default' ? "border-orange-500/50" : ""}
              >
                {sortOrder === 'default' ? 'Sort: Default' : sortOrder === 'a-z' ? 'Sort: A-Z' : 'Sort: Z-A'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={clearFilters}
                disabled={selectedTech.length === 0 && sortOrder === 'default'}
              >
                Clear Filters
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {allTechnologies.map((tech) => (
              <Badge 
                key={tech}
                variant={selectedTech.includes(tech) ? "default" : "outline"} 
                className={`cursor-pointer ${selectedTech.includes(tech) ? 'bg-orange-500 hover:bg-orange-600' : 'hover:bg-slate-800'}`}
                onClick={() => toggleTechFilter(tech)}
              >
                {tech}
              </Badge>
            ))}
          </div>
          
          {selectedTech.length > 0 && (
            <p className="mt-3 text-xs text-slate-400">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          )}
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <ProjectCard key={index} project={project} imageIndex={index} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-slate-300 mb-3">No projects match your selected filters.</p>
              <Button onClick={clearFilters} variant="outline">Clear Filters</Button>
            </div>
          )}
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