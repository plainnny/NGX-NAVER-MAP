import {ModuleWithProviders, NgModule} from '@angular/core';
import {AnmMap} from './directives/map';
import {AnmInfoWindow} from './directives/info-window';
import {AnmMarker} from './directives/marker';
import { LazyMapsAPILoader } from './services/maps-api-loader/lazy-maps-api-loader';
import {LAZY_MAPS_API_CONFIG, LazyMapsAPILoaderConfigLiteral} from './services/maps-api-loader/lazy-maps-api-loader';
import {MapsAPILoader} from './services/maps-api-loader/maps-api-loader';
import {BROWSER_GLOBALS_PROVIDERS} from './utils/browser-globals';
import {NaverMapsAPIWrapper} from './services/maps-api-wrapper';

/**
 * @internal
 */
export function coreDirectives() {
  return [
    AnmMap, AnmMarker, AnmInfoWindow
  ];
};

/**
 * The ngx-naver-maps core module. Contains all Directives/Services/Pipes
 * of the core module. Please use `AnmCoreModule.forRoot()` in your app module.
 */
@NgModule({declarations: coreDirectives(), exports: coreDirectives()})
export class AnmCoreModule {
  /**
   * Please use this method when you register the module at the root level.
   */
  static forRoot(lazyMapsAPILoaderConfig?: LazyMapsAPILoaderConfigLiteral): ModuleWithProviders {
    return {
      ngModule: AnmCoreModule,
      providers: [
        ...BROWSER_GLOBALS_PROVIDERS, {provide: MapsAPILoader, useClass: LazyMapsAPILoader},
        {provide: LAZY_MAPS_API_CONFIG, useValue: lazyMapsAPILoaderConfig},
        NaverMapsAPIWrapper
      ],
    };
  }
}
