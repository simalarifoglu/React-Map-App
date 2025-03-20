import { updateFeature } from "../redux/state/mapObjectsState";
import { toast } from "react-toastify";
import { Collection } from "ol";
import WKT from "ol/format/WKT";
import { vectorSource } from "../MapView";
import { getMap } from "../MapView";
import { Translate } from "ol/interaction";

const enableTranslateMode = (selectedFeatureJSON, dispatch) => {
    const map = getMap();

    const selectedFeature = vectorSource.getFeatures().find(feature => {
        return feature.getId() === selectedFeatureJSON.id;
    });

    if (!selectedFeature) {
        return;
    }

    const initialGeometry = selectedFeature.getGeometry().clone();

    const translate = new Translate({
        features: new Collection([selectedFeature])
    });

    translate.on('translateend', (event) => {
        const feature = event.features.item(0);
        const geometry = feature.getGeometry();

        const transformedGeometry = geometry.clone().transform('EPSG:3857', 'EPSG:4326');
        
        const wktFormat = new WKT();
        const wkt = wktFormat.writeGeometry(transformedGeometry);

        if (!confirm("Do you want to update?")) {
            selectedFeature.setGeometry(initialGeometry);
            
            toast.warning("Update operation is cancelled!");
            
        } else {
            const data = {
                name: selectedFeatureJSON.name,
                wkt: wkt
            };
            dispatch(updateFeature({
                id: selectedFeatureJSON.id,
                data: data
            }));
            
            toast.success("Feature updated successfully!");

        }
        map.removeInteraction(translate);
    });
    map.addInteraction(translate);
};

export default enableTranslateMode;
