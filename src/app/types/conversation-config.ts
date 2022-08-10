import { Observable } from 'rxjs';
import { Conversation, ConversationItem, ConversationParticipant, ConversationItemMessage, Account } from '../types'

export type ConversationConfig = {
  conversationsGet: (query?: any) => Observable<{ conversations: Conversation[], paging?: any }>;
  conversationsStats: (query?: any) => Observable<any>;

  conversationSave: (conversation: Conversation) => Observable<Conversation>;
  conversationDelete: (conversation: Conversation) => Observable<Conversation>;
  conversationRead: (conversation: Conversation, conversationItemId: number) => Observable<Conversation>;
  
  conversationItemsGet: (conversationId: number, query?: any) => Observable<{ conversationItems: ConversationItem[], paging?: any }>;
  
  conversationItemSave: (conversationItem: ConversationItem | ConversationItemMessage) => Observable<ConversationItem>;  
  conversationItemDelete: (conversationItem: ConversationItem | ConversationItemMessage) => Observable<ConversationItem>;  
  conversationItemFilePost: (conversationItem: ConversationItem, file: Blob) => Observable<any>;
  conversationItemFileDownload: (conversationItem: ConversationItem | ConversationItemMessage, fileId: number) => void;

  conversationParticipantsGet: (conversationId: number, query?: any) => Observable<{ conversationParticipants: ConversationParticipant[], paging?: any }>;
  conversationParticipantSave: (conversationId: number, conversationParticipant: ConversationParticipant) => Observable<ConversationParticipant>;
  conversationParticipantAdd: (conversationId: number, data: any) => Observable<any>;
  conversationParticipantSession: (conversationId: number) => Observable<ConversationParticipant>;
  conversationParticipantDelete: (conversationId: number, conversationParticipant: ConversationParticipant) => Observable<ConversationParticipant>;
  conversationParticipantBulk: (conversationId: number, data: any) => Observable<any>;

  accountsGet: (query?: any) => Observable<{ accounts: Account[], paging?: any }>;

}
