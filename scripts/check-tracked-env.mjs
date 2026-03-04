import { execSync } from 'node:child_process';

const allowedFiles = new Set(['.env.example']);

function getTrackedEnvFiles() {
  const output = execSync('git ls-files -z -- .env .env.*', {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return output
    .split('\0')
    .map((file) => file.trim())
    .filter(Boolean)
    .filter((file) => !allowedFiles.has(file));
}

try {
  const trackedEnvFiles = getTrackedEnvFiles();

  if (trackedEnvFiles.length > 0) {
    console.error('Tracked environment files are not allowed:');
    for (const file of trackedEnvFiles) {
      console.error(`- ${file}`);
    }
    process.exit(1);
  }

  console.log('Tracked environment file check passed.');
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Unable to verify tracked environment files: ${message}`);
  process.exit(1);
}
