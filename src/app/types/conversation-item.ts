import { ConversationItemState, ConversationItemType } from '../enums';

import { ConversationParticipant } from './conversation-participant';


export interface ConversationItem {
  id?: number;
  conversationId?: number;
  conversationParticipant?: ConversationParticipant;
  conversationParticipantId?: number;
  createDate?: Date;
  guid?: string;
  objectId?: number;
  message?: string;
  conversationItemFiles?: any[];
  state?: ConversationItemState;
  type?: ConversationItemType;
  conversationParticipantsAddedCount?: number;
  conversationParticipantsRemovedCount?: number;
  conversationParticipantsReadCount?: number;
  lastConversationItemParticipantAddRemove?: any;
  lastConversationItemFile?: any;
}

