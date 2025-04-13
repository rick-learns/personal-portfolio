import React from 'react';

interface TerminalWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-header">
        <div className="terminal-circle bg-red-500"></div>
        <div className="terminal-circle bg-yellow-500"></div>
        <div className="terminal-circle bg-green-500"></div>
        <div className="ml-auto font-mono text-xs text-gray-400">{title}</div>
      </div>
      <div className="p-4 font-mono text-sm">
        {children}
      </div>
    </div>
  );
};

export default TerminalWindow;
