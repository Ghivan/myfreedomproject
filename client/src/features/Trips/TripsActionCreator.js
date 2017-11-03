import ActionTypes from "./TripsActionTypes";
import { setError } from '../Global/Errors/ErrorReducer';

export const fetchTripsList = trips => ({
    type: ActionTypes.GET_LIST,
    payload: {
        trips
    }
});

export const addTrip = trip => ({
    type: ActionTypes.ADD_TRIP,
    payload: {
        trip
    }
});

export const updateTrip = trip => ({
    type: ActionTypes.UPDATE_TRIP,
    payload: {
        trip
    }
});

export const deleteTrip = tripId => ({
    type: ActionTypes.DELETE_TRIP,
    payload: {
        id: tripId
    }
});

export default {
    fetchTrips: () => {
        return (dispatch, getState, api) => {
            return api.getAll('trips')
                .then((trips) => {
                    dispatch(fetchTripsList(trips));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    addTrip: (newTrip) => {
        return (dispatch, getState, api) => {
            return api.add('trips', newTrip)
                .then((trip) => {
                    dispatch(addTrip(trip))
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    updateTrip: (tripId, updatedTrip) => {
        return (dispatch, getState, api) => {
            return api.update('trips', tripId, updatedTrip)
                .then((trip) => {
                    dispatch(updateTrip(trip));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    deleteTrip: (tripId) => {
        return (dispatch, getState, api) => {
            return api.remove('trips', tripId)
                .then((trip) => {
                    dispatch(deleteTrip(tripId));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    }
};
