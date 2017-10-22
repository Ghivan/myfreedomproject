const ActionTypes = {
    GET_LIST: 'LOCATIONS/ GET LIST',
    SELECT: 'LOCATIONS/ SELECT',
    CLEAR_SELECTED_LOCATION: 'LOCATIONS/ CLEAR SELECTED',
    ADD_LOCATION: 'LOCATIONS/ ADD',
    UPDATE_LOCATION: 'LOCATIONS/ UPDATE',
    DELETE_LOCATION: 'LOCATIONS/ DELETE',
    ERROR_OCCURRED: 'LOCATIONS/ ERROR OCCURRED'
};

const initialState = {
    list: [],
    errorMessage: '',
    selectedLocation: null
};

export const fetchLocationsList = (dispatch, locations) => {
    dispatch({
        type: ActionTypes.GET_LIST,
        payload: {
            locations
        }
    })
};

const __fetchLocationsList = (state, action) => {
    return {
        ...state,
        list: action.payload.locations
    };
};


export const selectLocation = (dispatch, id) => {
    dispatch({
        type: ActionTypes.SELECT,
        payload: {
            selectedLocation: id
        }
    })
};

const __selectLocation = (state, action) => {
    const location = state.list.find(item => item.id === action.payload.selectedLocation);
    return {
        ...state,
        selectedLocation: location
    };
};

export const clearSelectedLocation = (dispatch) => {
    dispatch({
        type: ActionTypes.CLEAR_SELECTED_LOCATION
    })
};

const __clearSelectedLocation = (state) => {
    return {
        ...state,
        selectedLocation: null
    };
};

export const addLocation = (dispatch, location) => {
    dispatch({
        type: ActionTypes.ADD_LOCATION,
        payload: {
            location
        }
    })
};

const __addLocation = (state, action) => {
    const newLocationsList = state.list.slice();
    newLocationsList.push(action.payload.location);
    return {
        ...state,
        list: newLocationsList
    };
};

export const updateLocation = (dispatch, location) => {
    dispatch({
        type: ActionTypes.UPDATE_LOCATION,
        payload: {
            location
        }
    })
};

const __updateLocation = (state, action) => {
    const newLocationsList = state.list.slice();
    const index = newLocationsList.findIndex(item => item.id === action.payload.location.id);
    newLocationsList.splice(index, 1, action.payload.location);
    return {
        ...state,
        list: newLocationsList
    };
};

export const deleteLocation = (dispatch, locationId) => {
    dispatch({
        type: ActionTypes.DELETE_LOCATION,
        payload: {
            id: locationId
        }
    })
};

const __deleteLocation = (state, action) => {
    const newLocationsList = state.list.slice();
    const index = newLocationsList.findIndex(item => item.id === action.payload.id);
    newLocationsList.splice(index, 1);
    return {
        ...state,
        list: newLocationsList
    };
};

export const setError = (dispatch, message) => {
    dispatch({
        type: ActionTypes.ERROR_OCCURRED,
        payload: {
            errorMessage: message
        }
    })
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
            return __fetchLocationsList(state, action);
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