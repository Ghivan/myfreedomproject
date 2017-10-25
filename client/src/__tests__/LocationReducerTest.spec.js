import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk';

import LocationsReducer, {
    ActionTypes,
    fetchLocationsList,
    deleteLocation
} from '../features/Locations/LocationsReducer';

const mockStore = configureStore([thunk]);
const getInitialState = () => ({
  list: []
});
const getLocationsList = () => [
    {
        id: '1',
        city: 'Paris',
        country: 'France'
    }
];


it('should populate list with received data', () => {
    const initialState = getInitialState();
    const receivedLocations = getLocationsList();
    const store = mockStore(initialState);

    store.dispatch(dispatch => {
        fetchLocationsList(dispatch, receivedLocations)
    });

    const actionEmitted = store.getActions()[0];
    const updatedState = LocationsReducer(initialState, actionEmitted);

    expect(actionEmitted.type).toBe(ActionTypes.GET_LIST);
    expect(updatedState.list).toEqual(receivedLocations);
});

it('should delete location from list', () => {
    const initialState = {
        list: getLocationsList()
    };
    const locationToDelete = initialState.list[0];
    const store = mockStore(initialState);

    store.dispatch(dispatch => {
        deleteLocation(dispatch, locationToDelete.id)
    });

    const actionEmitted = store.getActions()[0];
    const updatedState = LocationsReducer(initialState, actionEmitted);
    const index = updatedState.list.findIndex(location => location.id === locationToDelete.id);

    expect(actionEmitted.type).toBe(ActionTypes.DELETE_LOCATION);
    expect(index).toBe(-1);
});