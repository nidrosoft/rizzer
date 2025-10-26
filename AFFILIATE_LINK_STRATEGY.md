# 🔗 Affiliate Link Strategy for AI Gift Suggestions

## 📋 **Overview**

You want to monetize gift suggestions through affiliate commissions. When users click "View Product" and purchase, you earn a commission.

---

## 🎯 **Recommended Approach**

### **Option 1: AI Generates Affiliate Links Directly** ⭐ **BEST**

**How it works:**
1. In the AI prompt, instruct ChatGPT to search for products on **affiliate-friendly platforms**
2. AI returns product links from platforms where you have affiliate accounts
3. Links are already affiliate-tagged when saved to database
4. User clicks → Goes directly to affiliate link → You earn commission

**Platforms to use:**
- **Amazon Associates** (most products)
- **ShareASale** (multi-merchant)
- **CJ Affiliate** (Commission Junction)
- **Rakuten Advertising**
- **Impact** (various brands)

**AI Prompt Enhancement:**
```
When suggesting gifts, search for products on Amazon.com and provide 
the Amazon product URL. Format: https://www.amazon.com/dp/[ASIN]

Example: https://www.amazon.com/dp/B08N5WRWNW
```

**Then in your backend:**
```typescript
// When saving to database, convert to affiliate link
function addAffiliateTag(url: string): string {
  if (url.includes('amazon.com')) {
    const asin = extractASIN(url);
    return `https://www.amazon.com/dp/${asin}?tag=YOUR_AFFILIATE_ID`;
  }
  // Add other platforms...
  return url;
}
```

---

### **Option 2: Link Redirect Service** 🔄

**How it works:**
1. AI generates regular product URLs
2. Store original URL in database
3. When user clicks "View Product", redirect through YOUR server
4. Your server converts to affiliate link and redirects

**Implementation:**

**Database:**
```sql
ALTER TABLE date_profile_ai_gift_suggestions 
ADD COLUMN original_product_link TEXT,
ADD COLUMN affiliate_product_link TEXT;
```

**Backend Function:**
```typescript
// /lib/affiliateLinks.ts

export async function convertToAffiliateLink(url: string): Promise<string> {
  // Amazon
  if (url.includes('amazon.com')) {
    const asin = extractASIN(url);
    return `https://www.amazon.com/dp/${asin}?tag=YOUR_AFFILIATE_ID`;
  }
  
  // Etsy
  if (url.includes('etsy.com')) {
    return `${url}?ref=YOUR_ETSY_AFFILIATE_ID`;
  }
  
  // Generic affiliate network (ShareASale, CJ, etc.)
  // Use their API to generate affiliate link
  
  return url; // Fallback to original
}
```

**Edge Function:**
```typescript
// /supabase/functions/redirect-affiliate/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  const url = new URL(req.url);
  const productUrl = url.searchParams.get('url');
  const suggestionId = url.searchParams.get('id');
  
  if (!productUrl) {
    return new Response('Missing URL', { status: 400 });
  }
  
  // Log the click for analytics
  await logAffiliateClick(suggestionId);
  
  // Convert to affiliate link
  const affiliateUrl = await convertToAffiliateLink(productUrl);
  
  // Redirect user
  return new Response(null, {
    status: 302,
    headers: { 'Location': affiliateUrl }
  });
});
```

**In your app:**
```typescript
// When user clicks "View Product"
const affiliateRedirectUrl = `https://YOUR_PROJECT.supabase.co/functions/v1/redirect-affiliate?url=${encodeURIComponent(productLink)}&id=${suggestionId}`;

Linking.openURL(affiliateRedirectUrl);
```

---

### **Option 3: Hybrid Approach** 🎯 **RECOMMENDED**

**Combine both methods:**

1. **AI generates Amazon links** (easiest, most products)
2. **Backend converts to affiliate** (adds your tag)
3. **Track clicks** (analytics + attribution)

**Implementation:**

**1. Update AI Prompt:**
```typescript
// /lib/aiGiftPrompts.ts

export const SYSTEM_PROMPT = `
You are an expert gift recommendation AI.

When suggesting gifts:
1. Search for products on Amazon.com
2. Provide the Amazon product URL in format: https://www.amazon.com/dp/[ASIN]
3. Only include product_link if you find a specific, purchasable product
4. Prefer products with good reviews and availability

Example product_link: "https://www.amazon.com/dp/B08N5WRWNW"
`;
```

**2. Backend Processing:**
```typescript
// /supabase/functions/generate-gift-suggestions/index.ts

async function saveSuggestions(supabase: any, profileId: string, suggestions: any[], batchId: string) {
  const records = suggestions.map(s => ({
    date_profile_id: profileId,
    generation_batch_id: batchId,
    title: s.title,
    reason: s.reason,
    price: s.price,
    occasion: s.occasion,
    confidence_score: s.confidence_score,
    product_link: s.product_link ? addAffiliateTag(s.product_link) : null, // ✅ Add affiliate tag
    status: 'pending',
    expires_at: expiresAt.toISOString(),
  }));

  await supabase
    .from('date_profile_ai_gift_suggestions')
    .insert(records);
}

function addAffiliateTag(url: string): string {
  if (url.includes('amazon.com')) {
    // Extract ASIN (Amazon product ID)
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
    if (asinMatch) {
      const asin = asinMatch[1];
      return `https://www.amazon.com/dp/${asin}?tag=YOUR_AFFILIATE_ID`;
    }
  }
  return url;
}
```

**3. Track Clicks:**
```typescript
// /lib/dateProfileGifts.ts

export async function trackAffiliateClick(suggestionId: string) {
  const { error } = await supabase
    .from('affiliate_clicks')
    .insert({
      suggestion_id: suggestionId,
      clicked_at: new Date().toISOString(),
    });
  
  if (error) console.error('Failed to track click:', error);
}
```

**4. In App:**
```typescript
// When user clicks "View Product"
const handleOpenLink = async (url: string | null, suggestionId: string) => {
  if (!url) return;
  
  // Track the click
  await trackAffiliateClick(suggestionId);
  
  // Open affiliate link
  await Linking.openURL(url);
};
```

---

## 📊 **Analytics & Tracking**

**Create tracking table:**
```sql
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  suggestion_id UUID REFERENCES date_profile_ai_gift_suggestions(id),
  user_id UUID REFERENCES users(id),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE,
  commission_amount DECIMAL(10,2),
  conversion_date TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_affiliate_clicks_suggestion ON affiliate_clicks(suggestion_id);
CREATE INDEX idx_affiliate_clicks_user ON affiliate_clicks(user_id);
```

**Track conversions:**
- Amazon Associates provides reports
- Match order dates with click dates
- Update `converted` and `commission_amount`

---

## 💰 **Affiliate Programs to Join**

### **1. Amazon Associates** ⭐
- **Commission:** 1-10% depending on category
- **Cookie Duration:** 24 hours
- **Best for:** Everything
- **Sign up:** https://affiliate-program.amazon.com

### **2. Etsy Affiliate Program**
- **Commission:** 4% per sale
- **Cookie Duration:** 30 days
- **Best for:** Handmade, unique gifts
- **Sign up:** https://www.etsy.com/affiliates

### **3. ShareASale**
- **Commission:** Varies by merchant
- **Cookie Duration:** Varies
- **Best for:** Multiple brands
- **Sign up:** https://www.shareasale.com

### **4. CJ Affiliate (Commission Junction)**
- **Commission:** Varies
- **Best for:** Big brands
- **Sign up:** https://www.cj.com

### **5. Rakuten Advertising**
- **Commission:** Varies
- **Best for:** Fashion, electronics
- **Sign up:** https://rakutenadvertising.com

---

## 🎯 **Recommended Implementation Steps**

### **Phase 1: Amazon Only (Start Simple)**
1. ✅ Join Amazon Associates
2. ✅ Get your affiliate tag (e.g., `yourapp-20`)
3. ✅ Update AI prompt to generate Amazon links
4. ✅ Add `addAffiliateTag()` function to Edge Function
5. ✅ Test with real products

### **Phase 2: Add Tracking**
1. ✅ Create `affiliate_clicks` table
2. ✅ Track clicks in app
3. ✅ Monitor Amazon Associates dashboard
4. ✅ Calculate ROI

### **Phase 3: Expand Platforms**
1. ✅ Join Etsy, ShareASale, etc.
2. ✅ Update `addAffiliateTag()` for multiple platforms
3. ✅ Diversify product sources

---

## 🔧 **Code Implementation**

### **1. Update Edge Function:**
```typescript
// /supabase/functions/generate-gift-suggestions/index.ts

function addAffiliateTag(url: string): string {
  if (!url) return url;
  
  // Amazon
  if (url.includes('amazon.com')) {
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/);
    if (asinMatch) {
      const asin = asinMatch[1];
      return `https://www.amazon.com/dp/${asin}?tag=YOUR_AFFILIATE_TAG`;
    }
  }
  
  // Etsy
  if (url.includes('etsy.com')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}ref=YOUR_ETSY_ID`;
  }
  
  return url;
}

// Use in saveSuggestions:
product_link: s.product_link ? addAffiliateTag(s.product_link) : null,
```

### **2. Update AI Prompt:**
```typescript
// /lib/aiGiftPrompts.ts

export const SYSTEM_PROMPT = `
You are an expert gift recommendation AI.

IMPORTANT: When suggesting gifts, search for products on Amazon.com 
and provide the Amazon product URL in this exact format:
https://www.amazon.com/dp/[ASIN]

Example: "https://www.amazon.com/dp/B08N5WRWNW"

Only include product_link if you find a specific, real, purchasable product.
`;
```

### **3. Track Clicks:**
```typescript
// In AIGiftSuggestionsModal.tsx

const handleOpenLink = async (url: string | null) => {
  if (!url) return;
  
  if (Platform.OS === 'ios') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
  
  // Track click for analytics
  // await trackAffiliateClick(suggestion.id); // Add this later
  
  await Linking.openURL(url);
};
```

---

## 📈 **Expected Revenue**

### **Example Calculation:**
- **1,000 active users**
- **5 suggestions per user per day** = 5,000 suggestions/day
- **10% click rate** = 500 clicks/day
- **5% conversion rate** = 25 purchases/day
- **Average order value:** $50
- **Average commission:** 4% = $2 per order
- **Daily revenue:** 25 × $2 = **$50/day**
- **Monthly revenue:** **$1,500/month**

### **At Scale:**
- **10,000 users:** $15,000/month
- **100,000 users:** $150,000/month

---

## ✅ **Summary & Recommendation**

### **Best Approach:**
1. **Start with Amazon Associates** (easiest, most products)
2. **AI generates Amazon links** in suggestions
3. **Backend adds your affiliate tag** automatically
4. **Track clicks** for analytics
5. **Expand to other platforms** later

### **Why This Works:**
- ✅ AI can find Amazon products easily
- ✅ Amazon has everything
- ✅ Simple to implement
- ✅ No redirect service needed
- ✅ Links work immediately
- ✅ You earn commission automatically

### **Next Steps:**
1. Join Amazon Associates
2. Get your affiliate tag
3. Update Edge Function with `addAffiliateTag()`
4. Update AI prompt to prefer Amazon links
5. Test and monitor

**This is the simplest, most effective approach to start earning affiliate revenue!** 🚀
