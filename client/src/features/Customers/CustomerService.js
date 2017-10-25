import {APIDriver} from '../../api/api';
import {
    fetchCustomersList,
    addCustomer,
    updateCustomer,
    deleteCustomer
} from './CustomersReducer';
import { setError } from '../Global/Errors/ErrorReducer';

export const CustomersService = {
    fetchCustomers: () => {
        return (dispatch) => {
            APIDriver.getAll('customers')
                .then((customers) => {
                    fetchCustomersList(dispatch, customers);
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    },

    addCustomer: (newCustomer) => {
        return (dispatch) => {
            APIDriver.add('customers', newCustomer)
                .then((customer) => {
                    addCustomer(dispatch, customer)
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    },

    updateCustomer: (customerId, updatedCustomer) => {
        return (dispatch) => {
            APIDriver.update('customers', customerId, updatedCustomer)
                .then((customer) => {
                    updateCustomer(dispatch, customer);
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    },

    deleteCustomer: (customerId) => {
        return (dispatch) => {
            APIDriver.remove('customers', customerId)
                .then((customer) => {
                    deleteCustomer(dispatch, customerId);
                })
                .catch(err => {
                    setError(dispatch, err.message)
                })
        };
    }
};
