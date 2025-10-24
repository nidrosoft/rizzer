# Header Standard Verification - App-Wide Consistency

## 🎯 Objective
Ensure all pages across the app use the same standard header positioning for back buttons, three-dot menus, and other action buttons.

---

## 📐 Standard Header Specifications

### **From Rizz Category Detail Page (Reference Standard)**

```typescript
// Navigation Container
navigation: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: Spacing.lg,     // 24px - STANDARD
  paddingTop: Spacing.md,            // 16px - STANDARD
  paddingBottom: Spacing.lg,         // 24px
}

// Icon Buttons (Back, Three-dot menu, etc.)
navButton: {
  width: 44,                         // 44px - STANDARD
  height: 44,                        // 44px - STANDARD
  borderRadius: 22,                  // 22px - STANDARD
  backgroundColor: Colors.background, // White
  justifyContent: 'center',
  alignItems: 'center',
}
```

### **Key Measurements**
- **Button Size**: 44x44px (not 48px, not 40px)
- **Border Radius**: 22px (perfect circle)
- **Horizontal Padding**: 24px (Spacing.lg)
- **Top Padding**: 16px (Spacing.md)
- **Background**: White circle on gradient/colored backgrounds
- **Icon Color**: Black (Colors.text)

---

## ✅ Verification Status

### **1. Rizz Feature**

#### **Rizz Category Detail** (`/app/rizz/category-detail.tsx`)
- ✅ Back button: 44x44px, radius 22px
- ✅ Three-dot menu: 44x44px, radius 22px
- ✅ Padding: horizontal 24px, top 16px
- ✅ White circle backgrounds
- ✅ **Status**: STANDARD (Reference implementation)

---

### **2. Gifts Feature**

#### **Investigation Detail** (`/app/gifts/investigation-detail.tsx`)
- ✅ Uses `GradientHeader` component
- ✅ Back button: 44x44px (via GradientHeader)
- ✅ Three-dot menu: 44x44px (custom iconCircle)
- ✅ Padding: horizontal 24px, top 16px
- ✅ White circle backgrounds
- ✅ **Status**: COMPLIANT

**Code:**
```typescript
<GradientHeader
  title={recipientName}
  showBackButton={true}
  rightElement={
    <TouchableOpacity style={styles.moreButton}>
      <View style={styles.iconCircle}>
        <More size={24} color={Colors.text} variant="Bold" />
      </View>
    </TouchableOpacity>
  }
/>

// Styles
iconCircle: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: Colors.background,
  ...HeaderConfig.iconButtonShadow,
}
```

#### **Step 1-5 (Contact, Occasion, Details, Analysis, Purchase)**
- ✅ All use `GradientHeader` component
- ✅ Back button: 44x44px (via GradientHeader)
- ✅ Close button: 44x44px (via GradientHeader)
- ✅ Padding: horizontal 24px, top 16px
- ✅ White circle backgrounds
- ✅ **Status**: COMPLIANT

**Uses StepLayout component which wraps GradientHeader:**
```typescript
<GradientHeader
  title={title}
  showBackButton={showBackButton}
  showCloseButton={showCloseButton}
  onBackPress={onBackPress}
  onClosePress={onClosePress}
/>
```

---

### **3. GradientHeader Component** (`/components/ui/GradientHeader.tsx`)

#### **Specifications**
```typescript
header: {
  paddingHorizontal: Spacing.lg,     // 24px ✅
  paddingTop: Spacing.md,            // 16px ✅
}

backButton: {
  width: 44,                         // ✅
  height: 44,                        // ✅
}

closeButton: {
  width: 44,                         // ✅
  height: 44,                        // ✅
}

iconCircle: {
  width: 44,                         // ✅
  height: 44,                        // ✅
  borderRadius: 22,                  // ✅
  backgroundColor: Colors.background, // ✅
  ...shadow                          // ✅
}
```

- ✅ **Status**: STANDARD COMPLIANT
- ✅ All measurements match Rizz page standard
- ✅ Used across all Gift steps
- ✅ Reusable across entire app

---

### **4. Header Configuration** (`/constants/header.ts`)

```typescript
export const HeaderConfig = {
  paddingTop: Spacing.md,           // 16px ✅
  paddingHorizontal: Spacing.lg,    // 24px ✅
  iconButtonSize: 44,               // 44px ✅
  iconButtonRadius: 22,             // 22px ✅
  iconButtonShadow: { ... },        // ✅
}
```

- ✅ **Status**: DOCUMENTED
- ✅ Single source of truth
- ✅ Matches Rizz page standard
- ✅ Available for import across app

---

## 📊 Compliance Summary

| Feature/Page | Back Button | Menu/Close | Padding | White Circle | Status |
|--------------|-------------|------------|---------|--------------|--------|
| **Rizz Category Detail** | 44x44 ✅ | 44x44 ✅ | 24/16 ✅ | ✅ | ✅ STANDARD |
| **Gifts Investigation Detail** | 44x44 ✅ | 44x44 ✅ | 24/16 ✅ | ✅ | ✅ COMPLIANT |
| **Gifts Step 1-5** | 44x44 ✅ | 44x44 ✅ | 24/16 ✅ | ✅ | ✅ COMPLIANT |
| **GradientHeader Component** | 44x44 ✅ | 44x44 ✅ | 24/16 ✅ | ✅ | ✅ COMPLIANT |

**Result**: 100% compliance across all Gift pages! ✅

---

## 🎨 Visual Consistency

### **Standard Header Layout**

```
┌─────────────────────────────────────────────┐
│  [◀]         Page Title          [⋮]       │  ← 44x44 buttons
│   ↑            ↑                  ↑         │
│  Back        Center             Menu        │
│                                             │
│  ←─ 24px padding                24px ─→    │
└─────────────────────────────────────────────┘
     ↑
   16px padding from top
```

### **Button Specifications**
```
┌──────────┐
│          │  44px
│    ◀     │  ← Icon (24px)
│          │
└──────────┘
   44px
   
Border Radius: 22px (perfect circle)
Background: White (#FFFFFF)
Shadow: Subtle elevation
Icon Color: Black (#000000)
```

---

## 🔍 Other Pages to Verify

### **Dates Tab**
- ❓ Check if detail pages use standard header
- ❓ Verify button sizes and positioning

### **Discovery Tab**
- ❓ Check if detail pages use standard header
- ❓ Verify button sizes and positioning

### **Home Tab**
- ❓ Check if detail pages use standard header
- ❓ Verify button sizes and positioning

### **Date Profile Creation**
- ❓ Check header positioning
- ❓ Verify button sizes

### **Onboarding Screens**
- ❓ Check header positioning
- ❓ Verify button sizes

---

## 📝 Implementation Guidelines

### **For New Pages**

**Option 1: Use GradientHeader Component (Recommended)**
```typescript
import GradientHeader from '@/components/ui/GradientHeader';

<GradientHeader
  title="Page Title"
  showBackButton={true}
  showCloseButton={false}
  rightElement={
    <TouchableOpacity style={styles.menuButton}>
      <View style={styles.iconCircle}>
        <More size={24} color={Colors.text} />
      </View>
    </TouchableOpacity>
  }
/>
```

**Option 2: Use HeaderConfig Constants**
```typescript
import { HeaderConfig } from '@/constants/header';

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: HeaderConfig.paddingHorizontal,
    paddingTop: HeaderConfig.paddingTop,
  },
  iconButton: {
    width: HeaderConfig.iconButtonSize,
    height: HeaderConfig.iconButtonSize,
    borderRadius: HeaderConfig.iconButtonRadius,
    ...HeaderConfig.iconButtonShadow,
  },
});
```

---

## ✅ Verification Checklist

### **Gift Pages** ✅
- [x] Investigation Detail - Uses GradientHeader ✅
- [x] Step 1 (Contact) - Uses GradientHeader ✅
- [x] Step 2 (Occasion) - Uses GradientHeader ✅
- [x] Step 3 (Details) - Uses GradientHeader ✅
- [x] Step 4 (Analysis) - Uses GradientHeader ✅
- [x] Step 5 (Purchase) - Uses GradientHeader ✅

### **Components** ✅
- [x] GradientHeader - Matches standard ✅
- [x] HeaderConfig - Documented ✅

### **Reference** ✅
- [x] Rizz Category Detail - Standard reference ✅

---

## 🎯 Summary

**All Gift pages are compliant with the standard header positioning!**

✅ **Back buttons**: 44x44px, radius 22px, white background  
✅ **Menu buttons**: 44x44px, radius 22px, white background  
✅ **Padding**: 24px horizontal, 16px top  
✅ **Consistency**: All pages use GradientHeader component  
✅ **Documentation**: HeaderConfig constants available  

**The Gift feature is production-ready with perfect header consistency!** 🎉

---

## 📋 Next Steps

1. ✅ Gift pages verified - All compliant
2. ⏭️ Verify Dates tab detail pages
3. ⏭️ Verify Discovery tab detail pages
4. ⏭️ Verify Home tab detail pages
5. ⏭️ Verify Date Profile creation flow
6. ⏭️ Verify Onboarding screens
7. ⏭️ Update any non-compliant pages to use GradientHeader or HeaderConfig

**Goal**: 100% header consistency across the entire app! 🚀
