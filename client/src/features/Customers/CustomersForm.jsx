import React from 'react';

import {ErrorBlock} from '../Global/Errors/ErrorMessage';

const getTripsIdsFromCustomer = (customer) => {
    return customer.trips.reduce((prev, curr) => {
        if (curr.id) prev.push(curr.id);
        return prev;
    }, [])
};

class CustomersForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
            firstName: '',
            lastName: '',
            selectedTrips: []
        };
        if (this.props.id) {
            this.props.getById(this.props.id)
                .then(customer => {
                    this.setState({
                        firstName: customer.firstName,
                        lastName: customer.lastName,
                        selectedTrips: getTripsIdsFromCustomer(customer)
                    })
                })
        }
    }

    handleSelectedTrips = e => {
        let index = this.state.selectedTrips.indexOf(e.target.value),
            selectedTrips = this.state.selectedTrips;
        if (e.target.checked) {
            selectedTrips.push(e.target.value);
            this.setState({
                selectedTrips
            })
        } else {
            if (index > -1) selectedTrips.splice(index, 1);
            this.setState({
                selectedTrips
            })
        }
    };

    handleActionBtn = e => {
        e.preventDefault();
        let errors = [];
        if (!this.state.firstName.trim()){
            errors.push('First name should not be empty.')
        }
        if (!this.state.lastName.trim()){
            errors.push('Last name should not be empty.')
        }
        if (errors.length > 0){
            this.setState({errors: errors.join(' ')});
            return;
        }
        switch (e.target.innerText) {
            case 'Update':
                this.props.showPopup(
                    'Do you really want to change this customer?',
                    () => {
                        this.props.update(this.props.id, {
                            firstName: this.state.firstName,
                            lastName: this.state.lastName,
                            trips: this.state.selectedTrips
                        });
                        this.props.hidePopup();
                        this.props.history.push('/customers');
                    },
                    () => this.props.hidePopup()
                );
                break;
            default:
                this.props.add({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    trips: this.state.selectedTrips
                });
                this.props.history.push('/customers');
                break;
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
                            clearError={()=>this.setState({errors: ''})}
                />
                <div className="form-group">
                    <label htmlFor="firstName">First name</label>
                    <input className="form-control"
                           id="firstName"
                           value={this.state.firstName}
                           onChange={(e) => this.setState({firstName: e.target.value})}
                           placeholder="First name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last name</label>
                    <input className="form-control"
                           id="lastName"
                           value={this.state.lastName}
                           onChange={(e) => this.setState({lastName: e.target.value})}
                           placeholder="Last name"/>
                </div>
                <div>
                    <label>Select trips:</label>
                </div>
                <fieldset className="form-group">
                    {this.props.allTrips.map(trip => {
                        return (
                            <div className="form-check form-check-inline"  key={trip.id}>
                                <label className="form-check-label"
                                       htmlFor={trip.id}
                                >
                                    <input className="form-check-input"
                                           id={trip.id}
                                           type="checkbox"
                                           value={trip.id}
                                           name="locations"
                                           checked={(this.state.selectedTrips.indexOf(trip.id) > -1)}
                                           onClick={this.handleSelectedTrips}
                                    />
                                    <span className="checkbox-label">{trip.name}</span>
                                </label>
                            </div>
                        )
                    })}
                </fieldset>
                <button className="btn btn-primary"
                        onClick={this.handleActionBtn}
                >{this.props.id ? 'Update' : 'Add'}</button>
                <button className="btn btn-default"
                        onClick={this.handleCancelBtn}
                >Cancel</button>
            </form>

        );
    };
}

export default CustomersForm;
