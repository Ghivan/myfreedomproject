import {composeWithDevTools} from 'redux-devtools-extension'
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import LocationReducer from './features/Locations/LocationsReducer';

const store = createStore(LocationReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;