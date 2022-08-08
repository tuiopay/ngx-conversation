import { Injectable } from '@angular/core';

import { FsApi } from '@firestitch/api';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConversationConfig, IConversation, IConversationItem, IConversationItemMessage, IConversationParticipant } from 'src/app/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ConversationsApiService {

  private _url = 'https://tuiopay.local.firestitch.com/api/';
  
  public constructor(
    private _api: FsApi,
  ) {}

  public save(url, data) {
    return data.id ? this._api.put(`${this._url}${url}/${data.id}`, data) : this._api.post(`${this._url}${url}`, data);
  }

  public delete(url, data) {
    return this._api.delete(`${this._url}${url}/${data.id}`, {});
  }

  public get(url, data) {
    return this._api.get(`${this._url}${url}`, data);
  }

  public post(url, data) {
    return this._api.post(`${this._url}${url}`, data);
  }

  public conversationConfig: ConversationConfig = {
    conversationsGet: (query?: any) => {
      return this._api.get(`${this._url}conversations`, query);
    },
    conversationsStats: (query?: any) => {
      return of({});
    },
    conversationSave: (conversation: IConversation) => {
      return this.save('conversations', conversation)
        .pipe(
          map((response) => response.conversation),
        );
    },
    conversationDelete: (conversation: IConversation) => {
      return this.delete('conversations', conversation);
    },
    conversationItemsGet: (conversationId: number, query?: any) => {
      return this.get(`conversations/${conversationId}/items`, query);
    },
    conversationItemSave: (conversationItem: IConversationItem | IConversationItemMessage) => {
      return this.save(`conversations/${conversationItem.conversationId}/items`, conversationItem)
        .pipe(
          map((response) => response.conversationItem),
        );
    }, 
    conversationItemFilePost: (conversationItem: IConversationItem, file: Blob) => {
      return this.post(`conversations/${conversationItem.conversationId}/items/${conversationItem.id}/files`, { file });
    },
    conversationItemFileDownload: (conversationItem: IConversationItem, conversationItemFileId: number) => {
      console.log(`conversations/${conversationItem.conversationId}/items/${conversationItem.id}/files/${conversationItemFileId}/download`);
    },
    conversationParticipantsGet: (conversationId: number, query?: any) => {
      return this.get(`conversations/${conversationId}/participants`, query);
    },
    conversationParticipantSave: (conversationId: number, conversationParticipant: IConversationParticipant) => {
      return this.save(`conversations/${conversationId}/participants`, conversationParticipant)
        .pipe(
          map((response) => response.conversationParticipant),
        );
    },
    conversationParticipantDelete: (conversationId: number, conversationParticipant: IConversationParticipant) => {
      return this.delete(`conversations/${conversationId}/participants`, conversationParticipant);
    },
    conversationParticipantBulk: (conversationId: number, data: any) => {
      return of({});
    },
    accountsGet: (query?: any) => {
      return this.get('accounts', query);
    }
  }

}
