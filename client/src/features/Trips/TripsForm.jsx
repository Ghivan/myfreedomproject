import React from 'react';

import {ErrorBlock} from '../Global/Errors/ErrorMessage';

const formatDate = (date) => {
    date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${String(year)}-${month < 10 ? '0' + String(month) : String(month)}-${day < 10 ? '0' + String(day) : String(day)}`
};

const selectTrip = (props, currentTrip) => {
    if (props.id && props.trips && props.id !== currentTrip.id) {
        const selectedTrip = Object.assign({},props.trips[props.id]);
        if (selectedTrip.id) {
            selectedTrip.selectedLocations = props.trips[props.id].route.locations;
            selectedTrip.arrivalDate = formatDate( props.trips[props.id].route.arrivalDate);
            selectedTrip.departureDate = formatDate(props.trips[props.id].route.departureDate);
            delete selectedTrip.route;
            return selectedTrip;
        }
    }
};

class TripsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
            currentTrip: {
                id: '',
                name: '',
                arrivalDate: formatDate(Date.now()),
                departureDate: formatDate(Date.now()),
                selectedLocations: []
            }
        };
    }

    componentDidMount() {
        const currentTrip = selectTrip(this.props, this.state.currentTrip);
        if (currentTrip) {
            this.setState({
                currentTrip
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const currentTrip = selectTrip(nextProps, this.state.currentTrip);
        if (currentTrip) {
            this.setState({
                currentTrip
            })
        }
    }

    handleSelectedLocations = e => {
        let index = this.state.currentTrip.selectedLocations.indexOf(e.target.value),
            selectedLocations = this.state.currentTrip.selectedLocations.slice();
        if (e.target.checked) {
            selectedLocations.push(e.target.value);
            this.setState((prevState) => {
                return {
                    ...prevState,
                    currentTrip: {
                        ...prevState.currentTrip,
                        selectedLocations
                    }
                }
            });
        } else {
            if (index > -1) selectedLocations.splice(index, 1);
            this.setState((prevState) => {
                return {
                    ...prevState,
                    currentTrip: {
                        ...prevState.currentTrip,
                        selectedLocations
                    }
                }
            });
        }
    };

    handleActionBtn = e => {
        e.preventDefault();
        let errors = [];
        if (!this.state.currentTrip.name.trim()) {
            errors.push('Trip name should not be empty.')
        }
        if (!this.state.currentTrip.arrivalDate.trim()) {
            errors.push('Arrival date should not be empty.')
        }
        if (!this.state.currentTrip.departureDate.trim()) {
            errors.push('Arrival date should not be empty.')
        }

        if (new Date(this.state.currentTrip.arrivalDate) > new Date(this.state.currentTrip.departureDate)) {
            errors.push('Departure is sooner than arrival')
        }

        if (this.state.currentTrip.selectedLocations.length === 0) {
            errors.push('Locations should not be empty')
        }

        if (errors.length > 0) {
            this.setState({errors: errors.join(' ')});
            return;
        }
        if (this.state.currentTrip.id) {
            this.props.showPopup(
                'Do you really want to change this trip?',
                () => {
                    this.props.update(this.state.currentTrip.id, {
                        name: this.state.currentTrip.name,
                        arrivalDate: this.state.currentTrip.arrivalDate,
                        departureDate: this.state.currentTrip.departureDate,
                        locations: this.state.currentTrip.selectedLocations
                    });
                    this.props.hidePopup();
                    this.props.history.push('/trips');
                },
                () => this.props.hidePopup()
            );
        } else {
            this.props.add({
                name: this.state.currentTrip.name,
                arrivalDate: this.state.currentTrip.arrivalDate,
                departureDate: this.state.currentTrip.departureDate,
                locations: this.state.currentTrip.selectedLocations
            });
            this.props.history.push('/trips');
        }
    };

    handleCancelBtn = e => {
        e.preventDefault();
        this.props.history.push('/trips');
    };

    render() {
        return (
            <form>
                <ErrorBlock message={this.state.errors}
                            clearError={() => this.setState({errors: ''})}
                />
                <div className="form-group">
                    <label htmlFor="tripName">Trip Name</label>
                    <input className="form-control"
                           id="tripName"
                           value={this.state.currentTrip.name}
                           onChange={(e) => {
                               const tripName = e.target.value;
                               this.setState((prevState) => {
                                   return {
                                       ...prevState,
                                       currentTrip: {
                                           ...prevState.currentTrip,
                                           name: tripName
                                       }
                                   }
                               })
                           }
                           }
                           placeholder="Trip Name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="arrivalDate">Arrival date</label>
                    <input type="date"
                           className="form-control"
                           id="arrivalDate"
                           value={this.state.currentTrip.arrivalDate}
                           onChange={(e) => {
                               const arrivalDate = e.target.value;
                               this.setState((prevState) => {
                                   return {
                                       ...prevState,
                                       currentTrip: {
                                           ...prevState.currentTrip,
                                           arrivalDate
                                       }
                                   }
                               })
                           }
                           }
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="departureDate">Departure date</label>
                    <input type="date"
                           className="form-control"
                           id="departureDate"
                           value={this.state.currentTrip.departureDate}
                           onChange={(e) => {
                               const departureDate = e.target.value;
                               this.setState((prevState) => {
                                   return {
                                       ...prevState,
                                       currentTrip: {
                                           ...prevState.currentTrip,
                                           departureDate
                                       }
                                   }
                               })
                           }
                           }
                    />
                </div>
                <div>
                    <label>Select locations:</label>
                </div>
                <fieldset className="form-group">
                    {Object.keys(this.props.allLocations).map(id => {
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
                                           checked={(this.state.currentTrip.selectedLocations.indexOf(id) > -1)}
                                           onChange={this.handleSelectedLocations}
                                    />
                                    <span className="checkbox-label">{`${this.props.allLocations[id].city} (${this.props.allLocations[id].country})`}</span>
                                </label>
                            </div>
                        )
                    })}
                </fieldset>
                <button className="btn btn-primary"
                        onClick={this.handleActionBtn}
                >{this.state.currentTrip.id ? 'Update' : 'Add'}</button>
                <button className="btn btn-default"
                        onClick={this.handleCancelBtn}
                >Cancel
                </button>
            </form>

        );
    };
}

export default TripsForm;
