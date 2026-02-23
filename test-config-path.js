import { resolveStateDir, resolveConfigPath } from './dist/config/paths.js';

console.log('Testing configuration path resolution...');

// Test default state directory
const defaultStateDir = resolveStateDir();
console.log('Default state directory:', defaultStateDir);

// Test default config path
const defaultConfigPath = resolveConfigPath();
console.log('Default config path:', defaultConfigPath);

console.log('✅ Configuration path resolution test completed');