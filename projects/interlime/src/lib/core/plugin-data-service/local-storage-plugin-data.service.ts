import {Injectable, OnInit,} from '@angular/core';
import {PluginDataService} from './plugin-data-service';
import {Observable, Subject} from 'rxjs';
import {startWith} from 'rxjs/operators';

@Injectable()
export class LocalStoragePluginDataService
  implements OnInit, PluginDataService {
  plugins: { [key: string]: Subject<any> } = {};

  constructor() {}

  ngOnInit(): void {}

  getPluginData$<T>(
    absoluteIdentifier: string,
    pluginId: string
  ): Observable<T | undefined> {
    const data = localStorage.getItem(
      this.getKey(absoluteIdentifier, pluginId)
    );
    return this.getOrSetPluginSubject(absoluteIdentifier, pluginId).pipe(
      startWith(data ? JSON.parse(data) : undefined)
    );
  }

  async setPluginData<T>(
    absoluteIdentifier: string,
    pluginId: string,
    data: T
  ) {
    const stringifiedData = JSON.stringify(data);

    this.getOrSetPluginSubject(absoluteIdentifier, pluginId).next(data);
    return localStorage.setItem(
      this.getKey(absoluteIdentifier, pluginId),
      stringifiedData
    );
  }

  getOrSetPluginSubject(absoluteIdentifier: string, pluginId: string) {
    const key = this.getKey(absoluteIdentifier, pluginId);
    const subjectOrUndefined = this.plugins[key];
    if (subjectOrUndefined) {
      return subjectOrUndefined;
    }
    this.plugins[key] = new Subject();
    return this.plugins[key];
  }

  private getKey(absoluteIdentifier: string, pluginId: string) {
    return `interlime:${absoluteIdentifier}:${pluginId}`;
  }
}
