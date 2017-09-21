import React from 'react';

import {ConfirmBlock} from '../popups/confirm'
import TripsTable from './table';

const ViewTypes = {
    TABLE: 'table',
    DETAILS: 'details'
};

class Trip extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            _currentView: ViewTypes.TABLE,
            trips: this.props.trips,
            tripDetailsId: null,
            popup: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            }
        };
    }
    componentWillReceiveProps(nextProps){
        if (nextProps['trips']){
            this.setState({locations: nextProps['trips']});
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
                    <TripsTable trips={this.state.trips}
                                remove={this.props.remove}
                                showPopup={this.showPopup}
                                hidePopup={this.hidePopup}
                                showDetails={this.showDetails}
                    />
                </div>
            );
        }

    }
}

export default Trip;
