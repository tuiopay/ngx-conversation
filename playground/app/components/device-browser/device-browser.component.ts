import { Component } from '@angular/core';

import { Fs2FaBrowser } from '@firestitch/2fa';

@Component({
  selector: 'device-browser',
  templateUrl: './device-browser.component.html',
  styleUrls: ['./device-browser.component.scss']
})
export class DeviceBrowserComponent {

  public Fs2FaBrowser = Fs2FaBrowser;

  constructor() { }
}
