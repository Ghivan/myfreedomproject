import _ from 'lodash';
import ActionTypes from './LocationActionTypes';

const initialState = {
    locations: {}
};

const reducerFetchLocations = (state, action) => {
    const normalizedLocations = _.keyBy(action.payload.locations, location => location.id);
    return {
        ...state,
        locations: normalizedLocations
    };
};

const reducerAddLocation = (state, action) => {
    const newLocationsList = _.cloneDeep(state.locations);
    newLocationsList[action.payload.location.id] = action.payload.location;
    return {
        ...state,
        locations: newLocationsList
    };
};

const reducerUpdateLocation = (state, action) => {
    const newLocationsList = _.cloneDeep(state.locations);
    newLocationsList[action.payload.location.id] = action.payload.location;
    return {
        ...state,
        locations: newLocationsList
    };
};

const reducerDeleteLocation = (state, action) => {
    const newLocationsList = _.cloneDeep(state.locations);
    delete newLocationsList[action.payload.id];
    return {
        ...state,
        locations: newLocationsList
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_LIST:
            return reducerFetchLocations(state, action);
        case ActionTypes.ADD_LOCATION:
            return reducerAddLocation(state, action);
        case ActionTypes.UPDATE_LOCATION:
            return reducerUpdateLocation(state, action);
        case ActionTypes.DELETE_LOCATION:
            return reducerDeleteLocation(state, action);
        default:
            return state
    }
};
