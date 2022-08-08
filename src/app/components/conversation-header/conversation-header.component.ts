import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, Input, Output, EventEmitter, 
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { list } from '@firestitch/common';
import { FsPrompt } from '@firestitch/prompt';

import { forkJoin, Observable, of, Subject, timer, iif } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

import { ConversationStates } from '../../consts';
import { Account, IConversation } from '../../interfaces';
import { ConversationService } from '../../services';
import { ParticipantsListComponent } from '../participants-list';
import { ParticipantsAddComponent } from '../participants-add';
import { ConversationSettingsComponent } from '../conversation-settings';


@Component({
  selector: 'app-conversation-header',
  templateUrl: './conversation-header.component.html',
  styleUrls: ['./conversation-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationHeaderComponent implements OnInit, OnDestroy {

  @Input() public conversation: IConversation = null;
  @Input() public conversationService: ConversationService;

  @Output() public participantsChanged = new EventEmitter();
  @Output() public conversationChange = new EventEmitter<IConversation>();

  public ConversationStates = ConversationStates;
  public conversationStates = list(ConversationStates, 'name', 'value');
  public account: Account;

  private _destroy$ = new Subject();

  constructor(
    private _dialog: MatDialog,    
  ) {}

  public ngOnInit(): void {
    
  }

  public openParticipants(): void {
    this._dialog.open(ParticipantsListComponent, {
      data: {
        conversationId: this.conversation.id,
        conversationService: this.conversationService,
      },
    })
      .afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.participantsChanged.emit();
      });
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
      this.participantsChanged.emit();
    });
  }

  public settingsOpen(): void {
    this._dialog.open(ConversationSettingsComponent, {
      data: { 
        conversation: this.conversation,
        conversationConfig: this.conversationService.conversationConfig,
      },
    })
      .afterClosed()
      .pipe(
        filter((conversation) => (!!conversation)),
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
