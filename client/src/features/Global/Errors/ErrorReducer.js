const ActionTypes = {
    ERROR_OCCURRED: 'ERRORS/ ERROR OCCURRED',
    CLEAR_ERROR: 'ERRORS/ CLEAR'
};

const initialState = {
    message: ''
};

export const setError = (dispatch, message) => {
    dispatch({
        type: ActionTypes.ERROR_OCCURRED,
        payload: {
            message
        }
    })
};

const __setError = (state, action) => {
    return {
        ...state,
        message: action.payload.message
    };
};

export const clearError = () => dispatch => {
    dispatch({
        type: ActionTypes.CLEAR_ERROR
    })
};

const __clearError = (state) => {
    return {
        ...state,
        message: ''
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.ERROR_OCCURRED:
            return __setError(state, action);
            case ActionTypes.CLEAR_ERROR:
            return __clearError(state);
        default:
            return state
    }
};