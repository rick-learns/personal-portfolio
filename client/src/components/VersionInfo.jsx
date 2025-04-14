import React from 'react';
import { version } from '../version';

const VersionInfo = ({ showDetailed = false }) => {
  const isDev = version.environment === 'development';
  
  // Simple version display (can be shown in footer)
  if (!showDetailed) {
    return (
      <span className="text-xs text-gray-500">
        v{version.number}
      </span>
    );
  }
  
  // Detailed version information (for admin or about page)
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-sm">
      <h3 className="font-bold mb-2">Version Information</h3>
      <div className="space-y-1">
        <p><span className="font-semibold">Version:</span> {version.number}</p>
        <p><span className="font-semibold">Build Date:</span> {version.buildDate}</p>
        <p><span className="font-semibold">Commit:</span> {version.commitHash}</p>
        <p><span className="font-semibold">Environment:</span> {version.environment}</p>
        {isDev && <p className="text-yellow-600 dark:text-yellow-400">⚠️ Development Mode</p>}
      </div>
    </div>
  );
};

export default VersionInfo;
