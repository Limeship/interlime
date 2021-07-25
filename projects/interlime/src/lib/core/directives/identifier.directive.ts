import {Directive, ElementRef, Inject, Input, OnDestroy, OnInit, Optional, SkipSelf,} from '@angular/core';
import {Observable, ReplaySubject, zip} from 'rxjs';
import {first, map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {PLUGIN_DATA_SERVICE, PluginDataService,} from '../plugin-data-service/plugin-data-service';
import {IlcApi} from '../services/public-api';
import {ILC_ELEMENT_TOKEN, IlcElement} from './ilc-element';

@Directive({
  selector: '[il-identifier]',
  providers: [
    {
      provide: ILC_ELEMENT_TOKEN,
      useExisting: IdentifierDirective,
    },
  ],
})
export class IdentifierDirective implements OnInit, OnDestroy, IlcElement {
  children$: Observable<IlcElement[]>;
  // @ts-ignore
  absoluteIdentifier$: Observable<string>;
  // flatChildren$: Observable<IlcElement[]>;
  // @ts-ignore
  normalizedIdentifier$: Observable<string>;
  domElement?: HTMLElement;
  private children = new ReplaySubject<IlcElement[]>(1);

  constructor(
    elementRef: ElementRef,
    private ilcApi: IlcApi,
    @Inject(PLUGIN_DATA_SERVICE) private pluginDataService: PluginDataService,
    @Inject(ILC_ELEMENT_TOKEN)
    @Optional()
    @SkipSelf()
    public parent?: IlcElement
  ) {
    this.domElement = elementRef.nativeElement;
    this.children$ = this.children.asObservable();
    this.setupNormalizedIdentifier$();
    this.setupAbsoluteIdentifier$();
    this.setupFlatChildren$();
  }

  private _identifier = new ReplaySubject<string | string[]>(1);

  @Input('il-identifier')
  set identifier(identifier: string | string[]) {
    this._identifier.next(identifier);
    this._identifier.complete();
  }

  getPluginData$<T>(pluginId: string): Observable<T> {
    return this.absoluteIdentifier$.pipe(
      switchMap((absoluteIdentifier) =>
        this.pluginDataService.getPluginData$<T>(absoluteIdentifier, pluginId)
      )
    );
  }

  setPluginData<T>(pluginId: string, data: T) {
    this.absoluteIdentifier$
      .pipe(
        tap((absoluteIdentifier) =>
          this.pluginDataService.setPluginData<T>(
            absoluteIdentifier,
            pluginId,
            data
          )
        )
      )
      .subscribe();
  }

  registerChild(child: IlcElement) {
    this.children
      .pipe(first())
      .subscribe((children) => this.children.next([...children, child]));
  }

  unregisterChild(child: IlcElement) {
    this.children
      .pipe(first())
      .subscribe((children) =>
        this.children.next(children.filter((_child) => _child !== child))
      );
  }

  ngOnInit() {
    this.absoluteIdentifier$
      .pipe(first())
      .subscribe((absoluteIdentifier) =>
        this.ilcApi.register(absoluteIdentifier, this)
      );
  }

  ngOnDestroy() {
    if (this.parent) {
      this.parent.unregisterChild(this);
    }
  }

  private setupNormalizedIdentifier$() {
    this.normalizedIdentifier$ = this._identifier.pipe(
      map((identifier) =>
        Array.isArray(identifier) ? identifier.join('|') : identifier
      ),
      first(),
      shareReplay({refCount: false, bufferSize: 1})
    );
  }

  private setupAbsoluteIdentifier$() {
    if (!this.parent) {
      this.absoluteIdentifier$ = this.normalizedIdentifier$;
    }

    const parents: IlcElement[] = [];
    for (let curr = this as IlcElement | undefined; !!curr; curr = curr.parent) {
      parents.unshift(curr);
    }
    this.absoluteIdentifier$ = zip(
      ...parents.map((parent) => parent.normalizedIdentifier$)
    ).pipe(
      first(),
      map((identifiers) => '/' + identifiers.join('/')),
      shareReplay({bufferSize: 1, refCount: false})
    );
  }

  private setupFlatChildren$() {}
}
