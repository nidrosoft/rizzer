# Global Toast Notification System

## Overview
The app now has a universal toast notification system that can be triggered from **any component** across the entire app. Toasts always appear at the top of the screen with consistent positioning and behavior.

## Setup
The `ToastProvider` is already wrapped around the entire app in `/app/_layout.tsx`, so no additional setup is needed.

## Usage

### 1. Import the hook
```typescript
import { useToast } from '@/contexts/ToastContext';
```

### 2. Use in your component
```typescript
export default function YourComponent() {
  const { showToast } = useToast();

  const handleAction = () => {
    // Show success toast (default)
    showToast('Action completed successfully!');
    
    // Or specify type and duration
    showToast('Item deleted', 'error', 2000);
  };

  return (
    // Your component JSX
  );
}
```

## API

### `showToast(message, type?, duration?)`

**Parameters:**
- `message` (string, required): The message to display
- `type` (string, optional): Toast type - `'success'` | `'info'` | `'error'`
  - Default: `'success'`
- `duration` (number, optional): How long to show the toast in milliseconds
  - Default: `3000` (3 seconds)

**Examples:**

```typescript
// Success toast (green checkmark)
showToast('Profile saved successfully!');
showToast('Event added to calendar', 'success');

// Info toast (blue info icon)
showToast('Swipe to see more options', 'info');

// Error toast (red X icon)
showToast('Failed to delete item', 'error');

// Custom duration (5 seconds)
showToast('This message stays longer', 'success', 5000);
```

## Toast Behavior

✅ **Always appears at the top** of the screen (60px from top)
✅ **Slides down** with smooth spring animation
✅ **Auto-dismisses** after specified duration
✅ **High z-index** (99999) - appears above all content
✅ **Consistent positioning** across all screens
✅ **Works in any component** - no need to manage state

## Visual Styles

### Success Toast
- Green checkmark icon
- Dark background
- White text
- Use for: Confirmations, successful actions

### Info Toast
- Blue info icon
- Dark background
- White text
- Use for: Tips, helpful information

### Error Toast
- Red X icon
- Dark background
- White text
- Use for: Errors, failed actions, warnings

## Example Use Cases

### 1. Adding to Calendar
```typescript
const handleAddEvent = (event) => {
  // Add event logic...
  showToast(`Added "${event.title}" to your calendar`, 'success');
};
```

### 2. Deleting Item
```typescript
const handleDelete = (item) => {
  // Delete logic...
  showToast('Item deleted', 'success');
};
```

### 3. Error Handling
```typescript
const handleSave = async () => {
  try {
    await saveData();
    showToast('Saved successfully!', 'success');
  } catch (error) {
    showToast('Failed to save', 'error');
  }
};
```

### 4. Info Message
```typescript
const handleFirstVisit = () => {
  showToast('Swipe left to see more options', 'info', 4000);
};
```

## Migration from Old Toast

**Before (local state):**
```typescript
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState('');

const handleAction = () => {
  setToastMessage('Success!');
  setShowToast(true);
};

return (
  <>
    {/* Your component */}
    <Toast 
      visible={showToast} 
      message={toastMessage}
      onHide={() => setShowToast(false)}
    />
  </>
);
```

**After (global hook):**
```typescript
const { showToast } = useToast();

const handleAction = () => {
  showToast('Success!');
};

return (
  // Your component (no Toast component needed!)
);
```

## Benefits

✅ **No state management** - Just call `showToast()`
✅ **No Toast component** - Already rendered at root level
✅ **Consistent positioning** - Always at the top
✅ **Less code** - Simpler, cleaner components
✅ **Universal** - Works everywhere in the app

## Files Modified

1. **Created:**
   - `/contexts/ToastContext.tsx` - Global toast provider and hook

2. **Updated:**
   - `/app/_layout.tsx` - Wrapped app with ToastProvider
   - `/app/tabs/index.tsx` - Example usage with useToast hook

## Notes

- The toast is rendered at the **root level** of the app
- It appears **above all content** including modals and bottom sheets
- Only **one toast** can be shown at a time (new toast replaces current)
- Toast **auto-dismisses** after the specified duration
- No need to manually hide the toast - it handles itself
