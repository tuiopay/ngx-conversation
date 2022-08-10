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

import { FsListComponent, FsListConfig } from '@firestitch/list';

import { Subject, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ParticipantsAddComponent } from '../participants-add';
import { Conversation, ConversationParticipant } from '../../types';
import { ConversationService } from '../../services';


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
                conversationId: this.conversation.id,
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
      rowActions: [
        {
          click: (conversationParticipant) => {
            return this.conversationService.conversationConfig
              .conversationParticipantDelete(this.conversation.id, conversationParticipant);
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

        return this.conversationService.conversationConfig.conversationParticipantsGet(this.conversation.id, query)
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
