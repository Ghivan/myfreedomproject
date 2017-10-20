import {APIDriver} from '../../api/api';
import {ActionTypes} from './LocationsReducer';

export const LocationService = {
    getLocations: () => {
        return (dispatch) => {
            APIDriver.getAll('locations')
                .then((locations) => {
                    dispatch({
                        type: ActionTypes.GET_LIST,
                        payload: {
                            locations
                        }
                    })
                })
                .catch(err => {
                    dispatch({
                        type: ActionTypes.ERROR_OCCURRED,
                        payload: {
                            errorMessage: err.message
                        }
                    })
                })
        };
    },

    selectLocation: (id) => {
        return dispatch => {
            dispatch({
                type: ActionTypes.SELECT,
                payload: {
                    selectedLocation: id
                }
            })
        }
    },

    clearSelectedLocation: () => {
        return dispatch => {
            dispatch({
                type: ActionTypes.CLEAR_SELECTED_LOCATION
            })
        }
    },

    addLocation: (location) => {
        return (dispatch) => {
            APIDriver.add('locations', location)
                .then((location) => {
                    dispatch({
                        type: ActionTypes.ADD_LOCATION,
                        payload: {
                            location
                        }
                    })
                })
                .catch(err => {
                    dispatch({
                        type: ActionTypes.ERROR_OCCURRED,
                        payload: {
                            errorMessage: err.message
                        }
                    })
                })
        };
    },

    updateLocation: (locationId, newLocation) => {
        return (dispatch) => {
            APIDriver.update('locations', locationId, newLocation)
                .then((location) => {
                    dispatch({
                        type: ActionTypes.UPDATE_LOCATION,
                        payload: {
                            location
                        }
                    })
                })
                .catch(err => {
                    dispatch({
                        type: ActionTypes.ERROR_OCCURRED,
                        payload: {
                            errorMessage: err.message
                        }
                    })
                })
        };
    },

    deleteLocation: (locationId) => {
        return (dispatch) => {
            APIDriver.remove('locations', locationId)
                .then((location) => {
                    dispatch({
                        type: ActionTypes.DELETE_LOCATION,
                        payload: {
                            id: location.id
                        }
                    })
                })
                .catch(err => {
                    dispatch({
                        type: ActionTypes.ERROR_OCCURRED,
                        payload: {
                            errorMessage: err.message
                        }
                    })
                })
        };
    }
};
