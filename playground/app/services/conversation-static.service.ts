import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ConversationState } from 'src/app/enums';
import { ConversationConfig, IConversation, IConversationItem, IConversationItemMessage, IConversationParticipant } from 'src/app/interfaces';
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
    conversationSave: (conversation: IConversation) => {
      return of(conversation);
    },
    conversationDelete: (conversation: IConversation) => {
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
      
      if(query?.maxConversationItemId) {
        conversationItems = conversationItems
          .filter((conversationItem) => (conversationItem.id > query.maxConversationItemId));
      }

      return of({ conversationItems });
    },
    conversationItemSave: (conversationItem: IConversationItem | IConversationItemMessage) => {
      return of(conversationItem);
    }, 
    conversationItemFilePost: (conversationItem: IConversationItem, file: Blob) => {
      return of(true);
    },
    conversationItemFileDownload: (conversationItem: IConversationItem | IConversationItemMessage, fileId: number) =>  {

    },
    conversationParticipantsGet: (conversationId: number, query?: any) => {
      return of(conversationParticipantData);
    },
    conversationParticipantSave: (conversationId: number, conversationParticipant: IConversationParticipant) => {
      return of(conversationParticipant);
    },
    conversationParticipantDelete: (conversationId: number, conversationParticipant: IConversationParticipant) => {
      return of(conversationParticipant);
    },
    conversationParticipantBulk: (conversationId: number, data: any) => {
      return of({});
    },
    accountsGet: (query?: any) => {
      return of(accountsData)
    }
  }

}
