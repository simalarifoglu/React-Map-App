import { WKT } from 'ol/format';

const zoomToFeature = (map, feature) => {
    if (!map || !feature) {
        console.warn('Map or feature is undefined');
        return;
    }
    
    try {
        const wktFormat = new WKT();
        
        const geometry = wktFormat.readGeometry(feature.wkt, {
            dataProjection: 'EPSG:4326',
            featureProjection: map.getView().getProjection()
        });
        
        const extent = geometry.getExtent();
        
        map.getView().fit(extent, {
            padding: [50, 50, 50, 50],
            maxZoom: 10,
            duration: 1000
        });
    } catch (error) {
        console.error('WKT string:', feature.wkt);
    }
};

export default zoomToFeature