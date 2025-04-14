import { developerInfo } from '@/lib/data';
import VersionInfo from './VersionInfo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center">
              <span className="font-mono font-semibold text-white text-xl">rickcohen</span>
              <span className="font-mono font-semibold text-orange-500">@dev</span>
              <span className="font-mono text-orange-500 animate-[text-blink_1s_steps(5,start)_infinite]">_</span>
            </div>
            <p className="text-slate-400 mt-2 text-sm">{developerInfo.title}</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-slate-400 text-sm">© {currentYear} {developerInfo.name}. All rights reserved.</p>
            <div className="flex items-center justify-center md:justify-end mt-1 space-x-1.5">
              <p className="text-slate-500 text-xs">
                Built with React, TypeScript & Tailwind CSS
              </p>
              <span className="text-slate-700 text-xs">|</span>
              <VersionInfo className="text-slate-600 hover:text-slate-400 transition-colors duration-200" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;