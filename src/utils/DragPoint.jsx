import { updateFeature } from "../redux/state/mapObjectsState";
import { toast } from "react-toastify";
import { Collection } from "ol";
import WKT from "ol/format/WKT";
import { vectorSource } from "./MapView";
import { getMap } from "./MapView";
import { Translate, Modify } from "ol/interaction";

export const enableTranslateMode = (selectedFeatureJSON, dispatch, getUserConfirmation) => {
    const map = getMap();
    
    const selectedFeature = vectorSource.getFeatures().find(feature => {
        return feature.getId() === selectedFeatureJSON.id;
    });

    if (!selectedFeature) {
        console.error("The selected feature was not found in vectorSource.");
        return;
    }

    const initialGeometry = selectedFeature.getGeometry().clone();

    const translate = new Translate({
        features: new Collection([selectedFeature]) 
    });

    translate.on('translateend', async (event) => {
        const feature = event.features.item(0);
        const geometry = feature.getGeometry();

        const transformedGeometry = geometry.clone().transform('EPSG:3857', 'EPSG:4326');
        
        const wktFormat = new WKT();
        const wkt = wktFormat.writeGeometry(transformedGeometry);

        const userConfirmed = await getUserConfirmation();
        if (!userConfirmed) {
            selectedFeature.setGeometry(initialGeometry);
            
            toast.warning("Updation process cancelled!");
            
        } else {
            const data = {
                name: selectedFeatureJSON.name,
                wkt: wkt
            };
            dispatch(updateFeature({
                id: selectedFeatureJSON.id,
                data: data
            }));
            
            toast.success("Deletion completed successfully.!");

        }
        map.removeInteraction(translate);
    });
    map.addInteraction(translate);
};
