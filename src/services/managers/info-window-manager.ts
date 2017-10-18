import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import {Injectable, NgZone} from '@angular/core';

import {AnmInfoWindow} from '../../directives/info-window';

import {NaverMapsAPIWrapper} from '../maps-api-wrapper';
import {InfoWindow, InfoWindowOptions} from '../maps-types';
import {MarkerManager} from './marker-manager';

@Injectable()
export class InfoWindowManager {
  private _infoWindows: Map<AnmInfoWindow, Promise<InfoWindow>> =
      new Map<AnmInfoWindow, Promise<InfoWindow>>();

  constructor(
    private _mapsWrapper: NaverMapsAPIWrapper, private _zone: NgZone,
    private _markerManager: MarkerManager) {}

  deleteInfoWindow(infoWindow: AnmInfoWindow): Promise<void> {
    const iWindow = this._infoWindows.get(infoWindow);
    if (iWindow == null) {
      // info window already deleted
      return Promise.resolve();
    }
    return iWindow.then((i: InfoWindow) => {
      return this._zone.run(() => {
        i.close();
        this._infoWindows.delete(infoWindow);
      });
    });
  }

  setPosition(infoWindow: AnmInfoWindow): Promise<void> {
    return this._infoWindows.get(infoWindow).then((i: InfoWindow) => i.setPosition({
      lat: infoWindow.latitude,
      lng: infoWindow.longitude
    }));
  }

  setZIndex(infoWindow: AnmInfoWindow): Promise<void> {
    return this._infoWindows.get(infoWindow)
        .then((i: InfoWindow) => i.setZIndex(infoWindow.zIndex));
  }

  open(infoWindow: AnmInfoWindow): Promise<void> {
    return this._infoWindows.get(infoWindow).then((w) => {
      if (infoWindow.hostMarker != null) {
        return this._markerManager.getNativeMarker(infoWindow.hostMarker).then((marker) => {
          return this._mapsWrapper.getNativeMap().then((map) => w.open(map, marker));
        });
      }
      return this._mapsWrapper.getNativeMap().then((map) => w.open(map));
    });
  }

  close(infoWindow: AnmInfoWindow): Promise<void> {
    return this._infoWindows.get(infoWindow).then((w) => w.close());
  }

  setOptions(infoWindow: AnmInfoWindow, options: InfoWindowOptions) {
    return this._infoWindows.get(infoWindow).then((i: InfoWindow) => i.setOptions(options));
  }

  addInfoWindow(infoWindow: AnmInfoWindow) {
    const options: InfoWindowOptions = {
      content: infoWindow.content,
      zIndex: infoWindow.zIndex,
    };
    if (typeof infoWindow.latitude === 'number' && typeof infoWindow.longitude === 'number') {
      options.position = {lat: infoWindow.latitude, lng: infoWindow.longitude};
    }
    const infoWindowPromise = this._mapsWrapper.createInfoWindow(options);
    this._infoWindows.set(infoWindow, infoWindowPromise);
  }

   /**
    * Creates a Daum Maps event listener for the given InfoWindow as an Observable
    */
  createEventObservable<T>(eventName: string, infoWindow: AnmInfoWindow): Observable<T> {
    return Observable.create((observer: Observer<T>) => {
      this._infoWindows.get(infoWindow).then((i: InfoWindow) => {
        i.addListener(eventName, (e: T) => this._zone.run(() => observer.next(e)));
      });
    });
  }
}
