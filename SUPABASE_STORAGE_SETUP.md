# 🗄️ SUPABASE STORAGE SETUP

## **REQUIRED: Create Storage Bucket**

Before the photo upload will work, you MUST create a storage bucket in Supabase.

---

## 📋 **SETUP INSTRUCTIONS:**

### **1. Go to Supabase Dashboard**
https://supabase.com/dashboard/project/svspwjunukphqdjjfvef/storage/buckets

### **2. Create New Bucket**
- Click **"New bucket"**
- **Name:** `user-photos`
- **Public bucket:** ✅ **YES** (check this box)
- Click **"Create bucket"**

### **3. Set Up Storage Policies**

After creating the bucket, set up these policies:

#### **Policy 1: Allow Authenticated Users to Upload**
```sql
-- Go to: Storage → user-photos → Policies → New Policy

-- Name: Allow authenticated uploads
-- Policy: INSERT
-- Target roles: authenticated

-- Using SQL Editor:
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-photos');
```

#### **Policy 2: Allow Public Read Access**
```sql
-- Name: Allow public read
-- Policy: SELECT
-- Target roles: public

-- Using SQL Editor:
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-photos');
```

#### **Policy 3: Allow Users to Delete Their Own Photos**
```sql
-- Name: Allow users to delete own photos
-- Policy: DELETE
-- Target roles: authenticated

-- Using SQL Editor:
CREATE POLICY "Allow users to delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## ✅ **VERIFICATION:**

After setup, verify:
1. Bucket `user-photos` exists
2. Bucket is public
3. 3 policies are active
4. Test upload from app

---

## 🔧 **ALTERNATIVE: Quick Setup via SQL**

Run this in SQL Editor:

```sql
-- Create bucket (if not exists via UI)
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-photos', 'user-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create policies
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'user-photos');

CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'user-photos');

CREATE POLICY "Allow users to delete own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'user-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## ⚠️ **IMPORTANT:**

**The photo upload will NOT work until you complete this setup!**

After setup, the app will be able to:
- ✅ Upload photos to `user-photos` bucket
- ✅ Get public URLs
- ✅ Display photos in app
- ✅ Delete user's own photos

---

**Complete this setup now, then continue with the implementation!**
