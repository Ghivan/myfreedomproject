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

const CustomersTable = ({customers, trips, remove, showPopup, hidePopup}) =>
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
                    Object.keys(customers).map(id => {
                        return (
                            <tr key={id}>
                                <td>{customers[id].firstName}</td>
                                <td>{customers[id].lastName}</td>
                                <td>
                                    <ul>
                                        {customers[id].trips.map(id => {
                                            return <li key={id}>{trips[id].name}</li>
                                        })}
                                    </ul>
                                </td>
                                <td>
                                    <Link to={`/customers/${id}`}
                                          className="btn btn-info btn-sm"
                                    >Update</Link>
                                    <button className="btn btn-danger btn-sm"
                                            onClick={handleDeleteCustomerBtn(customers[id], showPopup, remove, hidePopup)}
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
