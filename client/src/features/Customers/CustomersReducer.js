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
    return {
        ...state,
        list: action.payload.customers
    };
};

export const addCustomer = customer => ({
        type: ActionTypes.ADD_CUSTOMER,
        payload: {
            customer
        }
    });

const __addCustomer = (state, action) => {
    const newCustomersList = state.list.slice();
    newCustomersList.push(action.payload.customer);
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
    const newCustomersList = state.list.slice();
    const index = newCustomersList.findIndex(item => item.id === action.payload.customer.id);
    newCustomersList.splice(index, 1, action.payload.customer);
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
    const newCustomersList = state.list.slice();
    const index = newCustomersList.findIndex(item => item.id === action.payload.id);
    newCustomersList.splice(index, 1);
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