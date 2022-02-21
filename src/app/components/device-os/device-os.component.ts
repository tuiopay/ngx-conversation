import { ChangeDetectionStrategy, Input, Component } from '@angular/core';

import { DeviceType } from '../../enums/device-type.enum';
import { DeviceOs } from '../../enums/device-os.enum';

import { DeviceOsIcons } from '../../consts/device-os-icons.const';
import { DeviceTypeIcons } from '../../consts/device-type-icons.const';


@Component({
  selector: 'fs-device-os',
  templateUrl: './device-os.component.html',
  styleUrls: [ './device-os.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsDeviceOsComponent {

  @Input()
  public type: DeviceType = null;

  @Input()
  public os: DeviceOs = null;

  @Input()
  public name: string = null;

  public DeviceOsIcons = DeviceOsIcons;
  public DeviceTypeIcons = DeviceTypeIcons;
  public DeviceType = DeviceType;

  constructor() { }

}
