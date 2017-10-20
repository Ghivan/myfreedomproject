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
            itemsPerPage: 5,
            confirmationBlockConfig: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            }
        };
        this.props.getLocations();
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
                    <MainMenu />
                    <ErrorBlock message={this.state.errors}
                                clearError={() => this.setState({errors: ''})}
                    />
                    <ConfirmationBlock status={this.state.confirmationBlockConfig.isShown}
                                       message={this.state.confirmationBlockConfig.message}
                                       resolve={this.state.confirmationBlockConfig.onResolve}
                                       reject={this.state.confirmationBlockConfig.onReject}
                    />
                    <Switch>
                        <Route exact path="/" component={MainPage}/>
                        <Route path="/locations">
                            <LocationsRouter locations={this.props.locations}
                                             remove={this.props.deleteLocation}
                                             add={this.props.addLocation}
                                             selectedLocation={this.props.selectedLocation}
                                             selectLocation={this.props.selectLocation}
                                             clearSelectedLocation={this.props.clearSelectedLocation}
                                             update={this.props.updateLocation}
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