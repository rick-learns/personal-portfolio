import { developerInfo } from '@/lib/data';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <span className="font-mono font-semibold text-orange-500 text-xl">qa@</span>
              <span className="font-mono font-semibold text-white">rickcohen</span>
              <span className="font-mono text-orange-500 animate-[text-blink_1s_steps(5,start)_infinite]">_</span>
            </div>
            <p className="text-slate-400 mt-2 text-sm">{developerInfo.title}</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-slate-400 text-sm">© {currentYear} {developerInfo.name}. All rights reserved.</p>
            <p className="text-slate-500 text-xs mt-1">Built with React, TypeScript & Tailwind CSS</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
