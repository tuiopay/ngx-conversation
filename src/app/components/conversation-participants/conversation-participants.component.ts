import {
  Component,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

import { ConversationParticipant } from '../../types';


@Component({
  selector: 'app-conversation-participants',
  templateUrl: './conversation-participants.component.html',
  styleUrls: ['./conversation-participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationParticipantsComponent {

  @Input()
  public conversationParticipants: ConversationParticipant[] = [];

  @Input()
  public size = 24;

  @Input()
  public count = 0;

}
