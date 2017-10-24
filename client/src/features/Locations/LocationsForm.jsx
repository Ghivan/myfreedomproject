import React from 'react';

import {ErrorBlock} from '../Global/Errors/ErrorMessage';

const selectLocation = (props, currentLocation) => {
    if (props.id && props.locations && props.id !== currentLocation.id) {
        return Object.assign({}, props.locations.find(location => location.id === props.id));
    }
};

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
        const currentLocation = selectLocation(this.props, this.state.currentLocation);
        if (currentLocation){
            this.setState({
                currentLocation
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        const currentLocation = selectLocation(nextProps, this.state.currentLocation);
        if (currentLocation){
            this.setState({
                currentLocation
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
