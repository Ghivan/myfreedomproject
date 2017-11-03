import React from 'react';

import {ErrorBlock} from '../Global/Errors/ErrorMessage';

class LocationsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
            currentLocation: {
                id: '',
                city: '',
                country: ''
            }
        };
    }

    componentDidMount(){
        if (this.props.selectedLocation){
            this.setState({
                currentLocation: this.props.selectedLocation
            })
        }
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.selectedLocation && nextProps.selectedLocation.id !== this.state.currentLocation.id){
            this.setState({
                currentLocation: nextProps.selectedLocation
            })
        }
    }

    handleActionBtn = e => {
        e.preventDefault();
        let errors = [];
        if (!this.state.currentLocation.city.trim()) {
            errors.push('City should not be empty.')
        }
        if (!this.state.currentLocation.country.trim()) {
            errors.push('Country should not be empty.')
        }
        if (errors.length > 0) {
            this.setState({errors: errors.join(' ')});
            return;
        }
        if (this.state.currentLocation.id) {
            this.props.showPopup(
                `Do you really want to change location to: "${this.state.currentLocation.city} (${this.state.currentLocation.country})"?`,
                () => {
                    this.props.update(this.state.currentLocation.id, {
                        city: this.state.currentLocation.city,
                        country: this.state.currentLocation.country
                    });
                    this.props.hidePopup();
                    this.props.history.push('/locations');
                },
                () => this.props.hidePopup()
            );
        } else {
            this.props.add({
                city: this.state.currentLocation.city,
                country: this.state.currentLocation.country
            });
            this.props.history.push('/locations');
        }
    };

    handleCancelBtn = e => {
        e.preventDefault();
        this.props.history.push('/locations');
    };

    handleCityInput = e => {
        const cityName = e.target.value;
        this.setState((prevState) => {
            return {
                ...prevState,
                currentLocation: {
                    ...prevState.currentLocation,
                    city: cityName
                }
            }
        })
    };

    handleCountryInput = e => {
        const countryName = e.target.value;
        this.setState((prevState) => ({
            ...prevState,
            currentLocation: {
                ...prevState.currentLocation,
                country: countryName
            }
        }))
    };

    render() {
        return (
            <form>
                <ErrorBlock message={this.state.errors}
                            clearError={() => this.setState({errors: ''})}
                />
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input className="form-control"
                           id="city"
                           value={this.state.currentLocation.city}
                           onChange={this.handleCityInput}
                           placeholder="City"/>
                </div>
                <div className="form-group">
                    <label htmlFor="Country">Country</label>
                    <input className="form-control"
                           id="Country"
                           value={this.state.currentLocation.country}
                           onChange={this.handleCountryInput}
                           placeholder="Country"/>
                </div>
                <button className="btn btn-primary"
                        onClick={this.handleActionBtn}
                >{this.state.currentLocation.id ? 'Update' : 'Add'}</button>
                <button className="btn btn-default"
                        onClick={this.handleCancelBtn}
                >Cancel
                </button>
            </form>
        );
    };
}

export default LocationsForm;
