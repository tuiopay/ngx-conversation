import { Component } from '@angular/core';

import { DeviceBrowser } from '@firestitch/2fa';

@Component({
  selector: 'device-browser',
  templateUrl: './device-browser.component.html',
  styleUrls: ['./device-browser.component.scss']
})
export class DeviceBrowserComponent {

  public DeviceBrowser = DeviceBrowser;

  constructor() { }
}
