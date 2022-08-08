import { Component } from '@angular/core';
import { accountData} from 'playground/app/data';
import { ConversationsApiService } from 'playground/app/services';
import { ConversationConfig } from 'src/app/interfaces';


@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.scss']
})
export class ConversationsComponent {
  
  public account = accountData

  public conversationConfig: ConversationConfig;

  public constructor(
    private _conversationsService: ConversationsApiService,
  ) {
    this.conversationConfig = _conversationsService.conversationConfig;
  }

}
