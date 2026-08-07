// Builds the OpenNext bundle during dependency install on Cloudflare.
//
// Workers Builds runs no build phase for this project: it installs dependencies
// and then goes straight to `wrangler deploy`. That command detects an OpenNext
// project and re-execs `opennextjs-cloudflare deploy`, which expects
// `.open-next/.build/open-next.config.edge.mjs` to already exist and exits
// before wrangler's own build step would run. Install is therefore the only
// phase left to build in.
//
// Skipped outside CI so a local `npm install` doesn't trigger a full production
// build. `opennextjs-cloudflare build` runs `npm run build` (`next build`), so
// this must never be reachable from the `build` script itself.
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const isCI = process.env.WORKERS_CI || process.env.CI;

if (!isCI) {
  console.log("[cf-build] not CI, skipping OpenNext build");
  process.exit(0);
}

// Resolved explicitly rather than relying on `node_modules/.bin` being on PATH,
// which only holds while npm is running the lifecycle script.
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const bin = path.join(repoRoot, "node_modules", ".bin", "opennextjs-cloudflare");

console.log("[cf-build] CI detected, building OpenNext bundle");
execFileSync(bin, ["build"], { stdio: "inherit", cwd: repoRoot });
