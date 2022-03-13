import { ITrustedDeviceAccount } from './trusted-device-account';
import { ITrustedDeviceDevice } from './trusted-device-device';
import { ITrustedDeviceIp } from './trusted-device-ip';


export interface ITrustedDevice {
  readonly id: number;
  account: ITrustedDeviceAccount;
  device: ITrustedDeviceDevice;
  ip: ITrustedDeviceIp;
  activityDate: Date;
  createDate: Date;
  guid: string;
  state: 'active' | 'deleted';
}
