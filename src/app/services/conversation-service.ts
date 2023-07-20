import { Injectable, TemplateRef } from '@angular/core';
import { RequestConfig } from '@firestitch/api';

import { forkJoin, Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { ConversationConfig, Conversation, ConversationParticipant, Account } from '../types';
import { FsGalleryItem } from '@firestitch/gallery';


@Injectable()
export class ConversationService {

  public conversationSettingTemplate: TemplateRef<any>;
  public conversationHeadingTemplate: TemplateRef<any>;
  public inited = false;
  public startConversation: {
    disabled?: boolean,
    show?: boolean,
    tooltip?: string,
    beforeStart?: (conversation: Conversation) => Observable<Conversation>,
    afterStart?: (conversation: Conversation) => Observable<Conversation>,
  } = {
    disabled: false,
    show: true,
    tooltip: '',
  };

  public leaveConverstation: {
    show?: boolean,
  };

  private _conversationConfig: ConversationConfig;

  public get conversationConfig(): ConversationConfig {
    return this._conversationConfig;
  }

  public set conversationConfig(conversationConfig: ConversationConfig) {
    this._conversationConfig = {
      ...conversationConfig,
    };
  }

  public conversationGet(conversationId: number, query?: any, config?: RequestConfig): Observable<Conversation> {
    return this.conversationConfig.conversationsGet({
      ...query,
      conversationId,
    }, config)
      .pipe(
        map((response) => (response.conversations[0])),
      );
  }

  public conversationParticipantGet(
    conversation: Conversation,
    query?: any,
    config?: RequestConfig
  ): Observable<ConversationParticipant> {
    return this.conversationConfig.conversationParticipantsGet(conversation, {
      ...query,
    }, config)
      .pipe(
        map((response) => (response.conversationParticipants[0])),
      );
  }

  public initStartConversation(): Observable<any> {
    const leaveConversation = this.conversationConfig.leaveConversation || {};
    const leaveConversationShow = leaveConversation.show ? leaveConversation.show() : undefined;

    const startConversation = this.conversationConfig.startConversation || {};
    const startConversationShow = startConversation.show ? startConversation.show() : undefined;
    const startConversationDisabled = startConversation.disabled ? startConversation.disabled() : undefined;
    const startConversationTooltip = startConversation.tooltip ? startConversation.tooltip() : undefined;

    const configs$: {
      startConversationShow?: Observable<boolean>,
      startConversationDisabled?: Observable<boolean>,
      startConversationTooltip?: Observable<string>,
      leaveConversationShow?: Observable<boolean>,
      dummy?: Observable<boolean>,
    } = {
      startConversationShow: startConversationShow instanceof Observable ? startConversationShow : of(startConversationShow),
      startConversationDisabled: startConversationDisabled instanceof Observable ? startConversationDisabled : of(startConversationDisabled),
      startConversationTooltip: startConversationTooltip instanceof Observable ? startConversationTooltip : of(startConversationTooltip),
      leaveConversationShow: leaveConversationShow instanceof Observable ? leaveConversationShow : of(leaveConversationShow),
      dummy: of(true),
    };

    return forkJoin(configs$)
      .pipe(
        filter((config: any) => config.show ?? true),
        tap((config) => {
          this.startConversation = {
            show: config.startConversationShow ?? true,
            disabled: config.startConversationDisabled ?? false,
            tooltip: config.startConversationTooltip,
            beforeStart: startConversation.beforeStart instanceof Observable ? startConversation.beforeStart : (conversation) => of(conversation),
            afterStart: startConversation.afterStart instanceof Observable ? startConversation.afterStart : (conversation) => of(conversation),            
          };

          this.leaveConverstation = {
            show: config.leaveConversationShow,
          }
        }),
      )
      .pipe(
        tap(() => this.inited = true),
      );
  }

  public hasWebSocketConnection(): boolean {
    return this.conversationConfig.websocketService() && this.conversationConfig.websocketService().isConnected();
  }

  public sendMessageNotice(conversationId: number, accountId: number = null): void {
    if (this.hasWebSocketConnection()) {
      if(accountId)
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

  public mapAccount(account): Account {
    return this._conversationConfig.mapAccount ? this._conversationConfig.mapAccount(account) : account;
  }

  public mapGalleryItem(conversationItemFile): FsGalleryItem {
    return this._conversationConfig.mapGalleryItem ? this._conversationConfig.mapGalleryItem(conversationItemFile) : conversationItemFile;
  }

  public onUnreadNotice(accountId: number): Observable<any> {
    if (!this.conversationConfig.websocketService()) {
      return of();
    }
    
    return this.conversationConfig.websocketService().routeObservable(`account/${accountId}/unreadconversations`);
  }

  public onMessageNotice(conversationId: number): Observable<any> {
    if (!this.conversationConfig.websocketService()) {
      return of();
    } 

    return this.conversationConfig.websocketService().routeObservable(`conversation/${conversationId}/message`);
  }

  public onTypingNotice(conversationId: number): Observable<any> {
    if (!this.conversationConfig.websocketService()) {
      return of();
    }

    return this.conversationConfig.websocketService().routeObservable(`conversation/${conversationId}/typing`);
  }

}
