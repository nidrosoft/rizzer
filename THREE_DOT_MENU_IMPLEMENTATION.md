# Three-Dot Menu Implementation Guide

## ✅ Overview - COMPLETE

Already implemented with full action sheet, delete modal, and archive modal.

---

## 🎯 Implementation Pattern for Remaining Screens

### **What Was Added:**

1. **Three-dot menu button** in top right header
2. **Action sheet** with Archive and Delete options
3. **Delete confirmation modal** (icon in corner)
4. **Archive confirmation modal** (icon in corner)
5. **Haptic feedback** on all interactions

---

## 📋 Code Changes for Each Screen

### **1. Imports**
```typescript
import { More } from 'iconsax-react-native';
import CategoryActionSheet from '@/components/date-profile/CategoryActionSheet';
```

### **2. State**
```typescript
const [showActionSheet, setShowActionSheet] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [showArchiveModal, setShowArchiveModal] = useState(false);
```

### **3. Handlers**
```typescript
const handleMenu = () => {
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  setShowActionSheet(true);
};

const handleDelete = () => {
  setShowActionSheet(false);
  setTimeout(() => setShowDeleteModal(true), 300);
};

const handleArchive = () => {
  setShowActionSheet(false);
  setTimeout(() => setShowArchiveModal(true), 300);
};

const confirmDelete = () => {
  if (Platform.OS === 'ios') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
  setShowDeleteModal(false);
  // TODO: Delete from database
  setTimeout(() => router.back(), 500);
};

const confirmArchive = () => {
  if (Platform.OS === 'ios') {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
  setShowArchiveModal(false);
  // TODO: Archive in database
  setTimeout(() => router.back(), 500);
};
```

### **4. Header Button (Replace empty View)**
```typescript
// Before
<View style={styles.navButton} />

// After
<TouchableOpacity style={styles.navButton} onPress={handleMenu} activeOpacity={0.6}>
  <More size={24} color={Colors.text} variant="Outline" />
</TouchableOpacity>
```

### **5. Component (Before closing SafeAreaView)**
```typescript
{/* Category Action Sheet */}
<CategoryActionSheet
  visible={showActionSheet}
  onClose={() => setShowActionSheet(false)}
  onArchive={handleArchive}
  onDelete={handleDelete}
  title="Manage [Category Name]"
  deleteModalVisible={showDeleteModal}
  archiveModalVisible={showArchiveModal}
  onDeleteConfirm={confirmDelete}
  onArchiveConfirm={confirmArchive}
  onDeleteCancel={() => setShowDeleteModal(false)}
  onArchiveCancel={() => setShowArchiveModal(false)}
  deleteMessage="This action cannot be undone. All [category] data will be permanently removed."
  archiveMessage="[Category] will be moved to archives. You can restore it anytime."
/>
```

---

## 🎨 Reusable Component

**Created**: `/components/date-profile/CategoryActionSheet.tsx`

**Features**:
- Action sheet with Archive and Delete options
- Delete confirmation modal
- Archive confirmation modal
- Consistent styling with Date Profile main screen
- Haptic feedback
- Customizable titles and messages

**Props**:
- `visible`: boolean - Show/hide action sheet
- `onClose`: () => void - Close action sheet
- `onArchive`: () => void - Archive button handler
- `onDelete`: () => void - Delete button handler
- `title`: string - Action sheet title
- `deleteModalVisible`: boolean - Show/hide delete modal
- `archiveModalVisible`: boolean - Show/hide archive modal
- `onDeleteConfirm`: () => void - Confirm delete
- `onArchiveConfirm`: () => void - Confirm archive
- `onDeleteCancel`: () => void - Cancel delete
- `onArchiveCancel`: () => void - Cancel archive
- `deleteMessage`: string - Delete confirmation message
- `archiveMessage`: string - Archive confirmation message

---

## 📱 Screens to Update

- [x] Overview ✅
- [ ] Interests
- [ ] Dates & Events
- [ ] Memories
- [ ] Conversations
- [ ] Gifts & Ideas
- [ ] Favorites
- [ ] Quick Notes

---

## 🎯 Result

Each category screen will have:
1. **Three-dot menu** (top right)
2. **Bottom sheet** with 2 options
3. **Confirmation modals** for both actions
4. **Consistent design** across all screens
5. **Haptic feedback** for better UX

**User Flow**:
1. Tap three-dot menu → Action sheet slides up
2. Tap Archive → Archive confirmation modal
3. Confirm → Success haptic → Navigate back
4. OR Tap Delete → Delete confirmation modal
5. Confirm → Success haptic → Navigate back
