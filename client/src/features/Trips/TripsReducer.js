import _ from 'lodash';
import ActionTypes from './TripsActionTypes';

const initialState = {
    trips: {}
};


const reducerFetchTrips = (state, action) => {
    const normalizedTrips = _.keyBy(action.payload.trips, trip => trip.id);
    return {
        ...state,
        trips: normalizedTrips
    };
};


const reducerAddTrip = (state, action) => {
    const newTripsList = _.cloneDeep(state.trips);
    newTripsList[action.payload.trip.id] = action.payload.trip;
    return {
        ...state,
        trips: newTripsList
    };
};

const reducerUpdateTrip = (state, action) => {
    const newTripsList = _.cloneDeep(state.trips);
    newTripsList[action.payload.trip.id] = action.payload.trip;
    return {
        ...state,
        trips: newTripsList
    };
};

const reducerDeleteTrip = (state, action) => {
    const newTripsList = _.cloneDeep(state.trips);
    delete newTripsList[action.payload.id];
    return {
        ...state,
        trips: newTripsList
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_LIST:
            return reducerFetchTrips(state, action);
        case ActionTypes.ADD_TRIP:
            return reducerAddTrip(state, action);
        case ActionTypes.UPDATE_TRIP:
            return reducerUpdateTrip(state, action);
        case ActionTypes.DELETE_TRIP:
            return reducerDeleteTrip(state, action);
        default:
            return state
    }
};