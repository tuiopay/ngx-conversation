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
import { FsCountry } from '@firestitch/country';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { ITrustedDevice } from '../../interfaces/trusted-device';
import { ITrustedDeviceAccount } from '../../interfaces/trusted-device-account';


@Component({
  selector: 'fs-trusted-devices',
  templateUrl: './trusted-devices.component.html',
  styleUrls: [ './trusted-devices.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsTrustedDevicesComponent implements OnInit, OnDestroy {

  @Input()
  public fetchTrustedDevices = (query: any) => new Observable<{
    data: ITrustedDevice[];
    paging?: any;
  }>();

  @Input()
  public removeTrustedDevice = (trustedDevice: ITrustedDevice) => new Observable<any>();

  @Input()
  public signOutTrustedDevice = (trustedDevice:  ITrustedDevice) => new Observable<any>();

  @Input()
  public currentDeviceGuid: string = null;

  @Output()
  public accountClick: EventEmitter<ITrustedDeviceAccount> = new EventEmitter< ITrustedDeviceAccount>();

  @ViewChild(FsListComponent)
  public listComponent: FsListComponent;

  public listConfig: FsListConfig;

  private _destroy$ = new Subject();

  constructor(
    private _fsCountry: FsCountry,
  ) { }

  public ngOnInit(): void {
    this._fsCountry.ready$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._initListConfig();
      });
  }

  public accountClicked(account: ITrustedDeviceAccount): void {
    this.accountClick.emit(account);
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
      rowActions: [
        {
          click: (data) => {
            return this.signOutTrustedDevice(data);
          },
          menu: true,
          label: 'Sign Out',
        },
        {
          click: (data) => {
            return this.removeTrustedDevice(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
          },
          menu: true,
          label: 'Delete',
        },
      ],
      fetch: (query) => {
        return this.fetchTrustedDevices(query)
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
