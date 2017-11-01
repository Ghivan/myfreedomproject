import ActionTypes from './LocationActionTypes';

import { setError } from '../Global/Errors/ErrorReducer';

export const fetchLocationsList = locations => ({
    type: ActionTypes.GET_LIST,
    payload: {
        locations
    }
});

export const addLocation = location => ({
    type: ActionTypes.ADD_LOCATION,
    payload: {
        location
    }
});

export const updateLocation = location => ({
    type: ActionTypes.UPDATE_LOCATION,
    payload: {
        location
    }
});

export const deleteLocation = locationId => ({
    type: ActionTypes.DELETE_LOCATION,
    payload: {
        id: locationId
    }
});

export default {
    fetchLocations: () => {
        return (dispatch, getState, api) => {
            return api.getAll('locations')
                .then((locations) => {
                    dispatch(fetchLocationsList(locations));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    addLocation: (location) => {
        return (dispatch, getState, api) => {
            api.add('locations', location)
                .then((location) => {
                    dispatch(addLocation(location))
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    updateLocation: (locationId, updatedLocation) => {
        return (dispatch, getState, api) => {
            return api.update('locations', locationId, updatedLocation)
                .then((location) => {
                    dispatch(updateLocation(location));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    deleteLocation: (locationId) => {
        return (dispatch, getState, api) => {
            return api.remove('locations', locationId)
                .then(() => {
                    dispatch(deleteLocation(locationId));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    }
};
