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

export const fetchTripsList = (dispatch, trips) => {
    dispatch({
        type: ActionTypes.GET_LIST,
        payload: {
            trips
        }
    })
};

const __fetchTripsList = (state, action) => {
    return {
        ...state,
        list: action.payload.trips
    };
};

export const addTrip = (dispatch, trip) => {
    dispatch({
        type: ActionTypes.ADD_TRIP,
        payload: {
            trip
        }
    })
};

const __addTrip = (state, action) => {
    const newTripsList = state.list.slice();
    newTripsList.push(action.payload.trip);
    return {
        ...state,
        list: newTripsList
    };
};

export const updateTrip = (dispatch, trip) => {
    dispatch({
        type: ActionTypes.UPDATE_TRIP,
        payload: {
            trip
        }
    })
};

const __updateTrip = (state, action) => {
    const newTripsList = state.list.slice();
    const index = newTripsList.findIndex(item => item.id === action.payload.trip.id);
    newTripsList.splice(index, 1, action.payload.trip);
    return {
        ...state,
        list: newTripsList
    };
};

export const deleteTrip = (dispatch, tripId) => {
    dispatch({
        type: ActionTypes.DELETE_TRIP,
        payload: {
            id: tripId
        }
    })
};

const __deleteTrip = (state, action) => {
    const newTripsList = state.list.slice();
    const index = newTripsList.findIndex(item => item.id === action.payload.id);
    newTripsList.splice(index, 1);
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