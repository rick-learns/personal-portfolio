import { useState, useEffect } from 'react';
import { Menu, Github, Linkedin } from 'lucide-react';
import { developerInfo } from '@/lib/data';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.pageYOffset;
      
      sections.forEach(section => {
        const sectionHeight = section.clientHeight;
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionId = section.getAttribute('id') || '';
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' }
  ];

  const githubUrl = developerInfo.socials.find(social => social.name === "GitHub")?.url || "#";
  const linkedinUrl = developerInfo.socials.find(social => social.name === "LinkedIn")?.url || "#";

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md z-50 px-4 py-3 border-b border-slate-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <span className="font-mono font-semibold text-white text-xl">rickcohen</span>
          <span className="font-mono font-semibold text-orange-500">@dev</span>
          <span className="font-mono text-orange-500 animate-[text-blink_1s_steps(5,start)_infinite]">_</span>
        </div>
        
        {/* Desktop Navigation with Social Icons */}
        <div className="hidden md:flex items-center">
          <nav className="mr-6">
            <ul className="flex space-x-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a 
                    href={item.href} 
                    className={`nav-item font-sans text-white hover:text-orange-500 transition-colors ${activeSection === item.href.substring(1) ? 'active' : ''}`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4">
            <a 
              href={githubUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-orange-500 transition-colors"
              aria-label="GitHub Profile"
            >
              <Github size={20} />
            </a>
            <a 
              href={linkedinUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-orange-500 transition-colors"
              aria-label="LinkedIn Profile"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <Menu size={24} />
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900 border-b border-slate-800 animate-fade-in">
          <ul className="container mx-auto py-4 px-4 space-y-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href} 
                  className="block font-sans text-white hover:text-orange-500 py-2 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
            
            {/* Social icons in mobile menu */}
            <li className="flex items-center space-x-4 py-2">
              <a 
                href={githubUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-orange-500 transition-colors"
                aria-label="GitHub Profile"
              >
                <Github size={20} />
                <span className="ml-2">GitHub</span>
              </a>
              <a 
                href={linkedinUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-orange-500 transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin size={20} />
                <span className="ml-2">LinkedIn</span>
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;