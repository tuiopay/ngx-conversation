import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'fs-device-browser',
  templateUrl: './device-browser.component.html',
  styleUrls: [ './device-browser.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDeviceBrowserComponent {

  constructor() { }

}
