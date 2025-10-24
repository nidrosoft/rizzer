#!/bin/bash

# Bulk fix LinearGradient imports across the entire app
# This script replaces expo-linear-gradient with our safe wrapper

echo "🔧 Fixing LinearGradient imports across the app..."

# Find all .tsx files in app/ and components/ directories
find app components -name "*.tsx" -type f | while read file; do
  # Check if file contains LinearGradient import from expo
  if grep -q "from 'expo-linear-gradient'" "$file"; then
    echo "📝 Fixing: $file"
    
    # Replace the import
    sed -i '' "s/import { LinearGradient } from 'expo-linear-gradient';/import { SafeLinearGradient as LinearGradient } from '@\/components\/ui\/SafeLinearGradient';/g" "$file"
    
    # Also handle imports with other items
    sed -i '' "s/import { LinearGradient, /import { SafeLinearGradient as LinearGradient, /g" "$file"
  fi
done

echo "✅ Done! All LinearGradient imports have been replaced with SafeLinearGradient"
echo "🎨 The app will now use solid colors instead of gradients (temporary fix)"
echo "🔄 Restart your Expo server to see changes"
