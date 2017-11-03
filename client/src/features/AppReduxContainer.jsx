import React from 'react';

import {connect, Provider} from 'react-redux';

import store from '../store';
import {bindActionCreators} from '../utils/utils';

import LocationActionCreator from './Locations/LocationsActionCreator';
import TripsActionCreator from './Trips/TripsActionCreator';
import {CustomersService} from './Customers/CustomerService';
import {clearError} from './Global/Errors/ErrorReducer';

import {AppRouter} from './AppRouter';

const ActionCreator = {
    ...LocationActionCreator,
    ...TripsActionCreator,
    ...CustomersService,
    clearError
};

const mapStateToProps = state => state;
const ConnectedRouter = connect(mapStateToProps,
    dispatch => bindActionCreators(dispatch, ActionCreator))(AppRouter);

export const ConnectedApp = () => (
    <Provider store={store}>
        <ConnectedRouter/>
    </Provider>);