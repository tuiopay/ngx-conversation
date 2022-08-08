import { ConversationItemState, ConversationItemType } from '../enums';

import { IConversationParticipant } from './conversation-participant';


export interface IConversationItem{
  id?: number;
  conversationId?: number;
  conversationParticipant?: IConversationParticipant;
  conversationParticipantId?: number;
  createDate?: Date;
  guid?: string;
  objectId?: number;
  payload?: {
    message?: string;
    [key: string]: any;
  };
  conversationItemFiles?: any[],
  state?: ConversationItemState;
  type?: ConversationItemType;
}

