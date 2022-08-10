import { ConversationRole, ConversationState } from '../enums';

import { ConversationParticipant } from './conversation-participant';
import { ConversationItem } from './conversation-item';


export type Conversation = {
  id?: number;
  activityDate?: Date;
  conversationParticipants?: ConversationParticipant[];
  createDate?: Date;
  creatorConversationParticipantId?: number;
  guid?: string;
  lastConversationItem?: ConversationItem;
  lastConversationItemId?: number;
  name?: string;
  state?: ConversationState;
  accountConversationRoles?: ConversationRole[];
  unread?: number;
  participantsEnvironmentId?: number;
  conversationParticipantCount?: number;
  addAllParents?: boolean;
}
