#!/bin/bash

# Netlify Build Script for DaWg Website
# This script ensures only frontend dependencies are installed

set -e  # Exit on any error

echo "🧹 Cleaning any cached dependencies..."
rm -rf node_modules package-lock.json yarn.lock pnpm-lock.yaml 2>/dev/null || true

echo "📦 Installing dependencies from package.json only..."
npm install --no-package-lock --legacy-peer-deps

echo "🔍 Verifying no jsr: packages were installed..."
if npm list | grep -i "@jsr"; then
    echo "❌ ERROR: Found @jsr packages in node_modules!"
    exit 1
fi

echo "✅ Dependencies installed successfully (npm packages only)"

echo "🏗️  Building the site..."
npm run build

echo "🎉 Build complete!"
