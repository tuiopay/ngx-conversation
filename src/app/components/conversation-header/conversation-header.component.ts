import {
  Component, OnDestroy,
  ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit, 
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { list } from '@firestitch/common';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConversationStates } from '../../consts';
import { Account, Conversation } from '../../types';
import { ConversationService } from '../../services';
import { ParticipantsAddComponent } from '../participants-add';
import { ConversationSettingsComponent } from '../conversation-settings';
import { ConversationRole, ConversationItemState } from '../../enums';
import { FilterConfig, ItemType } from '@firestitch/filter';


@Component({
  selector: 'app-conversation-header',
  templateUrl: './conversation-header.component.html',
  styleUrls: ['./conversation-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationHeaderComponent implements OnDestroy, OnInit {

  @Input() public conversation: Conversation = null;
  @Input() public conversationService: ConversationService;

  @Output() public conversationChange = new EventEmitter<Conversation>();
  @Output() public filterChanged = new EventEmitter<{ query: any, sort: any }>();

  public ConversationStates = ConversationStates;
  public conversationStates = list(ConversationStates, 'name', 'value');
  public account: Account;
  public filterConf: FilterConfig;

  private _destroy$ = new Subject();

  constructor(
    private _dialog: MatDialog,    
  ) {}

  public ngOnInit(): void {
    this.filterConf = {
      persist: false,
      inline: false,
      chips: false,
      button: {
        style: 'icon',
        label: '',
      },
      change: (query, sort) => {
        this.filterChanged.emit({ query, sort });
      },
      items: [
        {
          name: 'state',
          type: ItemType.Checkbox,
          label: 'Show Deleted',
          unchecked: ConversationItemState.Active,
          checked: [
            ConversationItemState.Deleted,
            ConversationItemState.Active
          ].join(','),
        },
      ],
    };
  }

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
