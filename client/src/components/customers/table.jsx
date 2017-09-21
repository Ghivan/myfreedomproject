import React from 'react';
import PropTypes from 'prop-types';

const CustomersTable = ({customers, remove, showPopup, hidePopup }) =>
    (
        <table className="table table-responsive table-striped table-hover">
            <thead>
            <tr>
                <th>First name</th>
                <th>Last name</th>
                <th>Trips</th>
            </tr>
            </thead>
            <tbody>
            {
                customers.map(customer => {
                    return (
                        <tr key={customer.id}>
                            <td>{customer.firstName}</td>
                            <td>{customer.lastName}</td>
                            <td>
                                <ul>
                                    {customer.trips.map(trip => {
                                        return <li key={trip.id}>{trip.name}</li>
                                    })}
                                </ul>
                            </td>
                            <td>
                                <a href="#"
                                   className="btn btn-danger btn-sm"
                                   onClick={
                                       e => {
                                           e.preventDefault();
                                           showPopup(
                                               `Do you really want to delete location: "${customer.firstName} ${customer.lastName}"`,
                                               () => {
                                                   remove(customer.id);
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

CustomersTable.propTypes = {
    locationsList: PropTypes.arrayOf(PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        trips: PropTypes.array
    }))
};

export default CustomersTable;
