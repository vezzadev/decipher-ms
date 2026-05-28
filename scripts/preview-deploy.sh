#!/usr/bin/env bash
#
# Non-production (preview) deploy for Cloudflare Workers Builds.
#
# Set the Worker's "Non-production branch deploy command" (dashboard ->
# Worker -> Settings -> Builds) to:
#
#     bash scripts/preview-deploy.sh
#
# Production keeps its own database (decipher-ms-db) exclusively. Every preview
# branch shares ONE separate database (decipher-ms-preview), so production
# schema and data are never touched by branch builds.
#
# Astro's Cloudflare adapter (SSR) builds to ./dist:
#   - ./dist/client          static assets
#   - ./dist/server          the worker + a generated wrangler.json (deploy config)
# The generated dist/server/wrangler.json inherits the D1 binding from the root
# wrangler.jsonc (i.e. the *production* database). For previews we swap that to
# the shared preview database before uploading.
set -euo pipefail

PROD_DB_NAME="decipher-ms-db"
PROD_DB_ID="7fa5214b-5743-43cb-86e1-b679428f1d17"
PREVIEW_DB_NAME="decipher-ms-preview"
PREVIEW_DB_ID="e13ad566-bc05-49f8-890e-1d5820189be7"
PREVIEW_CONFIG="wrangler.preview.jsonc"
DEPLOY_CONFIG="dist/server/wrangler.json"

# Build if Workers Builds hasn't already produced the adapter output.
if [ ! -f "$DEPLOY_CONFIG" ]; then
  npm run build
fi

# Migrate the preview database. d1 commands don't need `main`, so the root
# wrangler.jsonc (with only the D1 name + id swapped) works and resolves
# migrations_dir relative to the repo root, where migrations/ lives.
sed -e "s/$PROD_DB_ID/$PREVIEW_DB_ID/g" \
    -e "s/\"$PROD_DB_NAME\"/\"$PREVIEW_DB_NAME\"/g" \
    "wrangler.jsonc" > "$PREVIEW_CONFIG"
npx wrangler d1 migrations apply "$PREVIEW_DB_NAME" --remote --config "$PREVIEW_CONFIG"

# Point the generated deploy config at the preview database, then upload the
# version. wrangler resolves main (entry.mjs) and assets (../client) relative
# to dist/server/, so this config must stay in place.
sed -i \
    -e "s/$PROD_DB_ID/$PREVIEW_DB_ID/g" \
    -e "s/\"$PROD_DB_NAME\"/\"$PREVIEW_DB_NAME\"/g" \
    "$DEPLOY_CONFIG"
npx wrangler versions upload --config "$DEPLOY_CONFIG"
