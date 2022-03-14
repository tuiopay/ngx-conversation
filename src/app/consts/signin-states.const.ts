import { SigninState } from '../enums/signin-state.enum';

export const SigninStates = [
  { name: 'Success', value: SigninState.Success },
  { name: 'Failure', value: SigninState.Failure },
  { name: 'Reset', value: SigninState.Reset },
  { name: 'Verification Request', value: SigninState.Verification },
];
