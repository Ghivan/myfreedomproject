import _ from 'lodash';
import ActionTypes from './CustomersActionTypes';

const initialState = {
    customers: {}
};



const reducerFetchCustomers = (state, action) => {
    const normalizedCustomers = _.keyBy(action.payload.customers, customer => customer.id);
    return {
        ...state,
        customers: normalizedCustomers
    };
};



const reducerAddCustomer = (state, action) => {
    const newCustomersList = _.cloneDeep(state.customers);
    newCustomersList[action.payload.customer.id] = action.payload.customer;
    return {
        ...state,
        customers: newCustomersList
    };
};



const reducerUpdateCustomer = (state, action) => {
    const newCustomersList = _.cloneDeep(state.customers);
    newCustomersList[action.payload.customer.id] = action.payload.customer;
    return {
        ...state,
        customers: newCustomersList
    };
};



const reducerDeleteCustomer = (state, action) => {
    const newCustomersList = _.cloneDeep(state.customers);
    delete newCustomersList[action.payload.id];
    return {
        ...state,
        customers: newCustomersList
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_LIST:
            return reducerFetchCustomers(state, action);
        case ActionTypes.ADD_CUSTOMER:
            return reducerAddCustomer(state, action);
        case ActionTypes.UPDATE_CUSTOMER:
            return reducerUpdateCustomer(state, action);
        case ActionTypes.DELETE_CUSTOMER:
            return reducerDeleteCustomer(state, action);
        default:
            return state
    }
};