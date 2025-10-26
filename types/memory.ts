/**
 * Memory Types
 * Type definitions for date profile memories feature
 */

export type MemoryType = 
  | 'First Date'
  | 'Birthday'
  | 'Trip'
  | 'Activity'
  | 'Anniversary'
  | 'Special';

/**
 * Memory interface matching database structure
 */
export interface Memory {
  id: string;
  date_profile_id: string;
  title: string;
  description: string | null;
  date: string; // ISO date string (YYYY-MM-DD)
  memory_type: MemoryType;
  photos: string[]; // Array of photo URLs
  tags: string[] | null;
  likes: number;
  created_at: string;
  updated_at: string;
}

/**
 * Input for creating a new memory
 */
export interface CreateMemoryInput {
  date_profile_id: string;
  title: string;
  description?: string;
  date: string; // ISO date string (YYYY-MM-DD)
  memory_type: MemoryType;
  photo_uris?: string[]; // Local URIs to upload
  tags?: string[];
}

/**
 * Input for updating an existing memory
 */
export interface UpdateMemoryInput {
  title?: string;
  description?: string;
  date?: string;
  memory_type?: MemoryType;
  tags?: string[];
}

/**
 * Memory with formatted date for display
 */
export interface MemoryDisplay extends Memory {
  formattedDate: string; // e.g., "January 15, 2024"
  photoCount: number;
}
