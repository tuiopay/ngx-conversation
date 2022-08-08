import { IConversationItem } from './conversation-item';


export interface IConversationItemMessage extends IConversationItem {
  message?: string;
}

