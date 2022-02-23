import { Component, OnInit } from '@angular/core';

import { ITrustedDevice, ITrustedDeviceAccount, DeviceType, DeviceBrowser, DeviceOs } from '@firestitch/2fa';
import { guid } from '@firestitch/common';

import { of } from 'rxjs';


@Component({
  selector: 'trusted-devices',
  templateUrl: './trusted-devices.component.html',
  styleUrls: ['./trusted-devices.component.scss']
})
export class TrustedDevicesComponent implements OnInit {

  public trustedDevices: ITrustedDevice[] = null;

  constructor() { }

  public ngOnInit(): void {
    this.trustedDevices = [
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
          osName: 'Windows',
          browserType: DeviceBrowser.Chrome,
          browserVersion: '1.0.0',
          browserName: 'Chrome',
          userAgent: 'Mozilla/5.0',
        },
        location: {
          id: Math.random(),
          isoCode: 'CA',
        },
        activityDate: new Date(),
        createDate: new Date(),
        guid: guid(),
        state: 'active',
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
          type: DeviceType.Phone,
          osType: DeviceOs.Android,
          osName: 'Android',
          browserType: DeviceBrowser.Android,
          browserName: 'Android',
          browserVersion: '1.0.0',
          userAgent: 'Mozilla/5.0',
        },
        location: {
          id: Math.random(),
          isoCode: 'CA',
        },
        activityDate: new Date(),
        createDate: new Date(),
        guid: guid(),
        state: 'active',
      },
    ];
  }

  public fetchTrustedDevices = (query) => {
    return of({
      data: this.trustedDevices,
    });
  }

  public removeTrustedDevice = (data) => {
    console.log('Removed', data);
    return of(data);
  }

  public signOutTrustedDevice = (data) => {
    console.log('Sign Out', data);
    return of(data);
  }

  public accountClick(account: ITrustedDeviceAccount): void {
    console.log(account);
  }

}
