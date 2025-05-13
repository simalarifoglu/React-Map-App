import WKT from "ol/format/WKT";
import { getLength, getArea } from "ol/sphere";

export function getFormattedLength(wktString) {
    try {
        const format = new WKT();
        const geometry = format.readGeometry(wktString);
        geometry.transform("EPSG:4326", "EPSG:3857");

        const length = getLength(geometry);

        return length < 1000
            ? `${length.toFixed(2)} m`
            : `${(length / 1000).toFixed(2)} km`;
    } catch (e) {
        console.error("Length calculation failed:", e);
        return "-";
    }
}

export function getFormattedArea(wktString) {
  try {
    const format = new WKT();
    const geometry = format.readGeometry(wktString);
    geometry.transform("EPSG:4326", "EPSG:3857");

    const area = getArea(geometry);
    return area < 1000000
      ? `${area.toFixed(2)} m²`
      : `${(area / 1_000_000).toFixed(2)} km²`;
  } catch (e) {
    console.error("Area calculation failed:", e);
    return "-";
  }
}