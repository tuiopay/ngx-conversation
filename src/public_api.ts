/*
 * Public API Surface of fs-2fa
 */

export { Fs2FaModule } from './app/fs-2fa.module';

export { FsDeviceBrowserComponent } from './app/components/device-browser/device-browser.component';
export { FsDeviceOsComponent } from './app/components/device-os/device-os.component';

export { DeviceBrowser } from './app/enums/device-browser.enum';
export { DeviceOs } from './app/enums/device-os.enum';
export { DeviceType } from './app/enums/device-type.enum';

export { ITrustedDevice } from './app/interfaces/trusted-device';
export { ITrustedDeviceAccount } from './app/interfaces/trusted-device-account';
export { ITrustedDeviceDevice } from './app/interfaces/trusted-device-device';
export { ITrustedDeviceIp } from './app/interfaces/trusted-device-ip';
