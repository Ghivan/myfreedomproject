import React from 'react';

import {MainMenu} from './features/Global/Menu/Menu';
import {ErrorBlock} from './features/Global/Errors/ErrorMessage';
import {ConfirmationBlock} from './features/Global/Popups/ConfirmationBlock';
import {ConnectedApp} from './features/AppReduxContainer';

import {MainPage} from './features/MainPage/MainPage';
import LocationsRouter from "./features/Locations/LocationsRouter";
import TripsRouter from './features/Trips/TripsRouter';
import CustomersRouter from "./features/Customers/CustomersRouter";

const Entities ={
    LOCATION: 'locations',
    TRIP: 'trips',
    CUSTOMER: 'customers'
};

class App extends React.Component {
    render() {
        return <ConnectedApp />
    }
}

export default App;
