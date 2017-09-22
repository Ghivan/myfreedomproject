import React from 'react';

import {ErrorBlock} from '../errors/error';

class TripsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
            name: props.name || '',
            arrivalDate: props.arrivalDate || '',
            departureDate: props.departureDate || '',
            trips: props.trips || '',
            locations: props.locations,
            allTrips: [],
            id: props.id || null,
            selectedLocations: []
        };
        if (this.state.id){
            this.props.getById(this.state.id)
                .then(location => {
                    this.setState({
                        name: location.name,
                        arrivalDate: location.arrivalDate
                    })
                })
        }
    }

    handleSelectedLocations =  e => {
        let index =  this.state.selectedLocations.indexOf(e.target.value),
            selectedLocations = this.state.selectedLocations;
        if (e.target.checked){
            selectedLocations.push(e.target.value);
            this.setState({
                selectedLocations: selectedLocations
            })
        } else {
            if (index > -1) selectedLocations.splice(index, 1);
            this.setState({
                selectedLocations: selectedLocations
            })
        }
        console.log(selectedLocations)
    };

    handleActionBtn = e => {
        e.preventDefault();
        switch (e.target.innerText){
            case 'Add':
                console.log({
                    name: this.state.name,
                    arrivalDate: this.state.arrivalDate,
                    departureDate: this.state.departureDate,
                    locations: this.state.selectedLocations
                });
                this.props.add({
                    name: this.state.name,
                    arrivalDate: this.state.arrivalDate,
                    departureDate: this.state.departureDate,
                    locations: this.state.selectedLocations
                });
                this.props.cancel();
                break;
            case 'Update':
                this.props.showPopup(
                    `Do you really want to change location to: "${this.state.city} (${this.state.country})"`,
                    () => {
                        this.props.update(this.state.id, {
                            city: this.state.city,
                            country: this.state.country
                        });
                        this.props.hidePopup();
                        this.props.cancel();
                    },
                    () => this.props.hidePopup()
                );
                break;
        }
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
                    <div>
                        <label>Select locations:</label>
                    </div>
                    {this.state.locations.map(location => {
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
                                           onChange={this.handleSelectedLocations}
                                    />
                                    {`${location.city} (${location.country})`}</label>
                            </div>
                        )
                    })}
                </div>
                <button className="btn btn-primary"
                        onClick={this.handleActionBtn}
                >{this.state.id ? 'Update' : 'Add'}</button>
                <button className="btn btn-default"
                        onClick={e => {
                            e.preventDefault();
                            this.props.cancel();
                        }}
                >Cancel</button>
            </form>
        );
    };
}

export default TripsForm;
