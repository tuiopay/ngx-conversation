import {
  Component,
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
  public set conversationParticipants(conversationParticipants: ConversationParticipant[]) {
    this._sort(conversationParticipants);
    this._conversationParticipants = conversationParticipants;
    this._init();
  }

  public get conversationParticipants(): ConversationParticipant[] {
    return this._conversationParticipants;
  }

  @Input()
  public size = 24;

  @Input()
  public count = 0;

  public others = 0;

  private _conversationParticipants: ConversationParticipant[] = [];

  private _init(): void {
    this.others = this.count - this.conversationParticipants.length;
  }

  private _sort(conversationParticipants: ConversationParticipant[]) {
    conversationParticipants
      .sort((a: ConversationParticipant, b: ConversationParticipant) => {
        const nameA = `${a.account?.firstName} ${a.account?.lastName}`;
        const nameB = `${b.account?.firstName} ${b.account?.lastName}`;

        return (nameA > nameB) ? 1 : ((nameB > nameA) ? -1 : 0);
      });
  }

}
