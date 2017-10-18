import {Injectable, NgZone} from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Observer} from "rxjs/Observer";

import * as mapTypes from "./maps-types";
import { Polyline, PolylineOptions} from "./maps-types";
import {MapsAPILoader} from "./maps-api-loader/maps-api-loader";

// todo: add types for this
declare var naver: any;

/**
 * Wrapper class that handles the communication with the Naver Maps Javascript
 * API v3
 */
@Injectable()
export class NaverMapsAPIWrapper {
  private _map: Promise<mapTypes.NaverMap>;
  private _mapResolver: (value?: mapTypes.NaverMap) => void;

  constructor(private _loader: MapsAPILoader, private _zone: NgZone) {
    this._map =
        new Promise<mapTypes.NaverMap>((resolve: () => void) => { this._mapResolver = resolve; });
  }

  createMap(el: HTMLElement, mapOptions?: mapTypes.MapOptions): Promise<void> {
    return this._loader.load().then(() => {
        const map = new naver.maps.Map(el,mapOptions);
        this._mapResolver(<mapTypes.NaverMap>map);
      return;
    });
  }

  setMapOptions(options: mapTypes.MapOptions) {
    this._map.then((m: mapTypes.NaverMap) => {
      m.setOptions(options);
    });
  }

  /**
   * Creates a naver map marker with the map context
   */
  createMarker(options: mapTypes.MarkerOptions = <mapTypes.MarkerOptions>{}):
      Promise<mapTypes.Marker> {
    return this._map.then((map: mapTypes.NaverMap) => {
      // options.map = map;
      // options.position = new naver.maps.LatLng(options.position.lat, options.position.lng);

      let markerOptions = {};

      markerOptions['position'] = new naver.maps.LatLng(options.position.lat, options.position.lng);
      markerOptions['map'] = map;
      if(options.icon)markerOptions['icon'] = options.icon;
      if(options.title) markerOptions['title'] = options.title;
      if(options.draggable) markerOptions['draggable'] = options.draggable;
      if(options.clickable) markerOptions['clickable'] = options.clickable;
      if(options.zIndex) markerOptions['zIndex'] = options.zIndex;

      return new naver.maps.Marker(markerOptions);
    });
  }

  createInfoWindow(options?: mapTypes.InfoWindowOptions): Promise<mapTypes.InfoWindow> {
    return this._map.then(() => { return new naver.maps.InfoWindow(options); });
  }

  /**
   * Creates a naver.map.Circle for the current map.
   */
  createCircle(options: mapTypes.CircleOptions): Promise<mapTypes.Circle> {
    return this._map.then((map: mapTypes.NaverMap) => {
      options.map = map;
      return new naver.maps.Circle(options);
    });
  }

  createPolyline(options: PolylineOptions): Promise<Polyline> {
    return this.getNativeMap().then((map: mapTypes.NaverMap) => {
      let line = new naver.maps.Polyline(options);
      line.setMap(map);
      return line;
    });
  }

  createPolygon(options: mapTypes.PolygonOptions): Promise<mapTypes.Polyline> {
    return this.getNativeMap().then((map: mapTypes.NaverMap) => {
      let polygon = new naver.maps.Polygon(options);
      polygon.setMap(map);
      return polygon;
    });
  }

  /**
   * Determines if given coordinates are insite a Polygon path.
   */
  containsLocation(latLng: mapTypes.LatLngLiteral, polygon: mapTypes.Polygon): Promise<boolean> {
    return naver.maps.geometry.poly.containsLocation(latLng, polygon);
  }

  subscribeToMapEvent<E>(eventName: string): Observable<E> {
    return Observable.create((observer: Observer<E>) => {
      this._map.then((m: mapTypes.NaverMap) => {
        naver.maps.Event.addListener(m, eventName, (arg: E) => {
          this._zone.run(() => observer.next(arg));
        });
      });
    });
  }
  createLatLng(lat: number|(() => number), lng: number|(() => number)): any{
    return new naver.maps.LatLng(lat, lng);
  }

  setCenter(latLng: mapTypes.LatLngLiteral): Promise<void> {
    return this._map.then((map: mapTypes.NaverMap) => {
      return map.setCenter({lat: latLng.lat, lng: latLng.lng});
    });
  }

  getZoom(): Promise<number> { return this._map.then((map: mapTypes.NaverMap) => map.getZoom()); }

  getBounds(): Promise<mapTypes.LatLngBounds> {
    return this._map.then((map: mapTypes.NaverMap) => map.getBounds());
  }

  setZoom(zoom: number): Promise<void> {
    return this._map.then((map: mapTypes.NaverMap) => map.setZoom(zoom));
  }

  getCenter(): Promise<mapTypes.LatLng> {
    return this._map.then((map: mapTypes.NaverMap) => map.getCenter());
  }

  panTo(latLng: mapTypes.LatLngLiteral): Promise<void> {
    return this._map.then((map) => map.panTo({lat: latLng.lat, lng: latLng.lng}));
  }

  relayout(): void{
    this._map.then((map) => map.refresh(false));
  }

  // fitBounds(latLng: mapTypes.LatLngBounds|mapTypes.LatLngBoundsLiteral): Promise<void> {
  //   return this._map.then((map) => map.fitBounds(latLng));
  // }

  // panToBounds(latLng: mapTypes.LatLngBounds|mapTypes.LatLngBoundsLiteral): Promise<void> {
  //   return this._map.then((map) => map.panToBounds(latLng));
  // }

  /**
   * Returns the native Naver Maps Map instance. Be careful when using this instance directly.
   */
  getNativeMap(): Promise<mapTypes.NaverMap> { return this._map; }

  /**
   * Triggers the given event name on the map instance.
   */
  triggerMapEvent(eventName: string): Promise<void> {
    return this._map.then((m) => naver.maps.event.trigger(m, eventName));
  }
}
