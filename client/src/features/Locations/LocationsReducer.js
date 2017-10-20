export const ActionTypes = {
    GET_LIST: 'LOCATIONS/ GET LIST',
    SELECT: 'LOCATIONS/ SELECT',
    CLEAR_SELECTED_LOCATION: 'LOCATIONS/ CLEAR SELECTED',
    ADD_LOCATION: 'LOCATIONS/ UPDATE',
    UPDATE_LOCATION: 'LOCATIONS/ ADD',
    DELETE_LOCATION: 'LOCATIONS/ DELETE',
    ERROR_OCCURRED: 'LOCATIONS/ ERROR OCCURRED'
};

const initialState = {
    locations: [],
    errorMessage: '',
    selectedLocation: null
};

const __getLocationsList = (state, action) => {
    return {
        ...state,
        locations: action.payload.locations
    };
};

const __selectLocation = (state, action) => {
    const location = state.locations.find(item => item.id === action.payload.selectedLocation);
    return {
        ...state,
        selectedLocation: location
    };
};

const __clearSelectedLocation = (state) => {
    return {
        ...state,
        selectedLocation: null
    };
};

const __addLocation = (state, action) => {
    const newLocationsList = state.locations.slice();
    newLocationsList.push(action.payload.location);
    return {
        ...state,
        locations: newLocationsList
    };
};

const __updateLocation = (state, action) => {
    const newLocationsList = state.locations.slice();
    const index = newLocationsList.findIndex(item => item.id === action.payload.location.id);
    newLocationsList.splice(index, 1, action.payload.location)
    return {
        ...state,
        locations: newLocationsList
    };
};

const __deleteLocation = (state, action) => {
    const newLocationsList = state.locations.slice();
    const index = newLocationsList.findIndex(item => item.id === action.payload.id);
    newLocationsList.splice(index, 1);
    return {
        ...state,
        locations: newLocationsList
    };
};

const __setError = (state, action) => {
    return {
        ...state,
        errorMessage: action.payload.errorMessage
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_LIST:
            return __getLocationsList(state, action);
        case ActionTypes.SELECT:
            return __selectLocation(state, action);
        case ActionTypes.CLEAR_SELECTED_LOCATION:
            return __clearSelectedLocation(state);
        case ActionTypes.ADD_LOCATION:
            return __addLocation(state, action);
        case ActionTypes.UPDATE_LOCATION:
            return __updateLocation(state, action);
        case ActionTypes.DELETE_LOCATION:
            return __deleteLocation(state, action);
        case ActionTypes.ERROR_OCCURRED:
            return __setError(state, action);
        default:
            return state
    }
};