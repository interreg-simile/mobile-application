import { Icon } from "leaflet";


/**
 * Creates the user marker icon.
 *
 * @returns {Icon} - The icon of the marker.
 */
export function userMarkerIcon(): Icon {
    return new Icon({
        iconUrl      : "assets/images/user-marker.png",
        iconRetinaUrl: "assets/images/user-marker-2x.png",
        iconSize     : [20, 20],
        iconAnchor   : [10, 10],
    });
}


/**
 * Creates the custom marker icon.
 *
 * @returns {Icon} - The icon of the marker.
 */
export function customMarkerIcon(): Icon {
    return new Icon({
        iconUrl      : "assets/images/custom-marker.png",
        iconRetinaUrl: "assets/images/custom-marker-2x.png",
        shadowUrl    : "leaflet/marker-shadow.png",
        iconSize     : [25, 46],
        iconAnchor   : [12.5, 46],
        shadowSize   : [41, 41]
    });
}


/**
 * Creates the user observation marker icon.
 *
 * @returns {Icon} - The icon of the marker.
 */
export function userObservationMarkerIcon(): Icon {
    return new Icon({
        iconUrl      : "assets/images/user-observation-marker.png",
        iconRetinaUrl: "assets/images/user-observation-marker-2x.png",
        shadowUrl    : "leaflet/marker-shadow.png",
        iconSize     : [25, 46],
        iconAnchor   : [12.5, 46],
        shadowSize   : [41, 41]
    });
}


/**
 * Creates the observation marker icon.
 *
 * @returns {Icon} - The icon of the marker.
 */
export function observationMarkerIcon(): Icon {
    return new Icon({
        iconUrl      : "assets/images/observation-marker.png",
        iconRetinaUrl: "assets/images/observation-marker-2x.png",
        shadowUrl    : "leaflet/marker-shadow.png",
        iconSize     : [25, 46],
        iconAnchor   : [12.5, 46],
        shadowSize   : [41, 41]
    });
}


/**
 * Creates the locally saved observation marker icon.
 *
 * @returns {Icon} - The icon of the marker.
 */
export function localObservationMarkerIcon(): Icon {
    return new Icon({
        iconUrl      : "assets/images/local-observation-marker.png",
        iconRetinaUrl: "assets/images/local-observation-marker-2x.png",
        shadowUrl    : "leaflet/marker-shadow.png",
        iconSize     : [25, 46],
        iconAnchor   : [12.5, 46],
        shadowSize   : [41, 41]
    });
}


/**
 * Creates the event marker icon.
 *
 * @returns {Icon} - The icon of the marker.
 */
export function eventMarkerIcon(): Icon {
    return new Icon({
        iconUrl      : "assets/images/event-marker.png",
        iconRetinaUrl: "assets/images/event-marker-2x.png",
        shadowUrl    : "leaflet/marker-shadow.png",
        iconSize     : [25, 46],
        iconAnchor   : [12.5, 46],
        shadowSize   : [41, 41]
    });
}
