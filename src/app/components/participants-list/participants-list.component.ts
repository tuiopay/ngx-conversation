import {
  Component,
  ViewChild,
  Inject,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsListActionSelected, FsListComponent, FsListConfig } from '@firestitch/list';

import { Subject, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

import { ParticipantsAddComponent } from '../participants-add';
import { Conversation, ConversationParticipant } from '../../types';
import { ConversationService } from '../../services';
import { SelectionActionType } from '@firestitch/selection';
import { FsPrompt } from '@firestitch/prompt';


@Component({
  selector: 'app-participants-list',
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsListComponent implements OnInit, OnDestroy {

  @Input() public conversation: Conversation = null;
  @Input() public conversationService: ConversationService;

  public conversationParticipants: ConversationParticipant[] = [];

  public listConfig: FsListConfig = null;

  @ViewChild(FsListComponent)
  private _list: FsListComponent = null;

  private _destroy$ = new Subject<void>();

  constructor(
    private _dialog: MatDialog,
    private _prompt: FsPrompt,
  ) { }

  public reload(): void {
    this._list.reload();
  }

  public ngOnInit(): void {
    this.listConfig = {
      paging: false,
      actions: [
        {
          click: () => {
            this._dialog.open(ParticipantsAddComponent, {
              data: {
                conversationParticipants: this.conversationParticipants,
                conversation: this.conversation,
                conversationService: this.conversationService,
              },
            })
            .afterClosed()
              .pipe(
                filter((response) => !!response),
              )
              .subscribe(() => {
                this.reload();
              });
          },
          label: 'Add',
        },
      ],
      selection: {
        actions: [
          {
            name: 'remove',
            label: 'Remove',
            type: SelectionActionType.Action,
          },
        ],
        actionSelected: (actionSelected: FsListActionSelected) => {
          return of(true)
          .pipe(
            switchMap(() => actionSelected.action.name === 'remove' ?
              this._prompt.confirm({
                title: 'Remove Participants',
                template: 'Are you sure you want to remove these participants from this conversation?',
              }) : of(true)),
            switchMap(() => {
              const data = {
                action: actionSelected.action.name,
                conversationParticipantIds: actionSelected.selected
                  .map((conversationParticipant) => conversationParticipant.id),
              };

              return this.conversationService.conversationConfig
                .conversationParticipantBulk(this.conversation, data)
            }),
            tap(() => {
              this.reload();
            }),
          );
        },
        selectAll: false,
      },
      rowActions: [
        {
          click: (conversationParticipant) => {
            return this.conversationService.conversationConfig
              .conversationParticipantDelete(this.conversation, conversationParticipant)
              .pipe(tap((conversationParticipant) => {
                this.conversationService.sendMessageNotice(this.conversation.id);
              }));
          },
          remove: true,
          label: 'Remove',
        },
      ],
      fetch: (query) => {
        query = {
          ...query,
          accounts: true,
        };

        return this.conversationService.conversationConfig.conversationParticipantsGet(this.conversation, query)
        .pipe(
          map((response) => ({ data: response.conversationParticipants, paging: response.paging })),
        );
      },
    };
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
