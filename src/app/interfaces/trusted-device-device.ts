import { DeviceType, DeviceOs, DeviceBrowser } from '@firestitch/device';


export interface ITrustedDeviceDevice {
  readonly id: number;
  type: DeviceType;
  osType: DeviceOs;
  osVersion: string;
  browserType: DeviceBrowser;
  browserVersion: string;
  userAgent: string;
}
