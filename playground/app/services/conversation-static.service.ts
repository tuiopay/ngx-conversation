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
    conversationItemsGet: (conversationId: number, query?: any) => {
      let conversationItems = conversationData.conversationItems
      .filter((conversationItem) => {
        return conversationId === conversationItem.conversationId
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
    conversationParticipantAdd: (conversationId: number, data) => {
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
    conversationParticipantsGet: (conversationId: number, query?: any) => {
      return of(conversationParticipantData);
    },
    conversationParticipantSave: (conversationId: number, conversationParticipant: ConversationParticipant) => {
      return of(conversationParticipant);
    },
    conversationParticipantSession: (conversationId: number) => {
      return of({});
    },
    conversationParticipantDelete: (conversationId: number, conversationParticipant: ConversationParticipant) => {
      return of(conversationParticipant);
    },
    conversationParticipantBulk: (conversationId: number, data: any) => {
      return of({});
    },
    accountsGet: (query?: any) => {
      return of(accountsData)
    },
  }

}
