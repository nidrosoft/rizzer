# 📸 Memories Feature - Complete Implementation Plan

## 🎯 **Overview**

Implementing a full-featured Memories timeline where users can:
- Add memories with photos, dates, types, and descriptions
- View memories in a beautiful timeline layout
- Edit and delete memories
- Attach multiple photos to each memory
- Categorize memories by type (First Date, Birthday, Trip, etc.)

---

## 📊 **Current State Analysis**

### **✅ What We Have:**

**1. UI Components (Complete)**
- `/app/date-profile/categories/memories.tsx` - Full UI implementation
- Timeline layout with dots and connecting lines
- Memory cards with photos, descriptions, and metadata
- Add memory modal with all fields
- Memory detail modal for viewing
- Stats bar showing total memories and likes
- Beautiful type badges with colors and emojis

**2. Mock Data Structure:**
```typescript
{
  id: '1',
  title: 'First Date at Central Park',
  date: 'January 15, 2024',
  type: 'First Date',
  description: 'Amazing afternoon walk and coffee...',
  photos: ['url1', 'url2'],
  likes: 12,
}
```

**3. Memory Types:**
- First Date (💕 - Pink)
- Birthday (🎂 - Purple)
- Trip (✈️ - Blue)
- Activity (🎨 - Green)
- Anniversary (💍 - Hot Pink)
- Special (⭐ - Orange)

**4. RLS Policies:**
- Already defined in `date_profiles_complete_setup.sql`
- Policies exist for INSERT, SELECT, UPDATE, DELETE
- Linked to user's date profiles

### **❌ What We Need:**

1. **Database Table** - `date_profile_memories` table doesn't exist yet
2. **Database Functions** - CRUD operations in `/lib/memories.ts`
3. **Photo Storage** - Upload/delete memory photos
4. **State Management** - Wire up real data instead of mock
5. **Form Handling** - Make add/edit modals functional

---

## 🗄️ **Database Schema**

### **Table: `date_profile_memories`**

```sql
CREATE TABLE IF NOT EXISTS date_profile_memories (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  profile_id UUID NOT NULL REFERENCES date_profiles(id) ON DELETE CASCADE,
  
  -- Memory Data
  title VARCHAR(255) NOT NULL,
  description TEXT,
  memory_date DATE NOT NULL,
  memory_type VARCHAR(50) NOT NULL,
  
  -- Metadata
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_memory_type CHECK (
    memory_type IN (
      'First Date',
      'Birthday',
      'Trip',
      'Activity',
      'Anniversary',
      'Special'
    )
  )
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memories_profile_id ON date_profile_memories(profile_id);
CREATE INDEX IF NOT EXISTS idx_memories_date ON date_profile_memories(memory_date DESC);
CREATE INDEX IF NOT EXISTS idx_memories_type ON date_profile_memories(memory_type);
CREATE INDEX IF NOT EXISTS idx_memories_created_at ON date_profile_memories(created_at DESC);
```

### **Table: `date_profile_memory_photos`**

```sql
CREATE TABLE IF NOT EXISTS date_profile_memory_photos (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Foreign Keys
  memory_id UUID NOT NULL REFERENCES date_profile_memories(id) ON DELETE CASCADE,
  
  -- Photo Data
  photo_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(memory_id, order_index)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memory_photos_memory_id ON date_profile_memory_photos(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_photos_order ON date_profile_memory_photos(memory_id, order_index);
```

### **RLS Policies:**

Already exist in `date_profiles_complete_setup.sql`:
- ✅ Users can insert own profile memories
- ✅ Users can view own profile memories
- ✅ Users can update own profile memories
- ✅ Users can delete own profile memories

**Need to add for photos:**
```sql
-- Enable RLS
ALTER TABLE date_profile_memory_photos ENABLE ROW LEVEL SECURITY;

-- INSERT
CREATE POLICY "Users can insert own memory photos" ON date_profile_memory_photos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM date_profile_memories m
      JOIN date_profiles dp ON dp.id = m.profile_id
      WHERE m.id = date_profile_memory_photos.memory_id
      AND dp.user_id = auth.uid()
    )
  );

-- SELECT
CREATE POLICY "Users can view own memory photos" ON date_profile_memory_photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM date_profile_memories m
      JOIN date_profiles dp ON dp.id = m.profile_id
      WHERE m.id = date_profile_memory_photos.memory_id
      AND dp.user_id = auth.uid()
    )
  );

-- DELETE
CREATE POLICY "Users can delete own memory photos" ON date_profile_memory_photos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM date_profile_memories m
      JOIN date_profiles dp ON dp.id = m.profile_id
      WHERE m.id = date_profile_memory_photos.memory_id
      AND dp.user_id = auth.uid()
    )
  );
```

---

## 📁 **File Structure**

### **New Files to Create:**

1. **`/supabase/migrations/create_date_profile_memories.sql`**
   - Create `date_profile_memories` table
   - Create `date_profile_memory_photos` table
   - Add RLS policies for photos
   - Add indexes

2. **`/lib/memories.ts`**
   - `getMemories(profileId)` - Fetch all memories with photos
   - `getMemoryById(memoryId)` - Fetch single memory
   - `createMemory(data)` - Create new memory
   - `updateMemory(memoryId, data)` - Update memory
   - `deleteMemory(memoryId)` - Delete memory
   - `addMemoryPhoto(memoryId, photoUrl, orderIndex)` - Add photo
   - `deleteMemoryPhoto(photoId)` - Delete photo

3. **`/types/memory.ts`**
   - TypeScript interfaces for Memory and MemoryPhoto

### **Files to Update:**

1. **`/app/date-profile/categories/memories.tsx`**
   - Replace mock data with real data
   - Wire up CRUD operations
   - Add photo upload functionality
   - Add form validation
   - Add loading states
   - Add error handling

2. **`/lib/storage.ts`**
   - Add `uploadMemoryPhoto()` function
   - Add `deleteMemoryPhoto()` function

---

## 🔄 **Implementation Steps**

### **Phase 1: Database Setup** ✅

**Step 1.1: Create Migration File**
- Create `create_date_profile_memories.sql`
- Define `date_profile_memories` table
- Define `date_profile_memory_photos` table
- Add RLS policies
- Add indexes

**Step 1.2: Run Migration**
- Apply migration to Supabase
- Verify tables created
- Verify RLS policies active

---

### **Phase 2: TypeScript Types** ✅

**Step 2.1: Create Type Definitions**
```typescript
// /types/memory.ts

export type MemoryType = 
  | 'First Date'
  | 'Birthday'
  | 'Trip'
  | 'Activity'
  | 'Anniversary'
  | 'Special';

export interface Memory {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  memory_date: string; // ISO date string
  memory_type: MemoryType;
  likes: number;
  created_at: string;
  updated_at: string;
  photos: MemoryPhoto[];
}

export interface MemoryPhoto {
  id: string;
  memory_id: string;
  photo_url: string;
  order_index: number;
  created_at: string;
}

export interface CreateMemoryInput {
  profile_id: string;
  title: string;
  description?: string;
  memory_date: string;
  memory_type: MemoryType;
  photo_uris?: string[]; // Local URIs to upload
}

export interface UpdateMemoryInput {
  title?: string;
  description?: string;
  memory_date?: string;
  memory_type?: MemoryType;
}
```

---

### **Phase 3: Database Functions** ✅

**Step 3.1: Create `/lib/memories.ts`**

```typescript
import { supabase } from './supabase';
import { uploadMemoryPhoto, deleteMemoryPhoto } from './storage';
import { Memory, CreateMemoryInput, UpdateMemoryInput } from '@/types/memory';

/**
 * Fetch all memories for a profile with photos
 */
export async function getMemories(profileId: string) {
  try {
    const { data: memories, error } = await supabase
      .from('date_profile_memories')
      .select(`
        *,
        photos:date_profile_memory_photos(*)
      `)
      .eq('profile_id', profileId)
      .order('memory_date', { ascending: false });

    if (error) throw error;

    return { success: true, memories: memories as Memory[] };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Create a new memory with photos
 */
export async function createMemory(input: CreateMemoryInput) {
  try {
    // 1. Create memory record
    const { data: memory, error: memoryError } = await supabase
      .from('date_profile_memories')
      .insert({
        profile_id: input.profile_id,
        title: input.title,
        description: input.description || null,
        memory_date: input.memory_date,
        memory_type: input.memory_type,
      })
      .select()
      .single();

    if (memoryError) throw memoryError;

    // 2. Upload photos if provided
    if (input.photo_uris && input.photo_uris.length > 0) {
      const photoUrls: string[] = [];

      for (let i = 0; i < input.photo_uris.length; i++) {
        const { success, url } = await uploadMemoryPhoto(
          input.photo_uris[i],
          memory.id
        );

        if (success && url) {
          photoUrls.push(url);
        }
      }

      // 3. Save photo URLs to database
      if (photoUrls.length > 0) {
        const photoRecords = photoUrls.map((url, index) => ({
          memory_id: memory.id,
          photo_url: url,
          order_index: index,
        }));

        const { error: photosError } = await supabase
          .from('date_profile_memory_photos')
          .insert(photoRecords);

        if (photosError) throw photosError;
      }
    }

    return { success: true, memory };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Update a memory
 */
export async function updateMemory(memoryId: string, input: UpdateMemoryInput) {
  try {
    const { data, error } = await supabase
      .from('date_profile_memories')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('id', memoryId)
      .select()
      .single();

    if (error) throw error;

    return { success: true, memory: data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete a memory (cascade deletes photos)
 */
export async function deleteMemory(memoryId: string) {
  try {
    // 1. Get all photos to delete from storage
    const { data: photos } = await supabase
      .from('date_profile_memory_photos')
      .select('photo_url')
      .eq('memory_id', memoryId);

    // 2. Delete memory (cascade deletes photo records)
    const { error } = await supabase
      .from('date_profile_memories')
      .delete()
      .eq('id', memoryId);

    if (error) throw error;

    // 3. Delete photos from storage
    if (photos && photos.length > 0) {
      for (const photo of photos) {
        await deleteMemoryPhoto(photo.photo_url);
      }
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

---

### **Phase 4: Storage Functions** ✅

**Step 4.1: Update `/lib/storage.ts`**

```typescript
/**
 * Upload memory photo
 */
export async function uploadMemoryPhoto(
  uri: string,
  memoryId: string
): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  try {
    // Compress image
    const compressed = await compressImageForGallery(uri);
    if (!compressed.success) {
      return { success: false, error: compressed.error };
    }

    // Read file as ArrayBuffer
    const response = await fetch(compressed.uri!);
    const blob = await response.blob();
    const arrayBuffer = await new Response(blob).arrayBuffer();

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `memories/${memoryId}/${timestamp}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filename, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filename);

    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Delete memory photo from storage
 */
export async function deleteMemoryPhoto(photoUrl: string) {
  try {
    // Extract filename from URL
    const filename = photoUrl.split('/').slice(-3).join('/');

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filename]);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
```

---

### **Phase 5: UI Integration** ✅

**Step 5.1: Update Memories Screen**

**Changes needed in `/app/date-profile/categories/memories.tsx`:**

1. **Import dependencies:**
```typescript
import { getMemories, createMemory, deleteMemory } from '@/lib/memories';
import { Memory } from '@/types/memory';
import { useToast } from '@/contexts/ToastContext';
import * as ImagePicker from 'expo-image-picker';
```

2. **Replace mock data with real data:**
```typescript
const [memories, setMemories] = useState<Memory[]>([]);
const [isLoading, setIsLoading] = useState(true);
const { showToast } = useToast();

useEffect(() => {
  loadMemories();
}, [id]);

const loadMemories = async () => {
  setIsLoading(true);
  const { success, memories: data, error } = await getMemories(id as string);
  
  if (success && data) {
    setMemories(data);
  } else {
    showToast(error || 'Failed to load memories', 'error');
  }
  
  setIsLoading(false);
};
```

3. **Add form state:**
```typescript
const [formData, setFormData] = useState({
  title: '',
  description: '',
  memory_date: new Date(),
  memory_type: 'First Date' as MemoryType,
  photo_uris: [] as string[],
});
```

4. **Implement photo picker:**
```typescript
const handleAddPhotos = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1.0,
    selectionLimit: 10,
  });

  if (!result.canceled && result.assets) {
    const uris = result.assets.map(asset => asset.uri);
    setFormData(prev => ({
      ...prev,
      photo_uris: [...prev.photo_uris, ...uris],
    }));
  }
};
```

5. **Implement save:**
```typescript
const handleSave = async () => {
  if (!formData.title.trim()) {
    showToast('Please enter a title', 'error');
    return;
  }

  setIsLoading(true);

  const { success, error } = await createMemory({
    profile_id: id as string,
    title: formData.title,
    description: formData.description,
    memory_date: formData.memory_date.toISOString().split('T')[0],
    memory_type: formData.memory_type,
    photo_uris: formData.photo_uris,
  });

  if (success) {
    showToast('Memory created!', 'success');
    setShowAddModal(false);
    loadMemories(); // Refresh list
    resetForm();
  } else {
    showToast(error || 'Failed to create memory', 'error');
  }

  setIsLoading(false);
};
```

6. **Implement delete:**
```typescript
const handleDeleteMemory = async (memoryId: string) => {
  const { success, error } = await deleteMemory(memoryId);

  if (success) {
    showToast('Memory deleted', 'success');
    loadMemories(); // Refresh list
  } else {
    showToast(error || 'Failed to delete memory', 'error');
  }
};
```

---

## 🎨 **UI Features to Implement**

### **1. Add Memory Modal:**
- ✅ Type selector (horizontal scroll)
- ✅ Title input (TextInput)
- ✅ Date picker (DateTimePicker)
- ✅ Description input (multiline TextInput)
- ✅ Photo picker (multiple selection)
- ✅ Photo preview grid
- ✅ Save button with loading state
- ✅ Cancel button

### **2. Memory Card:**
- ✅ Timeline dot with type color
- ✅ Timeline connecting line
- ✅ Title and date
- ✅ Type badge
- ✅ Description
- ✅ Photo grid (1-3 photos shown, +N overlay)
- ✅ Likes count
- ✅ Tap to view detail

### **3. Memory Detail Modal:**
- ✅ Full-screen overlay
- ✅ Close button
- ✅ Title, date, type badge
- ✅ Full description
- ✅ All photos (scrollable)
- ✅ Edit button (future)
- ✅ Delete button

### **4. Loading States:**
- ✅ Skeleton loading for timeline
- ✅ Spinner during save
- ✅ Disabled buttons during operations

### **5. Empty State:**
- ✅ "No memories yet" message
- ✅ Illustration
- ✅ "Add your first memory" CTA

---

## 📋 **Implementation Checklist**

### **Phase 1: Database** ✅
- [ ] Create migration file
- [ ] Define `date_profile_memories` table
- [ ] Define `date_profile_memory_photos` table
- [ ] Add RLS policies for photos
- [ ] Add indexes
- [ ] Run migration
- [ ] Verify in Supabase dashboard

### **Phase 2: Types** ✅
- [ ] Create `/types/memory.ts`
- [ ] Define `Memory` interface
- [ ] Define `MemoryPhoto` interface
- [ ] Define `CreateMemoryInput` interface
- [ ] Define `UpdateMemoryInput` interface
- [ ] Define `MemoryType` type

### **Phase 3: Database Functions** ✅
- [ ] Create `/lib/memories.ts`
- [ ] Implement `getMemories()`
- [ ] Implement `createMemory()`
- [ ] Implement `updateMemory()`
- [ ] Implement `deleteMemory()`
- [ ] Add error handling
- [ ] Add TypeScript types

### **Phase 4: Storage** ✅
- [ ] Update `/lib/storage.ts`
- [ ] Implement `uploadMemoryPhoto()`
- [ ] Implement `deleteMemoryPhoto()`
- [ ] Test photo upload
- [ ] Test photo deletion

### **Phase 5: UI Integration** ✅
- [ ] Update memories screen imports
- [ ] Add state management
- [ ] Implement `loadMemories()`
- [ ] Implement photo picker
- [ ] Implement form validation
- [ ] Implement `handleSave()`
- [ ] Implement `handleDelete()`
- [ ] Add loading states
- [ ] Add error handling
- [ ] Add toast notifications
- [ ] Test create flow
- [ ] Test delete flow
- [ ] Test photo upload

### **Phase 6: Testing** ✅
- [ ] Test create memory with photos
- [ ] Test create memory without photos
- [ ] Test view memory detail
- [ ] Test delete memory
- [ ] Test timeline display
- [ ] Test empty state
- [ ] Test loading states
- [ ] Test error states
- [ ] Test RLS policies
- [ ] Test photo storage

---

## 🚀 **Execution Plan**

### **Session 1: Database Setup (30 min)**
1. Create migration file
2. Run migration
3. Verify tables and policies

### **Session 2: Backend (45 min)**
1. Create type definitions
2. Implement database functions
3. Implement storage functions
4. Test with Postman/console

### **Session 3: UI Integration (60 min)**
1. Wire up data fetching
2. Implement add memory flow
3. Implement delete flow
4. Add loading/error states
5. Test end-to-end

### **Session 4: Polish (30 min)**
1. Add empty state
2. Add validation
3. Improve error messages
4. Test edge cases
5. Final QA

---

## 🎯 **Success Criteria**

✅ **Database:**
- Tables created successfully
- RLS policies working
- Indexes in place

✅ **Backend:**
- All CRUD operations working
- Photos upload/delete correctly
- Error handling robust

✅ **Frontend:**
- Can create memories with photos
- Timeline displays correctly
- Can view memory details
- Can delete memories
- Loading states smooth
- Error messages clear

✅ **UX:**
- No bugs or crashes
- Fast performance
- Beautiful UI (already done!)
- Intuitive flow

---

## 📝 **Notes**

**Design Decisions:**
1. **Separate photo table** - Allows multiple photos per memory, maintains order
2. **Cascade delete** - When memory deleted, photos auto-delete
3. **Date storage** - Store as DATE type, convert to/from strings in app
4. **Photo compression** - Use gallery compression (preserves aspect ratio)
5. **Storage path** - `memories/{memoryId}/{timestamp}.jpg`

**Future Enhancements:**
- Edit memory functionality
- Reorder photos
- Add reactions/comments
- Share memories
- Memory search/filter
- Export memories as PDF

---

## 🎉 **Ready to Implement!**

The plan is complete and comprehensive. We have:
- ✅ Clear database schema
- ✅ Defined types
- ✅ Backend functions planned
- ✅ UI integration steps
- ✅ Testing checklist
- ✅ Execution timeline

**Let's build this feature step by step!** 🚀
