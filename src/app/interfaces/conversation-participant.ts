import { ConversationParticipantType } from '../enums';

import { Account } from './account';

export interface IConversationParticipant {
  id?: number;
  state?: 'active' | 'deleted';
  type?: ConversationParticipantType;
  accountId?: number;
  account?: Account;
  activityDate?: Date;
  conversationId?: number;
  createDate?: Date;
  email?: string;
  guid?: string;
  lastNotifiedConversationItemId?: number;
  lastViewedConversationItemId?: number;
  name?: string;
}
