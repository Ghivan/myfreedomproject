import ActionTypes from './CustomersActionTypes';
import { setError } from '../Global/Errors/ErrorReducer';

export const fetchCustomersList = customers => ({
    type: ActionTypes.GET_LIST,
    payload: {
        customers
    }
});

export const addCustomer = customer => ({
    type: ActionTypes.ADD_CUSTOMER,
    payload: {
        customer
    }
});

export const updateCustomer = customer => ({
    type: ActionTypes.UPDATE_CUSTOMER,
    payload: {
        customer
    }
});

export const deleteCustomer = customerId => ({
    type: ActionTypes.DELETE_CUSTOMER,
    payload: {
        id: customerId
    }
});

export default {
    fetchCustomers: () => {
        return (dispatch, getState, api) => {
            return api.getAll('customers')
                .then((customers) => {
                    dispatch(fetchCustomersList(customers));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    addCustomer: (newCustomer) => {
        return (dispatch, getState, api) => {
            return api.add('customers', newCustomer)
                .then((customer) => {
                    dispatch(addCustomer(customer))
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    updateCustomer: (customerId, updatedCustomer) => {
        return (dispatch, getState, api) => {
            return api.update('customers', customerId, updatedCustomer)
                .then((customer) => {
                    dispatch(updateCustomer(customer));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    },

    deleteCustomer: (customerId) => {
        return (dispatch, getState, api) => {
            return api.remove('customers', customerId)
                .then((customer) => {
                    dispatch(deleteCustomer(customerId));
                })
                .catch(err => {
                    dispatch(setError(err.message))
                })
        };
    }
};
