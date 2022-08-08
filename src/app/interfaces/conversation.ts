import { ConversationState } from '../enums';

import { IConversationParticipant } from './conversation-participant';
import { IConversationItem } from './conversation-item';


export interface IConversation {
  id?: number;
  activityDate?: Date;
  conversationParticipants?: IConversationParticipant[];
  createDate?: Date;
  creatorConversationParticipantId?: number;
  guid?: string;
  lastConversationItem?: IConversationItem;
  lastConversationItemId?: number;
  name?: string;
  state?: ConversationState;
  unread?: number;
  participantsEnvironmentId?: number;
  conversationParticipantCount?: number;
  addAllParents?: boolean;
}
