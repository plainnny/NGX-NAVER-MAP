export var naver: any;

export interface NaverMap extends KVO {
    data?: Data;
    constructor(el: HTMLElement, opts?: MapOptions): void;

    addPane(name, elementOrZIndex): void;
    destroy();
    fitBounds(bounds, margin);
    getBounds();
    getCenter();
    getCenterPoint();
    getElement();
    getMapTypeId();
    getOptions(key);
    getPanes();
    getPrimitiveProjection();
    getProjection();
    getSize();
    getZoom();
    morph(coord, zoom, transitionOptions);
    panBy(offset);
    panTo(coord, transitionOptions?);
    panToBounds(bounds, transitionOptions, margin);
    refresh(noEffect);
    removePane(name);
    setCenter(center);
    setCenterPoint(point);
    setMapTypeId(mapTypeId);
    setOptions(newOptionsOrKey, value?);
    setSize(size);
    setZoom(zoom, effect?);
    updateBy(coord, zoom);
    zoomBy(deltaZoom, zoomOrigin, effect);
}

export interface Marker extends KVO {
    constructor(options?: MarkerOptions): void;
    setMap(map: NaverMap): void;
    getMap(): NaverMap;
    // setImage(image: MarkerImage): void;
    // getImage(): MarkerImage;
    setPosition(latLng: LatLng | LatLngLiteral): void;
    getPosition(): LatLng;
    setZIndex(zIndex: number): void;
    getZIndex(): number;
    setVisible(visible: boolean): void;
    getVisible(): boolean;
    setTitle(title: string): void;
    getTitle(): string;
    setDraggable(draggable: boolean): void;
    getDraggable(): boolean;
    setClickable(clickable: boolean): void;
    getClickable(): boolean;
    setAltitude(altitude: number): void;
    getAltitude(): number;
    setRange(range: number): void;
    getRange(): number;
    setOpacity(opacity: number): void;
    getOpacity(): number;
}

export interface MarkerOptions {
    animation?
    map
    position
    icon?
    shape?
    title?
    cursor?
    clickable?
    draggable?
    visible?
    zIndex?
}

export interface ImageIcon {
    url: string;
    size?: string;
    scaledSize?: SizeLiteral|Size;
    origin?: Point|PointLiteral;
    anchor?: Point|PointLiteral|Position;
}

export interface SizeLiteral{
    width: number;
    height: number;
}

export interface PointLiteral {
    x: number;
    y: number;
}

export interface MarkerImageOptions {
    alt?: string;
    coords?: string;
    offset?: Point;
    shape?: string;
    spriteOrigin?: Point;
    spriteSize?: Size;
}
export interface Viewpoint {
    constructor(pan: number, tilt: number, zoom: number, panoId?: number): void;
}

export interface Circle extends KVO {
    getBounds(): LatLngBounds;
    getCenter(): LatLng;
    getDraggable(): boolean;
    getEditable(): boolean;
    getMap(): NaverMap;
    getRadius(): number;
    getVisible(): boolean;
    setCenter(center: LatLng | LatLngLiteral): void;
    setDraggable(draggable: boolean): void;
    setEditable(editable: boolean): void;
    setMap(map: NaverMap): void;
    setOptions(options: CircleOptions): void;
    setRadius(radius: number): void;
    setVisible(visible: boolean): void;
}

export interface CircleOptions {
    center?: LatLng | LatLngLiteral;
    clickable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    map?: NaverMap;
    radius?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokePosition?: 'CENTER' | 'INSIDE' | 'OUTSIDE';
    strokeWeight?: number;
    visible?: boolean;
    zIndex?: number;
}

export interface LatLngBounds {
    constructor(sw: LatLng, ne: LatLng): void;
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    toString(): string;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    isEmpty(): boolean;
    extend(point: LatLng): void;
    contain(latLng: LatLng): boolean;
}

export interface LatLngBoundsLiteral {
    east: number;
    north: number;
    south: number;
    west: number;
}

export interface MouseEvent { latLng: LatLng;
}

export interface MapOptions {
    background?
    baseTileOpacity?
    bounds?
    center?
    disableDoubleClickZoom?
    disableDoubleTapZoom?
    disableKineticPan?
    disableTwoFingerTapZoom?
    draggable?
    keyboardShortcuts?
    logoControl?
    logoControlOptions?
    mapDataControl?
    mapDataControlOptions?
    mapTypeControl?
    mapTypeControlOptions?
    mapTypeId?
    mapTypes?
    maxBounds?
    maxZoom?
    minZoom?
    padding?
    pinchZoom?
    resizeOrigin?
    scaleControl?
    scaleControlOptions?
    scrollWheel?
    size?
    overlayZoomEffect?
    tileSpare?
    tileTransition?
    zoom?
    zoomControl?
    zoomControlOptions?
    zoomOrigin?
}

export interface MapTypeStyle {
    elementType?: 'all' | 'geometry' | 'geometry.fill' | 'geometry.stroke' | 'labels' | 'labels.icon' |
        'labels.text' | 'labels.text.fill' | 'labels.text.stroke';
    featureType?: 'administrative' | 'administrative.country' | 'administrative.land_parcel' |
        'administrative.locality' | 'administrative.neighborhood' | 'administrative.province' | 'all' |
        'landscape' | 'landscape.man_made' | 'landscape.natural' | 'landscape.natural.landcover' |
        'landscape.natural.terrain' | 'poi' | 'poi.attraction' | 'poi.business' | 'poi.government' |
        'poi.medical' | 'poi.park' | 'poi.place_of_worship' | 'poi.school' | 'poi.sports_complex' | 'road' |
        'road.arterial' | 'road.highway' | 'road.highway.controlled_access' | 'road.local' | 'transit' |
        'transit.line' | 'transit.station' | 'transit.station.airport' | 'transit.station.bus' |
        'transit.station.rail' | 'water';
    stylers: MapTypeStyler[];
}

/**
 *  If more than one key is specified in a single MapTypeStyler, all but one will be ignored.
 */
export interface MapTypeStyler {
    color?: string;
    gamma?: number;
    hue?: string;
    invert_lightness?: boolean;
    lightness?: number;
    saturation?: number;
    visibility?: string;
    weight?: number;
}

export interface InfoWindow extends KVO {
    constructor(opts?: InfoWindowOptions): void;
    open(map?: NaverMap, marker?: Marker): void;
    close(): void;
    getMap(): NaverMap;

    getContent(): string | Node;
    getPosition(): LatLng;
    getZIndex(): number;
    getAltitude(): number;
    getRange(): number;

    setContent(content: string | Node): void;
    setOptions(options: InfoWindowOptions): void;
    setPosition(position: LatLng | LatLngLiteral): void;
    setZIndex(zIndex: number): void;
    setAltitude(altitude: number): void;
    setRange(range: number): void;
}

export interface KVO { addListener(eventName: string, handler: Function): MapsEventListener;}

export interface MapsEventListener { remove(): void;
}

export interface Size {
    height: number;
    width: number;
    equals(other: Size): boolean;
    toString(): string;
}

export interface Event {
    addListener(target: EventTarget, type: string, handler: Function): void;
    removeListener(target: EventTarget, type: string, handler: Function): void;
}

export interface InfoWindowOptions {
    content?: string | Node;
    disableAutoPan?: boolean;
    map?: NaverMap;
    position?: LatLngLiteral | LatLng;
    removable?: boolean;
    zIndex?: number;
    altitude?: number;
    range?: number;
}

export interface Point {
    x: number;
    y: number;
    equals(other: Point): boolean;
    toString(): string;
}

export interface GoogleSymbol {
    anchor?: Point;
    fillColor?: string;
    fillOpacity?: string;
    labelOrigin?: Point;
    path?: string;
    rotation?: number;
    scale?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
}

export interface IconSequence {
    fixedRotation?: boolean;
    icon?: GoogleSymbol;
    offset?: string;
    repeat?: string;
}

export interface PolylineOptions {
    clickable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    geodesic?: boolean;
    icon?: Array<IconSequence>;
    map?: NaverMap;
    path?: Array<LatLng> | Array<LatLng | LatLngLiteral>;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    visible?: boolean;
    zIndex?: number;
}

export interface Polyline extends KVO {
    getDraggable(): boolean;
    getEditable(): boolean;
    getMap(): NaverMap;
    getPath(): Array<LatLng>;
    getVisible(): boolean;
    setDraggable(draggable: boolean): void;
    setEditable(editable: boolean): void;
    setMap(map: NaverMap): void;
    setOptions(options: PolylineOptions): void;
    setPath(path: Array<LatLng | LatLngLiteral>): void;
    setVisible(visible: boolean): void;
}

/**
 * PolyMouseEvent gets emitted when the user triggers mouse events on a polyline.
 */
export interface PolyMouseEvent extends MouseEvent {
    edge: number;
    path: number;
    vertex: number;
}

export interface PolygonOptions {
    clickable?: boolean;
    draggable?: boolean;
    editable?: boolean;
    fillColor?: string;
    fillOpacity?: number;
    geodesic?: boolean;
    icon?: Array<IconSequence>;
    map?: NaverMap;
    paths?: Array<LatLng | LatLngLiteral> | Array<Array<LatLng | LatLngLiteral>>;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    visible?: boolean;
    zIndex?: number;
}

export interface Polygon extends KVO {
    getDraggable(): boolean;
    getEditable(): boolean;
    getMap(): NaverMap;
    getPath(): Array<LatLng>;
    getPaths(): Array<Array<LatLng>>;
    getVisible(): boolean;
    setDraggable(draggable: boolean): void;
    setEditable(editable: boolean): void;
    setMap(map: NaverMap): void;
    setPath(path: Array<LatLng> | Array<LatLng | LatLngLiteral>): void;
    setOptions(options: PolygonOptions): void;
    setPaths(paths: Array<Array<LatLng | LatLngLiteral>> | Array<LatLng | LatLngLiteral>): void;
    setVisible(visible: boolean): void;
}

export interface KmlLayer extends KVO {
    getDefaultViewport(): LatLngBounds;
    getMap(): NaverMap;
    getMetadata(): KmlLayerMetadata;
    getStatus(): KmlLayerStatus;
    getUrl(): string;
    getZIndex(): number;
    setMap(map: NaverMap): void;
    setOptions(options: KmlLayerOptions): void;
    setUrl(url: string): void;
    setZIndex(zIndex: number): void;
}

/**
 * See: https://developers.google.com/maps/documentation/javascript/reference?hl=de#KmlLayerStatus
 */
export type KmlLayerStatus = 'DOCUMENT_NOT_FOUND' |
    'DOCUMENT_TOO_LARGE' | 'FETCH_ERROR' | 'INVALID_DOCUMENT' | 'INVALID_REQUEST' |
    'LIMITS_EXCEEDED' | 'OK' | 'TIMED_OUT' | 'UNKNOWN';

/**
 * See: https://developers.google.com/maps/documentation/javascript/reference?hl=de#KmlLayerMetadata
 */
export interface KmlLayerMetadata {
    author: KmlAuthor;
    description: string;
    hasScreenOverlays: boolean;
    name: string;
    snippet: string;
}

export interface KmlAuthor {
    email: string;
    name: string;
    uri: string;
}

export interface KmlLayerOptions {
    clickable?: boolean;
    map?: NaverMap;
    preserveViewport?: boolean;
    screenOverlays?: boolean;
    suppressInfoWindows?: boolean;
    url?: string;
    zIndex?: number;
}

export interface KmlFeatureData {
    author: KmlAuthor;
    description: string;
    id: string;
    infoWindowHtml: string;
    name: string;
    snippet: string;
}

export interface KmlMouseEvent extends MouseEvent {
    featureData: KmlFeatureData;
    pixelOffset: Size;
}

export interface Data extends KVO {
    features: Feature[];
    constructor(options?: DataOptions): void;
    addGeoJson(geoJson: Object, options?: GeoJsonOptions): Feature[];
    remove(feature: Feature): void;
    setControlPosition(controlPosition: ControlPosition): void;
    setControls(controls: string[]): void;
    setDrawingMode(drawingMode: string): void;
    setMap(map: NaverMap): void;
    /* tslint:disable */
    /*
     * Tslint configuration check-parameters will prompt errors for these lines of code.
     * https://palantir.github.io/tslint/rules/no-unused-variable/
     */
    setStyle(style: () => void): void;
    forEach(callback: (feature: Feature) => void): void;
    /* tslint:enable */
}

export interface Feature extends KVO {
    id?: number | string | undefined;
    geometry: Geometry;
    properties: any;
}

export interface DataOptions {
    controlPosition?: ControlPosition;
    controls?: string[];
    drawingMode?: string;
    featureFactory?: (geometry: Geometry) => Feature;
    map?: NaverMap;
    style?: () => void;
}

export interface DataMouseEvent extends MouseEvent {
    feature: Feature;
}

export interface GeoJsonOptions {
    idPropertyName: string;
}

export interface Geometry {
    type: string;
}

/**
 * Identifiers used to specify the placement of controls on the map. Controls are
 * positioned relative to other controls in the same layout position. Controls that
 * are added first are positioned closer to the edge of the map.
 */
export enum ControlPosition {
    BOTTOM,
    BOTTOM_LEFT,
    BOTTOM_RIGHT,
    LEFT,
    RIGHT,
    TOP,
    TOP_LEFT,
    TOP_RIGHT
}

export interface Tileset {
    constructor(width: number,
                height: number,
                urlFunc: number,
                copyright: number,
                dark: number,
                minZoom: number,
                maxZoom: number): void;
    add(id: string, tileset: Tileset): void;
}
export interface TilesetCopyright {
    constructor(msg: string, shortMsg: string, minZoom: number): void;
}

/***** Controls *****/
/** Options for the rendering of the map type control. */
export interface MapTypeControlOptions {
    /** IDs of map types to show in the control. */
    mapTypeIds?: (MapTypeId | string)[];
    /**
     * Position id. Used to specify the position of the control on the map.
     * The default position is TOP_RIGHT.
     */
    position?: ControlPosition;
    /** Style id. Used to select what style of map type control to display. */
    style?: MapTypeControlStyle;
}

export enum MapTypeControlStyle {
    DEFAULT,
    DROPDOWN_MENU,
    HORIZONTAL_BAR
}

export interface OverviewMapControlOptions {
    opened?: boolean;
}

/** Options for the rendering of the pan control. */
export interface PanControlOptions {
    /**
     * Position id. Used to specify the position of the control on the map.
     * The default position is TOP_LEFT.
     */
    position?: ControlPosition;
}

/** Options for the rendering of the rotate control. */
export interface RotateControlOptions {
    /**
     * Position id. Used to specify the position of the control on the map.
     * The default position is TOP_LEFT.
     */
    position?: ControlPosition;
}

/** Options for the rendering of the scale control. */
export interface ScaleControlOptions {
    /** Style id. Used to select what style of scale control to display. */
    style?: ScaleControlStyle;
}

export enum ScaleControlStyle {
    DEFAULT
}

/** Options for the rendering of the Street View pegman control on the map. */
export interface StreetViewControlOptions {
    /**
     * Position id. Used to specify the position of the control on the map. The
     * default position is embedded within the navigation (level and pan) controls.
     * If this position is empty or the same as that specified in the
     * zoomControlOptions or panControlOptions, the Street View control will be
     * displayed as part of the navigation controls. Otherwise, it will be displayed
     * separately.
     */
    position?: ControlPosition;
}

/** Options for the rendering of the level control. */
export interface ZoomControlOptions {
    /**
     * Position id. Used to specify the position of the control on the map.
     * The default position is TOP_LEFT.
     */
    position?: ControlPosition;
    style?: ZoomControlStyle;
}

export enum ZoomControlStyle {
    DEFAULT,
    LARGE,
    SMALL
}

/** Options for the rendering of the fullscreen control. */
export interface FullscreenControlOptions {
    /**
     * Position id. Used to specify the position of the control on the map.
     * The default position is RIGHT_TOP.
     */
    position?: ControlPosition;
}

////////////////////////////////////////////////////
export interface MapTypeControl {

}

export interface ZoomControl {

}

export enum ProjectionId{
    /**
     * 투영 없는 API 내부의 좌표계 자체.
     * left-bottom을 (0,0)으로 하는 픽셀단위의 좌표계.
     */
    NONE,
        /**
         * API 내부 좌표계를 WCongnamul좌표계로 투영.
         * 외부에서 WCongnamul 좌표를 받아 사용가능.
         */
    WCONG
}

//copyright의 위치가 상수값으로 정의되어 있다.
export enum CopyrightPosition{
    //왼쪽아래
    BOTTOMLEFT,
        //오른쪽아래
    BOTTOMRIGHT
}

export interface MapProjection {
    pointFromCoords(latlng: LatLng): Point;
    coordsFromPoint(point: Point): LatLng;
    containerPointFromCoords(latlng: LatLng): Point;
    coordsFromContainerPoint(point: Point): LatLng;
}

export interface LatLng {
    constructor(lat: number, lng: number): void;
    clone(): LatLng;
    lat(): number;
    lng(): number;
    destinationPoint(angle: number, meter: number): LatLng;
    toPoint(): Point;
    equals(latlng: LatLng | Point | LatLngLiteral): boolean;
    toString(): string;
}

export interface LatLngLiteral {
    lat: number;
    lng: number;
}

export enum MapTypeId {
    NORMAL,
    ERRAIN,
    SATELLITE,
    HYBRID
}
