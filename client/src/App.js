import React from 'react';

import {APIDriver} from './api/api';
import {Entities} from './configs/entities';

import {MainMenu} from './components/menu/menu';
import {ErrorBlock} from './components/errors/error';
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
            errors: ''
        };
        this.state[Entities.LOCATION] = [];
        this.state[Entities.TRIP] = [];
        this.state[Entities.CUSTOMER] = [];
    }

    componentDidMount(){
        this.updateAllData();
    }

    updateAllData = () => {
        APIDriver.getAll(Entities.LOCATION)
            .then(locations => {
                this.setState((prevState)=>{
                    prevState[Entities.LOCATION] = locations
                });
            });
        APIDriver.getAll(Entities.TRIP)
            .then(trips => {
                this.setState((prevState)=>{
                    prevState[Entities.TRIP] = trips
                });
            });
        APIDriver.getAll(Entities.CUSTOMER)
            .then(customers => {
                this.setState((prevState)=>{
                    prevState[Entities.CUSTOMER] = customers
                });
            });
    };

    changeScreen = (screen) =>{
        this.setState({
            _currentScreen: screen,
            errors: ''}
        );
        this.updateAllData();
    };

    add = (entity) => {
        return (data) => APIDriver
            .add(entity, data)
            .then(newData => {
                if (newData.error){
                    this.setState({errors: newData.error});
                    console.warn(newData)
                } else {
                    this.setState((prevState)=>{
                        prevState[entity].push(newData);
                    });
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
                    this.setState((prevState)=>{
                        let index = prevState[entity].findIndex((elem) => elem.id === deletedEntity.id);
                        prevState[entity].splice(index,1);
                    });
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
                    this.setState({errors: updatedEntity.error});
                    console.warn(updatedEntity)
                } else {
                    this.setState((prevState) => {
                        let index = prevState[entity].findIndex((elem) => elem.id === updatedEntity.id);
                        prevState[entity].splice(index, 1, updatedEntity);
                    });
                }
            })
    };

    render() {
        if (this.state._currentScreen === Screens.LOCATIONS){
            return (
                <div>
                    <MainMenu screens={Screens}
                              activeScreen={this.state._currentScreen}
                              changeScreen={this.changeScreen} />
                    <ErrorBlock message={this.state.errors}
                                clearError={()=>this.setState({errors: ''})}
                    />
                    <Locations locations={this.state[Entities.LOCATION]}
                               add={this.add(Entities.LOCATION)}
                               remove={this.remove(Entities.LOCATION)}
                               getById={this.getById(Entities.LOCATION)}
                               update={this.update(Entities.LOCATION)}
                    />
                </div>
            );
        }
        if (this.state._currentScreen === Screens.TRIPS){
            return (
                <div>
                    <MainMenu screens={Screens}
                              activeScreen={this.state._currentScreen}
                              changeScreen={this.changeScreen} />
                    <ErrorBlock message={this.state.errors}
                                clearError={()=>this.setState({errors: ''})}
                    />
                    <Trips trips={this.state[Entities.TRIP]}
                           add={this.add(Entities.TRIP)}
                           remove={this.remove(Entities.TRIP)}
                           getById={this.getById(Entities.TRIP)}
                           update={this.update(Entities.TRIP)}
                    />
                </div>
            );
        }
        if (this.state._currentScreen === Screens.CUSTOMERS){
            return (
                <div>
                    <MainMenu screens={Screens}
                              activeScreen={this.state._currentScreen}
                              changeScreen={this.changeScreen} />
                    <ErrorBlock message={this.state.errors}
                                clearError={()=>this.setState({errors: ''})}
                    />
                    <Customers customers={this.state[Entities.CUSTOMER]}
                               add={this.add(Entities.CUSTOMER)}
                               remove={this.remove(Entities.CUSTOMER)}
                               getById={this.getById(Entities.CUSTOMER)}
                               update={this.update(Entities.CUSTOMER)}
                    />
                </div>
            );
        }

    }
}

export default App;
