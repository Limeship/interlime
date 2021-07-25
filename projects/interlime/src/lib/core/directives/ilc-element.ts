import {Observable} from 'rxjs';
import {InjectionToken} from '@angular/core';

export const ILC_ELEMENT_TOKEN = new InjectionToken<IlcElement>(
  'Interlime Element'
);

export interface IlcElement {
  normalizedIdentifier$: Observable<string>;
  absoluteIdentifier$: Observable<string>;
  domElement?: HTMLElement;
  parent?: IlcElement;

  getPluginData$<T>(pluginId: string): Observable<T | undefined>;

  setPluginData<T>(pluginId: string, data: T): Promise<void>;

  registerChild(child: IlcElement): Promise<void>;

  unregisterChild(child: IlcElement): Promise<void>;
}

export function isIlcElement(something: any): something is IlcElement {
  return !!something.normalizedIdentifier$
    && !!something.absoluteIdentifier$
    && !!something.getPluginData$
    && !!something.setPluginData
    && !!something.registerChild
    && !!something.unregisterChild;
}
