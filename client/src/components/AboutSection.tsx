import { Code2, LayoutDashboard, Database, Lightbulb } from 'lucide-react';
import TerminalWindow from './TerminalWindow';
import { aboutCards } from '@/lib/data';

const AboutSection = () => {
  // Map for icon components
  const iconMap = {
    Code2: <Code2 className="text-orange-500" />,
    LayoutDashboard: <LayoutDashboard className="text-orange-500" />,
    Database: <Database className="text-orange-500" />,
    Lightbulb: <Lightbulb className="text-orange-500" />
  };

  return (
    <section id="about" className="py-24 px-4 bg-gradient-to-b from-blue-900 to-blue-950">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 relative">
            <span className="text-orange-500">~/</span>about<span className="text-orange-500">_me</span>
          </h2>
          <div className="h-1 w-24 bg-orange-500 rounded-full mb-8"></div>
          <p className="text-center text-gray-300 max-w-2xl font-sans">
            Passionate software developer with a focus on creating elegant solutions to complex problems.
            I bring creativity and technical expertise to every project.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <TerminalWindow title="~/about/bio.md">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-orange-500 mb-2"># Professional Journey</h3>
              <p className="text-gray-300 mb-2">
                Started my coding journey 5 years ago, working on web applications and interactive user interfaces.
              </p>
              <p className="text-gray-300">
                Currently working as a Senior Developer at TechCorp, focusing on scalable frontend architecture.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-orange-500 mb-2"># Education</h3>
              <p className="text-gray-300">
                B.S. in Computer Science from Tech University (2018-2022)
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-orange-500 mb-2"># Personal Interests</h3>
              <p className="text-gray-300">
                When I'm not coding, you'll find me hiking in nature, reading sci-fi novels, or experimenting with new cooking recipes.
              </p>
            </div>
          </TerminalWindow>
          
          <div className="grid grid-cols-2 gap-5">
            {aboutCards.map((card, index) => (
              <div key={index} className="bg-blue-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800 hover:border-orange-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="bg-orange-500/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {iconMap[card.icon as keyof typeof iconMap]}
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-gray-300 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
