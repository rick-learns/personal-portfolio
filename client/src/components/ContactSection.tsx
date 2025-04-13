import { useState } from 'react';
import { Mail, MapPin, Calendar, Github, Linkedin, Twitter, Dribbble, Send } from 'lucide-react';
import TerminalWindow from './TerminalWindow';
import { developerInfo } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    // In a real application, you would send the form data to a backend service here
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully!",
      variant: "default",
    });
    
    // Reset the form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const socialIcons = {
    GitHub: <Github className="text-orange-500" />,
    LinkedIn: <Linkedin className="text-orange-500" />,
    Twitter: <Twitter className="text-orange-500" />,
    Dribbble: <Dribbble className="text-orange-500" />,
  };

  return (
    <section id="contact" className="py-24 px-4 bg-blue-950">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            <span className="text-orange-500">~/</span>contact<span className="text-orange-500">_me</span>
          </h2>
          <div className="h-1 w-24 bg-orange-500 rounded-full mb-8"></div>
          <p className="text-center text-gray-300 max-w-2xl font-sans">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <TerminalWindow title="~/contact/info.sh">
            <div className="mb-6">
              <div className="mb-2">
                <span className="terminal-prompt">echo $CONTACT_INFO</span>
              </div>
              <div className="cmd-output mb-4">
                <div className="flex items-start gap-3 mb-4">
                  <Mail className="text-orange-500 h-5 w-5 mt-1" />
                  <div>
                    <div className="text-orange-500">Email</div>
                    <a href={`mailto:${developerInfo.email}`} className="text-white hover:text-orange-500 transition-colors">
                      {developerInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="text-orange-500 h-5 w-5 mt-1" />
                  <div>
                    <div className="text-orange-500">Location</div>
                    <span className="text-white">{developerInfo.location}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="text-orange-500 h-5 w-5 mt-1" />
                  <div>
                    <div className="text-orange-500">Availability</div>
                    <span className="text-white">{developerInfo.availability}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-2">
                <span className="terminal-prompt">ls social/</span>
              </div>
              <div className="flex flex-wrap gap-4 mt-2">
                {developerInfo.socials.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.url} 
                    className="flex items-center gap-2 bg-blue-900/30 border border-gray-800 hover:border-orange-500 px-4 py-2 rounded-full transition-all hover:bg-blue-900/50"
                  >
                    {socialIcons[social.name as keyof typeof socialIcons]}
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </TerminalWindow>
          
          <div>
            <form 
              className="bg-blue-900/50 rounded-lg p-6 border border-gray-800"
              onSubmit={handleSubmit}
            >
              <div className="mb-6">
                <label htmlFor="name" className="block font-mono text-sm mb-2">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-user text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-blue-900/40 border border-gray-700 rounded-md py-3 pl-10 pr-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500" 
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block font-mono text-sm mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-mail text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-blue-900/40 border border-gray-700 rounded-md py-3 pl-10 pr-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500" 
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block font-mono text-sm mb-2">Subject</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-briefcase text-gray-400"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  </div>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full bg-blue-900/40 border border-gray-700 rounded-md py-3 pl-10 pr-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500" 
                    placeholder="Project Discussion"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block font-mono text-sm mb-2">Message</label>
                <textarea 
                  id="message" 
                  rows={5} 
                  className="w-full bg-blue-900/40 border border-gray-700 rounded-md py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500" 
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center"
              >
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
