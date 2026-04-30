#!/usr/bin/env bash
# Run Vitest in watch mode
set -e
cd "$(dirname "$0")/.."
npx vitest "$@"
