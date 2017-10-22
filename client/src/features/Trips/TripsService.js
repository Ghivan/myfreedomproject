import {APIDriver} from '../../api/api';
import {
    fetchTripsList,
    selectTrip,
    clearSelectedTrip,
    addTrip,
    updateTrip,
    deleteTrip,
    setError
} from './TripsReducer';

export const TripsService = {
    fetchTrips: () => {
        return (dispatch) => {
            APIDriver.getAll('trips')
                .then((trips) => {
                    fetchTripsList(dispatch, trips);
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    },

    selectTrip: (id) => {
        return dispatch => {
            selectTrip(dispatch, id);
        }
    },

    clearSelectedTrip: () => {
        return dispatch => {
            clearSelectedTrip(dispatch)
        }
    },

    addTrip: (newTrip) => {
        return (dispatch) => {
            APIDriver.add('trips', newTrip)
                .then((trip) => {
                    addTrip(dispatch, trip)
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    },

    updateTrip: (tripId, updatedTrip) => {
        return (dispatch) => {
            APIDriver.update('trips', tripId, updatedTrip)
                .then((trip) => {
                    updateTrip(dispatch, trip);
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    },

    deleteTrip: (tripId) => {
        return (dispatch) => {
            APIDriver.remove('trips', tripId)
                .then((trip) => {
                    deleteTrip(dispatch, tripId);
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    }
};
