import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import {AnmMarker} from './../../directives/marker';

import {NaverMapsAPIWrapper} from '../maps-api-wrapper';
import {Marker} from '../maps-types';

// todo: add types for this
declare var naver: any;

@Injectable()
export class MarkerManager {
  private _markers: Map<AnmMarker, Promise<Marker>> =
      new Map<AnmMarker, Promise<Marker>>();

  constructor(private _mapsWrapper: NaverMapsAPIWrapper, private _zone: NgZone) {}

  deleteMarker(marker: AnmMarker): Promise<void> {
    const m = this._markers.get(marker);
    if (m == null) {
      // marker already deleted
      return Promise.resolve();
    }
    return m.then((m: Marker) => {
      return this._zone.run(() => {
        m.setMap(null);
        this._markers.delete(marker);
      });
    });
  }

  updateMarkerPosition(marker: AnmMarker): Promise<void> {
    return this._markers.get(marker).then(
        (m: Marker) => {
          m.setPosition(new naver.maps.LatLng(marker.latitude, marker.longitude));
        });
  }

  updateTitle(marker: AnmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setTitle(marker.title));
  }

  updateLabel(marker: AnmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => { m.setTitle(marker.label); });
  }

  updateDraggable(marker: AnmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setDraggable(marker.draggable));
  }

  updateIcon(marker: AnmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => {
      // m.setImage( new naver.maps.MarkerImage(
      //   marker.icon.url, new naver.maps.Point(marker.icon.size.width, marker.icon.size.height)
      // ));
    });
  }

  updateOpacity(marker: AnmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setOpacity(marker.opacity));
  }

  updateVisible(marker: AnmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setVisible(marker.visible));
  }

  updateZIndex(marker: AnmMarker): Promise<void> {
    return this._markers.get(marker).then((m: Marker) => m.setZIndex(marker.zIndex));
  }

  addMarker(marker: AnmMarker) {
    const markerPromise = this._mapsWrapper.createMarker({
      position: {lat: marker.latitude, lng: marker.longitude},
      map: null,
      icon: marker.icon,
      title: marker.label,
      draggable: marker.draggable,
      clickable: true,
      zIndex: marker.zIndex
    });
    this._markers.set(marker, markerPromise);
  }

  getNativeMarker(marker: AnmMarker): Promise<Marker> {
    return this._markers.get(marker);
  }

  createEventObservable<T>(eventName: string, marker: AnmMarker): Observable<void> {
    return Observable.create((observer: Observer<T>) => {
      this._markers.get(marker).then((m: Marker) => {
        naver.maps.Event.addListener(m, eventName, () => this._zone.run(() => observer.next(null)));
      });
    });
  }
}
