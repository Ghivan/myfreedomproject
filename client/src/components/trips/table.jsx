import React from 'react';
import PropTypes from 'prop-types';

const TripsTable = ({trips, remove, showPopup, hidePopup}) =>
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
                        <tr key={trip.id}>
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
                                   className="btn btn-danger btn-sm"
                                   onClick={
                                       e => {
                                           e.preventDefault();
                                           showPopup(
                                               `Do you really want to delete trip: "${trip.name}"`,
                                               () => {
                                                   remove(trip.id);
                                                   hidePopup()
                                               },
                                               () => hidePopup()
                                           );
                                       }
                                   }
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
