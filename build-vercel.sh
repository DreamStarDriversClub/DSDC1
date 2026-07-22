#!/usr/bin/env bash
# Produce a Vercel Build Output API bundle (.vercel/output) for this Next.js site.
# Builds Next.js without standalone output, then wraps it in Build Output API v3
# format with a minimal server.js wrapper.
set -euo pipefail
cd "$(dirname "$0")"
umask 002

echo "[1/4] Installing dependencies"
bun install

echo "[2/4] Building Next.js"
bun run build

echo "[3/4] Assembling .vercel/output (Build Output API v3)"
rm -rf .vercel/output
mkdir -p .vercel/output/functions/render.func

# Copy the build output and required project files
cp -r .next .vercel/output/functions/render.func/
cp package.json .vercel/output/functions/render.func/
cp next.config.js .vercel/output/functions/render.func/

# Create a minimal Next.js server entry point
cat > .vercel/output/functions/render.func/server.js <<'SERVEREOF'
const next = require('next');
const app = next({ dev: false, dir: __dirname, hostname: '0.0.0.0', port: process.env.PORT || 3000 });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  require('http').createServer((req, res) => handle(req, res)).listen(process.env.PORT || 3000);
});
SERVEREOF

echo "[4/4] Installing production dependencies for render function"
(
  cd .vercel/output/functions/render.func
  bun install --production
)

# Vercel function config
cat > .vercel/output/functions/render.func/.vc-config.json <<'JSON'
{ "runtime": "nodejs22.x", "handler": "server.js", "launcherType": "Nodejs", "supportsResponseStreaming": true }
JSON

# Static assets
mkdir -p .vercel/output/static/_next
cp -r .next/static .vercel/output/static/_next/static
if [ -d "public" ] && [ "$(ls -A public 2>/dev/null)" ]; then
  cp -r public/* .vercel/output/static/ 2>/dev/null || true
fi

# Routing config
cat > .vercel/output/config.json <<'JSON'
{ "version": 3, "routes": [ { "handle": "filesystem" }, { "src": "/(.*)", "dest": "/render" } ] }
JSON

echo "done -> .vercel/output ready for: bunx vercel deploy --prebuilt"
