import {
  Component, OnDestroy,
  ChangeDetectionStrategy, Input, Output, EventEmitter, 
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { list } from '@firestitch/common';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConversationStates } from '../../consts';
import { Account, Conversation } from '../../types';
import { ConversationService } from '../../services';
import { ParticipantsAddComponent } from '../participants-add';
import { ConversationSettingsComponent } from '../conversation-settings';
import { ConversationRole } from '../../enums';


@Component({
  selector: 'app-conversation-header',
  templateUrl: './conversation-header.component.html',
  styleUrls: ['./conversation-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationHeaderComponent implements OnDestroy {

  @Input() public conversation: Conversation = null;
  @Input() public conversationService: ConversationService;

  @Output() public conversationChange = new EventEmitter<Conversation>();

  public ConversationStates = ConversationStates;
  public conversationStates = list(ConversationStates, 'name', 'value');
  public account: Account;

  private _destroy$ = new Subject();

  constructor(
    private _dialog: MatDialog,    
  ) {}

  public get hasAdminConversationRole(): boolean {
    return this.conversation.accountConversationRoles.indexOf(ConversationRole.Admin) !== -1;
  }

  public participantAdd(): void {
    this._dialog.open(ParticipantsAddComponent, {
      data: {
        conversationId: this.conversation.id,
        conversationService: this.conversationService,
      },
    })
    .afterClosed()
    .subscribe(() => {
      this.conversationChange.emit();
    });
  }

  public settingsOpen(tab = 'settings'): void {
    this._dialog.open(ConversationSettingsComponent, {
      data: { 
        conversation: this.conversation,
        conversationService: this.conversationService,
        tab,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((conversation) => {
        this.conversation = {
          ...this.conversation,
          ...conversation,
        };

        this.conversationChange.emit();
      });
  }


  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
