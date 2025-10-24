/**
 * Type definitions for Gifts feature
 * Centralized types for better maintainability and type safety
 */

export type InvestigationStatus = 'pending' | 'active' | 'paused' | 'completed' | 'cancelled' | 'declined';

export type GiftsTab = 'active' | 'completed';

export type OccasionType = 'birthday' | 'secret_santa' | 'anniversary' | 'graduation' | 'just_because';

export type ContactSource = 'phone' | 'app';

export type Platform = 'whatsapp' | 'imessage';

export type CreativityMode = 'standard' | 'creative';

export type Language = 'english' | 'spanish' | 'french' | 'german' | 'italian' | 'portuguese';

export interface Investigation {
  id: string;
  recipientName: string;
  recipientAvatar?: string;
  occasion: string;
  context: string;
  extraInstructions?: string;
  budget?: number;
  language: Language;
  platform: Platform;
  creativityMode: CreativityMode;
  messagePreview?: string;
  status: InvestigationStatus;
  messageCount: number;
  lastMessageTime: Date;
  createdAt: Date;
  sentAt?: Date;
}

export interface Contact {
  id: string;
  name: string;
  phone?: string;
  avatar?: string;
  source: ContactSource;
  isAppUser?: boolean;
}

export interface Occasion {
  id: OccasionType;
  label: string;
  icon: string;
  description: string;
}

export interface NewInvestigationForm {
  selectedContact: Contact | null;
  occasion: OccasionType | null;
  occasionDate: Date | null;
  relationshipContext: string;
  extraInstructions: string;
  budget: string;
  language: Language;
  platform: Platform;
  creativityMode: CreativityMode;
  messagePreview: string;
}

// Component Props
export interface InvestigationCardProps {
  investigation: Investigation;
  onPress: (id: string) => void;
}

export interface StatusBadgeProps {
  status: InvestigationStatus;
  size?: 'small' | 'medium';
}

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onPress: (contact: Contact) => void;
}

export interface OccasionCardProps {
  occasion: Occasion;
  isSelected: boolean;
  onPress: (occasionId: OccasionType) => void;
}

// Step 3: AI Analysis & Gift Suggestions
export type AnalysisStage = 'analyzing' | 'generating' | 'completed';

export interface GiftSuggestion {
  id: string;
  title: string;
  description: string;
  price: string;
  category: string;
  reasoning: string;
  matchScore: number; // 0-100
  imageUrl?: string;
  purchaseUrl?: string;
}

export interface AnalysisProgress {
  stage: AnalysisStage;
  progress: number; // 0-100
  message: string;
}

export interface GiftSuggestionCardProps {
  suggestion: GiftSuggestion;
  onPress: (suggestion: GiftSuggestion) => void;
}

// Step 4: Investigation Detail & Chat
export type MessageSender = 'sherlock' | 'recipient' | 'user';
export type InvestigationTab = 'chat' | 'summary';

export interface Message {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: Date;
  isInjected?: boolean; // For user-injected messages
}

export interface ConversationInsight {
  id: string;
  text: string;
  icon: string;
}

export interface MessageBubbleProps {
  message: Message;
  recipientName?: string;
}

export interface MessageListProps {
  messages: Message[];
  recipientName: string;
}

export interface MessageInputProps {
  onSend: (message: string) => void;
  placeholder?: string;
}

export interface ConversationSummaryProps {
  summary: string;
  insights: ConversationInsight[];
}

export interface InvestigationDetailParams {
  investigationId: string;
  recipientName: string;
  status: InvestigationStatus;
}
