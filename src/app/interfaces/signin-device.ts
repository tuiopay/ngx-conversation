import { DeviceType, DeviceOs, DeviceBrowser } from '@firestitch/device';


export interface ISigninDevice {
  readonly id: number;
  type: DeviceType;
  osType: DeviceOs;
  osVersion: string;
  browserType: DeviceBrowser;
  browserVersion: string;
  userAgent: string;
}
