import {NaverMap} from '../services/maps-types';
import {
    Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output,
    SimpleChanges
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {MouseEvent} from '../map-types';
import {NaverMapsAPIWrapper} from '../services/maps-api-wrapper';
import {
    naver, FullscreenControlOptions, LatLng, LatLngLiteral, MapTypeControlOptions, MapTypeId, PanControlOptions,
    RotateControlOptions, ScaleControlOptions, StreetViewControlOptions, ZoomControlOptions
} from '../services/maps-types';
import {LatLngBounds, LatLngBoundsLiteral, MapTypeStyle} from '../services/maps-types';
import {InfoWindowManager} from '../services/managers/info-window-manager';
import {MarkerManager} from '../services/managers/marker-manager';
import {WindowRef} from '../utils/browser-globals';

/**
 * AnmMap renders a Naver Map.
 * **Important note**: To be able see a map in the browser, you have to define a height for the
 * element `anm-map`.
 *
 * ### Example
 * ```typescript
 * import { Component } from '@angular/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  styles: [`
 *    anm-map {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <anm-map [latitude]="lat" [longitude]="lng" [level]="level">
 *    </anm-map>
 *  `
 * })
 * ```
 */
@Component({
    selector: 'anm-map',
    providers: [
        NaverMapsAPIWrapper, MarkerManager, InfoWindowManager
    ],
    host: {
        // todo: deprecated - we will remove it with the next version
        '[class.sebm-google-map-container]': 'true'
    },
    styles: [`
        .anm-map-container-inner {
            width: inherit;
            height: inherit;
        }

        .anm-map-content {
            display: none;
        }
    `],
    template: `
        <div class='anm-map-container-inner sebm-google-map-container-inner'></div>
        <div class='anm-map-content'>
            <ng-content></ng-content>
        </div>
    `
})
export class AnmMap implements OnChanges, OnInit, OnDestroy {

    @Input() longitude: number = 0;
    @Input() latitude: number = 0;
    @Input() level: number = 8;
    @Input() draggable: boolean = true;
    @Input() disableDoubleClickZoom: boolean = false;
    @Input() disableDoubleClick: boolean = false;
    @Input() scrollwheel: boolean = true;
    @Input() keyboardShortcuts: boolean = true;
    @Input() projectionId: string = 'WCONG';
    @Input() tileAnimation: boolean = true;
    @Input() mapTypeId: MapTypeId = MapTypeId.NORMAL;
    @Input() usePanning: boolean = true;

    private static _mapOptionsAttributes: string[] = [
        'background',
        'baseTileOpacity',
        'bounds',
        'center',
        'disableDoubleClickZoom',
        'disableDoubleTapZoom',
        'disableKineticPan',
        'disableTwoFingerTapZoom',
        'draggable',
        'keyboardShortcuts',
        'logoControl',
        'logoControlOptions',
        'mapDataControl',
        'mapDataControlOptions',
        'mapTypeControl',
        'mapTypeControlOptions',
        'mapTypeId',
        'mapTypes',
        'maxBounds',
        'maxZoom',
        'minZoom',
        'padding',
        'pinchZoom',
        'resizeOrigin',
        'scaleControl',
        'scaleControlOptions',
        'scrollWheel',
        'size',
        'overlayZoomEffect',
        'tileSpare',
        'tileTransition',
        'zoom',
        'zoomControl',
        'zoomControlOptions',
        'zoomOrigin'
    ];

    private _observableSubscriptions: Subscription[] = [];


    // click: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
    // rightclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
    // dblclick: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
    // mousemove: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();
    // center_changed: EventEmitter<LatLngLiteral> = new EventEmitter<LatLngLiteral>();
    // bounds_changed: EventEmitter<LatLngBounds> = new EventEmitter<LatLngBounds>();
    // idle: EventEmitter<void> = new EventEmitter<void>();
    // zoom_change: EventEmitter<number> = new EventEmitter<number>();
    // mapReady: EventEmitter<NaverMap> = new EventEmitter<NaverMap>();
    // dragend: EventEmitter<LatLngLiteral> = new EventEmitter<LatLngLiteral>();

    @Output() addLayer: EventEmitter<any> = new EventEmitter();
    @Output() bounds_changed: EventEmitter<any> = new EventEmitter();
    @Output() center_changed: EventEmitter<any> = new EventEmitter();
    @Output() centerPoint_changed: EventEmitter<any> = new EventEmitter();
    @Output() click: EventEmitter<any> = new EventEmitter();
    @Output() dblclick: EventEmitter<any> = new EventEmitter();
    @Output() doubletap: EventEmitter<any> = new EventEmitter();
    @Output() drag: EventEmitter<any> = new EventEmitter();
    @Output() dragend: EventEmitter<any> = new EventEmitter();
    @Output() dragstart: EventEmitter<any> = new EventEmitter();
    @Output() idle: EventEmitter<any> = new EventEmitter();
    @Output() keydown: EventEmitter<any> = new EventEmitter();
    @Output() keyup: EventEmitter<any> = new EventEmitter();
    @Output() longtap: EventEmitter<any> = new EventEmitter();
    @Output() mapType_changed: EventEmitter<any> = new EventEmitter();
    @Output() mapTypeId_changed: EventEmitter<any> = new EventEmitter();
    @Output() mousedown: EventEmitter<any> = new EventEmitter();
    @Output() mousemove: EventEmitter<any> = new EventEmitter();
    @Output() mouseout: EventEmitter<any> = new EventEmitter();
    @Output() mouseover: EventEmitter<any> = new EventEmitter();
    @Output() mouseup: EventEmitter<any> = new EventEmitter();
    @Output() panning: EventEmitter<any> = new EventEmitter();
    @Output() pinch: EventEmitter<any> = new EventEmitter();
    @Output() pinchend: EventEmitter<any> = new EventEmitter();
    @Output() pinchstart: EventEmitter<any> = new EventEmitter();
    @Output() projection_changed: EventEmitter<any> = new EventEmitter();
    @Output() removeLayer: EventEmitter<any> = new EventEmitter();
    @Output() resize: EventEmitter<any> = new EventEmitter();
    @Output() rightclick: EventEmitter<any> = new EventEmitter();
    @Output() size_changed: EventEmitter<any> = new EventEmitter();
    @Output() tap: EventEmitter<any> = new EventEmitter();
    @Output() tilesloaded: EventEmitter<any> = new EventEmitter();
    @Output() touchend: EventEmitter<any> = new EventEmitter();
    @Output() touchmove: EventEmitter<any> = new EventEmitter();
    @Output() touchstart: EventEmitter<any> = new EventEmitter();
    @Output() twofingertap: EventEmitter<any> = new EventEmitter();
    @Output() zoom_changed: EventEmitter<any> = new EventEmitter();
    @Output() zooming: EventEmitter<any> = new EventEmitter();

    @Output() mapReady: EventEmitter<any> = new EventEmitter();

    constructor(private _elem: ElementRef, private w: WindowRef, private _mapsWrapper: NaverMapsAPIWrapper) {
    }

    /** @internal */
    ngOnInit() {
        // todo: this should be solved with a new component and a viewChild decorator
        const container = this._elem.nativeElement.querySelector('.anm-map-container-inner');
        this._initMapInstance(container);
    }

    private _initMapInstance(el: HTMLElement) {
        this._mapsWrapper.createMap(el, {
            zoom: this.level,
            scrollWheel: this.scrollwheel,
            pinchZoom: this.scrollwheel,
            draggable: this.draggable,
            disableDoubleClickZoom: this.disableDoubleClickZoom,
            keyboardShortcuts: this.keyboardShortcuts
        })
            .then(() => this._mapsWrapper.getNativeMap())
            .then(map => {
                this.w.getNativeWindow().onresize = (event: any) => {
                    this.relayout();
                };
                return this.mapReady.emit(map);
            });

        // register event listeners
        this._handleMapCenterChange();
        this._handleMapZoomChange();
        this._handleMapMouseEvents();
        this._handleBoundsChange();
        this._handleIdleEvent();
    }

    /** @internal */
    ngOnDestroy() {
        // unsubscribe all registered observable subscriptions
        this._observableSubscriptions.forEach((s) => s.unsubscribe());
    }

    /* @internal */
    ngOnChanges(changes: SimpleChanges) {
        this._updateMapOptionsChanges(changes);
        this._updatePosition(changes);
    }

    private _updateMapOptionsChanges(changes: SimpleChanges) {
        let options: { [propName: string]: any } = {};
        let optionKeys =
            Object.keys(changes).filter(k => AnmMap._mapOptionsAttributes.indexOf(k) !== -1);
        optionKeys.forEach((k) => {
            options[k] = changes[k].currentValue;
        });

        this._mapsWrapper.setMapOptions(options);
    }

    // /**
    //  * Triggers a resize event on the daum map instance.
    //  * When recenter is true, the of the daum map gets called with the current lat/lng values or fitBounds value to recenter the map.
    //  * Returns a promise that gets resolved after the event was triggered.
    //  */
    // triggerResize(recenter: boolean = true): Promise<void> {
    //   // Note: When we would trigger the resize event and show the map in the same turn (which is a
    //   // common case for triggering a resize event), then the resize event would not
    //   // work (to show the map), so we trigger the event in a timeout.
    //   return new Promise<void>((resolve) => {
    //     setTimeout(() => {
    //       return this._mapsWrapper.triggerMapEvent('resize').then(() => {
    //         if (recenter) {
    //           this.fitBounds != null ? ()=>{} : this._setCenter();
    //         }
    //         resolve();
    //       });
    //     });
    //   });
    // }

    private _updatePosition(changes: SimpleChanges) {
        if (changes['latitude'] == null && changes['longitude'] == null &&
            changes['fitBounds'] == null) {
            // no position update needed
            return;
        }

        // // we prefer fitBounds in changes
        // if (changes['fitBounds'] && this.fitBounds != null) {
        //   this._fitBounds();
        //   return;
        // }

        if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
            return;
        }

        this._setCenter();
    }
    //
    private _setCenter() {
        let newCenter = {
            lat: this.latitude,
            lng: this.longitude,
        };
        if (this.usePanning) {
            this._mapsWrapper.panTo(newCenter);
        } else {
            this._mapsWrapper.setCenter(newCenter);
        }
    }

    _panTo(lat?: number, lng?: number) {
        if (lat && lng) {
            this.latitude = lat;
            this.longitude = lng;
        }
        let newCenter: LatLngLiteral = {
            lat: this.latitude,
            lng: this.longitude,
        };
        this._mapsWrapper.panTo(newCenter);
    }

    private relayout() {
        this._mapsWrapper.relayout();
    }

    private _handleMapCenterChange() {
        const s = this._mapsWrapper.subscribeToMapEvent<void>('center_changed').subscribe(() => {
            this._mapsWrapper.getCenter().then((center: LatLng) => {
                this.latitude = center.lat();
                this.longitude = center.lng();
                this.center_changed.emit(<LatLngLiteral>{lat: this.latitude, lng: this.longitude});
                // this._setCenter();
            });
        });
        this._observableSubscriptions.push(s);
    }

    private _handleBoundsChange() {
        const s = this._mapsWrapper.subscribeToMapEvent<void>('bounds_changed').subscribe(() => {
            this._mapsWrapper.getBounds().then(
                (bounds: LatLngBounds) => {
                    this.bounds_changed.emit(bounds);
                });
        });
        this._observableSubscriptions.push(s);
    }

    private _handleMapZoomChange() {
        const s = this._mapsWrapper.subscribeToMapEvent<void>('zoom_changed').subscribe(() => {
            this._mapsWrapper.getZoom().then((z: number) => {
                this.level = z;
                this.zoom_changed.emit(z);
            });
        });
        this._observableSubscriptions.push(s);
    }

    private _handleDragEnd() {
        const s = this._mapsWrapper.subscribeToMapEvent<void>('dragend').subscribe(() => {
            this._mapsWrapper.getCenter().then((center: LatLng) => {
                this.latitude = center.lat();
                this.longitude = center.lng();
                this.dragend.emit(<LatLngLiteral>{lat: this.latitude, lng: this.longitude});
            });
        });
        this._observableSubscriptions.push(s);
    }

    private _handleIdleEvent() {
        const s = this._mapsWrapper.subscribeToMapEvent<void>('idle').subscribe(
            () => {
                return this.idle.emit(void 0);
            });
        this._observableSubscriptions.push(s);
    }

    private _handleMapMouseEvents() {
        interface Emitter {
            emit(value: any): void;
        }
        type Event = { name: string, emitter: Emitter };

        const events: Event[] = [
            {name: 'click', emitter: this.click},
            {name: 'rightclick', emitter: this.rightclick},
            {name: 'dblclick', emitter: this.dblclick},
        ];

        events.forEach((e: Event) => {
            const s = this._mapsWrapper.subscribeToMapEvent<any>(e.name).subscribe(
                (event) => {
                    const value = <any>{coords: {lat: event.coord.lat, lng: event.coord.lng}};
                    e.emitter.emit(value);
                });
            this._observableSubscriptions.push(s);
        });
    }
}


