import { ChangeDetectionStrategy, Input, Component } from '@angular/core';

import { DeviceBrowser } from '../../enums/device-browser.enum';


@Component({
  selector: 'fs-device-browser',
  templateUrl: './device-browser.component.html',
  styleUrls: [ './device-browser.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDeviceBrowserComponent {

  @Input()
  public type: DeviceBrowser = null;

  @Input()
  public version: string = null;

  @Input()
  public name: string = null;

  constructor() { }

}
