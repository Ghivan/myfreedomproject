import {APIDriver} from '../../api/api';
import {
    fetchTripsList,
    addTrip,
    updateTrip,
    deleteTrip
} from './TripsReducer';

import { setError } from '../Global/Errors/ErrorReducer';

export const TripsService = {
    fetchTrips: () => {
        return (dispatch) => {
            return APIDriver.getAll('trips')
                .then((trips) => {
                    dispatch(fetchTripsList(trips));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    addTrip: (newTrip) => {
        return (dispatch) => {
            return APIDriver.add('trips', newTrip)
                .then((trip) => {
                    dispatch(addTrip(trip))
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    updateTrip: (tripId, updatedTrip) => {
        return (dispatch) => {
            return APIDriver.update('trips', tripId, updatedTrip)
                .then((trip) => {
                    dispatch(updateTrip(trip));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    deleteTrip: (tripId) => {
        return (dispatch) => {
            return APIDriver.remove('trips', tripId)
                .then((trip) => {
                    dispatch(deleteTrip(tripId));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    }
};
