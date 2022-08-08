import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConversationConfig, IConversation } from '../interfaces';


@Injectable()
export class ConversationService {

  public conversationConfig: ConversationConfig;

  public conversationGet(conversationId: number, query?: any): Observable<IConversation> {
    return this.conversationConfig.conversationsGet({
      ...query,
      conversationId,
    })
      .pipe(
        map((response) => (response.conversations[0])),
      );
  }

}