import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ConversationRole, ConversationState } from 'src/app/enums';
import { ConversationConfig, Conversation, ConversationItem, ConversationItemMessage, ConversationParticipant } from 'src/app/types';
import { conversationData, conversationParticipantData, conversationsData } from '../data';
import { accountsData } from '../data/accounts-data';


@Injectable({
  providedIn: 'root'
})
export class ConversationsStaticService {

  public conversationConfig: ConversationConfig = {
    conversationsGet: (query?: any) => {
      return of(conversationsData);
    },
    conversationsStats: (query?: any) => {
      return of({});
    },
    conversationSave: (conversation: Conversation) => {
      return of(conversation);
    },
    conversationRead: (conversation: Conversation, conversationItemId) => {
      return of(conversation);
    },
    conversationDelete: (conversation: Conversation) => {
      return of({
        ...conversation,
        state: ConversationState.Deleted,
      });
    },
    conversationItemsGet: (conversation: Conversation, query?: any) => {
      let conversationItems = conversationData.conversationItems
      .filter((conversationItem) => {
        return conversation.id === conversationItem.conversationId
      });

      if (query?.maxConversationItemId) {
        conversationItems = conversationItems
          .filter((conversationItem) => (conversationItem.id > query.maxConversationItemId));
      }

      return of({ conversationItems });
    },
    conversationItemSave: (conversationItem: ConversationItem | ConversationItemMessage) => {
      return of(conversationItem);
    },
    conversationParticipantAdd: (conversation: Conversation, data) => {
      return of(null)
    },
    conversationItemDelete: (conversationItem: ConversationItem | ConversationItemMessage) => {
      return of(conversationItem);
    },
    conversationItemFilePost: (conversationItem: ConversationItem, file: Blob) => {
      return of(true);
    },
    conversationItemFileDownload: (conversationItem: ConversationItem | ConversationItemMessage, fileId: number) =>  {

    },
    conversationParticipantsGet: (conversation: Conversation, query?: any) => {
      return of(conversationParticipantData);
    },
    conversationParticipantSave: (conversation: Conversation, conversationParticipant: ConversationParticipant) => {
      return of(conversationParticipant);
    },
    conversationParticipantSession: (conversation: Conversation) => {
      return of({});
    },
    conversationParticipantDelete: (conversation: Conversation, conversationParticipant: ConversationParticipant) => {
      return of(conversationParticipant);
    },
    conversationParticipantBulk: (conversation: Conversation, data: any) => {
      return of({});
    },
    accountsGet: (conversation: Conversation, query?: any) => {
      return of(accountsData)
    },
  }

}
