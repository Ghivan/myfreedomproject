import React from 'react';

import {ConfirmBlock} from '../popups/confirm'
import TripsTable from './table';
import TripsForm from './form';

const ViewTypes = {
    TABLE: 'table',
    DETAILS: 'details'
};

class Trip extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            _currentView: ViewTypes.TABLE,
            trips: props.trips,
            locations: props.locations,
            tripDetailsId: null,
            popup: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            },
            remove: props.remove,
            getById: props.getById,
            add: props.add
        };
    }
    componentWillReceiveProps(nextProps){
        if (nextProps['trips']){
            this.setState({trips: nextProps['trips']});
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
                                remove={this.state.remove}
                                showPopup={this.showPopup}
                                hidePopup={this.hidePopup}
                    />
                    <button onClick={() => {
                        this.setState({tripDetailsId: null});
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
                    <TripsForm  cancel={this.changeView(ViewTypes.TABLE)}
                                showPopup={this.showPopup}
                                hidePopup={this.hidePopup}
                                locations={this.state.locations}
                                update={this.state.getById}
                                add={this.state.add}
                    />
                </div>
            );
        }

    }
}

export default Trip;
