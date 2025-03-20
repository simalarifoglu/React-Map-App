import { setWkt } from '../redux/state/wktState';
import { transform } from 'ol/proj';
import { Draw } from 'ol/interaction';
import {vectorSource} from '../MapView';
import { getMap } from '../MapView';

let drawInteraction = false;
let lastDrawnFeature = null;

export function resetLastDrawnFeature() {
    if (lastDrawnFeature) {
        vectorSource.removeFeature(lastDrawnFeature);
        lastDrawnFeature = null;
    }
}
export function nullLastDrawnFeature() {
    if (lastDrawnFeature) {
        lastDrawnFeature = null;
    }
}

function enableDrawMode(type,dispatch,openPanel) {
    const map = getMap();

    if (drawInteraction) {
        map.removeInteraction(drawInteraction);
    }

    drawInteraction = new Draw({
        source: vectorSource,
        type: type
    });

    drawInteraction.on('drawend', function(event) {
        const feature = event.feature;
        lastDrawnFeature = feature;
        const geometry = feature.getGeometry();

        let wkt;
        if (type === 'Point') {
            const coords = transform(
                geometry.getCoordinates(), 'EPSG:3857', 'EPSG:4326'
            );
            wkt = `POINT(${coords[0]} ${coords[1]})`;
        } else if (type === 'LineString') {
            const coords = geometry.getCoordinates().map(coord => {
                const transformed = transform(coord, 'EPSG:3857', 'EPSG:4326');
                return `${transformed[0]} ${transformed[1]}`;
            });
            wkt = `LINESTRING(${coords.join(', ')})`;
        } else if (type === 'Polygon') {
            const coords = geometry.getCoordinates()[0].map(coord => {
                const transformed = transform(coord, 'EPSG:3857', 'EPSG:4326');
                return `${transformed[0]} ${transformed[1]}`;
            });
            wkt = `POLYGON((${coords.join(', ')}))`;
        }
        dispatch(setWkt({ wktData: wkt, name: null })); 
        
        if (openPanel) {
            openPanel(true);
        }
        map.removeInteraction(drawInteraction);
    });
    map.addInteraction(drawInteraction);
}

export default enableDrawMode;
