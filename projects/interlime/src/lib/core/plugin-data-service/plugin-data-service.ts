import { InjectionToken } from '@angular/core';
import { LocalStoragePluginDataService } from './local-storage-plugin-data.service';
import { Observable } from 'rxjs';

export const PLUGIN_DATA_SERVICE = new InjectionToken<
  LocalStoragePluginDataService
>('Plugin Data Service');

export interface PluginDataService {
  getPluginData$<T>(
    absoluteIdentifier: string,
    pluginId: string
  ): Observable<T | undefined>;

  setPluginData<T>(absoluteIdentifier: string, pluginId: string, data: T): Promise<void>;
}
