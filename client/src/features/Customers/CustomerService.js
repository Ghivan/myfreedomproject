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
                    dispatch(fetchCustomersList(customers));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    addCustomer: (newCustomer) => {
        return (dispatch) => {
            APIDriver.add('customers', newCustomer)
                .then((customer) => {
                    dispatch(addCustomer(customer))
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    updateCustomer: (customerId, updatedCustomer) => {
        return (dispatch) => {
            APIDriver.update('customers', customerId, updatedCustomer)
                .then((customer) => {
                    dispatch(updateCustomer(customer));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    deleteCustomer: (customerId) => {
        return (dispatch) => {
            APIDriver.remove('customers', customerId)
                .then((customer) => {
                    dispatch(deleteCustomer(customerId));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    }
};
