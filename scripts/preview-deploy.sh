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
set -euo pipefail

PROD_DB_NAME="decipher-ms-db"
PROD_DB_ID="7fa5214b-5743-43cb-86e1-b679428f1d17"
PREVIEW_DB_NAME="decipher-ms-preview"
PREVIEW_DB_ID="e13ad566-bc05-49f8-890e-1d5820189be7"
PREVIEW_CONFIG="wrangler.preview.jsonc"

# Derive a config that points the DB binding at the preview database. Written
# to the repo root so wrangler resolves main / assets.directory / migrations_dir
# relative to it (a /tmp config would break those relative paths). wrangler.jsonc
# stays the single source of truth — only the D1 name + id are swapped.
sed -e "s/$PROD_DB_ID/$PREVIEW_DB_ID/g" \
    -e "s/\"$PROD_DB_NAME\"/\"$PREVIEW_DB_NAME\"/g" \
    "wrangler.jsonc" > "$PREVIEW_CONFIG"

# Migrate the preview database to the current schema, then upload the version.
npx wrangler d1 migrations apply "$PREVIEW_DB_NAME" --remote --config "$PREVIEW_CONFIG"
npx wrangler versions upload --config "$PREVIEW_CONFIG"
