import { Injectable } from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsWebSocket } from '@firestitch/web-socket';

import { map } from 'rxjs/operators';

import { ConversationConfig, Conversation, ConversationItem, ConversationItemMessage, ConversationParticipant, Account } from 'src/app/types';


@Injectable({
  providedIn: 'root'
})
export class ConversationsApiService {

  private _url = 'https://tuiopay.local.firestitch.com/api/';

  public constructor(
    private _api: FsApi,
    private _websocketService: FsWebSocket,
  ) {
  }

  public save(url, data) {
    return data.id ? this._api.put(`${this._url}${url}/${data.id}`, data) : this._api.post(`${this._url}${url}`, data);
  }

  public delete(url, data) {
    return this._api.delete(`${this._url}${url}/${data.id}`, {});
  }

  public get(url, data = {}) {
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
      return this._api.get(`${this._url}conversations/stats`, query);;
    },
    conversationSave: (conversation: Conversation) => {
      return this.save('conversations', conversation)
        .pipe(
          map((response) => response.conversation),
        );
    },
    conversationDelete: (conversation: Conversation) => {
      return this.delete('conversations', conversation);
    },
    conversationRead: (conversation: Conversation, conversationItemId: number) => {
      return this.post(`conversations/${conversation.id}/read`, { conversationItemId });
    },
    conversationItemsGet: (conversationId: number, query?: any) => {
      return this.get(`conversations/${conversationId}/items`, query);
    },
    conversationItemSave: (conversationItem: ConversationItem | ConversationItemMessage) => {
      return this.save(`conversations/${conversationItem.conversationId}/items`, conversationItem)
        .pipe(
          map((response) => response.conversationItem),
        );
    },
    conversationItemDelete: (conversationItem: ConversationItem | ConversationItemMessage) => {
      return this.delete(`conversations/${conversationItem.conversationId}/items`, conversationItem)
        .pipe(
          map((response) => response.conversationItem),
        );
    },
    conversationItemFilePost: (conversationItem: ConversationItem, file: Blob) => {
      return this.post(`conversations/${conversationItem.conversationId}/items/${conversationItem.id}/files`, { file });
    },
    conversationItemFileDownload: (conversationItem: ConversationItem, conversationItemFileId: number) => {
      console.log(`conversations/${conversationItem.conversationId}/items/${conversationItem.id}/files/${conversationItemFileId}/download`);
    },
    conversationParticipantsGet: (conversationId: number, query?: any) => {
      return this.get(`conversations/${conversationId}/participants`, query);
    },
    conversationParticipantAdd: (conversationId: number, data) => {
      return this.post(`conversations/${conversationId}/participants`, data);
    },
    conversationParticipantSave: (conversationId: number, conversationParticipant: ConversationParticipant) => {
      return this.save(`conversations/${conversationId}/participants`, conversationParticipant)
        .pipe(
          map((response) => response.conversationParticipant),
        );
    },
    conversationParticipantSession: (conversationId: number) => {
      return this.get(`conversations/${conversationId}/participants/session`)
        .pipe(
          map((response) => response.conversationParticipant),
        );
    },
    conversationParticipantDelete: (conversationId: number, conversationParticipant: ConversationParticipant) => {
      return this.delete(`conversations/${conversationId}/participants`, conversationParticipant);
    },
    conversationParticipantBulk: (conversationId: number, data: any) => {
      return this.post(`conversations/${conversationId}/participants/bulk`, data);
    },
    accountsGet: (query?: any) => {
      return this.get('accounts', query);
    },
    websocketService: () => {
      return this._websocketService;
    }
  }

}
