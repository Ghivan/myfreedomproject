import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import {APIDriver} from './api/api';

import {MainMenu} from './features/Global/Menu/Menu';
import {ErrorBlock} from './features/Global/Errors/ErrorMessage';
import {ConfirmationBlock} from './features/Global/Popups/ConfirmationBlock'

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
    constructor(props) {
        super(props);
        this.state = {
            locations: [],
            trips: [],
            customers: [],
            itemsPerPage: 5,
            confirmationBlockConfig: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            }
        };
    }

    componentDidMount(){
        this.updateAllData();
    }

    updateAllData = (props) => {
        Promise.all([
            APIDriver.getAll(Entities.LOCATION),
            APIDriver.getAll(Entities.TRIP),
            APIDriver.getAll(Entities.CUSTOMER)
        ]).then(([locations, trips, customers]) => {
            this.setState({
                locations,
                trips,
                customers
            });
        })
            .catch(err => {
                this.setState({
                    errors: err.statusMessage
                })
            });
    };

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

    add = (entity) => {
        return (data) => APIDriver
            .add(entity, data)
            .then(() => {
                this.updateAllData()
            })
            .catch(err => {
                this.setState({errors: err.message});
            });
    };

    remove = (entity) => {
        return (id) => APIDriver
            .remove(entity, id)
            .then(deletedEntity => {
                this.updateAllData()
            })
            .catch(err => {
                this.setState({errors: err.message});
            });
    };

    getById = (entity) => {
        return (id) => APIDriver
            .getById(entity, id)
            .catch(err => {
                if (err.message !== '404'){
                    this.setState({errors: err.message});
                }
            });
    };

    update = (entity) => {
        return (id, data) => APIDriver
            .update(entity, id, data)
            .then(updatedEntity => {
                this.updateAllData()
            })
            .catch(err => {
                if (err.message !== '404'){
                    this.setState({errors: err.message});
                }
            });
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
                            <LocationsRouter locations={this.state.locations}
                                             remove={this.remove(Entities.LOCATION)}
                                             add={this.add(Entities.LOCATION)}
                                             getById={this.getById(Entities.LOCATION)}
                                             update={this.update(Entities.LOCATION)}
                                             showConfirmationBlock={this.showConfirmationBlock}
                                             hideConfirmationBlock={this.hideConfirmationBlock}
                            />
                        </Route>
                        <Route path="/trips">
                            <TripsRouter trips={this.state.trips}
                                         remove={this.remove(Entities.TRIP)}
                                         allLocations={this.state.locations}
                                         add={this.add(Entities.TRIP)}
                                         getById={this.getById(Entities.TRIP)}
                                         update={this.update(Entities.TRIP)}
                                         showConfirmationBlock={this.showConfirmationBlock}
                                         hideConfirmationBlock={this.hideConfirmationBlock}
                            />
                        </Route>
                        <Route path="/customers">
                            <CustomersRouter customers={this.state.customers}
                                             remove={this.remove(Entities.CUSTOMER)}
                                             allTrips={this.state.trips}
                                             add={this.add(Entities.CUSTOMER)}
                                             getById={this.getById(Entities.CUSTOMER)}
                                             update={this.update(Entities.CUSTOMER)}
                                             showConfirmationBlock={this.showConfirmationBlock}
                                             hideConfirmationBlock={this.hideConfirmationBlock}

                            />
                        </Route>
                        <Route path="/" render={() => <h1 className="alert alert-warning">The page you are looking for is not found</h1>}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
