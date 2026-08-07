// Builds the OpenNext bundle during dependency install on Cloudflare.
//
// Workers Builds runs no build phase for this project: it installs dependencies
// and then goes straight to `wrangler deploy`. That command detects an OpenNext
// project and re-execs `opennextjs-cloudflare deploy`, which expects `.open-next/`
// to already exist and exits before wrangler's own build step would run. Install
// is therefore the only phase left to build in.
//
// Guarded by WORKERS_CI so a local `npm install` doesn't trigger a full
// production build.
import { execSync } from "node:child_process";

if (process.env.WORKERS_CI) {
  execSync("opennextjs-cloudflare build", { stdio: "inherit" });
}
