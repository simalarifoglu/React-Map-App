import { useEffect, useRef } from 'react';
import { defaults as defaultControls } from 'ol/control';
import { Map, View, Collection } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { fromLonLat } from 'ol/proj';
import { Style, Stroke, Fill, Circle as CircleStyle } from 'ol/style';
import { useDispatch, useSelector } from 'react-redux';
import 'ol/ol.css';
import SelectInteraction from 'ol/interaction/Select';
import UpdatePanel from '../components/UpdatePanel/UpdatePanel';
import { setFeature } from '../redux/state/featureState';
import { openPanel } from '../redux/state/panelState';
import { Modify } from 'ol/interaction';
import WKT from 'ol/format/WKT';
import { toast } from 'react-toastify';
import { updateFeature } from '../redux/state/mapObjectsState';
import { StopEditButton } from '../components/StopUpdate/StopUpdate';

export const vectorSource = new VectorSource(); 
let mapInstance = null;
export const getMap = () => mapInstance;
const InitMap = () => {
  const dispatch = useDispatch();
  const mapRef = useRef(null);

  useEffect(() => {
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: (feature) => {
        const geometryType = feature.getGeometry().getType();
        switch (geometryType) {
          case 'Point':
            return new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({ color: '#eb367e' }),
                stroke: new Stroke({ color: 'white', width: 2 })
              }),
            });
          case 'LineString':
            return new Style({
              stroke: new Stroke({ color: '#f7186a', width: 2 }),
            });
          case 'Polygon':
            return new Style({
              stroke: new Stroke({ color: '#ec8c69', width: 2 }),
              fill: new Fill({ color: 'rgba(236, 140, 105, 0.1)' }),
            });
          default:
            return null;
        }
      },
    });

    const map = new Map({
      controls: defaultControls({ attribution: false,zoom: false }),
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      view: new View({
        center: fromLonLat([35.2433, 38.9208]),
        zoom: 6,
      }),
    });
    mapInstance = map;

    const select = new SelectInteraction();
    map.addInteraction(select);
    
    select.on('select', function(e) {
        if (e.selected.length > 0) {
          const selectedFeature = e.selected[0];
          
          const pointData = selectedFeature.get('pointData');
          if(pointData){
            
            dispatch(setFeature(pointData));
            if (!selectedFeature.getId()) {
              selectedFeature.setId(pointData.id);
            }
            
            dispatch(openPanel());
            select.getFeatures().clear();
          }
        }
    });
    return () => {
      map.setTarget(null);
      map.removeInteraction(select);
      mapInstance = null;
    }
  }, []);

  const isModify = useSelector(state => state.Edit.edit);
  const selectedFeatureJSON = useSelector(state => state.feature.feature);

  const modifyRef = useRef(null);
  const revertRef = useRef(null);
  const selectedRef = useRef(null);
  const wktRef = useRef(null);
  useEffect(() => {
    const map = getMap();
    
    if(isModify){ 
      if(map){
        const selectedFeature = vectorSource.getFeatures().find((feature) => {
          return feature.getId() === selectedFeatureJSON.id;
      });
      selectedRef.current = selectedFeature; 
  
      if (!selectedFeature) {
          console.error("Selected feature not found in vectorSource.");
          return;
      }
  
      const initialGeometry = selectedFeature.getGeometry().clone();
      revertRef.current = initialGeometry;
      const modify = new Modify({
          source: vectorSource,
          features: new Collection([selectedFeature]), 
      });
      modifyRef.current = modify;
      modify.on("modifyend", async (event) => {
          if (event.features && event.features.getLength() > 0) {
              const feature = event.features.item(0); 
              const geometry = feature.getGeometry();
  
              const transformedGeometry = geometry.clone().transform("EPSG:3857", "EPSG:4326");
              const wktFormat = new WKT();
              const wkt = wktFormat.writeGeometry(transformedGeometry);
              wktRef.current = wkt;
              
          } else {
              console.error("No features found in modifyend event.");
          }
      });
  
      map.addInteraction(modify);
      }else{}
      
    }else{
      if (map && modifyRef.current) {
        map.removeInteraction(modifyRef.current);
        modifyRef.current = null;
        
        const data = {
          name: selectedFeatureJSON.name,
          wkt: wktRef.current,
        };
        wktRef.current = null;
        dispatch(updateFeature({
          id: selectedFeatureJSON.id,
          data: data,
        }));
        toast.success("Updation completed successfully.");
      }else{}
    }
  }, [isModify]);

  return (<>
    <div ref={mapRef} style={{ width: '100%', height: '100vh' }}></div>
    <UpdatePanel/>
    <StopEditButton
      onConfirmStop={(confirmed) => {
        if (confirmed) {
        }
      }}
    />
  </>)
};

export default InitMap;
