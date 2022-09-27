import { Injectable, TemplateRef } from '@angular/core';
import { RequestConfig } from '@firestitch/api';

import { Observable, of } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { ConversationConfig, Conversation, ConversationParticipant } from '../types';


@Injectable()
export class ConversationService {

  public conversationSettingTemplate: TemplateRef<any>;
  public conversationHeadingTemplate: TemplateRef<any>;
  public conversationConfig: ConversationConfig;


  public conversationGet(conversationId: number, query?: any, config?: RequestConfig): Observable<Conversation> {
    return this.conversationConfig.conversationsGet({
      ...query,
      conversationId,
    }, config)
      .pipe(
        map((response) => (response.conversations[0])),
      );
  }

  public conversationParticipantGet(conversationId: number, query?: any, config?: RequestConfig): Observable<ConversationParticipant> {
    return this.conversationConfig.conversationParticipantsGet(conversationId, {
      ...query,
    }, config)
      .pipe(
        map((response) => (response.conversationParticipants[0])),
      );
  }




  public hasWebSocketConnection(): boolean {
    return this.conversationConfig.websocketService() && this.conversationConfig.websocketService().isConnected();
  }


  public sendMessageNotice(conversationId: number, accountId: number): void {
    if (this.hasWebSocketConnection()) {
      this.sendTypingStopNotice(conversationId, accountId);
      this.conversationConfig.websocketService().send(`conversation/${conversationId}/message`);
    }
  }

  public sendTypingStartNotice(conversationId: number, accountId: number) {
    if (this.hasWebSocketConnection()) {
      this.conversationConfig.websocketService().send(`conversation/${conversationId}/typing`, {isTyping: true})
    }
  }

  public sendTypingStopNotice(conversationId: number, accountId: number): void {
    if (this.hasWebSocketConnection()) {
      this.conversationConfig.websocketService().send(`conversation/${conversationId}/typing`, {isTyping: false})
    }
  }


  public onUnreadNotice(accountId: number): Observable<any> {
    if (this.hasWebSocketConnection()) {
      return this.conversationConfig.websocketService().routeObservable(`account/${accountId}/unreadconversations`);
    } else {
      return of({});
    }
  }

  public onMessageNotice(conversationId: number): Observable<any> {
    if (this.hasWebSocketConnection()) {
      return this.conversationConfig.websocketService().routeObservable(`conversation/${conversationId}/message`);
    } else {
      return of({});
    }
  }

  public onTypingNotice(conversationId: number): Observable<any> {
    if (this.hasWebSocketConnection()) {
      return this.conversationConfig.websocketService().routeObservable(`conversation/${conversationId}/typing`);
    } else {
      return of({});
    }
  }

}