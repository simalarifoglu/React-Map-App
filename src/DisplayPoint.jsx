import { vectorSource } from "./MapView";
import { Feature } from "ol";
import WKT from "ol/format/WKT";

function displayObj(objects) {
  vectorSource.clear();
  objects.forEach(object => {
    const wktFormat = new WKT();
    const geometry = wktFormat.readGeometry(object.wkt, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    
    if (geometry.getType() === 'Point' || geometry.getType() === 'LineString' || geometry.getType() === 'Polygon') {
      const feature = new Feature({
        geometry: geometry
      });
      feature.set('pointData', object);
      vectorSource.addFeature(feature);
    } else {
      console.error('Unsupported geometry type:', geometry.getType());
    }
  });
  return 0;
}

export default displayObj;