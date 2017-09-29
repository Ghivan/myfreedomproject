import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    withRouter
} from 'react-router-dom';

import {APIDriver} from './api/api';

import {MainMenu} from './features/Global/Menu/Menu';
import {ErrorBlock} from './features/Global/Errors/ErrorMessage';
import {ConfirmationBlock} from './features/Global/Popups/ConfirmationBlock'
import {Paginator} from './features/Global/Paginator/Paginator';

import LocationsTable from "./features/Locations/LocationsTable";
import LocationsForm from "./features/Locations/LocationsForm";
import TripsTable from "./features/Trips/TripsTable";
import TripsForm from "./features/Trips/TripsForm";
import CustomersTable from "./features/Customers/CustomersTable";
import CustomersForm from "./features/Customers/CustomersForm";

const Entities ={
    LOCATION: 'locations',
    TRIP: 'trips',
    CUSTOMER: 'customers'
};

const parseQueryString = (queryString) => {
    return queryString.split('&').reduce(
        (prev, curr) => {
            let currentPare = curr.split('=');
            if (currentPare.length === 2){
                prev[currentPare[0]] = currentPare[1];
            }
            return prev
        }, {}
    );
};

const RouteredLocationsForm = withRouter(LocationsForm);
const RouteredTripsForm = withRouter(TripsForm);
const RouteredCustomersForm = withRouter(CustomersForm);

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
        }).catch(err => {
            this.setState({
                errors: 'Bad connection'
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
            .then(newEntity => {
                if (newEntity.error){
                    this.setState({errors: newEntity.error});
                    console.warn(newEntity)
                } else {
                    this.updateAllData({
                        item: {
                            id: newEntity.id,
                            entity
                        }
                    })
                }
            })
    };

    remove = (entity) => {
        return (id) => APIDriver
            .remove(entity, id)
            .then(deletedEntity => {
                if (deletedEntity.error){
                    this.setState({errors: deletedEntity.error});
                    console.warn(deletedEntity)
                } else {
                    this.updateAllData()
                }
            });
    };

    getById = (entity) => {
        return (id) => APIDriver.getById(entity, id)
    };

    update = (entity) => {
        return (id, data) => APIDriver
            .update(entity, id, data).then(updatedEntity => {
                if (updatedEntity.error){
                    this.setState({
                        errors: updatedEntity.error
                    });
                    console.warn(updatedEntity)
                } else {
                    this.updateAllData()
                }
            })
    };

    getDisplayedItems = (items, pageNumber) => {
        let startIndex = pageNumber*this.state.itemsPerPage - this.state.itemsPerPage;
        if (startIndex >= items.length) {
            return items.slice(-this.state.itemsPerPage)
        } else {
            return items.slice(startIndex, startIndex + this.state.itemsPerPage)
        }
    };


    renderLocationsTable = ({match}) => {
        const queryParams = parseQueryString(window.location.search.substr(1));
        let currentPage = queryParams.page >= 1 ? parseInt(queryParams.page, 10) : 1;
        return (
            <div>
                <LocationsTable locations={this.getDisplayedItems(this.state.locations, currentPage)}
                                remove={this.remove(Entities.LOCATION)}
                                showPopup={this.showConfirmationBlock}
                                hidePopup={this.hideConfirmationBlock}
                />
                <Paginator isShown={this.state.locations.length > this.state.itemsPerPage}
                           currentPage={currentPage}
                           currentElementIndex={null}
                           totalItems={this.state.locations.length}
                           itemsPerPage={this.state.itemsPerPage}
                           urlPrefix={'/locations'}
                />
            </div>
        )
    };

    renderLocationsForm = ({match, history}) => (
        <RouteredLocationsForm  id={match.params.id}
                                add={this.add(Entities.LOCATION)}
                                getById={this.getById(Entities.LOCATION)}
                                update={this.update(Entities.LOCATION)}
                                showPopup={this.showConfirmationBlock}
                                hidePopup={this.hideConfirmationBlock}
                                history={history}
        />
    );

    renderTripsTable = () => {
        const queryParams = parseQueryString(window.location.search.substr(1));
        let currentPage = queryParams.page >= 1 ? parseInt(queryParams.page, 10) : 1;
        return (
            <div>
                <TripsTable trips={this.getDisplayedItems(this.state.trips, currentPage)}
                            remove={this.remove(Entities.TRIP)}
                            showPopup={this.showConfirmationBlock}
                            hidePopup={this.hideConfirmationBlock}
                />
                <Paginator isShown={this.state.trips.length > this.state.itemsPerPage}
                           currentPage={currentPage}
                           currentElementIndex={null}
                           totalItems={this.state.trips.length}
                           itemsPerPage={this.state.itemsPerPage}
                           urlPrefix={'/trips'}
                />
            </div>
        )
    };

    renderTripsForm = ({match, history}) => (
        <RouteredTripsForm  id={match.params.id}
                            allLocations={this.state.locations}
                            add={this.add(Entities.TRIP)}
                            getById={this.getById(Entities.TRIP)}
                            update={this.update(Entities.TRIP)}
                            showPopup={this.showConfirmationBlock}
                            hidePopup={this.hideConfirmationBlock}
                            history={history}
        />
    );

    renderCustomersTable = () => {
        const queryParams = parseQueryString(window.location.search.substr(1));
        let currentPage = queryParams.page >= 1 ? parseInt(queryParams.page, 10) : 1;
        return (
            <div>
                <CustomersTable customers={this.getDisplayedItems(this.state.customers, currentPage)}
                                remove={this.remove(Entities.CUSTOMER)}
                                showPopup={this.showConfirmationBlock}
                                hidePopup={this.hideConfirmationBlock}
                />
                <Paginator isShown={this.state.customers.length > this.state.itemsPerPage}
                           currentPage={currentPage}
                           currentElementIndex={null}
                           totalItems={this.state.customers.length}
                           itemsPerPage={this.state.itemsPerPage}
                           urlPrefix={'/customers'}
                />
            </div>

        )
    };

    renderCustomersForm = ({match, history}) => {
        return <RouteredCustomersForm  id={match.params.id}
                                       allTrips={this.state.trips}
                                       add={this.add(Entities.CUSTOMER)}
                                       getById={this.getById(Entities.CUSTOMER)}
                                       update={this.update(Entities.CUSTOMER)}
                                       showPopup={this.showConfirmationBlock}
                                       hidePopup={this.hideConfirmationBlock}
                                       history={history}
        />
    };

    render() {

        return (
            <Router  getUserConfirmation={((message, callback) => {
                const allowTransition = window.confirm(message)
                callback(allowTransition)
            })}>
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
                        <Route exact path="/" render={() => <h1>Home</h1>}/>

                        <Route exact path="/locations" render={this.renderLocationsTable} />
                        <Route exact path="/locations/add" render={this.renderLocationsForm} />
                        <Route exact path="/locations/:id" render={this.renderLocationsForm} />

                        <Route exact path="/trips" render={this.renderTripsTable}/>
                        <Route exact path="/trips/add" render={this.renderTripsForm}/>
                        <Route exact path="/trips/:id" render={this.renderTripsForm}/>

                        <Route exact path="/customers" render={this.renderCustomersTable}/>
                        <Route exact path="/customers/add" render={this.renderCustomersForm}/>
                        <Route exact path="/customers/:id" render={this.renderCustomersForm}/>

                        <Route path="/" render={() => <h1>Not found</h1>}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;