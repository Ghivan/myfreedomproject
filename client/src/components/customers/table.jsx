import React from 'react';
import PropTypes from 'prop-types';


const handleUpdateBtn = (id, callback) => {
    return (e) => {
        e.preventDefault();
        callback(id)
    }
};

const handleDeleteCustomerBtn = (customer, showPopup, onAccept, hidePopup) => {
    return e => {
        e.preventDefault();
        showPopup(
            `Do you really want to delete customer: "${customer.firstName} ${customer.lastName}"?`,
            () => {
                onAccept(customer.id);
                hidePopup()
            },
            () => hidePopup()
        );
    }
};

const CustomersTable = ({customers, remove, showPopup, hidePopup, showDetails}) =>
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
                                   className="btn btn-info btn-sm"
                                   onClick={handleUpdateBtn(customer.id, showDetails)}
                                >Update</a>
                                <a href="#"
                                   className="btn btn-danger btn-sm"
                                   onClick={handleDeleteCustomerBtn(customer, showPopup, remove, hidePopup)}
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
