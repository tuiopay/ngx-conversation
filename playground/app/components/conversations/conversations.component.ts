import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { FsConversationsComponent } from '@firestitch/conversation';
import { FsWebSocket } from '@firestitch/web-socket';

import { of } from 'rxjs';

import { accountData } from 'playground/app/data';
import { ConversationsApiService } from 'playground/app/services';
import { ConversationConfig } from 'src/app/types';


@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationsComponent {

  @ViewChild(FsConversationsComponent)
  public conversations: FsConversationsComponent;

  public account = accountData;

  public conversationConfig: ConversationConfig;

  constructor(
    private _conversationsService: ConversationsApiService,
    private _websocketService: FsWebSocket,
  ) {
    this.conversationConfig = {
      ...this._conversationsService.conversationConfig,
      tabs: false,
      // readConversation: {
      //   show: () => of(false),
      // },
      startConversation: {
        ...this._conversationsService.conversationConfig.startConversation,
        afterOpen: (conversation) => {
          const conversationPane = this.conversations.conversationPane;
          conversationPane.openSettings();

          return of(conversation);
        },
      },
      converstationsReloadInterval: 10000,
    };
  }
}
