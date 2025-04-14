import React from 'react';
import VersionInfo from '@/components/VersionInfo';

const AdminVersionPage = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">System Information</h1>
      
      <div className="max-w-lg">
        <VersionInfo showDetailed={true} />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Deployment History</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View the deployment logs in <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">/var/www/rick-learns.dev/</code> 
            to see the complete deployment history.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminVersionPage;