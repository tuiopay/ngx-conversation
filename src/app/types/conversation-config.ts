import { RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { Conversation, ConversationItem, ConversationParticipant, ConversationItemMessage, Account } from '../types'


export type ConversationConfig = {
  conversationsGet: (query?: any, config?: RequestConfig) => Observable<{ conversations: Conversation[], paging?: any }>;
  conversationsStats: (query?: any, config?: RequestConfig) => Observable<any>;

  conversationSave: (conversation: Conversation, config?: RequestConfig) => Observable<Conversation>;
  conversationDelete: (conversation: Conversation, config?: RequestConfig) => Observable<Conversation>;
  conversationRead: (conversation: Conversation, conversationItemId: number, config?: RequestConfig) => Observable<Conversation>;
  
  conversationItemsGet: (conversationId: number, query?: any, config?: RequestConfig) => Observable<{ conversationItems: ConversationItem[], paging?: any }>;
  
  conversationItemSave: (conversationItem: ConversationItem | ConversationItemMessage, config?: RequestConfig) => Observable<ConversationItem>;  
  conversationItemDelete: (conversationItem: ConversationItem | ConversationItemMessage, config?: RequestConfig) => Observable<ConversationItem>;  
  conversationItemFilePost: (conversationItem: ConversationItem, file: Blob, config?: RequestConfig) => Observable<any>;
  conversationItemFileDownload: (conversationItem: ConversationItem | ConversationItemMessage, fileId: number, config?: RequestConfig) => void;

  conversationParticipantsGet: (conversationId: number, query?: any, config?: RequestConfig) => Observable<{ conversationParticipants: ConversationParticipant[], paging?: any }>;
  conversationParticipantSave: (conversationId: number, conversationParticipant: ConversationParticipant, config?: RequestConfig) => Observable<ConversationParticipant>;
  conversationParticipantAdd: (conversationId: number, data: any, config?: RequestConfig) => Observable<any>;
  conversationParticipantSession: (conversationId: number, config?: RequestConfig) => Observable<ConversationParticipant>;
  conversationParticipantDelete: (conversationId: number, conversationParticipant: ConversationParticipant, config?: RequestConfig) => Observable<ConversationParticipant>;
  conversationParticipantBulk: (conversationId: number, data: any, config?: RequestConfig) => Observable<any>;

  accountsGet: (query?: any, config?: RequestConfig) => Observable<{ accounts: Account[], paging?: any }>;

  beforeConverstation?: (conversation: Conversation) => Observable<Conversation>;

}
