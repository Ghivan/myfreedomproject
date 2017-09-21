import React from 'react';

import {ErrorBlock} from '../errors/error';

class LocationsForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: '',
            city: props.city || '',
            country: props.country || '',
            id: props.id || null
        };
        if (this.state.id){
            this.props.getById(this.state.id)
                .then(location => {
                    this.setState({
                        city: location.city,
                        country: location.country
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
                    <label htmlFor="city">City</label>
                    <input className="form-control"
                           id="city"
                           value={this.state.city}
                           onChange={(e) => this.setState({city: e.target.value})}
                           placeholder="City"/>
                </div>
                <div className="form-group">
                    <label htmlFor="Country">Country</label>
                    <input className="form-control"
                           id="Country"
                           value={this.state.country}
                           onChange={(e) => this.setState({country: e.target.value})}
                           placeholder="Country"/>
                </div>
                <button className="btn btn-primary"
                        onClick={e => {
                            e.preventDefault();
                            let errors = [];
                            if (!this.state.city.trim()){
                                errors.push('City should not be empty.')
                            }
                            if (!this.state.city.trim()){
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
                        }}
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

export default LocationsForm;
