import React from 'react';

import {ErrorBlock} from '../Global/Errors/ErrorMessage';

const formatDate = (date) => {
    date = new Date(date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${String(year)}-${month < 10 ? '0' + String(month) : String(month)}-${day < 10 ? '0' + String(day) : String(day)}`
};

const getLocationsIdsFromTrip = (trip) => {
  return trip.route.locations.reduce((prev, curr) => {
      if (curr.id) prev.push(curr.id);
      return prev;
  }, [])
};

class TripsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
            name: '',
            arrivalDate: formatDate(Date.now()),
            departureDate: formatDate(Date.now()),
            selectedLocations: []
        };
        if (this.props.id) {
            this.props.getById(this.props.id)
                .then(trip => {
                    this.setState({
                        name: trip.name,
                        arrivalDate: formatDate(trip.route.arrivalDate),
                        departureDate: formatDate(trip.route.departureDate),
                        selectedLocations: getLocationsIdsFromTrip(trip)
                    })
                })
        }
    }

    handleSelectedLocations = e => {
        let index = this.state.selectedLocations.indexOf(e.target.value),
            selectedLocations = this.state.selectedLocations;
        if (e.target.checked) {
            selectedLocations.push(e.target.value);
            this.setState({
                selectedLocations
            })
        } else {
            if (index > -1) selectedLocations.splice(index, 1);
            this.setState({
                selectedLocations
            })
        }
    };

    handleActionBtn = e => {
        e.preventDefault();
        let errors = [];
        if (!this.state.name.trim()){
            errors.push('Trip name should not be empty.')
        }
        if (!this.state.arrivalDate.trim()){
            errors.push('Arrival date should not be empty.')
        }
        if (!this.state.departureDate.trim()){
            errors.push('Arrival date should not be empty.')
        }

        if (new Date(this.state.arrivalDate) > new Date(this.state.departureDate)){
            errors.push('Departure is sooner than arrival')
        }

        if (this.state.selectedLocations.length === 0){
            errors.push('Locations should not be empty')
        }

        if (errors.length > 0){
            this.setState({errors: errors.join(' ')});
            return;
        }
        switch (e.target.innerText) {
            case 'Update':
                this.props.showPopup(
                    'Do you really want to change this trip?',
                    () => {
                        this.props.update(this.props.id, {
                            name: this.state.name,
                            arrivalDate: this.state.arrivalDate,
                            departureDate: this.state.departureDate,
                            locations: this.state.selectedLocations
                        });
                        this.props.hidePopup();
                        this.props.history.push('/trips');
                    },
                    () => this.props.hidePopup()
                );
                break;
            default:
                this.props.add({
                    name: this.state.name,
                    arrivalDate: this.state.arrivalDate,
                    departureDate: this.state.departureDate,
                    locations: this.state.selectedLocations
                });
                this.props.history.push('/trips');
                break;
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
                            clearError={()=>this.setState({errors: ''})}
                />
                <div className="form-group">
                    <label htmlFor="tripName">Trip Name</label>
                    <input className="form-control"
                           id="tripName"
                           value={this.state.name}
                           onChange={(e) => this.setState({name: e.target.value})}
                           placeholder="Trip Name"/>
                </div>
                <div className="form-group">
                    <label htmlFor="arrivalDate">Arrival date</label>
                    <input type="date"
                           className="form-control"
                           id="arrivalDate"
                           value={this.state.arrivalDate}
                           onChange={(e) => this.setState({arrivalDate: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="departureDate">Departure date</label>
                    <input type="date"
                           className="form-control"
                           id="departureDate"
                           value={this.state.departureDate}
                           onChange={(e) => this.setState({departureDate: e.target.value})}
                    />
                </div>
                <div>
                    <label>Select locations:</label>
                </div>
                <fieldset className="form-group">
                    {this.props.allLocations.map(location => {
                        return (
                            <div className="form-check form-check-inline"  key={location.id}>
                                <label className="form-check-label"
                                       htmlFor={location.id}
                                >
                                    <input className="form-check-input"
                                           id={location.id}
                                           type="checkbox"
                                           value={location.id}
                                           name="locations"
                                           checked={(this.state.selectedLocations.indexOf(location.id) > -1)}
                                           onClick={this.handleSelectedLocations}
                                    />
                                    <span className="checkbox-label">{`${location.city} (${location.country})`}</span>
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

export default TripsForm;
