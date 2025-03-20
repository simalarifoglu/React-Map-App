import { configureStore } from '@reduxjs/toolkit'
import objectReducer from './state/mapObjectsState'
import wktReducer from './state/wktState'
import featureReducer from './state/featureState'
import panelReducer from './state/panelState'

export const store = configureStore({
  reducer: {
    object: objectReducer,
    wkt: wktReducer,
    feature: featureReducer,
    panel: panelReducer
  },
})