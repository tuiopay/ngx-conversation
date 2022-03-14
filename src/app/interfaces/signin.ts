import { SigninState } from '../enums/signin-state.enum';
import { ISigninAccount } from './signin-account';
import { ISigninDevice } from './signin-device';
import { ISigninIp } from './signin-ip';


export interface ISignin {
  readonly id: number;
  account?: ISigninAccount;
  device?: ISigninDevice;
  ip?: ISigninIp;
  createDate?: Date;
  message?: string;
  email?: string;
  state: SigninState;
}
