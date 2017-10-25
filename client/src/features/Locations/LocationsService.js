import {APIDriver} from '../../api/api';
import {
    fetchLocationsList,
    addLocation,
    updateLocation,
    deleteLocation,
} from './LocationsReducer';

import { setError } from '../Global/Errors/ErrorReducer';

export const LocationService = {
    fetchLocations: () => {
        return (dispatch) => {
            APIDriver.getAll('locations')
                .then((locations) => {
                    fetchLocationsList(dispatch, locations);
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    },

    addLocation: (location) => {
        return (dispatch) => {
            APIDriver.add('locations', location)
                .then((location) => {
                    addLocation(dispatch, location)
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    },

    updateLocation: (locationId, updatedLocation) => {
        return (dispatch) => {
            APIDriver.update('locations', locationId, updatedLocation)
                .then((location) => {
                    updateLocation(dispatch, location);
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    },

    deleteLocation: (locationId) => {
        return (dispatch) => {
            APIDriver.remove('locations', locationId)
                .then((location) => {
                    deleteLocation(dispatch, locationId);
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    }
};
