import {
  Component,
  ChangeDetectionStrategy,
  Input,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { ConversationService } from '../../services';
import { Account, ConversationItem, ConversationParticipant } from '../../types';


@Component({
  selector: 'app-conversation-read-participants-popover',
  templateUrl: './conversation-read-participants-popover.component.html',
  styleUrls: ['./conversation-read-participants-popover.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationReadParticipantsPopoverComponent implements OnInit {

  @Input() public conversationItem: ConversationItem;
  @Input() public conversationService: ConversationService;
  @Input() public account: Account;

  public conversationParticipants: ConversationParticipant[];

  public constructor(
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.conversationService.conversationConfig
      .conversationParticipantsGet(this.conversationItem.conversationId, {
        maxReadConversationItemId: this.conversationItem.id,
        limit: 5,
        notConversationParticipantId: this.conversationItem.conversationParticipantId,
        accounts: true,
      })
      .subscribe((response) => {
        this.conversationParticipants = response.conversationParticipants;
        this._cdRef.markForCheck();
      });
  }


}
