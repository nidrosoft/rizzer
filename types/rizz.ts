/**
 * Type definitions for Rizz feature
 */

export type RizzTab = 'myRizz' | 'geniusRizz';

export interface RizzCategory {
  id: number;
  title: string;
  icon: any; // Icon component
  color: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}

export interface ChatThread {
  id: string;
  title: string | null;
  last_message: string | null;
  lastMessage?: string; // For backward compatibility
  timestamp?: Date; // For backward compatibility
  last_message_at: string;
  created_at: string;
  message_count: number;
}

export interface ChatGroup {
  timeLabel: string;
  chats: ChatThread[];
}

// Component Props
export interface RizzHeaderProps {
  title: string;
}

export interface RizzTabsProps {
  activeTab: RizzTab;
  onTabChange: (tab: RizzTab) => void;
}

export interface RizzCategoriesGridProps {
  categories: RizzCategory[];
  onCategoryPress: (categoryId: number) => void;
  onCategoryLongPress?: (categoryId: number, categoryTitle: string) => void;
}

export interface ChatThreadListProps {
  chatGroups: ChatGroup[];
  onChatPress: (chatId: string) => void;
}

export interface RizzFABProps {
  onPress: () => void;
}
