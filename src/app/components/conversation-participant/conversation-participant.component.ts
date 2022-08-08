import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
} from '@angular/core';

import { ConversationParticipantType } from '../../enums';


@Component({
  selector: 'app-conversation-participant',
  templateUrl: './conversation-participant.component.html',
  styleUrls: ['./conversation-participant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationParticipantComponent implements OnInit {

  @Input() public conversationParticipant;
  @Input() public showName = false;
  @Input() public showBadge = false;
  @Input() public showTooltip = false;
  @Input() public size = 28;

  public name;
  public image;

  public ngOnInit(): void {
    if (this.conversationParticipant ?.type === ConversationParticipantType.Account) {
      this.name = this.conversationParticipant ?.account ?.name;
      this.image = this.conversationParticipant ?.account ?.image ?.tiny;
    }
  }

}
