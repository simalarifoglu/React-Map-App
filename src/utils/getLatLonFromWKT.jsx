import WKT from "ol/format/WKT";
import { transform } from "ol/proj";

export function getLatLonFromWKT(wktString) {
    try {
        const format = new WKT();
        const geometry = format.readGeometry(wktString);
        const type = geometry.getType();

        let coord;

        if (type === "Point") {
            coord = geometry.getCoordinates();
        } else if (type === "LineString") {
            const points = geometry.getCoordinates();
            const avg = points.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1]], [0, 0]);
            coord = [avg[0] / points.length, avg[1] / points.length];
        } else if (type === "Polygon") {
            coord = geometry.getInteriorPoint().getCoordinates();
        } else {
            return null;
        }
        return coord;
    } catch (error) {
        console.error("WKT dönüşüm hatası:", error);
        return null;
    }
}
