import React from 'react';
import PropTypes from 'prop-types';

const handleUpdateBtn = (id, callback) => {
    return (e) => {
        e.preventDefault();
        callback(id)
    }
};

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

const TripsTable = ({trips, remove, showPopup, hidePopup, showDetails}) =>
    (
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
                trips.map(trip => {
                    return (
                        <tr key={trip.id} className={`${trip.updated ? 'updated' : ''}`}>
                            <td>{trip.name}</td>
                            <td>
                                <ul>
                                    {trip.route.locations.map(location => {
                                        return <li key={location.id}>{location.city} ({location.country})</li>
                                    })}
                                </ul>
                            </td>
                            <td>{new Date(trip.route.arrivalDate).toLocaleDateString()}</td>
                            <td>{new Date(trip.route.departureDate).toLocaleDateString()}</td>
                            <td>
                                <a href="#"
                                   className="btn btn-info btn-sm"
                                   onClick={handleUpdateBtn(trip.id, showDetails)}
                                >Update</a>
                                <a href="#"
                                   className="btn btn-danger btn-sm"
                                   onClick={handleDeleteTripBtn(trip,showPopup,remove,hidePopup)}
                                >Delete</a>
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
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
