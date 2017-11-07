import React from 'react';

import {ErrorBlock} from '../Global/Errors/ErrorMessage';

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
        if (this.props.selectedCustomer) {
            this.setState({
                currentCustomer: this.props.selectedCustomer
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedCustomer && nextProps.selectedCustomer.id !== this.state.currentCustomer.id) {
            this.setState({
                currentCustomer: nextProps.selectedCustomer
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
                    {Object.keys(this.props.allTrips).map(id => {
                        return (
                            <div className="form-check form-check-inline" key={id}>
                                <label className="form-check-label"
                                       htmlFor={id}
                                >
                                    <input className="form-check-input"
                                           id={id}
                                           type="checkbox"
                                           value={id}
                                           name="locations"
                                           checked={(this.state.currentCustomer.selectedTrips.indexOf(id) > -1)}
                                           onChange={this.handleSelectedTrips}
                                    />
                                    <span className="checkbox-label">{this.props.allTrips[id].name}</span>
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
