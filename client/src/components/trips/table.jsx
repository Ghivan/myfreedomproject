import React from 'react';
import PropTypes from 'prop-types';

const TripsTable = ({trips}) =>
    (
        <table className="table table-responsive table-striped table-hover">
            <thead>
            <tr>
                <th>Name</th>
                <th>Locations</th>
                <th>Arrival date</th>
                <th>Departure date</th>
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
