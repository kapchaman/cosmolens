// Backward-compatible entry point; Playwright manages browser selection and server startup.
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
const require = createRequire(import.meta.url);
const result = spawnSync(process.execPath, [require.resolve('@playwright/test/cli'), 'test'], { stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
