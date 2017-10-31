import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const handleDeleteTripBtn = (trip, showPopup, onAccept, hidePopup) => {
    return e => {
        e.preventDefault();
        showPopup(
            `Do you really want to delete trip: "${trip.name}"?`,
            () => {
                onAccept(trip.id);
                hidePopup()
            },
            () => hidePopup()
        );
    }
};

const TripsTable = ({trips, locations, remove, showPopup, hidePopup}) =>
    (
        <div>
            <table className="table table-responsive table-striped table-hover">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Locations</th>
                    <th>Arrival date</th>
                    <th>Departure date</th>
                    <th>Operations</th>
                </tr>
                </thead>
                <tbody>
                {
                    Object.keys(trips).map(id => {
                        return (
                            <tr key={id}>
                                <td>{trips[id].name}</td>
                                <td>
                                    <ul>
                                        {trips[id].route.locations.map(id => {
                                            return <li key={id}>{locations[id].city} ({locations[id].country})</li>
                                        })}
                                    </ul>
                                </td>
                                <td>{new Date(trips[id].route.arrivalDate).toLocaleDateString()}</td>
                                <td>{new Date(trips[id].route.departureDate).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`/trips/${id}`}
                                          className="btn btn-info btn-sm"
                                    >Update</Link>
                                    <button className="btn btn-danger btn-sm"
                                            onClick={handleDeleteTripBtn(trips[id],showPopup,remove,hidePopup)}
                                    >Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <Link to={'/trips/add'}
                  className="btn btn-lg btn-success btn-sm"
            >Add new trip
            </Link>
        </div>
    );

TripsTable.propTypes = {
    locationsList: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        route: PropTypes.shape({
            arrivalDate: PropTypes.string,
            departureDate: PropTypes.string,
            locations:PropTypes.arrayOf(PropTypes.string)
        })
    }))
};

export default TripsTable;
