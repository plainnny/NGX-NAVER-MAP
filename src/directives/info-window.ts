import { LatLngLiteral,LatLng } from '../services/maps-types';
import {Component, ElementRef, EventEmitter, OnChanges, OnDestroy, OnInit, SimpleChange} from '@angular/core';

import {InfoWindowManager} from '../services/managers/info-window-manager';

import {AnmMarker} from './marker';

let infoWindowId = 0;

/**
 * anmInfoWindow renders a info window inside a {@link anmMarker} or standalone.
 *
 * ### Example
 * ```typescript
 * import { Component } from '@angular/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  styles: [`
 *    .anm-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <anm-map [latitude]="lat" [longitude]="lng" [level]="level">
 *      <anm-marker [latitude]="lat" [longitude]="lng" [label]="'M'">
 *        <anm-info-window [disableAutoPan]="true">
 *          Hi, this is the content of the <strong>info window</strong>
 *        </anm-info-window>
 *      </anm-marker>
 *    </anm-map>
 *  `
 * })
 * ```
 */
@Component({
  selector: 'anm-info-window',
  inputs: ['latitude', 'longitude', 'disableAutoPan', 'position', 'removable', 'zIndex', 'isOpen'],
  outputs: ['infoWindowClose'],
  template: `<div class='anm-info-window-content'>
      <ng-content></ng-content>
    </div>
  `
})
export class AnmInfoWindow implements OnDestroy, OnChanges, OnInit {
  disableAutoPan:boolean;
  position: LatLngLiteral|LatLng;
  removable: boolean;
  zIndex: number;
  latitude: number;
  longitude: number;

  /**
   * Holds the marker that is the host of the info window (if available)
   */
  hostMarker: AnmMarker;

  /**
   * Holds the native element that is used for the info window content.
   */
  content: Node;

  isOpen: boolean;

  /**
   * Emits an event when the info window is closed.
   */
  infoWindowClose: EventEmitter<void> = new EventEmitter<void>();

  private static _infoWindowOptionsInputs: string[] = ['disableAutoPan', 'maxWidth'];
  private _infoWindowAddedToManager: boolean = false;
  private _id: string = (infoWindowId++).toString();

  constructor(private _infoWindowManager: InfoWindowManager, private _el: ElementRef) {}

  ngOnInit() {
    this.content = this._el.nativeElement.querySelector('.anm-info-window-content');
    this._infoWindowManager.addInfoWindow(this);
    this._infoWindowAddedToManager = true;
    this._updateOpenState();
    this._registerEventListeners();
  }

  /** @internal */
  ngOnChanges(changes: {[key: string]: SimpleChange}) {
    if (!this._infoWindowAddedToManager) {
      return;
    }
    if ((changes['latitude'] || changes['longitude']) && typeof this.latitude === 'number' &&
        typeof this.longitude === 'number') {
          console.log('changed postion');
      this._infoWindowManager.setPosition(this);
    }
    if (changes['zIndex']) {
      this._infoWindowManager.setZIndex(this);
    }
    if (changes['isOpen']) {
      this._updateOpenState();
    }
    this._setInfoWindowOptions(changes);
  }

  private _registerEventListeners() {
    this._infoWindowManager.createEventObservable('closeclick', this).subscribe(() => {
      this.isOpen = false;
      this.infoWindowClose.emit();
    });
  }

  private _updateOpenState() {
    this.isOpen ? this.open() : this.close();
  }

  private _setInfoWindowOptions(changes: {[key: string]: SimpleChange}) {
    let options: {[propName: string]: any} = {};
    let optionKeys = Object.keys(changes).filter(
        k => AnmInfoWindow._infoWindowOptionsInputs.indexOf(k) !== -1);
    optionKeys.forEach((k) => { options[k] = changes[k].currentValue; });
    this._infoWindowManager.setOptions(this, options);
  }

  /**
   * Opens the info window.
   */
  open(): Promise<void> { return this._infoWindowManager.open(this); }

  /**
   * Closes the info window.
   */
  close(): Promise<void> {
    return this._infoWindowManager.close(this).then(() => { this.infoWindowClose.emit(); });
  }

  /** @internal */
  id(): string { return this._id; }

  /** @internal */
  toString(): string { return 'anmInfoWindow-' + this._id.toString(); }

  /** @internal */
  ngOnDestroy() { this._infoWindowManager.deleteInfoWindow(this); }
}
