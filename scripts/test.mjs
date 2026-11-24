// Runs `vitest run`, working around a Vitest 5 bug on Windows: when the working directory has a lowercase drive letter
// (VS Code's terminal opens this folder as "c:\…"), test files load a second copy of the runner and every suite fails with
// "Cannot read properties of undefined (reading 'config')". Starting Vitest from the same folder spelled "C:\…" avoids it.
// Elsewhere this is a plain `vitest run`. Extra arguments are passed through.
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const cwd = process.cwd().replace(/^[a-z]:/, (drive) => drive.toUpperCase());
const vitest = join(cwd, "node_modules", "vitest", "vitest.mjs");
const { status } = spawnSync(process.execPath, [vitest, "run", ...process.argv.slice(2)], { cwd, stdio: "inherit" });
process.exit(status ?? 1);
