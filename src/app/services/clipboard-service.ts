import { Injectable } from '@angular/core';

import { FsMessage } from '@firestitch/message';


@Injectable({
  providedIn: 'root',
})
export class FsClipboard {

  public constructor(
    private _message: FsMessage,
  ) {}

  public copy(data, options: { showMessage?: boolean } = { showMessage: true}): Promise<void> {
    return new Promise((resolve, reject) => {
      navigator.clipboard.writeText(data)
      .then(() => {
        if(options.showMessage === true || options.showMessage === undefined) {
          this._message.success('Copied to clipboard');
        }

        resolve();
      }, (e) => {
        this._message.error('Failed to copy to clipboard');
        reject();
      });
    });
  }



}