import { ChangeDetectionStrategy, Component, Input } from '@angular/core';


@Component({
  selector: 'fs-clipboard-button',
  templateUrl: './clipboard-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsClipboardButtonComponent {

  @Input() public content: string | (() => string) | HTMLElement;

}
