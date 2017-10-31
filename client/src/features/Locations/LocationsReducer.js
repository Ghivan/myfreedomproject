import _ from 'lodash';

export const ActionTypes = {
    GET_LIST: 'LOCATIONS/ GET LIST',
    SELECT: 'LOCATIONS/ SELECT',
    CLEAR_SELECTED_LOCATION: 'LOCATIONS/ CLEAR SELECTED',
    ADD_LOCATION: 'LOCATIONS/ ADD',
    UPDATE_LOCATION: 'LOCATIONS/ UPDATE',
    DELETE_LOCATION: 'LOCATIONS/ DELETE',
};

const initialState = {
    list: []
};

export const fetchLocationsList = locations => ({
        type: ActionTypes.GET_LIST,
        payload: {
            locations
        }
    });

const __fetchLocationsList = (state, action) => {
    const normalizedLocations = _.keyBy(action.payload.locations, location => location.id);
    return {
        ...state,
        list: normalizedLocations
    };
};

export const addLocation = location => ({
        type: ActionTypes.ADD_LOCATION,
        payload: {
            location
        }
    });

const __addLocation = (state, action) => {
    const newLocationsList = Object.assign({}, state.list);
    newLocationsList[action.payload.location.id] = action.payload.location;
    return {
        ...state,
        list: newLocationsList
    };
};

export const updateLocation = location => ({
        type: ActionTypes.UPDATE_LOCATION,
        payload: {
            location
        }
    });

const __updateLocation = (state, action) => {
    const newLocationsList = Object.assign({}, state.list);
    newLocationsList[action.payload.location.id] = action.payload.location;
    return {
        ...state,
        list: newLocationsList
    };
};

export const deleteLocation = locationId => ({
        type: ActionTypes.DELETE_LOCATION,
        payload: {
            id: locationId
        }
    });

const __deleteLocation = (state, action) => {
    const newLocationsList = Object.assign({}, state.list);
    delete newLocationsList[action.payload.id];
    return {
        ...state,
        list: newLocationsList
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_LIST:
            return __fetchLocationsList(state, action);
        case ActionTypes.ADD_LOCATION:
            return __addLocation(state, action);
        case ActionTypes.UPDATE_LOCATION:
            return __updateLocation(state, action);
        case ActionTypes.DELETE_LOCATION:
            return __deleteLocation(state, action);
        default:
            return state
    }
};