import {
  Component,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
} from '@angular/core';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';

import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISignin } from '../../interfaces/signin';
import { ISigninAccount } from '../../interfaces/signin-account';
import { index } from '@firestitch/common';
import { SigninStates } from 'src/app/consts/signin-states.const';


@Component({
  selector: 'fs-signins',
  templateUrl: './signins.component.html',
  styleUrls: [ './signins.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsSigninsComponent implements OnInit, OnDestroy {

  @Input()
  public fetchSignins = (query: any) => new Observable<{
    data: ISignin[];
    paging?: any;
  }>();

  @ViewChild(FsListComponent)
  public listComponent: FsListComponent;

  public listConfig: FsListConfig;
  public SigninStates = index(SigninStates, 'value', 'name');

  private _destroy$ = new Subject();

  public ngOnInit(): void {
    this._initListConfig();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _initListConfig(): void {
    this.listConfig = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search',
        },
      ],
      fetch: (query) => {
        return this.fetchSignins(query)
          .pipe(
            map((response) => {
              return {
                data: response.data,
                paging: response.paging,
              };
            }),
          );
      },
    };
  }

}
