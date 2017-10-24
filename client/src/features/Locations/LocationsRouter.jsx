import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';

import LocationsTable from './LocationsTable';
import LocationsForm from './LocationsForm';
import {getDisplayedItems, Paginator} from "../Global/Paginator/Paginator";
import {parseQueryString} from "../../utils/utils";

const RoutedLocationsForm = withRouter(LocationsForm);

export default class LocationsRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            itemsPerPage: 5
        };
    }

    renderLocationsTable = ({match}) => {
        const queryParams = parseQueryString(window.location.search.substr(1));
        let currentPage = queryParams.page >= 1 ? parseInt(queryParams.page, 10) : 1;
        return (
            <div>
                <LocationsTable
                    locations={getDisplayedItems(this.props.locations, currentPage, this.state.itemsPerPage)}
                    remove={this.props.remove}
                    showPopup={this.props.showConfirmationBlock}
                    hidePopup={this.props.hideConfirmationBlock}
                />
                <Paginator isShown={this.props.locations.length > this.state.itemsPerPage}
                           currentPage={currentPage}
                           currentElementIndex={null}
                           totalItems={this.props.locations.length}
                           itemsPerPage={this.state.itemsPerPage}
                           urlPrefix={'/locations'}
                />
            </div>
        )
    };

    renderLocationsForm = ({match, history}) => {
        return (
            <RoutedLocationsForm locations={this.props.locations}
                                 id={match.params.id}
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
                <Route exact path="/locations" render={this.renderLocationsTable}/>
                <Route exact path="/locations/add" render={this.renderLocationsForm}/>
                <Route exact path="/locations/:id" render={this.renderLocationsForm}/>
            </Switch>
        )
    }

}