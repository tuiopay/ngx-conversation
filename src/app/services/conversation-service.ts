import { Injectable, TemplateRef } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConversationConfig, Conversation } from '../types';


@Injectable()
export class ConversationService {

  public conversationSettingTemplate: TemplateRef<any>;
  public conversationConfig: ConversationConfig;

  public conversationGet(conversationId: number, query?: any): Observable<Conversation> {
    return this.conversationConfig.conversationsGet({
      ...query,
      conversationId,
    })
      .pipe(
        map((response) => (response.conversations[0])),
      );
  }

}