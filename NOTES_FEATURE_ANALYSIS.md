# 📝 Notes Feature - Complete Analysis

## 🎯 **Feature Overview:**

The Notes feature is a **folder-based organization system** for storing notes about a date profile partner. It has a beautiful 2-column grid layout with color-coded folders and instant save/delete functionality.

---

## 📊 **Current UI Structure:**

### **Level 1: Notes Main Screen** (`/app/date-profile/categories/notes.tsx`)

**Purpose:** Display all note folders in a 2-column grid

**Features:**
- ✅ Search bar for folders
- ✅ Total notes count display (e.g., "60 Quick Notes")
- ✅ 2-column grid of folders
- ✅ Each folder shows:
  - Colored icon (6 colors: blue, yellow, green, purple, pink, orange)
  - Folder name
  - Note count (e.g., "4 Notes")
  - Preview of 4 notes (bullet points)
- ✅ Floating + button to create new folder
- ✅ Create folder modal with:
  - Folder name input
  - Color selector (6 colors)
  - Create/Cancel buttons

**Default Folders:**
1. Important (pink) - 4 notes
2. Preferences (yellow) - 4 notes
3. Interests (blue) - 4 notes
4. Reminders (green) - 4 notes
5. Ideas (orange) - 4 notes
6. Personal (purple) - 4 notes

---

### **Level 2: Folder Detail Screen** (`/app/date-profile/categories/notes/folder.tsx`)

**Purpose:** Display all notes within a specific folder

**Features:**
- ✅ Search bar for notes
- ✅ 2-column grid of note cards
- ✅ Each note card shows:
  - Category badge (colored)
  - Note title
  - Note content (3 lines max)
  - Date
  - Edit and Delete buttons
- ✅ Floating + button to add new note
- ✅ Add note modal with:
  - Title input
  - Content textarea (multiline)
  - Add/Cancel buttons

---

### **Level 3: QuickNotesCard Component** (`/components/date-profile/QuickNotesCard.tsx`)

**Purpose:** Display recent notes on date profile detail page

**Features:**
- ✅ Shows list of recent notes
- ✅ Each note has:
  - Style/type (default, important, love, idea, reminder)
  - Icon with colored background
  - Content text (3 lines max)
- ✅ Click + button → navigates to Notes screen
- ✅ Click note → opens edit modal
- ✅ Edit modal has:
  - Note style selector (5 styles)
  - Content textarea
  - Save/Cancel buttons

**Note Styles:**
1. **Default** - Purple note icon
2. **Important** - Red danger icon
3. **Love** - Pink heart icon
4. **Idea** - Orange star icon
5. **Reminder** - Green tick circle icon

---

## 🗄️ **Database Schema Design:**

### **Table 1: `date_profile_note_folders`**

**Purpose:** Store note folders for each date profile

```sql
CREATE TABLE date_profile_note_folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL, -- 'blue', 'yellow', 'green', 'purple', 'pink', 'orange'
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_note_folders_profile ON date_profile_note_folders(profile_id);
CREATE INDEX idx_note_folders_order ON date_profile_note_folders(profile_id, order_index);
```

---

### **Table 2: `date_profile_notes`**

**Purpose:** Store individual notes within folders

```sql
CREATE TABLE date_profile_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  folder_id UUID REFERENCES date_profile_note_folders(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  style TEXT DEFAULT 'default', -- 'default', 'important', 'love', 'idea', 'reminder'
  category TEXT, -- For backward compatibility with existing notes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_notes_profile ON date_profile_notes(profile_id);
CREATE INDEX idx_notes_folder ON date_profile_notes(folder_id);
CREATE INDEX idx_notes_created ON date_profile_notes(profile_id, created_at DESC);
```

---

## 🔐 **Row Level Security (RLS):**

### **For `date_profile_note_folders`:**

```sql
-- Enable RLS
ALTER TABLE date_profile_note_folders ENABLE ROW LEVEL SECURITY;

-- INSERT
CREATE POLICY "Users can insert own profile note folders" ON date_profile_note_folders
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_note_folders.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile note folders" ON date_profile_note_folders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_note_folders.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile note folders" ON date_profile_note_folders
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_note_folders.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile note folders" ON date_profile_note_folders
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_note_folders.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );
```

### **For `date_profile_notes`:**

```sql
-- Enable RLS
ALTER TABLE date_profile_notes ENABLE ROW LEVEL SECURITY;

-- INSERT
CREATE POLICY "Users can insert own profile notes" ON date_profile_notes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_notes.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own profile notes" ON date_profile_notes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_notes.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- UPDATE
CREATE POLICY "Users can update own profile notes" ON date_profile_notes
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_notes.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own profile notes" ON date_profile_notes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profiles
      WHERE date_profiles.id = date_profile_notes.profile_id
      AND date_profiles.user_id = auth.uid()
    )
  );
```

---

## 📈 **Data Flow:**

### **Creating a Folder:**

```
User clicks [+] on Notes screen
       ↓
Modal opens
       ↓
User enters folder name
       ↓
User selects color
       ↓
User clicks "Create Folder"
       ↓
INSERT INTO date_profile_note_folders
       ↓
Folder appears in grid
       ↓
Modal closes
```

### **Creating a Note:**

```
User clicks [+] in folder
       ↓
Modal opens
       ↓
User enters title
       ↓
User enters content
       ↓
User clicks "Add Note"
       ↓
INSERT INTO date_profile_notes
       ↓
Note appears in grid
       ↓
Folder note count updates
       ↓
Modal closes
```

### **Deleting a Note:**

```
User clicks trash icon
       ↓
DELETE FROM date_profile_notes WHERE id = ?
       ↓
Note disappears from grid
       ↓
Folder note count updates
```

### **Deleting a Folder:**

```
User clicks menu → Delete
       ↓
Confirmation modal
       ↓
User confirms
       ↓
DELETE FROM date_profile_note_folders WHERE id = ?
       ↓
CASCADE deletes all notes in folder
       ↓
Folder disappears from grid
       ↓
Total count updates
```

---

## 🎨 **UI Components:**

### **Folder Card:**
```
┌─────────────────────┐
│      📁 (colored)   │
│                     │
│     Important       │
│      4 Notes        │
│                     │
│  • Note preview 1   │
│  • Note preview 2   │
│  • Note preview 3   │
│  • Note preview 4   │
└─────────────────────┘
```

### **Note Card:**
```
┌─────────────────────┐
│ [Important]         │
│                     │
│ Allergic to         │
│ shellfish           │
│                     │
│ Always check menu   │
│ before ordering     │
│                     │
│ Oct 20, 2024        │
│ ─────────────────── │
│  [Edit]  [Delete]   │
└─────────────────────┘
```

---

## 🔢 **Counts & Aggregations:**

### **Total Notes Count:**
```sql
SELECT COUNT(*) FROM date_profile_notes
WHERE profile_id = ?
```

### **Folder Note Count:**
```sql
SELECT COUNT(*) FROM date_profile_notes
WHERE folder_id = ?
```

### **Folders with Note Counts:**
```sql
SELECT 
  f.*,
  COUNT(n.id) as note_count
FROM date_profile_note_folders f
LEFT JOIN date_profile_notes n ON f.id = n.folder_id
WHERE f.profile_id = ?
GROUP BY f.id
ORDER BY f.order_index, f.created_at
```

---

## ✅ **Implementation Checklist:**

### **Database:**
- [ ] Create `date_profile_note_folders` table
- [ ] Create `date_profile_notes` table
- [ ] Add indexes for performance
- [ ] Enable RLS on both tables
- [ ] Create RLS policies (INSERT, SELECT, UPDATE, DELETE)
- [ ] Add updated_at triggers

### **Functions:**
- [ ] `createNoteFolder(profileId, name, color)`
- [ ] `updateNoteFolder(folderId, name, color)`
- [ ] `deleteNoteFolder(folderId)`
- [ ] `fetchNoteFolders(profileId)`
- [ ] `createNote(profileId, folderId, title, content, style)`
- [ ] `updateNote(noteId, title, content, style)`
- [ ] `deleteNote(noteId)`
- [ ] `fetchNotesByFolder(folderId)`
- [ ] `fetchRecentNotes(profileId, limit)`

### **UI Integration:**
- [ ] Connect Notes screen to database
- [ ] Connect Folder detail screen to database
- [ ] Connect QuickNotesCard to database
- [ ] Implement real-time note counts
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add success toasts

---

## 🎯 **Key Features:**

1. **Instant Save** - Notes save immediately when user clicks "Add Note"
2. **Instant Delete** - Notes delete immediately when user confirms
3. **Real-time Counts** - Folder counts update automatically
4. **Folder Organization** - Notes grouped by colored folders
5. **Search** - Search folders and notes
6. **Styles** - 5 different note styles with icons
7. **Preview** - Folder cards show 4 note previews
8. **2-Column Grid** - Beautiful responsive layout

---

## 📝 **Example Data:**

### **Folders:**
```json
[
  {
    "id": "uuid-1",
    "profile_id": "profile-123",
    "name": "Important",
    "color": "pink",
    "order_index": 0,
    "note_count": 4
  },
  {
    "id": "uuid-2",
    "profile_id": "profile-123",
    "name": "Preferences",
    "color": "yellow",
    "order_index": 1,
    "note_count": 4
  }
]
```

### **Notes:**
```json
[
  {
    "id": "uuid-1",
    "profile_id": "profile-123",
    "folder_id": "uuid-1",
    "title": "Allergic to shellfish",
    "content": "Always check ingredients before ordering",
    "style": "important",
    "created_at": "2024-10-20T10:00:00Z"
  },
  {
    "id": "uuid-2",
    "profile_id": "profile-123",
    "folder_id": "uuid-2",
    "title": "Coffee Order",
    "content": "Oat milk latte, extra shot, no sugar",
    "style": "default",
    "created_at": "2024-10-15T10:00:00Z"
  }
]
```

---

## ✅ **Summary:**

**Structure:**
- 2-level hierarchy: Folders → Notes
- Folders have colors and names
- Notes have titles, content, and styles
- Beautiful 2-column grid layout

**Database:**
- 2 tables: `date_profile_note_folders` and `date_profile_notes`
- Full RLS security
- Cascade delete (delete folder → delete all notes)
- Indexes for performance

**Features:**
- Instant save/delete
- Real-time counts
- Search functionality
- 6 folder colors
- 5 note styles
- Preview in folder cards

**Ready for implementation!** 🎉
