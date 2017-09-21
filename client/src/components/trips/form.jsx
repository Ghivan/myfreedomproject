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
            allTrips: [],
            id: props.id || null
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
