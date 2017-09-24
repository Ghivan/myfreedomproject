import React from 'react';

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
            locationDetailsId: null
        };
    }

    changeView = (viewType) =>{
        return () => {
            this.setState({_currentView: viewType});
            this.props.toggleDisplayPagination(viewType !== ViewTypes.DETAILS);
        }
    };

    showDetails = (id) => {
        this.setState({locationDetailsId: id});
        this.changeView(ViewTypes.DETAILS)();
    };

    render() {
        if (this.state._currentView === ViewTypes.TABLE){
            return (
                <div>
                    <button onClick={() => {
                        this.setState({
                            locationDetailsId: null
                        });
                        this.changeView(ViewTypes.DETAILS)()
                    }
                    }
                            className="btn btn-success float-right"
                    >Add new location</button>
                    <LocationsTable locations={this.props.locations}
                                    remove={this.props.remove}
                                    showPopup={this.props.showPopup}
                                    hidePopup={this.props.hidePopup}
                                    showDetails={this.showDetails}
                    />

                </div>
            );
        }

        if (this.state._currentView === ViewTypes.DETAILS){
            return (
                <div>
                    <LocationsForm id={this.state.locationDetailsId}
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

export default Location;
