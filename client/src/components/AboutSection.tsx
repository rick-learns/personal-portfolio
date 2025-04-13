import { ShieldCheck, Code2, Server, Headphones } from 'lucide-react';
import TerminalWindow from './TerminalWindow';
import { aboutCards } from '@/lib/data';

const AboutSection = () => {
  // Map for icon components
  const iconMap = {
    ShieldCheck: <ShieldCheck className="text-orange-500" />,
    Code2: <Code2 className="text-orange-500" />,
    Server: <Server className="text-orange-500" />,
    Headphones: <Headphones className="text-orange-500" />
  };

  return (
    <section id="about" className="py-24 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-12">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 relative">
            <span className="text-orange-500">~/</span>about<span className="text-orange-500">_me</span>
          </h2>
          <div className="h-1 w-24 bg-orange-500 rounded-full mb-8"></div>
          <p className="text-center text-slate-300 max-w-2xl font-sans">
            Quality Engineer with a passion for building diagnostic tools and improving software reliability.
            With a gaming background, I bring focus, adaptability, and teamwork to every challenge.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <TerminalWindow title="~/about/bio.md">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-orange-500 mb-2"># Professional Journey</h3>
              <p className="text-slate-300 mb-2">
                My passion for technology was sparked through gaming, with titles like Starcraft, Diablo II, and Counter-Strike opening the door to a world of systems and technical curiosity.
              </p>
              <p className="text-slate-300 mb-2">
                I even competed professionally in Counter-Strike, traveling internationally and gaining invaluable experience in focus, adaptability, and teamwork under pressure.
              </p>
              <p className="text-slate-300">
                Today, I work as a Quality Engineer at DNSFilter, where I ensure the reliability and performance of our MacOS Roaming Client through rigorous testing and tool development.
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-orange-500 mb-2"># Certifications</h3>
              <p className="text-slate-300">
                CompTIA Network+
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-orange-500 mb-2"># Personal Interests</h3>
              <p className="text-slate-300">
                Outside of work, I enjoy attending music concerts, playing golf, gaming, cooking, and tinkering with technology projects.
              </p>
            </div>
          </TerminalWindow>
          
          <div className="grid grid-cols-2 gap-5">
            {aboutCards.map((card, index) => (
              <div key={index} className="bg-slate-900/50 rounded-lg p-6 backdrop-blur-sm border border-slate-800 hover:border-orange-500/50 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10">
                <div className="bg-orange-500/20 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  {iconMap[card.icon as keyof typeof iconMap]}
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-slate-300 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
