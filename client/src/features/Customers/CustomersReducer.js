import _ from 'lodash';

const ActionTypes = {
    GET_LIST: 'CUSTOMERS/ GET LIST',
    SELECT: 'CUSTOMERS/ SELECT',
    CLEAR_SELECTED_CUSTOMER: 'CUSTOMERS/ CLEAR SELECTED',
    ADD_CUSTOMER: 'CUSTOMERS/ ADD',
    UPDATE_CUSTOMER: 'CUSTOMERS/ UPDATE',
    DELETE_CUSTOMER: 'CUSTOMERS/ DELETE'
};

const initialState = {
    list: []
};

export const fetchCustomersList = customers => ({
        type: ActionTypes.GET_LIST,
        payload: {
            customers
        }
    });

const __fetchCustomersList = (state, action) => {
    const normalizedCustomers = _.keyBy(action.payload.customers, customer => customer.id);
    return {
        ...state,
        list: normalizedCustomers
    };
};

export const addCustomer = customer => ({
        type: ActionTypes.ADD_CUSTOMER,
        payload: {
            customer
        }
    });

const __addCustomer = (state, action) => {
    const newCustomersList = Object.assign({}, state.list);
    newCustomersList[action.payload.customer.id] = action.payload.customer;
    return {
        ...state,
        list: newCustomersList
    };
};

export const updateCustomer = customer => ({
        type: ActionTypes.UPDATE_CUSTOMER,
        payload: {
            customer
        }
    });

const __updateCustomer = (state, action) => {
    const newCustomersList = Object.assign({}, state.list);
    newCustomersList[action.payload.customer.id] = action.payload.customer;
    return {
        ...state,
        list: newCustomersList
    };
};

export const deleteCustomer = customerId => ({
        type: ActionTypes.DELETE_CUSTOMER,
        payload: {
            id: customerId
        }
    });

const __deleteCustomer = (state, action) => {
    const newCustomersList = Object.assign({}, state.list);
    delete newCustomersList[action.payload.id];
    return {
        ...state,
        list: newCustomersList
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ActionTypes.GET_LIST:
            return __fetchCustomersList(state, action);
        case ActionTypes.ADD_CUSTOMER:
            return __addCustomer(state, action);
        case ActionTypes.UPDATE_CUSTOMER:
            return __updateCustomer(state, action);
        case ActionTypes.DELETE_CUSTOMER:
            return __deleteCustomer(state, action);
        default:
            return state
    }
};