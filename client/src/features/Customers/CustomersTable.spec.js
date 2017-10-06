import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import { shallow, mount, render } from 'enzyme';
Enzyme.configure({ adapter: new Adapter() });

import {BrowserRouter as Router} from 'react-router-dom';
import CustomersTable from './CustomersTable';

it('passes customers property right', () => {
    const customers = [
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
        }
    ];

    const wrapper = mount(
        <Router>
            <CustomersTable customers={customers} />
        </Router>
    );

   expect(wrapper.find(CustomersTable).prop('customers')).toEqual(customers)
});

it('click calls showPopup function', () => {
    const customers = [
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
        }
    ];

    const showPopupFn = jest.fn();

    const wrapper = mount(
        <Router>
            <CustomersTable customers={customers}
                            showPopup={showPopupFn}
            />
        </Router>
    );
    wrapper.find(CustomersTable).find('.btn-danger').simulate('click');
    expect(showPopupFn.mock.calls.length).toBe(1)
});

it('perform deleting customer by calling remove and hidePopup functions', () => {
    const customers = [
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
        }
    ];

    const showPopupFn = jest.fn();
    const hidePopupFn = jest.fn();
    const removeCustomerFn = jest.fn();

    const wrapper = mount(
        <Router>
            <CustomersTable customers={customers}
                            showPopup={showPopupFn}
                            hidePopup={hidePopupFn}
                            remove={removeCustomerFn}
            />
        </Router>
    );

    wrapper.find(CustomersTable).find('.btn-danger').simulate('click');
    showPopupFn.mock.calls[0][1]();

    expect(removeCustomerFn.mock.calls.length).toBe(1);
    expect(removeCustomerFn.mock.calls[0][0]).toBe(customers[0].id);
});

it('calls hidePopup function without calling remove', () => {
    const customers = [
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
        }
    ];

    const showPopupFn = jest.fn();
    const hidePopupFn = jest.fn();
    const removeCustomerFn = jest.fn();

    const wrapper = mount(
        <Router>
            <CustomersTable customers={customers}
                            showPopup={showPopupFn}
                            hidePopup={hidePopupFn}
                            remove={removeCustomerFn}
            />
        </Router>
    );

    wrapper.find(CustomersTable).find('.btn-danger').simulate('click');
    showPopupFn.mock.calls[0][2]();

    expect(removeCustomerFn.mock.calls.length).toBe(0);
});