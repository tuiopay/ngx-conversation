import { FsContentWidgetConfig } from '@firestitch/content-widget';
import { of } from 'rxjs';


export function contentWidgetConfigFactory(): FsContentWidgetConfig {
  return {
    fetchContentWidget: () => {
      return of('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet aliquet est, eget laoreet mauris volutpat et. Duis eleifend eleifend tempus. Sed aliquet dui vel justo scelerisque efficitur. Pellentesque ut vulputate diam, eu efficitur elit. Integer fermentum lobortis orci vel facilisis. Cras condimentum, orci eu cursus posuere, eros ipsum aliquam lacus, in auctor nunc dui ut risus.');
    }
  };
}
