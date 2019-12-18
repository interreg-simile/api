import { icon } from "leaflet";


/**
 * Creates the default icon marker of Leaflet.
 *
 * @returns {Object} - The icon of the marker.
 */
export function defaultMarkerIcon() {
    return icon({
        iconUrl      : "leaflet/marker-icon.png",
        iconRetinaUrl: "leaflet/marker-icon-2x.png",
        shadowUrl    : "leaflet/marker-shadow.png",
        iconSize     : [25, 41],
        iconAnchor   : [12, 41],
        popupAnchor  : [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize   : [41, 41]
    });
}