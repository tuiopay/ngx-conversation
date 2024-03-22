import {
  ChangeDetectionStrategy,
  Component,
  Input,
  TemplateRef,
} from '@angular/core';

import { Conversation } from '../../types';


@Component({
  selector: 'app-conversation-list-participants',
  templateUrl: './conversation-list-participants.component.html',
  styleUrls: ['./conversation-list-participants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationsListParticipantsComponent {

  @Input()
  public conversation: Conversation;

  @Input()
  public conversationsConversationNameTemplate: TemplateRef<any>;

  @Input()
  public hideLastConversationItemInfo: boolean;

  @Input()
  public size: number;

  constructor() { }


}
