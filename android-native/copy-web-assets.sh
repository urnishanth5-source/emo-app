#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
npm run build
rm -rf android-native/app/src/main/assets/www
mkdir -p android-native/app/src/main/assets/www
cp -R dist/. android-native/app/src/main/assets/www/
echo "Copied dist into Android assets."
