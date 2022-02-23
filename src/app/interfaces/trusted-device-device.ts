import { DeviceType } from '../enums/device-type.enum';
import { DeviceBrowser } from '../enums/device-browser.enum';
import { DeviceOs } from '../enums/device-os.enum';


export interface ITrustedDeviceDevice {
  readonly id: number;
  type: DeviceType;
  osType: DeviceOs;
  osName: string;
  browserType: DeviceBrowser;
  browserVersion: string;
  browserName?: string;
  userAgent: string;
}
