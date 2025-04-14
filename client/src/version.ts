/**
 * Application version information
 * Automatically updated during build process
 */

export interface VersionInfo {
  number: string;
  buildDate: string;
  commitHash: string;
  environment: string;
}

export const version: VersionInfo = {
  number: '1.0.0',
  buildDate: 'Not set',
  commitHash: 'Not set',
  environment: process.env.NODE_ENV || 'development'
};

export default version;