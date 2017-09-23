import React from 'react';

import {APIDriver} from './api/api';
import {Entities} from './configs/entities';

import {MainMenu} from './components/menu/menu';
import {ErrorBlock} from './components/errors/error';
import {ConfirmBlock} from './components/popups/confirm'
import Locations from './components/locations/location';
import Trips from './components/trips/trip';
import Customers from './components/customers/customer';

const Screens = {
    LOCATIONS: 'Locations',
    TRIPS: 'Trips',
    CUSTOMERS: 'Customers'
};

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            _currentScreen: Screens.LOCATIONS,
            errors: '',
            locations: [],
            trips: [],
            customers: [],
            popup: {
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

    updateAllData = () => {
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

    changeScreen = (screen) =>{
        this.setState({
            _currentScreen: screen,
            errors: ''}
        );
        this.updateAllData();
    };

    showPopup = (message, onResolve, onReject) => {
        this.setState({
            popup: {
                isShown: true,
                message,
                onResolve,
                onReject
            }
        })
    };

    hidePopup = () => {
        this.setState({
            popup: {
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
            .then(newData => {
                if (newData.error){
                    this.setState({errors: newData.error});
                    console.warn(newData)
                } else {
                    this.updateAllData()
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

    clearError = () => {
        if (this.state.errors){
            this.setState({errors: ''});
        }
    };

    renderScreen(){
        if (this.state._currentScreen === Screens.LOCATIONS) {
            return (
                <Locations locations={this.state.locations}
                           add={this.add(Entities.LOCATION)}
                           remove={this.remove(Entities.LOCATION)}
                           getById={this.getById(Entities.LOCATION)}
                           update={this.update(Entities.LOCATION)}
                           showPopup={this.showPopup}
                           hidePopup={this.hidePopup}
                />
            )
        }
        if (this.state._currentScreen === Screens.TRIPS){
            return (
                <Trips trips={this.state.trips}
                       locations={this.state.locations}
                       add={this.add(Entities.TRIP)}
                       remove={this.remove(Entities.TRIP)}
                       getById={this.getById(Entities.TRIP)}
                       update={this.update(Entities.TRIP)}
                       showPopup={this.showPopup}
                       hidePopup={this.hidePopup}
                />
            )
        }
        if (this.state._currentScreen === Screens.CUSTOMERS){
            return (
                <Customers customers={this.state.customers}
                           trips={this.state.trips}
                           add={this.add(Entities.CUSTOMER)}
                           remove={this.remove(Entities.CUSTOMER)}
                           getById={this.getById(Entities.CUSTOMER)}
                           update={this.update(Entities.CUSTOMER)}
                           showPopup={this.showPopup}
                           hidePopup={this.hidePopup}
                />
            );
        }

    }

    render() {

        return (
            <div>
                <MainMenu screens={Screens}
                          activeScreen={this.state._currentScreen}
                          changeScreen={this.changeScreen} />
                <ErrorBlock message={this.state.errors}
                            clearError={this.clearError}
                />
                <ConfirmBlock status={this.state.popup.isShown}
                              message={this.state.popup.message}
                              resolve={this.state.popup.onResolve}
                              reject={this.state.popup.onReject}
                />
                {this.renderScreen()}
            </div>
        );
    }
}

export default App;
