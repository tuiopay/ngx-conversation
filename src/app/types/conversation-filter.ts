export interface ConversationFilter {
  name: string;
  icon?: string;
  image?: string;
  type: 'account' | 'open' | 'closed';
  unread?: boolean;
  count?: number;
}
