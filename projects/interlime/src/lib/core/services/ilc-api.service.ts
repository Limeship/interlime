import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import {IlcElement, isIlcElement} from '../directives/ilc-element';
import {InteropIdentifier} from "../directives/models/identifier-like";

@Injectable({ providedIn: 'root' })
export class IlcApi {
  private _registry$ = new BehaviorSubject(new Map<string, IlcElement>());

  // TODO Refactor -> make it possible to use it without the IlcElement -> access store here directly
  resolvePluginData$<T>(id: InteropIdentifier, pluginId: string) {
    return this.getIlcElement$(id).pipe(
      filter((ilcElement) => !!ilcElement),
      switchMap((ilcElement) => ilcElement.getPluginData$<T>(pluginId))
    );
  }

  resolvePluginDatas$<T>(ids: InteropIdentifier[], pluginId: string) {
    return combineLatest(ids.map(id => this.resolvePluginData$<T>(id, pluginId)));
  }

  setPluginData<T>(id: InteropIdentifier, pluginId: string, data: T) {
    return this.getIlcElement$(id).pipe(
      filter((ilcElement) => !!ilcElement),
      tap((ilcElement) => ilcElement.setPluginData(pluginId, data))
    );
  }

  getAbsoluteId$(id: InteropIdentifier) {
    if (Array.isArray(id)) {
      return of(id.join('/'));
    }
    if (isIlcElement(id)) {
      return id.absoluteIdentifier$.pipe(first());
    }
    return of(id);
  }

  getAbsoluteIds$(ids: InteropIdentifier[]) {
    return combineLatest(ids.map((id) => this.getAbsoluteId$(id)));
  }

  getIlcElement$(id: InteropIdentifier): Observable<IlcElement> {
    return combineLatest([this.getAbsoluteId$(id), this._registry$]).pipe(
      map(([id, registry]) => registry.get(id)),
      filter((ilcElement) => !!ilcElement),
      first()
    );
  }

  getIlcElements$(ids: InteropIdentifier[]) {
    return combineLatest(ids.map((id) => this.getIlcElement$(id))).pipe(
      first()
    );
  }

  getDomElement$(id: InteropIdentifier): Observable<HTMLElement> {
    return combineLatest([this.getAbsoluteId$(id), this._registry$]).pipe(
      map(([absoluteId, registry]) => registry.get(absoluteId)),
      filter((iclElement) => !!iclElement),
      map((iclElement) => iclElement.domElement),
      first()
    );
  }

  getDomElements$(ids: InteropIdentifier[]): Observable<HTMLElement[]> {
    return combineLatest(ids.map((id) => this.getDomElement$(id))).pipe(
      first()
    );
  }

  /** Used by Directives / mapped-ui-element-directive */
  register(id: InteropIdentifier, element: IlcElement) {
    combineLatest([this.getAbsoluteId$(id), this._registry$]).pipe(
      first(),
      map(([id, registry]) => {
        registry.set(id, element);
        this._registry$.next(registry);
      })
    ).subscribe();
  }

  /** Used by Directives / mapped-ui-element-directive */
  unregister(id: InteropIdentifier) {
    combineLatest([this.getAbsoluteId$(id), this._registry$]).pipe(
      first(),
      map(([id, registry]) => {
        registry.delete(id);
        this._registry$.next(registry);
      })
    ).subscribe();
  }
}
