import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';

import { ConversationParticipant } from '../../types';


@Component({
  selector: 'app-conversation-participants',
  templateUrl: './conversation-participants.component.html',
  styleUrls: ['./conversation-participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationParticipantsComponent implements OnInit {

  @Input()
  public conversationParticipants: ConversationParticipant[] = [];

  @Input()
  public size = 24;

  @Input()
  public count = 0;

  public others = 0;

  public ngOnInit(): void {
    this.others = this.count - this.conversationParticipants.length;
  }

}
