import {composeWithDevTools} from 'redux-devtools-extension'
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';

import {APIDriver} from './api/api';
import LocationReducer from './features/Locations/LocationsReducer';
import TripsReducer from './features/Trips/TripsReducer';
import CustomersReducer from './features/Customers/CustomersReducer';
import ErrorReducer from './features/Global/Errors/ErrorReducer';

const CombinedReducer = combineReducers({
        locationsScreen: LocationReducer,
        tripsScreen: TripsReducer,
        customersScreen: CustomersReducer,
        errors: ErrorReducer
    }
);

const store = createStore(CombinedReducer, composeWithDevTools(applyMiddleware(thunk.withExtraArgument(APIDriver))));

export default store;