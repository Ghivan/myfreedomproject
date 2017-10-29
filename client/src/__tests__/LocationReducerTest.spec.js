import configureStore from 'redux-mock-store'

import {APIDriver} from "../api/api";
import {LocationService} from "../features/Locations/LocationsService";
import LocationsReducer, {
    ActionTypes,
    fetchLocationsList,
    deleteLocation
} from '../features/Locations/LocationsReducer';



const mockStore = configureStore();
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

    store.dispatch(fetchLocationsList(receivedLocations));

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

    store.dispatch(deleteLocation(locationToDelete.id));

    const actionEmitted = store.getActions()[0];
    const updatedState = LocationsReducer(initialState, actionEmitted);
    const index = updatedState.list.findIndex(location => location.id === locationToDelete.id);

    expect(actionEmitted.type).toBe(ActionTypes.DELETE_LOCATION);
    expect(index).toBe(-1);
});

it('LocationsService should receive locations list from server', () => {
    const originalAPIGetAllFn = APIDriver.getAll;
    const locationsList = getLocationsList();
    const initialState = {
        list: []
    };
    const store = mockStore(initialState);
    APIDriver.getAll = () =>  Promise.resolve(locationsList);

    LocationService.fetchLocations()(store.dispatch).then(() => {
        const actionEmitted = store.getActions()[0];
        const updatedState = LocationsReducer(initialState, actionEmitted);

        APIDriver.getAll = originalAPIGetAllFn;
        expect(actionEmitted.type).toBe(ActionTypes.GET_LIST);
        expect(updatedState.list).toEqual(locationsList);
    });
});