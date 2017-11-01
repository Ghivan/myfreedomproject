import _ from 'lodash';
import ActionTypes from './LocationActionTypes';

const initialState = {
    list: {}
};

const reducerFetchLocationsList = (state, action) => {
    const normalizedLocations = _.keyBy(action.payload.locations, location => location.id);
    return {
        ...state,
        list: normalizedLocations
    };
};

const reducerAddLocation = (state, action) => {
    const newLocationsList = Object.assign({}, state.list);
    newLocationsList[action.payload.location.id] = action.payload.location;
    return {
        ...state,
        list: newLocationsList
    };
};

const reducerUpdateLocation = (state, action) => {
    const newLocationsList = Object.assign({}, state.list);
    newLocationsList[action.payload.location.id] = action.payload.location;
    return {
        ...state,
        list: newLocationsList
    };
};

const reducerDeleteLocation = (state, action) => {
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
            return reducerFetchLocationsList(state, action);
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
