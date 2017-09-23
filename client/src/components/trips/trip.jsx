import React from 'react';

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
            tripDetailsId: null,
        };
    }

    changeView = (viewType) =>{
        return () => this.setState({_currentView: viewType})
    };

    showDetails = (id) => {
        this.setState({tripDetailsId: id});
        this.changeView(ViewTypes.DETAILS)();
    };

    render() {
        if (this.state._currentView === ViewTypes.TABLE){
            return (
                <div>
                    <button onClick={() => {
                        this.setState({
                            tripDetailsId: null
                        });
                        this.changeView(ViewTypes.DETAILS)()
                    }} className="btn btn-success float-right"
                    >Add new trip</button>
                    <TripsTable trips={this.props.trips}
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
                    <TripsForm  id={this.state.tripDetailsId}
                                allLocations={this.props.locations}
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

export default Trip;
