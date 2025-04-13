import { Folder, Mail } from 'lucide-react';
import TerminalWindow from './TerminalWindow';
import { developerInfo } from '@/lib/data';

const HeroSection = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950 to-blue-900 opacity-50"></div>
      
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxRTI5M0IiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMCAwaDYwdjYwSDB6TTMwIDMwaDMwdjMwSDMwek0wIDMwaDMwdjMwSDB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-5"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 animate-slide-up">
            <TerminalWindow title="~/portfolio" className="mb-8 w-full max-w-xl">
              <div className="mb-2">
                <span className="terminal-prompt">whoami</span>
              </div>
              <div className="cmd-output mb-4">
                <span className="text-2xl font-bold text-white">{developerInfo.name}</span><br/>
                <span className="text-gray-300">{developerInfo.title}</span>
              </div>
              
              <div className="mb-2">
                <span className="terminal-prompt">cat skills.txt</span>
              </div>
              <div className="cmd-output mb-4">
                <span className="inline-block bg-blue-800/50 text-blue-300 px-2 py-1 rounded mr-2 mb-2">JavaScript</span>
                <span className="inline-block bg-blue-800/50 text-blue-300 px-2 py-1 rounded mr-2 mb-2">TypeScript</span>
                <span className="inline-block bg-blue-800/50 text-blue-300 px-2 py-1 rounded mr-2 mb-2">React</span>
                <span className="inline-block bg-blue-800/50 text-blue-300 px-2 py-1 rounded mr-2 mb-2">SvelteKit</span>
                <span className="inline-block bg-blue-800/50 text-blue-300 px-2 py-1 rounded mr-2 mb-2">Node.js</span>
              </div>
              
              <div className="mb-2">
                <span className="terminal-prompt">ls projects/</span>
              </div>
              <div className="cmd-output mb-4">
                e-commerce-platform.svelte<br/>
                weather-app.ts<br/>
                portfolio-site.svelte<br/>
              </div>
              
              <div>
                <span className="terminal-prompt">contact<span className="terminal-cursor"></span></span>
              </div>
            </TerminalWindow>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <a 
                href="#projects" 
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center"
              >
                <Folder className="mr-2 h-5 w-5" />
                View Projects
              </a>
              <a 
                href="#contact" 
                className="border border-gray-600 hover:border-orange-500 text-white font-semibold py-3 px-6 rounded-md transition-all hover:bg-blue-900/30 flex items-center justify-center"
              >
                <Mail className="mr-2 h-5 w-5" />
                Get in Touch
              </a>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center animate-fade-in">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-400 opacity-70 blur-lg rounded-full"></div>
              <div className="relative rounded-full w-64 h-64 bg-blue-900 border-4 border-blue-900 overflow-hidden">
                {/* This would be replaced with an actual image in production */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Developer Portrait
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
