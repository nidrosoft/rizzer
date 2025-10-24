/**
 * Type definitions for Home feature
 */

export interface DateProfile {
  id: string;
  name: string;
  age: number;
  photo?: string;
  profession: string;
}

export interface InterestCategory {
  emoji: string;
  title: string;
  borderColor: string;
}

export interface ActionCard {
  icon: any; // Icon component
  title: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
}

export interface RizzItem {
  id: number;
  emoji: string;
  title: string;
  color: string;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
}

// Component Props
export interface HomeHeaderProps {
  userName: string;
  onNotificationPress: () => void;
  onProfilePress: () => void;
}

export interface InterestCategoriesProps {
  categories: InterestCategory[];
  onCategoryPress?: (category: InterestCategory) => void;
}

export interface ActionCardsProps {
  actions: ActionCard[];
  onActionPress?: (action: ActionCard) => void;
}

export interface DateProfilesSectionProps {
  profiles: DateProfile[];
  onNewProfile: () => void;
  onProfilePress: (profileId: string) => void;
}

export interface MyRizzSectionProps {
  rizzItems: RizzItem[];
  onRizzPress?: (rizz: RizzItem) => void;
  onAddRizz?: () => void;
  onSeeAll?: () => void;
}

export interface CurrentDatesSectionProps {
  onCreateDate: () => void;
}

export interface UpcomingEventsSectionProps {
  events: UpcomingEvent[];
  onEventPress?: (event: UpcomingEvent) => void;
  onViewAll?: () => void;
}

export interface PremiumCardProps {
  onUpgrade: () => void;
}
