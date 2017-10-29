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
            return APIDriver.getAll('customers')
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
            return APIDriver.add('customers', newCustomer)
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
            return APIDriver.update('customers', customerId, updatedCustomer)
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
            return APIDriver.remove('customers', customerId)
                .then((customer) => {
                    dispatch(deleteCustomer(customerId));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    }
};
