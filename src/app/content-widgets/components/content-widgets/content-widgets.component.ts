import { Component, ViewChild, OnInit, OnDestroy, Input } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { FsContentWidgetComponent } from '../content-widget/content-widget.component';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';


@Component({
  selector: 'fs-content-widgets',
  templateUrl: './content-widgets.component.html',
  styleUrls: ['./content-widgets.component.scss'],
})
export class FsContentWidgetsComponent implements OnInit, OnDestroy {

  @Input() public fetchContentWidgets: (query?: string) => Observable<{ contentWigets: any[], paging?: any }>;
  @Input() public saveContentWidget: (contentWidget: any) => Observable<any>;
  @Input() public htmlEditorConfig: FsHtmlEditorConfig;

  @ViewChild(FsListComponent, { static: true })
  public list: FsListComponent;

  public config: FsListConfig = null;

  private _destroy$ = new Subject();

  constructor(
    private _dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
      ],
      fetch: (query) => {
        return this.fetchContentWidgets(query.keyword)
          .pipe(
            map((data: any) => ({ data: data.contentWidgets })),
          );
      },
    };
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public open(contentWidget): void {
    const dialogRef = this._dialog.open(FsContentWidgetComponent, {
      width: '90%',
      data: { 
        contentWidget,
        htmlEditorConfig: this.htmlEditorConfig,
        saveContentWidget: this.saveContentWidget,
      },
    });

    dialogRef.afterClosed()
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.list.reload();
      });
  }

}
