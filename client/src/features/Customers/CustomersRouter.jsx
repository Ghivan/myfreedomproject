import React from 'react';
import {
    Route,
    Switch,
    withRouter
} from 'react-router-dom';

import CustomersTable from './CustomersTable';
import CustomersForm from './CustomersForm'
import {Paginator, getDisplayedItems} from "../Global/Paginator/Paginator";
import {parseQueryString} from "../../utils/utils";

const RoutedCustomersForm = withRouter(CustomersForm);

export default class CustomersRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsPerPage: 5,
            confirmationBlockConfig: {
                isShown: false,
                message: '',
                onResolve: null,
                onReject: null
            }
        };
    }

    selectCustomer = (id) => {
        if (this.props.customers[id]) {
            const selectedCustomer = Object.assign({}, this.props.customers[id]);
            selectedCustomer.selectedTrips = this.props.customers[id].trips.slice();
            delete selectedCustomer.trips;
            return selectedCustomer;
        }
    };

    renderCustomersTable = () => {
        const queryParams = parseQueryString(window.location.search.substr(1));
        let currentPage = queryParams.page >= 1 ? parseInt(queryParams.page, 10) : 1;
        return (
            <div>
                <CustomersTable
                    customers={getDisplayedItems(this.props.customers, currentPage, this.state.itemsPerPage)}
                    trips={this.props.allTrips}
                    remove={this.props.remove}
                    showPopup={this.props.showConfirmationBlock}
                    hidePopup={this.props.hideConfirmationBlock}
                />
                <Paginator isShown={Object.keys(this.props.customers).length > this.state.itemsPerPage}
                           currentPage={currentPage}
                           currentElementIndex={null}
                           totalItems={Object.keys(this.props.customers).length}
                           itemsPerPage={this.state.itemsPerPage}
                           urlPrefix={'/customers'}
                />
            </div>

        )
    };

    renderCustomersForm = ({match, history}) => {
        return <RoutedCustomersForm selectedCustomer={this.selectCustomer(match.params.id)}
                                    allTrips={this.props.allTrips}
                                    customers={this.props.customers}
                                    add={this.props.add}
                                    getById={this.props.getById}
                                    update={this.props.update}
                                    showPopup={this.props.showConfirmationBlock}
                                    hidePopup={this.props.hideConfirmationBlock}
                                    history={history}
        />
    };

    render() {
        return (
            <Switch>
                <Route exact path="/customers" render={this.renderCustomersTable}/>
                <Route exact path="/customers/add" render={this.renderCustomersForm}/>
                <Route exact path="/customers/:id" render={this.renderCustomersForm}/>
            </Switch>
        )
    }

}