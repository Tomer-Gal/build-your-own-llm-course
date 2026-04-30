#!/usr/bin/env bash
# Run the full test suite via Vitest
set -e
cd "$(dirname "$0")/.."
npx vitest run "$@"
