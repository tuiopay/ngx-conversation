import {
  Component, OnInit, ViewChild,
  ChangeDetectionStrategy, OnDestroy, Input, ChangeDetectorRef, TemplateRef, Output, EventEmitter,
} from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsMessage } from '@firestitch/message';
import { format } from '@firestitch/date';

import { delay, filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Subject, of, timer } from 'rxjs';

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
  @Output() public conversationStarted = new EventEmitter<Conversation>();

  @ViewChild(FsListComponent)
  public listComponent: FsListComponent;
  
  public selectedConversation: Conversation;
  public listConfig: FsListConfig;
  public tab: 'account' | 'open' | 'closed' | string = 'account';
  public conversationsStats = {
    account: { count: 0, unread: 0 },
    open: { count: 0, unread: 0 },
    closed: { count: 0, unread: 0 },
  };

  private _destroy$ = new Subject<void>();
  private _converstationsReloadInterval;

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

  public deselect(): void {
    this.selectedConversation = null;
    this.listComponent.getData()
      .forEach((converstation) => {
        this.listComponent.updateData(converstation, (row) => row.id === converstation.id);
      });
  }

  public tabChange(tab): void {
    this.tab = tab;
    this.reload();
  }

  public initStatsReload(): void {
    timer(0, this._converstationsReloadInterval)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.loadStats();
      });
  }

  public initConverstationsReload(): void {
    timer(this._converstationsReloadInterval, this._converstationsReloadInterval)
      .pipe(
        filter(() => !this._conversationService.hasWebSocketConnection() && this.listComponent.list.paging.page === 1),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.reload();
      });
  }

  public ngOnInit(): void {
    this._converstationsReloadInterval = (this.conversationConfig.converstationsReloadInterval || 30) * 1000;
    this.initStatsReload();
    this.initConverstationsReload();

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
          this.selectedConversation = event.row;
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
          lastConversationItemConversationParticipantAccounts: true,
          lastConversationItemConversationParticipantAccountAvatars: true,
          recentConversationParticipants: true,
          recentConversationParticipantAccounts: true,
          recentConversationParticipantAccountAvatars: true,
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
        this.reload();
      }
    });
  }

  public conversationParticipantsChange(): void {
    this.reload();
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

    of(conversation)
    .pipe(
      switchMap((conversation) => this.conversationService.startConversation.beforeStart(conversation)),
      switchMap((conversation) => this.conversationConfig.conversationSave(conversation)),
      switchMap((conversation) => this.conversationService.startConversation.afterStart(conversation)),
      takeUntil(this._destroy$),
    )
      .subscribe((conversation) => {
        this._message.success('Saved Changes');
        this.reload();
        this.conversationStarted.emit(conversation);
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
