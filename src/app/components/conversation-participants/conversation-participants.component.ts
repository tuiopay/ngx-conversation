import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { IConversationParticipant } from '../../interfaces';


@Component({
  selector: 'app-conversation-participants',
  templateUrl: './conversation-participants.component.html',
  styleUrls: ['./conversation-participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationParticipantsComponent {

  @Input()
  public conversationParticipants: IConversationParticipant[] = [];

  @Input()
  public size = 24;

  @Input()
  public count = 0;

}
