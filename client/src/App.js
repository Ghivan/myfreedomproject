import React from 'react';

import {APIDriver} from './api/api';
import {Entities} from './configs/entities';

import {MainMenu} from './components/menu/menu';
import {ErrorBlock} from './components/errors/error';
import {ConfirmBlock} from './components/popups/confirm'
import {Paginator} from './components/Paginator/paginator';

import Locations from './components/locations/location';
import Trips from './components/trips/trip';
import Customers from './components/customers/customer';

const Screens = {
    LOCATIONS: 'Locations',
    TRIPS: 'Trips',
    CUSTOMERS: 'Customers'
};

const getTotalPages = (totalItems, itemsPerPage) => Math.ceil(totalItems/itemsPerPage);
const getPageNumberForItem = (itemIndex, itemsPerPage) => Math.floor(itemIndex/itemsPerPage) + 1;

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
            },
            paginatorConfig:{
                isShown: true,
                ITEMS_PER_PAGE: 3,
                totalPages: 0,
                currentPage: 1
            },
            displayedData: []
        };
    }

    componentDidMount(){
        this.updateAllData();
    }

    setPagination = () => {
        let length = 0;
        if (this.state._currentScreen === Screens.LOCATIONS){
            length = this.state.locations.length;
        }
        if (this.state._currentScreen === Screens.TRIPS){
            length = this.state.trips.length;
        }
        if (this.state._currentScreen === Screens.CUSTOMERS){
            length = this.state.customers.length;
        }
        let totalPages  = getTotalPages(length, this.state.paginatorConfig.ITEMS_PER_PAGE);
        this.setState((prevState) => {
            return {
                paginatorConfig: {
                    ...prevState.paginatorConfig,
                    isShown: totalPages > 1,
                    totalPages
                }
            }
        });
    };

    goToPage = (pageNumber) => {
        pageNumber = parseInt(pageNumber, 10);
        if (pageNumber > 0 && pageNumber <= this.state.paginatorConfig.totalPages){
            this.setState((prevState) => {
                return {
                    paginatorConfig: {
                        ...prevState.paginatorConfig,
                        currentPage: pageNumber
                    }
                }
            });
        } else {
            pageNumber = this.state.paginatorConfig.totalPages;
            this.setState((prevState) => {
                return {
                    paginatorConfig: {
                        ...prevState.paginatorConfig,
                        currentPage: pageNumber
                    }
                }
            });
        }
        let startIndex = pageNumber*this.state.paginatorConfig.ITEMS_PER_PAGE - this.state.paginatorConfig.ITEMS_PER_PAGE;
        if (this.state._currentScreen === Screens.LOCATIONS){
            this.setState({
                displayedData: this.state.locations.slice(startIndex, startIndex + this.state.paginatorConfig.ITEMS_PER_PAGE)
            })
        }
        if (this.state._currentScreen === Screens.TRIPS){
            this.setState({
                displayedData: this.state.trips.slice(startIndex, startIndex + this.state.paginatorConfig.ITEMS_PER_PAGE)
            })
        }
        if (this.state._currentScreen === Screens.CUSTOMERS){
            this.setState({
                displayedData: this.state.customers.slice(startIndex, startIndex + this.state.paginatorConfig.ITEMS_PER_PAGE)
            })
        }
    };

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
            this.setPagination();
            if (props){
                if (props.item){
                    let index;
                    switch (props.item.entity){
                        case Entities.LOCATION:
                            index = this.state.locations.findIndex(location => location.id === props.item.id);
                            this.state.locations[index].updated = true;
                            break;
                        case Entities.TRIP:
                            index = this.state.trips.findIndex(trip => trip.id === props.item.id);
                            this.state.trips[index].updated = true;
                            break;
                        case Entities.CUSTOMER:
                            index = this.state.customers.findIndex(customer => customer.id === props.item.id);
                            this.state.customers[index].updated = true;
                            break;
                        default:
                            index = 1;
                            break;
                    }
                    this.goToPage(getPageNumberForItem(index, this.state.paginatorConfig.ITEMS_PER_PAGE));
                }
                if (props.pageToGo){
                    this.goToPage(props.pageToGo);
                }
            } else {
                this.goToPage(1);
            }
        }).catch(err => {
            this.setState({
                errors: 'Bad connection'
            })
        });
    };

    changeScreen = (screen) =>{
        this.setState({
            _currentScreen: screen,
            errors: '',
            displayedData: []}
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
                    this.updateAllData({
                        pageToGo: this.state.paginatorConfig.currentPage
                    })
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
                    this.updateAllData({
                        item: {
                            id: updatedEntity.id,
                            entity
                        }
                    })
                }
            })
    };

    clearError = () => {
        if (this.state.errors){
            this.setState({errors: ''});
        }
    };

    renderScreen(entityIdToShow){
        if (this.state._currentScreen === Screens.LOCATIONS) {
            return (
                <div>
                    <Locations locations={this.state.displayedData}
                               add={this.add(Entities.LOCATION)}
                               remove={this.remove(Entities.LOCATION)}
                               getById={this.getById(Entities.LOCATION)}
                               update={this.update(Entities.LOCATION)}
                               showPopup={this.showPopup}
                               hidePopup={this.hidePopup}
                    />
                </div>
            )
        }
        if (this.state._currentScreen === Screens.TRIPS){
            return (
                <Trips trips={this.state.displayedData}
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
                <Customers customers={this.state.displayedData}
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
                <Paginator isShown={this.state.paginatorConfig.isShown}
                           totalPages={this.state.paginatorConfig.totalPages}
                           currentPage={this.state.paginatorConfig.currentPage}
                           goToPage={this.goToPage}
                />
                {this.renderScreen()}
            </div>
        );
    }
}

export default App;
