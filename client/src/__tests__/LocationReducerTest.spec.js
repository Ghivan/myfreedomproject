import _ from 'lodash';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store'

import LocationActionCreator, {
    fetchLocationsList,
    deleteLocation
} from '../features/Locations/LocationsActionCreator';
import LocationsReducer from '../features/Locations/LocationsReducer';
import ActionTypes from '../features/Locations/LocationActionTypes';

const getInitialState = () => ({
    list: {}
});
const getLocationsList = () => [
    {
        id: '1',
        city: 'Paris',
        country: 'France'
    }
];
const getNormalizedLocationList = () => {
    const list = getLocationsList();
    return _.keyBy(list, list => list.id)
};

const middlewares = [thunk.withExtraArgument({
    getAll: () => Promise.resolve(getLocationsList())
})];
const mockStore = configureStore(middlewares);

it('should populate list with received data', () => {
    const initialState = getInitialState();
    const receivedLocations = getLocationsList();
    const normalizedLocations = getNormalizedLocationList();
    const store = mockStore(initialState);

    store.dispatch(fetchLocationsList(receivedLocations));

    const actionEmitted = store.getActions()[0];
    const updatedState = LocationsReducer(initialState, actionEmitted);

    expect(actionEmitted.type).toBe(ActionTypes.GET_LIST);
    expect(updatedState.list).toEqual(normalizedLocations);
});

it('should delete location from list', () => {
    const initialState = {
        list: getNormalizedLocationList()
    };
    const locationsIds = Object.keys(initialState.list);
    const locationToDelete = locationsIds[0];
    const store = mockStore(initialState);

    store.dispatch(deleteLocation(locationToDelete));

    const actionEmitted = store.getActions()[0];
    const updatedState = LocationsReducer(initialState, actionEmitted);

    expect(actionEmitted.type).toBe(ActionTypes.DELETE_LOCATION);
    expect(updatedState.list[locationToDelete]).toBeFalsy();
});

it('LocationsService should receive locations list from server', () => {
    const normalizedLocationList = getNormalizedLocationList();
    const initialState = {
        list: {}
    };
    const store = mockStore(initialState);

    store.dispatch(LocationActionCreator.fetchLocations())
        .then(() => {
            const actionEmitted = store.getActions()[0];
            const updatedState = LocationsReducer(initialState, actionEmitted);

            expect(actionEmitted.type).toBe(ActionTypes.GET_LIST);
            expect(updatedState.list).toEqual(normalizedLocationList);
        });
});