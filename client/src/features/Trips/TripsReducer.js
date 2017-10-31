import _ from 'lodash';

const ActionTypes = {
    GET_LIST: 'TRIPS/ GET LIST',
    SELECT: 'TRIPS/ SELECT',
    CLEAR_SELECTED_TRIP: 'TRIPS/ CLEAR SELECTED',
    ADD_TRIP: 'TRIPS/ ADD',
    UPDATE_TRIP: 'TRIPS/ UPDATE',
    DELETE_TRIP: 'TRIPS/ DELETE'
};

const initialState = {
    list: [],
};

export const fetchTripsList = trips => ({
        type: ActionTypes.GET_LIST,
        payload: {
            trips
        }
    });

const __fetchTripsList = (state, action) => {
    const normalizedTrips = _.keyBy(action.payload.trips, trip => trip.id);
    return {
        ...state,
        list: normalizedTrips
    };
};

export const addTrip = trip => ({
        type: ActionTypes.ADD_TRIP,
        payload: {
            trip
        }
    });

const __addTrip = (state, action) => {
    const newTripsList = Object.assign({}, state.list);
    newTripsList[action.payload.trip.id] = action.payload.trip;
    return {
        ...state,
        list: newTripsList
    };
};

export const updateTrip = trip => ({
        type: ActionTypes.UPDATE_TRIP,
        payload: {
            trip
        }
    });

const __updateTrip = (state, action) => {
    const newTripsList = Object.assign({}, state.list);
    newTripsList[action.payload.trip.id] = action.payload.trip;
    return {
        ...state,
        list: newTripsList
    };
};

export const deleteTrip = tripId => ({
        type: ActionTypes.DELETE_TRIP,
        payload: {
            id: tripId
        }
    });

const __deleteTrip = (state, action) => {
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
            return __fetchTripsList(state, action);
        case ActionTypes.ADD_TRIP:
            return __addTrip(state, action);
        case ActionTypes.UPDATE_TRIP:
            return __updateTrip(state, action);
        case ActionTypes.DELETE_TRIP:
            return __deleteTrip(state, action);
        default:
            return state
    }
};