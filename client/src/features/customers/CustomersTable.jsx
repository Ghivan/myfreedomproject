import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

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
        <div>
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
                            <tr key={customer.id} className={`${customer.updated ? 'updated' : ''}`}>
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
                                    <Link to={`/customers/${customer.id}`}
                                          className="btn btn-info btn-sm"
                                    >Update</Link>
                                    <button className="btn btn-danger btn-sm"
                                            onClick={handleDeleteCustomerBtn(customer, showPopup, remove, hidePopup)}
                                    >Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
                </tbody>
            </table>
            <Link to={'/customers/add'}
                  className="btn btn-lg btn-success btn-sm"
            >Add new customer
            </Link>
        </div>
    );

CustomersTable.propTypes = {
    locationsList: PropTypes.arrayOf(PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        trips: PropTypes.array
    }))
};

export default CustomersTable;
