import React from 'react';

import {ConfirmBlock} from '../popups/confirm'
import CustomersTable from './table';

const ViewTypes = {
    TABLE: 'table',
    DETAILS: 'details'
};

class Customer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            _currentView: ViewTypes.TABLE,
            customers: this.props.customers,
            customerDetailsId: null,
            popup: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            }
        };
    }
    componentWillReceiveProps(nextProps){
        if (nextProps['customers']){
            this.setState({locations: nextProps['customers']});
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
                    <CustomersTable customers={this.state.customers}
                    />
                </div>
            );
        }

    }
}

export default Customer;
