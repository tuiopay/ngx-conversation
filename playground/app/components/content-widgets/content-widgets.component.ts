import { Component, OnInit } from '@angular/core';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { of } from 'rxjs';


@Component({
  selector: 'app-content-widgets',
  templateUrl: './content-widgets.component.html',
  styleUrls: ['./content-widgets.component.scss']
})
export class ContentWidgetsComponent implements OnInit {

  public contentWidgets: any[] = null;
  public htmlEditorConfig: FsHtmlEditorConfig;

  constructor() { }

  public ngOnInit(): void {
    this.contentWidgets = [
        {
          "id": 9,
          "tag": "approved_content",
          "name": "Approval Client: Approved Content",
          "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet aliquet est, eget laoreet mauris volutpat et. Duis eleifend eleifend tempus. Sed aliquet dui vel justo scelerisque efficitur. Pellentesque ut vulputate diam, eu efficitur elit. Integer fermentum lobortis orci vel facilisis. Cras condimentum, orci eu cursus posuere, eros ipsum aliquam lacus, in auctor nunc dui ut risus.",
          "modifiedDate": "2022-04-01T18:07:23+00:00",
          "styles": null,
          "class": null
        },
        {
          "id": 8,
          "tag": "terms",
          "name": "Terms & Conditions: Agreement",
          "content": "<ol><li>Customer Name: {$clientAccountName}</li><li>Billing Address: {$clientAccountAddress}</li><li>Payment Terms: {$paymentTerms}</li><li>Interest On Overdue Invoices: {$overdueInterest}</li><li>Service Location: {$serviceLocation}</li><li>Start Date: {$startDate}</li><li>End Date: {$endDate}</li><li>Termination Terms: {$terminationTerms}</li><li>Additional Terms &amp; Conditions: {$additionalTerms}</li><li>Undersigned: {$undersignedName}</li><li>Undersigned Email: {$undersignedEmail}</li><li>Create Date: {$createDate}</li></ol>",
          "modifiedDate": "2022-05-03T19:43:51+00:00",
          "styles": null,
          "class": null
      }
    ];

    this.htmlEditorConfig = {
      froalaConfig: {
      }
    };
  }

  public saveContentWidget = (contentWidget) => {
    console.log('Save', contentWidget);
    return of(contentWidget);
  }

  public fetchContentWidgets = (query) => {
    return of({
      contentWidgets: this.contentWidgets,
    });
  }

}
