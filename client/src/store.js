import {composeWithDevTools} from 'redux-devtools-extension'
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import LocationReducer from './features/Locations/LocationsReducer';
import TripsReducer from './features/Trips/TripsReducer';
import CustomersReducer from './features/Customers/CustomersReducer';

const CombinedReducer = combineReducers({
        locations: LocationReducer,
        trips: TripsReducer,
        customers: CustomersReducer
    }
);

const store = createStore(CombinedReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;