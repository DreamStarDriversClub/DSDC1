#!/usr/bin/env bash
# Produce a Vercel Build Output API bundle (.vercel/output) for this Next.js site.
# Next.js natively supports Vercel, so we just build and wrap it for the
# Build Output API v3 format that go-live.sh expects.
set -euo pipefail
cd "$(dirname "$0")"
umask 002

echo "[1/3] Installing dependencies"
bun install

echo "[2/3] Building Next.js (standalone output)"
bun run build

echo "[3/3] Assembling .vercel/output (Build Output API v3)"

# Clean previous output
rm -rf .vercel/output

# Next.js standalone output: the server entry is .next/standalone/server.js
# and static assets are in .next/static/
mkdir -p .vercel/output/functions/render.func

# Copy the standalone server and its node_modules into the render function
cp -r .next/standalone/. .vercel/output/functions/render.func/

# Copy static assets to the static directory
mkdir -p .vercel/output/static/_next
cp -r .next/static .vercel/output/static/_next/static
# Copy public assets if they exist
if [ -d "public" ] && [ "$(ls -A public 2>/dev/null)" ]; then
  cp -r public/* .vercel/output/static/ 2>/dev/null || true
fi

# Vercel function config
cat > .vercel/output/functions/render.func/.vc-config.json <<'JSON'
{ "runtime": "nodejs22.x", "handler": "server.js", "launcherType": "Nodejs", "supportsResponseStreaming": true }
JSON

# Vercel routing config
cat > .vercel/output/config.json <<'JSON'
{ "version": 3, "routes": [ { "handle": "filesystem" }, { "src": "/(.*)", "dest": "/render" } ] }
JSON

echo "done -> .vercel/output ready for: bunx vercel deploy --prebuilt"
