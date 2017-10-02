import React from 'react';
import {NavLink} from 'react-router-dom';

import Logo from './react.svg'

import {MenuItems} from "./MenuItems";

export const MainMenu = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
            <img src={Logo} width="30" height="30" className="d-inline-block align-top" alt="" />
            Agency
        </NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                {MenuItems.map(item => (
                    <li className={`nav-item`}
                        key={item.label}>
                        <NavLink className="nav-link"
                           to={item.path}
                        >
                            {item.label}
                        <span className="sr-only">(current)</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    </nav>
);
