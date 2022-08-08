import { Observable } from 'rxjs';
import { IConversation, IConversationItem, IConversationParticipant, IConversationItemMessage, Account } from '../interfaces'

export interface ConversationConfig {
  conversationsGet: (query?: any) => Observable<{ conversations: IConversation[], paging?: any }>;
  conversationsStats?: (query?: any) => Observable<any>;

  conversationSave: (conversation: IConversation) => Observable<IConversation>;
  conversationDelete: (conversation: IConversation) => Observable<IConversation>;
  
  conversationItemsGet: (conversationId: number, query?: any) => Observable<{ conversationItems: IConversationItem[], paging?: any }>;
  
  conversationItemSave: (conversationItem: IConversationItem | IConversationItemMessage) => Observable<IConversationItem>;  
  conversationItemFilePost: (conversationItem: IConversationItem, file: Blob) => Observable<any>;
  conversationItemFileDownload: (conversationItem: IConversationItem | IConversationItemMessage, fileId: number) => void;

  conversationParticipantsGet: (conversationId: number, query?: any) => Observable<{ conversationParticipants: IConversationParticipant[], paging?: any }>;
  conversationParticipantSave: (conversationId: number, conversationParticipant: IConversationParticipant) => Observable<IConversationParticipant>;
  conversationParticipantDelete: (conversationId: number, conversationParticipant: IConversationParticipant) => Observable<IConversationParticipant>;
  conversationParticipantBulk?: (conversationId: number, data: any) => Observable<any>;
  
  accountsGet: (query?: any) => Observable<{ accounts: Account[], paging?: any }>;

}
