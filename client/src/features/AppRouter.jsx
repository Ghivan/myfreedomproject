import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import {MainMenu} from './Global/Menu/Menu';
import {ErrorBlock} from './Global/Errors/ErrorMessage';
import {ConfirmationBlock} from './Global/Popups/ConfirmationBlock'

import {MainPage} from './MainPage/MainPage';
import LocationsRouter from "./Locations/LocationsRouter";
import TripsRouter from './Trips/TripsRouter';
import CustomersRouter from "./Customers/CustomersRouter";


export class AppRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmationBlockConfig: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            }
        };
    }

    componentWillMount() {
        this.props.fetchLocations();
        this.props.fetchTrips();
        this.props.fetchCustomers();
    }


    showConfirmationBlock = (message, onResolve, onReject) => {
        this.setState({
            confirmationBlockConfig: {
                isShown: true,
                message,
                onResolve,
                onReject
            }
        })
    };

    hideConfirmationBlock = () => {
        this.setState({
            confirmationBlockConfig: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            }
        })
    };

    render() {
        return (
            <Router>
                <div>
                    <MainMenu/>
                    <ErrorBlock message={this.props.errors.message}
                                clearError={this.props.clearError}
                    />
                    <ConfirmationBlock status={this.state.confirmationBlockConfig.isShown}
                                       message={this.state.confirmationBlockConfig.message}
                                       resolve={this.state.confirmationBlockConfig.onResolve}
                                       reject={this.state.confirmationBlockConfig.onReject}
                    />
                    <Switch>
                        <Route exact path="/" component={MainPage}/>
                        <Route path="/locations">
                            <LocationsRouter locations={this.props.locationsScreen.locations}
                                             remove={this.props.deleteLocation}
                                             add={this.props.addLocation}
                                             update={this.props.updateLocation}
                                             showConfirmationBlock={this.showConfirmationBlock}
                                             hideConfirmationBlock={this.hideConfirmationBlock}
                            />
                        </Route>
                        <Route path="/trips">
                            <TripsRouter trips={this.props.tripsScreen.trips}
                                         remove={this.props.deleteTrip}
                                         allLocations={this.props.locationsScreen.locations}
                                         add={this.props.addTrip}
                                         update={this.props.updateTrip}
                                         showConfirmationBlock={this.showConfirmationBlock}
                                         hideConfirmationBlock={this.hideConfirmationBlock}
                            />
                        </Route>
                        <Route path="/customers">
                            <CustomersRouter customers={this.props.customersScreen.customers}
                                             remove={this.props.deleteCustomer}
                                             allTrips={this.props.tripsScreen.trips}
                                             add={this.props.addCustomer}
                                             update={this.props.updateCustomer}
                                             showConfirmationBlock={this.showConfirmationBlock}
                                             hideConfirmationBlock={this.hideConfirmationBlock}

                            />
                        </Route>
                        <Route path="/"
                               render={() => <h1 className="alert alert-warning">The page you are looking for is not
                                   found</h1>}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}