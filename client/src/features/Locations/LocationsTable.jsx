import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const handleDeleteLocationBtn = (location, showPopup, onAccept, hidePopup) => {
    return e => {
        e.preventDefault();
        showPopup(
            `Do you really want to delete location: "${location.city} (${location.country})"?`,
            () => {
                onAccept(location.id);
                hidePopup()
            },
            () => hidePopup()
        );
    }
};

const LocationsTable = ({locations, remove, showPopup, hidePopup}) =>
    (
        <div>
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
                            <tr key={location.id} className={`${location.updated ? 'updated' : ''}`}>
                                <td>{location.city}</td>
                                <td>{location.country}</td>
                                <td>
                                    <Link to={`/locations/${location.id}`}
                                          className="btn btn-info btn-sm"
                                    >Update
                                    </Link>
                                    <button className="btn btn-danger btn-sm"
                                            onClick={handleDeleteLocationBtn(location, showPopup,remove, hidePopup)}
                                    >Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <Link to={'/locations/add'}
                  className="btn btn-lg btn-success btn-sm"
            >Add new location
            </Link>
        </div>
    );

LocationsTable.propTypes = {
    locations: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired
    }))
};

export default LocationsTable;
