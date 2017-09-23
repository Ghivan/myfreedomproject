import React from 'react';

import CustomersTable from './table';
import CustomersForm from './form';

const ViewTypes = {
    TABLE: 'table',
    DETAILS: 'details'
};

class Customer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            _currentView: ViewTypes.TABLE,
            customerDetailsId: null
        };
    }

    changeView = (viewType) =>{
        return () => this.setState({_currentView: viewType})
    };

    showDetails = (id) => {
        this.setState({customerDetailsId: id});
        this.changeView(ViewTypes.DETAILS)();
    };

    render() {
        if (this.state._currentView === ViewTypes.TABLE){
            return (
                <div>
                    <button onClick={() => {
                        this.setState({
                            customerDetailsId: null
                        });
                        this.changeView(ViewTypes.DETAILS)()
                    }} className="btn btn-success float-right"
                    >Add new customer</button>
                    <CustomersTable customers={this.props.customers}
                                    remove={this.props.remove}
                                    showDetails={this.showDetails}
                                    showPopup={this.props.showPopup}
                                    hidePopup={this.props.hidePopup}
                    />
                </div>
            );
        }
        if (this.state._currentView === ViewTypes.DETAILS){
            return (
                <div>
                    <CustomersForm  id={this.state.customerDetailsId}
                                    allTrips={this.props.trips}
                                    cancel={this.changeView(ViewTypes.TABLE)}
                                    add={this.props.add}
                                    getById={this.props.getById}
                                    update={this.props.update}
                                    showPopup={this.props.showPopup}
                                    hidePopup={this.props.hidePopup}
                    />
                </div>
            );
        }

    }
}

export default Customer;
