import React from 'react';

import {ErrorBlock} from '../errors/error';

class LocationsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
            city: '',
            country: '',
        };
        if (this.props.id){
            this.props.getById(this.props.id)
                .then(location => {
                    this.setState({
                        city: location.city,
                        country: location.country
                    })
                })
        }
    }

    handleActionBtn = e => {
        e.preventDefault();
        let errors = [];
        if (!this.state.city.trim()){
            errors.push('City should not be empty.')
        }
        if (!this.state.country.trim()){
            errors.push('Country should not be empty.')
        }
        if (errors.length > 0){
            this.setState({errors: errors.concat(' ')});
            return;
        }
        switch (e.target.innerText){
            case 'Add':
                this.props.add({
                    city: this.state.city,
                    country: this.state.country
                });
                this.props.cancel();
                break;
            case 'Update':
                this.props.showPopup(
                    `Do you really want to change location to: "${this.state.city} (${this.state.country})"?`,
                    () => {
                        this.props.update(this.props.id, {
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

    handleCancelBtn = e => {
        e.preventDefault();
        this.props.cancel();
    };

    handleCityInput = e => {
        this.setState({city: e.target.value})
    };

    handleCountryInput = e => {
        this.setState({country: e.target.value})
    };

    render() {
        return (
            <form>
                <ErrorBlock message={this.state.errors}
                            clearError={()=>this.setState({errors: ''})}
                />
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input className="form-control"
                           id="city"
                           value={this.state.city}
                           onChange={this.handleCityInput}
                           placeholder="City"/>
                </div>
                <div className="form-group">
                    <label htmlFor="Country">Country</label>
                    <input className="form-control"
                           id="Country"
                           value={this.state.country}
                           onChange={this.handleCountryInput}
                           placeholder="Country"/>
                </div>
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

export default LocationsForm;
