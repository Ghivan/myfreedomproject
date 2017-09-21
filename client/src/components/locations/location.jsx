import React from 'react';

import {ConfirmBlock} from '../popups/confirm'
import LocationsTable from './table';
import LocationsForm from './form';

const ViewTypes = {
    TABLE: 'table',
    DETAILS: 'details'
};

class Location extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            _currentView: ViewTypes.TABLE,
            locations: this.props.locations,
            locationDetailsId: null,
            popup: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            }
        };
    }
    componentWillReceiveProps(nextProps){
        if (nextProps['locations']){
            this.setState({locations: nextProps['locations']});
        }
    }

    changeView = (viewType) =>{
        return () => this.setState({_currentView: viewType})
    };

    showPopup = (message, onResolve, onReject) => {
        this.setState({
            popup: {
                isShown: true,
                message,
                onResolve,
                onReject
            }
        })
    };

    showDetails = (id) => {
        this.setState({locationDetailsId: id});
        this.changeView(ViewTypes.DETAILS)();
    };

    hidePopup = () => {
        this.setState({
            popup: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            }
        })
    };

    render() {
        if (this.state._currentView === ViewTypes.TABLE){
            return (
                <div>
                    <ConfirmBlock status={this.state.popup.isShown}
                                  message={this.state.popup.message}
                                  resolve={this.state.popup.onResolve}
                                  reject={this.state.popup.onReject}
                    />
                    <LocationsTable locations={this.state.locations}
                                    remove={this.props.remove}
                                    showPopup={this.showPopup}
                                    hidePopup={this.hidePopup}
                                    showDetails={this.showDetails}
                    />
                    <button onClick={() => {
                        this.setState({locationDetailsId: null});
                        this.changeView(ViewTypes.DETAILS)()
                    }} className="btn btn-success">Add</button>
                </div>
            );
        }

        if (this.state._currentView === ViewTypes.DETAILS){
            return (
                <div>
                    <ConfirmBlock status={this.state.popup.isShown}
                                  message={this.state.popup.message}
                                  resolve={this.state.popup.onResolve}
                                  reject={this.state.popup.onReject}
                    />
                    <LocationsForm cancel={this.changeView(ViewTypes.TABLE)}
                                   add={this.props.add}
                                   getById={this.props.getById}
                                   update={this.props.update}
                                   id={this.state.locationDetailsId}
                                   showPopup={this.showPopup}
                                   hidePopup={this.hidePopup}
                    />
                </div>
            );
        }
    }
}

export default Location;
