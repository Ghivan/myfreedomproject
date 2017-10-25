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
                    dispatch(fetchLocationsList(locations));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    addLocation: (location) => {
        return (dispatch) => {
            APIDriver.add('locations', location)
                .then((location) => {
                    dispatch(addLocation(location))
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    updateLocation: (locationId, updatedLocation) => {
        return (dispatch) => {
            APIDriver.update('locations', locationId, updatedLocation)
                .then((location) => {
                    dispatch(updateLocation(location));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    deleteLocation: (locationId) => {
        return (dispatch) => {
            APIDriver.remove('locations', locationId)
                .then((location) => {
                    dispatch(deleteLocation(locationId));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    }
};
