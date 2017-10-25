import React from 'react';

import {connect, Provider} from 'react-redux';

import store from '../store';
import {bindActionCreators} from '../utils/utils';
import {LocationService} from './Locations/LocationsService';
import {TripsService} from './Trips/TripsService';
import {CustomersService} from './Customers/CustomerService';

import {AppRouter} from './AppRouter';

const ActionCreator = {
    ...LocationService,
    ...TripsService,
    ...CustomersService
};

const mapStateToProps = state => state;
const ConnectedRouter = connect(mapStateToProps,
    dispatch => bindActionCreators(dispatch, ActionCreator))(AppRouter);

export const ConnectedApp = () => (
    <Provider store={store}>
        <ConnectedRouter/>
    </Provider>);