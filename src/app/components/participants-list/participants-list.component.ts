import {
  Component,
  ViewChild,
  Inject,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsListComponent, FsListConfig } from '@firestitch/list';

import { Subject, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ParticipantsAddComponent } from '../participants-add';
import { IConversationParticipant } from '../../interfaces';
import { ConversationService } from '../../services';


@Component({
  templateUrl: './participants-list.component.html',
  styleUrls: ['./participants-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantsListComponent implements OnInit, OnDestroy {

  public conversationParticipants: IConversationParticipant[] = [];

  public listConfig: FsListConfig = null;

  @ViewChild(FsListComponent)
  private _list: FsListComponent = null;

  private _destroy$ = new Subject<void>();
  private _conversationService: ConversationService;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: {
      conversationParticipants: IConversationParticipant[];
      conversationId: number;
      conversationService: ConversationService,
    },
    private _dialog: MatDialog,
  ) { }

  public reload(): void {
    this._list.reload();
  }

  public ngOnInit(): void {
    this._conversationService = this._data.conversationService;
    this.conversationParticipants = this._data.conversationParticipants;

    this.listConfig = {
      paging: false,
      actions: [
        {
          click: () => {
            this._dialog.open(ParticipantsAddComponent, {
              data: {
                conversationParticipants: this.conversationParticipants,
                conversationId: this._data.conversationId,
                conversationService: this._conversationService,
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
            return this._conversationService.conversationConfig
              .conversationParticipantDelete(this._data.conversationId, conversationParticipant);
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

        return this._conversationService.conversationConfig.conversationParticipantsGet(this._data.conversationId, query)
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
