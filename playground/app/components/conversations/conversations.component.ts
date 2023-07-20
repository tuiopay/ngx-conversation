import { Component, OnInit, ViewChild } from '@angular/core';
import { FsConversationsComponent } from '@firestitch/conversation';
import { FsWebSocket } from '@firestitch/web-socket';
import { accountData} from 'playground/app/data';
import { ConversationsApiService } from 'playground/app/services';
import { of } from 'rxjs';

import { ConversationConfig } from 'src/app/types';


@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {

  @ViewChild(FsConversationsComponent)
  public conversations: FsConversationsComponent;

  public account = accountData

  public conversationConfig: ConversationConfig;

  public constructor(
    private _conversationsService: ConversationsApiService,
    private _websocketService: FsWebSocket,
  ) {
    this.conversationConfig = {
      ...this._conversationsService.conversationConfig,
      startConversation: {
        ...this._conversationsService.conversationConfig.startConversation,
        afterOpen: (conversation) => {
          const conversationPane = this.conversations.conversationPane;
          conversationPane.openSettings();

          return of(conversation);
        }
      }
    };
  }

  public ngOnInit(): void {

    // setTimeout(() => {
    //   // create web socket
    //   this._websocketService
    //     .setPort(9501)
    //     .connect();
    // }, 2000);
  }
}
