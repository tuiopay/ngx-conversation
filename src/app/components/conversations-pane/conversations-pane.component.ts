import {
  Component, OnInit, ViewChild,
  ChangeDetectionStrategy, OnDestroy, Input, ChangeDetectorRef, TemplateRef, Output, EventEmitter,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';
import { format } from '@firestitch/date';

import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';

import { ConversationCreateComponent } from '../conversation-create';
import { ConversationConfig, Conversation } from '../../types';
import { ConversationRole, ConversationState } from '../../enums';
import { ConversationService } from '../../services';
import { ItemType } from '@firestitch/filter';


@Component({
  selector: 'app-conversations-pane',
  templateUrl: './conversations-pane.component.html',
  styleUrls: ['./conversations-pane.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationsPaneComponent implements OnInit, OnDestroy {
  
  @Input() public conversationHeadingTemplate: TemplateRef<any>;
  @Input() public conversationSettingTemplate: TemplateRef<any>;
  @Input() public conversationColumnTemplate: TemplateRef<any>;
  @Input() public account;

  @Output() public conversationOpen = new EventEmitter<Conversation>();

  @ViewChild(FsListComponent)
  public listComponent: FsListComponent;

  public listConfig: FsListConfig;
  public tab: 'account' | 'open' | 'closed' | string = 'account';
  public conversationsStats = {
    account: { count: 0, unread: 0 },
    open: { count: 0, unread: 0 },
    closed: { count: 0, unread: 0 },
  };

  private _destroy$ = new Subject<void>();

  constructor(
    private _dialog: MatDialog,
    private _message: FsMessage,
    private _conversationService: ConversationService,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public get conversationConfig(): ConversationConfig {
    return this._conversationService.conversationConfig;
  }

  public get conversationService(): ConversationService {
    return this._conversationService;
  }

  public reload(): void {
    this.listComponent.reload();
  }

  public ngOnInit(): void {
    timer(15000, 15000)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        if (!this._conversationService.hasWebSocketConnection()) {
          if (this.listComponent.list.paging.page === 1) {
            this.reload();
          }
        }
        
        this.loadStats();
      });


    this.loadStats();
    this.listConfig = {
      status: false,
      loadMore: true,
      queryParam: false,
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
      ],
      rowEvents: {
        click: (event) => {
          this.conversationOpen.emit(event.row);
        },
      },
      noResults: {
        message: 'No conversations found',
      },
      actions: [
        {
          label: 'Start',
          disabled: () => {
            return this.conversationService.startConversation.disabled;
          },
          show: () => {
            return this.conversationService.startConversation.show;
          },
          click: () => {
            this.conversationStart();
          },
        }
      ],
      rowActions: [
        {
          click: (conversation) => {
            return this.conversationConfig.conversationSave({
              id: conversation.id,
              state: ConversationState.Closed,
            })
            .pipe(
              tap(() => this.loadStats()),
            );
          },
          show: (conversation) => {
            return conversation.accountConversationRoles
              .indexOf(ConversationRole.Admin) !== -1 && conversation.state === ConversationState.Open;
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to close this conversation?',
          },
          label: 'Close',
        },
        {
          click: (data) => {
            return this.conversationConfig.conversationDelete(data);
          },
          show: (conversation) => {
            return conversation.accountConversationRoles.indexOf(ConversationRole.Admin) !== -1;
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this conversation?',
          },
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        query = {
          ...query,
          lastConversationItems: true,
          lastConversationItemConversationParticipants: true,
          lastConversationItemConversationParticipantsAccounts: true,
          unreads: true,
          accountConversationRoles: true,
          conversationParticipantCounts: true,
          lastConversationItemFiles: true,
          order: 'unread,desc;activityDate,desc',
        };

        switch (this.tab) {
          case 'account':
            query.conversationParticipantAccountId = this.account.id;
            break;

          case 'closed':
            query.state = ConversationState.Closed;
            break;

          case 'open':
            query.state = ConversationState.Open;
            break;
        }

        return this.conversationConfig.conversationsGet(query)
          .pipe(
            tap(() => {
              this.loadStats();
            }),
            map((response) => {
              return {
                data: response.conversations
                .map((conversation) => {
                  return {
                    ...conversation,
                  };
                }), paging: response.paging
              };
            }),
          );
      },
    };

    // when notified that user has conversation updates then reload stuff
    this._conversationService.onUnreadNotice(this.account.id)
    .subscribe(() => {
      if (this.listComponent) {
        this.listComponent.reload();
      }
    });
  }

  public conversationParticipantsChange(): void {
    this.listComponent.reload();
  }

  public loadStats(): void {
    const statsFilters: any = {
      account: true,
      open: true,
      closed: true,
    };

    this.conversationConfig.conversationsStats(statsFilters)
      .subscribe((conversationsStats) => {
        this.conversationsStats = conversationsStats;
        this._cdRef.markForCheck();
      });
  }

  public conversationCreate(conversation: Conversation = { id: null }): void {
    const dialogRef = this._dialog.open(ConversationCreateComponent, {
      autoFocus: true,
      data: { conversation },
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((response) => !!response),
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.reload();
        this.conversationOpen.emit(response);
      });
  }

  public conversationStart(conversation: Conversation = {}): void {
    conversation = {
      ...conversation,
      name: format(new Date()),
    };

    this.conversationConfig.conversationSave(conversation)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this._message.success('Saved Changes');
        this.listComponent.reload();
        this.conversationOpen.emit(response);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
