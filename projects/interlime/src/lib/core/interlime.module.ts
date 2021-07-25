import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdentifierDirective } from './directives/identifier.directive';
import { LocalStoragePluginDataService } from './plugin-data-service/local-storage-plugin-data.service';
import { PLUGIN_DATA_SERVICE } from './plugin-data-service/plugin-data-service';

@NgModule({
  imports: [CommonModule],
  declarations: [IdentifierDirective],
  exports: [IdentifierDirective],
})
export class InterlimeModule {
  static forRoot(): ModuleWithProviders<InterlimeModule> {
    return {
      ngModule: InterlimeModule,
      providers: [
        {
          provide: PLUGIN_DATA_SERVICE,
          useClass: LocalStoragePluginDataService,
        },
      ],
    };
  }
}
