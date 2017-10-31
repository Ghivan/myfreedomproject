import React from 'react';
import {
    Route,
    Switch,
    withRouter
} from 'react-router-dom';

import TripsTable from './TripsTable';
import TripsForm from './TripsForm';
import {Paginator, getDisplayedItems} from "../Global/Paginator/Paginator";
import {parseQueryString} from "../../utils/utils";

const RoutedTripsForm = withRouter(TripsForm);

export default class TripsRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsPerPage: 5
        };
    }

    renderTripsTable = () => {
        const queryParams = parseQueryString(window.location.search.substr(1));
        let currentPage = queryParams.page >= 1 ? parseInt(queryParams.page, 10) : 1;
        return (
            <div>
                <TripsTable trips={getDisplayedItems(this.props.trips, currentPage, this.state.itemsPerPage)}
                            locations={this.props.allLocations}
                            remove={this.props.remove}
                            showPopup={this.props.showConfirmationBlock}
                            hidePopup={this.props.hideConfirmationBlock}
                />
                <Paginator isShown={Object.keys(this.props.trips).length > this.state.itemsPerPage}
                           currentPage={currentPage}
                           currentElementIndex={null}
                           totalItems={Object.keys(this.props.trips).length}
                           itemsPerPage={this.state.itemsPerPage}
                           urlPrefix={'/trips'}
                />
            </div>
        )
    };

    renderTripsForm = ({match, history}) => {
        return (
            <RoutedTripsForm id={match.params.id}
                             trips={this.props.trips}
                             allLocations={this.props.allLocations}
                             add={this.props.add}
                             update={this.props.update}
                             showPopup={this.props.showConfirmationBlock}
                             hidePopup={this.props.hideConfirmationBlock}
                             history={history}
            />
        );
    };

    render() {
        return (
            <Switch>
                <Route exact path="/trips" render={this.renderTripsTable}/>
                <Route exact path="/trips/add" render={this.renderTripsForm}/>
                <Route exact path="/trips/:id" render={this.renderTripsForm}/>
            </Switch>
        )
    }

}