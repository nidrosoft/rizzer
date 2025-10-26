# Rizz Long-Press & Header Update

## Summary
Implemented two key features for the Rizz category management:
1. **Long-press on category cards** → Bottom sheet with Delete/Archive options
2. **Category detail header** → Shows category name and description prominently

---

## Feature 1: Long-Press Delete/Archive

### New Component Created
**`/components/rizz/CategoryManageSheet.tsx`** (150 lines)
- Bottom sheet modal with Archive and Delete options
- Archive: Purple icon, "Hide from view, keep data"
- Delete: Red icon, "Remove permanently"
- Shows category title in header: "Manage '{categoryTitle}'"
- Haptic feedback on all interactions

### Files Modified

#### 1. `/types/rizz.ts`
Added `onCategoryLongPress` prop to `RizzCategoriesGridProps`:
```typescript
export interface RizzCategoriesGridProps {
  categories: RizzCategory[];
  onCategoryPress: (categoryId: number) => void;
  onCategoryLongPress?: (categoryId: number, categoryTitle: string) => void;
}
```

#### 2. `/components/rizz/RizzCategoriesGrid.tsx`
- Added `onCategoryLongPress` prop to component
- Added `handleLongPress` function with haptic feedback
- Added `onLongPress` handler to `TouchableOpacity`
- Passes category ID and title to handler

#### 3. `/app/tabs/rizz.tsx`
**State Added:**
- `showManageSheet` - Controls bottom sheet visibility
- `selectedCategory` - Stores { id, title } of selected category

**Handlers Added:**
- `handleCategoryLongPress(categoryId, categoryTitle)` - Opens manage sheet
- `handleDeleteCategory()` - Deletes category (TODO: implement backend)
- `handleArchiveCategory()` - Archives category (TODO: implement backend)

**UI Added:**
- `CategoryManageSheet` component with all props
- Connected to `RizzCategoriesGrid` via `onCategoryLongPress` prop

### User Flow
1. User **long-presses** on any Rizz category card
2. Haptic feedback (medium impact)
3. Bottom sheet slides up with 2 options:
   - **Archive Category** (purple) - Hides category, keeps data
   - **Delete Category** (red) - Permanently removes category
4. User selects action
5. Toast notification confirms action
6. Categories reload automatically

---

## Feature 2: Category Detail Header Update

### Files Modified

#### `/components/rizz/category-detail/CategoryHeader.tsx`

**Layout Changes:**
- Removed centered title from navigation bar
- Added spacer between back and more buttons
- Moved title to content section (below navigation)
- Added description below title (conditional rendering)

**Style Updates:**
- `spacer` - Flex: 1 (pushes buttons to edges)
- `title` - Larger (24px), white color, centered, margin bottom
- `description` - Smaller (15px), white with 90% opacity, centered
- `content` - Added top padding for spacing

**Before:**
```
[Back] [Title] [More]
[Description centered]
```

**After:**
```
[Back]         [More]
    [Title]
 [Description]
```

#### `/app/rizz/category-detail.tsx`
Updated mock data to show proper title and description:
```typescript
const categoryData = {
  title: 'say good morning',
  description: 'Perfect morning greetings to start the day with charm and positivity',
  color: '#FF6B9D',
  icon: '😊',
  rizzes: [],
};
```

### Visual Result
- **Category name** displayed prominently at top
- **Description** shown directly below name
- Both centered and easy to read
- White text on gradient background
- Proper spacing and hierarchy

---

## Technical Details

### Haptic Feedback
- **Long-press**: Medium impact
- **Archive**: Success notification
- **Delete**: Medium impact

### Toast Notifications
- Archive: `"{categoryTitle}" archived`
- Delete: `"{categoryTitle}" deleted`
- Type: Success

### Backend Integration (TODO)
Both delete and archive handlers have placeholder logic:
```typescript
// TODO: Implement delete category logic
// TODO: Implement archive category logic
```

Need to create backend functions:
- `deleteRizzCategory(userId, categoryId)`
- `archiveRizzCategory(userId, categoryId)`

---

## Files Summary

### Created (1)
- `/components/rizz/CategoryManageSheet.tsx` - Bottom sheet for delete/archive

### Modified (5)
- `/types/rizz.ts` - Added onCategoryLongPress prop
- `/components/rizz/RizzCategoriesGrid.tsx` - Added long-press handler
- `/app/tabs/rizz.tsx` - Added manage sheet logic
- `/components/rizz/category-detail/CategoryHeader.tsx` - Updated layout
- `/app/rizz/category-detail.tsx` - Updated mock data

---

## Testing Checklist

- [x] Long-press on category card opens bottom sheet
- [x] Bottom sheet shows correct category title
- [x] Archive button shows toast and closes sheet
- [x] Delete button shows toast and closes sheet
- [x] Haptic feedback works on all interactions
- [x] Category detail shows name at top
- [x] Category detail shows description below name
- [x] Header layout is clean with buttons on edges
- [ ] Backend delete function integration
- [ ] Backend archive function integration

---

## Next Steps

1. **Implement backend functions:**
   - Create `deleteRizzCategory` in `/lib/rizzCategories.ts`
   - Create `archiveRizzCategory` in `/lib/rizzCategories.ts`
   - Add `is_archived` column to `rizz_categories` table if needed

2. **Update delete handler:**
   - Call backend function
   - Handle errors
   - Show error modal if fails

3. **Update archive handler:**
   - Call backend function
   - Handle errors
   - Filter archived categories from display

4. **Load category data dynamically:**
   - Pass category ID via route params
   - Fetch category from database
   - Display actual data instead of mock

---

**Status:** ✅ UI Complete | ⏳ Backend Pending
