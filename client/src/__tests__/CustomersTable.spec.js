import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mount } from 'enzyme';

import {MemoryRouter, Link} from 'react-router-dom';
import CustomersTable from '../features/Customers/CustomersTable';

Enzyme.configure({ adapter: new Adapter() });
global.requestAnimationFrame = function(callback) {
    setTimeout(callback, 0);
};

const getCustomers = () => [
    {
        id: '1e2ghd',
        firstName: 'John',
        lastName: 'Johnson',
        trips: [
            {
                id: "1",
                name: "Rally"
            }
        ]
    },
    {
        id: '1e2g323hd',
        firstName: 'John',
        lastName: 'Johnson',
        trips: [
            {
                id: "1",
                name: "Rally"
            }
        ]
    }
];

it('passes customers property right', () => {
    const customers = getCustomers();
    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers} />
        </MemoryRouter>
    );

   expect(wrapper.find(CustomersTable).prop('customers')).toEqual(customers)
});

it('click calls showPopup function', () => {
    const customers = getCustomers();

    const showPopupFn = jest.fn();

    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers}
                            showPopup={showPopupFn}
            />
        </MemoryRouter>
    );
    wrapper.find(CustomersTable).find('.btn-danger').first().simulate('click');
    expect(showPopupFn.mock.calls.length).toBe(1)
});

it('perform deleting customer by calling remove and hidePopup functions', () => {
    const customers = getCustomers();
    const showPopupFn = jest.fn();
    const hidePopupFn = jest.fn();
    const removeCustomerFn = jest.fn();

    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers}
                            showPopup={showPopupFn}
                            hidePopup={hidePopupFn}
                            remove={removeCustomerFn}
            />
        </MemoryRouter>
    );

    wrapper.find(CustomersTable).find('.btn-danger').first().simulate('click');
    showPopupFn.mock.calls[0][1]();

    expect(removeCustomerFn.mock.calls.length).toBe(1);
    expect(removeCustomerFn.mock.calls[0][0]).toBe(customers[0].id);
});

it('calls hidePopup function without calling remove', () => {
    const customers = getCustomers();
    const showPopupFn = jest.fn();
    const hidePopupFn = jest.fn();
    const removeCustomerFn = jest.fn();

    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers}
                            showPopup={showPopupFn}
                            hidePopup={hidePopupFn}
                            remove={removeCustomerFn}
            />
        </MemoryRouter>
    );

    wrapper.find(CustomersTable).find('.btn-danger').first().simulate('click');
    showPopupFn.mock.calls[0][2]();

    expect(removeCustomerFn.mock.calls.length).toBe(0);
});

it('link should redirect to right page', () => {
    const customers = getCustomers();
    const showPopupFn = jest.fn();
    const hidePopupFn = jest.fn();
    const removeCustomerFn = jest.fn();

    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers}
                            showPopup={showPopupFn}
                            hidePopup={hidePopupFn}
                            remove={removeCustomerFn}
            />
        </MemoryRouter>
    );
    expect(wrapper.find(Link).get(0).props.to).toMatch(new RegExp(customers[0].id))
});