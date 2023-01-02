import { RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';

import { Conversation, ConversationItem, ConversationParticipant, ConversationItemMessage, Account } from '../types'


export type ConversationConfig = {
  conversationsGet: (query?: any, config?: RequestConfig) => Observable<{ conversations: Conversation[], paging?: any }>;
  conversationsStats: (query?: any, config?: RequestConfig) => Observable<any>;

  conversationSave: (conversation: Conversation, config?: RequestConfig) => Observable<Conversation>;
  conversationDelete: (conversation: Conversation, config?: RequestConfig) => Observable<Conversation>;
  conversationRead: (conversation: Conversation, conversationItem: ConversationItem, config?: RequestConfig) => Observable<Conversation>;

  conversationItemsGet: (conversation: Conversation, query?: any, config?: RequestConfig) => Observable<{ conversationItems: ConversationItem[], paging?: any }>;

  conversationItemSave: (conversationItem: ConversationItem | ConversationItemMessage, config?: RequestConfig) => Observable<ConversationItem>;
  conversationItemDelete: (conversationItem: ConversationItem | ConversationItemMessage, config?: RequestConfig) => Observable<ConversationItem>;
  conversationItemFilePost: (conversationItem: ConversationItem, file: Blob, config?: RequestConfig) => Observable<any>;
  conversationItemFileDownload: (conversationItem: ConversationItem | ConversationItemMessage, fileId: number, config?: RequestConfig) => void;

  conversationParticipantsGet: (conversation: Conversation, query?: any, config?: RequestConfig) => Observable<{ conversationParticipants: ConversationParticipant[], paging?: any }>;
  conversationParticipantSave: (conversation: Conversation, conversationParticipant: ConversationParticipant, config?: RequestConfig) => Observable<ConversationParticipant>;
  conversationParticipantAdd: (conversation: Conversation, data: any, config?: RequestConfig) => Observable<any>;
  conversationParticipantSession: (conversation: Conversation, config?: RequestConfig) => Observable<ConversationParticipant>;
  conversationParticipantDelete: (conversation: Conversation, conversationParticipant: ConversationParticipant, config?: RequestConfig) => Observable<ConversationParticipant>;
  conversationParticipantBulk: (conversation: Conversation, data: any, config?: RequestConfig) => Observable<any>;

  accountsGet: (conversation: Conversation, query: any, config?: RequestConfig) => Observable<{ accounts: Account[], paging?: any }>;

  websocketService?: () => any;

  leaveConversation?: {
    show?: () => Observable<boolean> | boolean,
  },

  startConversation?: {
    disabled?: () => Observable<boolean> | boolean,
    tooltip?: () => Observable<string> | string,
    show?: () => Observable<boolean> | boolean,
  }
}
