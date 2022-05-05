import { Observable } from "rxjs";

export interface FsContentWidgetConfig {
  fetchContentWidget: (tag: string) => Observable<string>;
}