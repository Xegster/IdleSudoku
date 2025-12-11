#!/usr/bin/env node

// Simple wrapper that uses npx with environment variable
// The environment variable may not work, but this ensures it's set
process.env.EXPO_DOCTOR_SKIP_DEPENDENCY_VERSION_CHECK = '1';

const { spawn } = require('child_process');

console.log('Starting Expo web (dependency validation skipped)...');

const child = spawn('npx', ['expo', 'start', '--web'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    EXPO_DOCTOR_SKIP_DEPENDENCY_VERSION_CHECK: '1',
    // Also try other possible env vars
    EXPO_NO_DOCTOR: '1',
  }
});

child.on('error', (error) => {
  console.error('Error:', error.message);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
