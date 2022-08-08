import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';
import { IConversation } from '../../interfaces';

import { ConversationStates } from '../../consts';
import { index } from '@firestitch/common';


@Component({
  selector: 'app-conversation-state',
  templateUrl: './conversation-state.component.html',
  styleUrls: ['./conversation-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationStateComponent implements OnInit {

  @Input() public conversation: IConversation;

  public conversationState;
  public ConversationStates = index(ConversationStates, 'value');

  public ngOnInit(): void {
    this.conversationState = this.ConversationStates[this.conversation.state];
  }

}
