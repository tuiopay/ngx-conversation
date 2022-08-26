import { Injectable, TemplateRef } from '@angular/core';
import { RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConversationConfig, Conversation, ConversationParticipant } from '../types';


@Injectable()
export class ConversationService {

  public conversationSettingTemplate: TemplateRef<any>;
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

}