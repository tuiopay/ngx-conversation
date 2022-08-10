import { ConversationParticipantType } from '../enums';

import { Account } from './account';

export type ConversationParticipant = {
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
  notifiedConversationItemId?: number;
  readConversationItemId?: number;
  name?: string;
}
