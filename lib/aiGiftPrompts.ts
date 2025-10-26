/**
 * AI Gift Generation Prompts
 * System and user prompts for OpenAI gift generation
 */

import { ProfileDataForAI } from './aiGiftDataGathering';

/**
 * Master system prompt for AI gift generation
 */
export const SYSTEM_PROMPT = `You are an expert gift recommendation AI specializing in personalized gift suggestions for romantic relationships. Your goal is to analyze a person's profile data and generate thoughtful, meaningful gift ideas that show deep understanding and care.

## Your Task:
Analyze the provided profile data and generate 3-5 highly personalized gift suggestions. Each suggestion should:
1. Be based on specific data points from their profile
2. Show genuine understanding of their interests and preferences
3. Be appropriate for the relationship stage and upcoming occasions
4. Include a confidence score (85-100%) based on data strength
5. Have a clear reasoning that references specific profile information

## Data You'll Receive:
- Basic profile information (name, age, relationship details, favorites)
- Interests and hobbies
- Recent conversations and topics discussed
- Special memories and moments
- User notes and observations
- Past dates and activities
- Previous gift history (to avoid repetition)
- Current gift ideas (to avoid duplicates)

## Guidelines:
1. **Personalization is Key:** Every suggestion must tie back to specific profile data
2. **Variety:** Suggest different types of gifts (experiences, physical items, subscriptions)
3. **Price Range:** Mix of affordable ($20-50), mid-range ($50-150), and special ($150+)
4. **Occasions:** Consider upcoming events (birthday, anniversary, holidays, "just because")
5. **Avoid Repetition:** Don't suggest gifts similar to what they've already received
6. **Be Specific:** "Professional Hair Styling Kit" not "Hair Products"
7. **Include Links:** When possible, suggest where to buy (Amazon, Etsy, specific stores)
8. **Confidence Scoring:**
   - 95-100%: Direct mention or strong pattern
   - 90-94%: Clear interest with supporting evidence
   - 85-89%: Inferred from related interests

## Output Format:
Return ONLY a valid JSON object with this exact structure (no markdown, no code blocks):
{
  "suggestions": [
    {
      "title": "Specific gift name",
      "reason": "Why this gift based on profile data",
      "price": "$XX.XX or price range",
      "occasion": "Birthday/Anniversary/Just Because/etc",
      "confidence_score": 85-100,
      "product_link": "URL or null"
    }
  ]
}

## Important:
- Be thoughtful and genuine
- Reference specific profile details in reasoning
- Avoid generic suggestions
- Consider relationship stage and appropriateness
- Make each suggestion feel personal and meaningful
- Return ONLY valid JSON, no other text`;

/**
 * Builds user prompt from profile data
 */
export function buildUserPrompt(data: ProfileDataForAI): string {
  const sections: string[] = [];

  // Basic Information
  sections.push('# Profile Analysis Request\n');
  sections.push('## Basic Information:');
  sections.push(`- Name: ${data.profile.name || 'Not provided'}`);
  if (data.profile.age) sections.push(`- Age: ${data.profile.age}`);
  if (data.profile.relationship_status) sections.push(`- Relationship Status: ${data.profile.relationship_status}`);
  if (data.profile.how_we_met) sections.push(`- How We Met: ${data.profile.how_we_met}`);
  if (data.profile.relationship_start_date) sections.push(`- Relationship Start: ${data.profile.relationship_start_date}`);
  sections.push('');

  // Favorites
  const favorites = [];
  if (data.profile.favorite_color) favorites.push(`- Favorite Color: ${data.profile.favorite_color}`);
  if (data.profile.favorite_flower) favorites.push(`- Favorite Flower: ${data.profile.favorite_flower}`);
  if (data.profile.favorite_food) favorites.push(`- Favorite Food: ${data.profile.favorite_food}`);
  if (data.profile.favorite_drink) favorites.push(`- Favorite Drink: ${data.profile.favorite_drink}`);
  if (data.profile.favorite_music) favorites.push(`- Favorite Music: ${data.profile.favorite_music}`);
  if (data.profile.favorite_movie) favorites.push(`- Favorite Movie: ${data.profile.favorite_movie}`);
  
  if (favorites.length > 0) {
    sections.push('## Favorites:');
    sections.push(...favorites);
    sections.push('');
  }

  // Interests & Hobbies
  if (data.interests.length > 0) {
    sections.push('## Interests & Hobbies:');
    data.interests.forEach((interest) => {
      const line = interest.notes 
        ? `- ${interest.category}: ${interest.name} (${interest.notes})`
        : `- ${interest.category}: ${interest.name}`;
      sections.push(line);
    });
    sections.push('');
  }

  // Recent Conversations
  if (data.conversations.length > 0) {
    sections.push('## Recent Conversations:');
    data.conversations.forEach((conv) => {
      sections.push(`- ${conv.date}: ${conv.topic}${conv.summary ? ` - ${conv.summary}` : ''}`);
    });
    sections.push('');
  }

  // Special Memories
  if (data.memories.length > 0) {
    sections.push('## Special Memories:');
    data.memories.forEach((memory) => {
      sections.push(`- ${memory.date}: ${memory.title}${memory.description ? ` - ${memory.description}` : ''}`);
    });
    sections.push('');
  }

  // Important Notes
  if (data.notes.length > 0) {
    sections.push('## Important Notes:');
    data.notes.forEach((note) => {
      const category = note.category ? ` [${note.category}]` : '';
      sections.push(`- ${note.title}${category}: ${note.content}`);
    });
    sections.push('');
  }

  // Past Dates & Activities
  if (data.dates.length > 0) {
    sections.push('## Past Dates & Activities:');
    data.dates.forEach((date) => {
      sections.push(`- ${date.date}: ${date.activity}${date.location ? ` at ${date.location}` : ''}`);
    });
    sections.push('');
  }

  // Previous Gifts (to avoid repetition)
  if (data.giftHistory.length > 0) {
    sections.push('## Previous Gifts (to avoid repetition):');
    data.giftHistory.forEach((gift) => {
      const details = [];
      if (gift.occasion) details.push(gift.occasion);
      if (gift.price) details.push(gift.price);
      if (gift.reaction) details.push(`Reaction: ${gift.reaction}`);
      const detailsStr = details.length > 0 ? ` (${details.join(', ')})` : '';
      sections.push(`- ${gift.title}${detailsStr}`);
    });
    sections.push('');
  }

  // Current Gift Ideas (to avoid duplicates)
  if (data.giftIdeas.length > 0) {
    sections.push('## Current Gift Ideas (to avoid duplicates):');
    data.giftIdeas.forEach((idea) => {
      const details = [];
      if (idea.priority) details.push(idea.priority);
      if (idea.occasion) details.push(idea.occasion);
      const detailsStr = details.length > 0 ? ` (${details.join(', ')})` : '';
      sections.push(`- ${idea.title}${detailsStr}`);
    });
    sections.push('');
  }

  // Final instruction
  sections.push('---');
  sections.push('');
  sections.push('Based on this comprehensive profile, generate 3-5 highly personalized gift suggestions.');
  sections.push('Make each suggestion thoughtful, specific, and tied to concrete data points from the profile above.');
  sections.push('Return ONLY valid JSON in the exact format specified in the system prompt.');

  return sections.join('\n');
}

/**
 * Validates AI response structure
 */
export interface AIGiftSuggestion {
  title: string;
  reason: string;
  price: string;
  occasion: string;
  confidence_score: number;
  product_link: string | null;
}

export interface AIGiftResponse {
  suggestions: AIGiftSuggestion[];
}

export function validateAIResponse(response: any): { valid: boolean; data?: AIGiftResponse; error?: string } {
  try {
    if (!response || typeof response !== 'object') {
      return { valid: false, error: 'Response is not an object' };
    }

    if (!Array.isArray(response.suggestions)) {
      return { valid: false, error: 'Response.suggestions is not an array' };
    }

    if (response.suggestions.length === 0) {
      return { valid: false, error: 'No suggestions provided' };
    }

    // Validate each suggestion
    for (const suggestion of response.suggestions) {
      if (!suggestion.title || typeof suggestion.title !== 'string') {
        return { valid: false, error: 'Invalid or missing title' };
      }
      if (!suggestion.reason || typeof suggestion.reason !== 'string') {
        return { valid: false, error: 'Invalid or missing reason' };
      }
      if (!suggestion.price || typeof suggestion.price !== 'string') {
        return { valid: false, error: 'Invalid or missing price' };
      }
      if (!suggestion.occasion || typeof suggestion.occasion !== 'string') {
        return { valid: false, error: 'Invalid or missing occasion' };
      }
      if (typeof suggestion.confidence_score !== 'number' || suggestion.confidence_score < 0 || suggestion.confidence_score > 100) {
        return { valid: false, error: 'Invalid confidence_score (must be 0-100)' };
      }
      if (suggestion.product_link !== null && typeof suggestion.product_link !== 'string') {
        return { valid: false, error: 'Invalid product_link (must be string or null)' };
      }
    }

    return { valid: true, data: response as AIGiftResponse };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}
