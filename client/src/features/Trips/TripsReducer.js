import _ from 'lodash';
import ActionTypes from './TripsActionTypes';

const initialState = {
    list: [],
};


const reducerFetchTripsList = (state, action) => {
    const normalizedTrips = _.keyBy(action.payload.trips, trip => trip.id);
    return {
        ...state,
        list: normalizedTrips
    };
};


const reducerAddTrip = (state, action) => {
    const newTripsList = Object.assign({}, state.list);
    newTripsList[action.payload.trip.id] = action.payload.trip;
    return {
        ...state,
        list: newTripsList
    };
};

const reducerUpdateTrip = (state, action) => {
    const newTripsList = Object.assign({}, state.list);
    newTripsList[action.payload.trip.id] = action.payload.trip;
    return {
        ...state,
        list: newTripsList
    };
};

const reducerDeleteTrip = (state, action) => {
    const newTripsList = Object.assign({}, state.list);
    delete newTripsList[action.payload.id];
    return {
        ...state,
        list: newTripsList
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_LIST:
            return reducerFetchTripsList(state, action);
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