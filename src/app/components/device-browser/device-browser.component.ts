import { ChangeDetectionStrategy, Input, Component } from '@angular/core';

import { Fs2FaBrowser } from '../../enums/browser.enum';


@Component({
  selector: 'fs-device-browser',
  templateUrl: './device-browser.component.html',
  styleUrls: [ './device-browser.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDeviceBrowserComponent {

  @Input()
  public type: Fs2FaBrowser = null;

  @Input()
  public version: string = null;

  @Input()
  public name: string = null;

  constructor() { }

}
