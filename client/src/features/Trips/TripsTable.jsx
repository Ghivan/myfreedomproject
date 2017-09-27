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

const TripsTable = ({trips, remove, showPopup, hidePopup}) =>
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
                                    <Link to={`/trips/${trip.id}`}
                                          className="btn btn-info btn-sm"
                                    >Update</Link>
                                    <button className="btn btn-danger btn-sm"
                                            onClick={handleDeleteTripBtn(trip,showPopup,remove,hidePopup)}
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
