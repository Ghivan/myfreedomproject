import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {mount} from 'enzyme';

import {MemoryRouter, Link} from 'react-router-dom';
import CustomersTable from '../features/Customers/CustomersTable';

Enzyme.configure({adapter: new Adapter()});

const getCustomers = () => ({
    '59f8c472000faa1c0c2d4136': {
        firstName: 'John',
        lastName: 'Johnson',
        trips: [
            '59f8c471000faa1c0c2d4135'
            ],
        id: '59f8c472000faa1c0c2d4136'
    }
});

const getTrips = () => ({
    '59f8c471000faa1c0c2d4135': {
        name: 'From Paris with love',
        route: {
            arrivalDate: '2017-01-20T00:00:00.000Z',
            departureDate: '2017-01-29T00:00:00.000Z',
            locations: [
                '59f8c470000faa1c0c2d4133',
                '59f8c470000faa1c0c2d4134'
            ]
        },
        id: '59f8c471000faa1c0c2d4135'
    }
});

it('passes customers property right', () => {
    const customers = getCustomers();
    const trips = getTrips();
    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers}
                            trips={trips}
            />
        </MemoryRouter>
    );

    expect(wrapper.find(CustomersTable).prop('customers')).toEqual(customers)
});

it('click calls showPopup function', () => {
    const customers = getCustomers();
    const trips = getTrips();
    const showPopupFn = jest.fn();

    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers}
                            trips={trips}
                            showPopup={showPopupFn}
            />
        </MemoryRouter>
    );
    wrapper.find(CustomersTable).find('.btn-danger').first().simulate('click');
    expect(showPopupFn.mock.calls.length).toBe(1)
});

it('perform deleting customer by calling remove and hidePopup functions', () => {
    const customers = getCustomers();
    const trips = getTrips();
    const customersIds = Object.keys(customers);
    const showPopupFn = jest.fn();
    const hidePopupFn = jest.fn();
    const removeCustomerFn = jest.fn();

    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers}
                            trips={trips}
                            showPopup={showPopupFn}
                            hidePopup={hidePopupFn}
                            remove={removeCustomerFn}
            />
        </MemoryRouter>
    );

    wrapper.find(CustomersTable).find('.btn-danger').first().simulate('click');
    showPopupFn.mock.calls[0][1]();

    expect(removeCustomerFn.mock.calls.length).toBe(1);
    expect(removeCustomerFn.mock.calls[0][0]).toBe(customersIds[0]);
});

it('calls hidePopup function without calling remove', () => {
    const customers = getCustomers();
    const trips = getTrips();
    const showPopupFn = jest.fn();
    const hidePopupFn = jest.fn();
    const removeCustomerFn = jest.fn();

    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers}
                            trips={trips}
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
    const trips = getTrips();
    const customersIds = Object.keys(customers);
    const showPopupFn = jest.fn();
    const hidePopupFn = jest.fn();
    const removeCustomerFn = jest.fn();

    const wrapper = mount(
        <MemoryRouter>
            <CustomersTable customers={customers}
                            trips={trips}
                            showPopup={showPopupFn}
                            hidePopup={hidePopupFn}
                            remove={removeCustomerFn}
            />
        </MemoryRouter>
    );
    expect(wrapper.find(Link).get(0).props.to).toMatch(new RegExp(customersIds[0]))
});