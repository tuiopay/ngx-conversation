import { Component, OnInit } from '@angular/core';

import { ISignin, SigninState } from '@firestitch/signin';
import { DeviceType, DeviceBrowser, DeviceOs } from '@firestitch/device';

import { of } from 'rxjs';


@Component({
  selector: 'app-signins',
  templateUrl: './signins.component.html',
  styleUrls: ['./signins.component.scss']
})
export class SigninsComponent implements OnInit {

  public signins: ISignin[] = null;

  constructor() { }

  public ngOnInit(): void {
    this.signins = [
      {
        id: Math.random(),
        account: {
          id: Math.random(),
          name: 'John Doe',
          email: 'test@gmail.com',
          avatarUrl: 'https://randomuser.me/api/portraits/men/10.jpg',
        },
        device: {
          id: Math.random(),
          type: DeviceType.Desktop,
          osType: DeviceOs.Windows,
          osVersion: '10.0',
          browserType: DeviceBrowser.Chrome,
          browserVersion: '1.0.0',
          userAgent: 'Mozilla/5.0',
        },
        ip: {
          id: Math.random(),
          country: 'CA',
          ip: '124.22.52.112',
          region: 'Ontario'
        },
        createDate: new Date(),
        state: SigninState.Failure,
        email: 'admin@admin.com',
        message: 'The password does not match the account\'s password.'
      },
      {
        id: Math.random(),
        account: {
          id: Math.random(),
          name: 'Jane Doe',
          email: 'test2@gmail.com',
          avatarUrl: 'https://randomuser.me/api/portraits/women/30.jpg',
        },
        device: {
          id: Math.random(),
          type: DeviceType.Mobile,
          osType: DeviceOs.Android,
          osVersion: '10.0',
          browserType: DeviceBrowser.Android,
          browserVersion: '1.0.0',
          userAgent: 'Mozilla/5.0',
        },
        ip: {
          id: Math.random(),
          country: 'CA',
          ip: '124.22.52.112',
          region: 'Ontario'
        },
        email: 'admin@admin.com',
        createDate: new Date(),
        state: SigninState.Success,
      },
    ];
  }

  public fetchSignins = (query) => {
    return of({
      data: this.signins,
    });
  }

}
