import { Component, OnInit } from '@angular/core';
import { FsWebSocket } from '@firestitch/web-socket';
import { accountData} from 'playground/app/data';
import { ConversationsApiService } from 'playground/app/services';
import { ConversationConfig } from 'src/app/types';


@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent implements OnInit {

  public account = accountData

  public conversationConfig: ConversationConfig;

  public constructor(
    private _conversationsService: ConversationsApiService,
    private _websocketService: FsWebSocket,
  ) {
    this.conversationConfig = this._conversationsService.conversationConfig;
  }

  public ngOnInit(): void {
    //create web socket
    this._websocketService.connect();
  }
}
