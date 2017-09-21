import React from 'react';
import PropTypes from 'prop-types';

const LocationsTable = ({locations, remove, showPopup, hidePopup, showDetails}) =>
    (
        <table className="table table-responsive table-striped table-hover">
            <thead>
            <tr>
                <th>City</th>
                <th>Country</th>
                <th>Operations</th>
            </tr>
            </thead>
            <tbody>
            {
                locations.map(location => {
                    return (
                        <tr key={location.id}>
                            <td>{location.city}</td>
                            <td>{location.country}</td>
                            <td><a href="#"
                                   className="btn btn-info btn-sm"
                                   onClick={
                                       e => {
                                           e.preventDefault();
                                           showDetails(location.id)
                                       }
                                   }
                            >Update</a>
                                <a href="#"
                                   className="btn btn-danger btn-sm"
                                   onClick={
                                       e => {
                                           e.preventDefault();
                                           showPopup(
                                               `Do you really want to delete location: "${location.city} (${location.country})"`,
                                               () => {
                                                   remove(location.id);
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

LocationsTable.propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired
    }))
};

export default LocationsTable;
