import {composeWithDevTools} from 'redux-devtools-extension'
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import LocationReducer from './features/Locations/LocationsReducer';
import TripsReducer from './features/Trips/TripsReducer';

const CombinedReducer = combineReducers({
        locations: LocationReducer,
        trips: TripsReducer
    }
);

const store = createStore(CombinedReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;