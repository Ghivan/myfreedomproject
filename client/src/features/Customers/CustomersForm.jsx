import React from 'react';

import {ErrorBlock} from '../Global/Errors/ErrorMessage';

const getTripsIdsFromCustomer = (customer) => {
    return customer.trips.reduce((prev, curr) => {
        if (curr.id) prev.push(curr.id);
        return prev;
    }, [])
};

const selectCustomer = (props, currentCustomer) => {
    if (props.id && props.customers && props.id !== currentCustomer.id) {
        const selectedCustomer = Object.assign({}, props.customers.find(customers => customers.id === props.id));
        if (selectedCustomer.id) {
            selectedCustomer.selectedTrips = getTripsIdsFromCustomer(selectedCustomer);
            return selectedCustomer;
        }
    }
};

class CustomersForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
            currentCustomer: {
                id: '',
                firstName: '',
                lastName: '',
                selectedTrips: []
            }
        };
    }

    componentDidMount() {
        const currentCustomer = selectCustomer(this.props, this.state.currentCustomer);
        if (currentCustomer) {
            this.setState({
                currentCustomer
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const currentCustomer = selectCustomer(nextProps, this.state.currentCustomer);
        if (currentCustomer) {
            this.setState({
                currentCustomer
            })
        }
    }

    handleSelectedTrips = e => {
        let index = this.state.currentCustomer.selectedTrips.indexOf(e.target.value),
            selectedTrips = this.state.currentCustomer.selectedTrips;
        if (e.target.checked) {
            selectedTrips.push(e.target.value);
            this.setState((prevState) => {
                return {
                    ...prevState,
                    currentCustomer: {
                        ...prevState.currentCustomer,
                        selectedTrips
                    }
                }
            })
        } else {
            if (index > -1) selectedTrips.splice(index, 1);
            this.setState((prevState) => {
                return {
                    ...prevState,
                    currentCustomer: {
                        ...prevState.currentCustomer,
                        selectedTrips
                    }
                }
            })
        }
    };

    handleActionBtn = e => {
        e.preventDefault();
        let errors = [];
        if (!this.state.currentCustomer.firstName.trim()) {
            errors.push('First name should not be empty.')
        }
        if (!this.state.currentCustomer.lastName.trim()) {
            errors.push('Last name should not be empty.')
        }
        if (errors.length > 0) {
            this.setState({errors: errors.join(' ')});
            return;
        }
        if (this.state.currentCustomer.id) {
            this.props.showPopup(
                'Do you really want to change this customer?',
                () => {
                    this.props.update(this.state.currentCustomer.id, {
                        firstName: this.state.currentCustomer.firstName,
                        lastName: this.state.currentCustomer.lastName,
                        trips: this.state.currentCustomer.selectedTrips
                    });
                    this.props.hidePopup();
                    this.props.history.push('/customers');
                },
                () => this.props.hidePopup()
            );
        } else {
            this.props.add({
                firstName: this.state.currentCustomer.firstName,
                lastName: this.state.currentCustomer.lastName,
                trips: this.state.currentCustomer.selectedTrips
            });
            this.props.history.push('/customers');
        }
        return false;
    };

    handleCancelBtn = e => {
        e.preventDefault();
        this.props.history.push('/customers');
    };

    render() {
        return (
            <form>
                <ErrorBlock message={this.state.errors}
                            clearError={() => this.setState({errors: ''})}
                />
                <div className="form-group">
                    <label htmlFor="firstName">First name</label>
                    <input className="form-control"
                           id="firstName"
                           value={this.state.currentCustomer.firstName}
                           onChange={(e) => {
                               const firstName = e.target.value;
                               this.setState((prevState) => {
                                   return {
                                       ...prevState,
                                       currentCustomer: {
                                           ...prevState.currentCustomer,
                                           firstName
                                       }
                                   }
                               })
                           }
                           }
                           placeholder="First name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last name</label>
                    <input className="form-control"
                           id="lastName"
                           value={this.state.currentCustomer.lastName}
                           onChange={(e) => {
                               const lastName = e.target.value;
                               this.setState((prevState) => {
                                   return {
                                       ...prevState,
                                       currentCustomer: {
                                           ...prevState.currentCustomer,
                                           lastName
                                       }
                                   }
                               })
                           }
                           }
                           placeholder="Last name"/>
                </div>
                <div>
                    <label>Select trips:</label>
                </div>
                <fieldset className="form-group">
                    {this.props.allTrips.map(trip => {
                        return (
                            <div className="form-check form-check-inline" key={trip.id}>
                                <label className="form-check-label"
                                       htmlFor={trip.id}
                                >
                                    <input className="form-check-input"
                                           id={trip.id}
                                           type="checkbox"
                                           value={trip.id}
                                           name="locations"
                                           checked={(this.state.currentCustomer.selectedTrips.indexOf(trip.id) > -1)}
                                           onChange={this.handleSelectedTrips}
                                    />
                                    <span className="checkbox-label">{trip.name}</span>
                                </label>
                            </div>
                        )
                    })}
                </fieldset>
                <button className="btn btn-primary"
                        onClick={this.handleActionBtn}
                >{this.state.currentCustomer.id ? 'Update' : 'Add'}</button>
                <button className="btn btn-default"
                        onClick={this.handleCancelBtn}
                >Cancel
                </button>
            </form>

        );
    };
}

export default CustomersForm;
