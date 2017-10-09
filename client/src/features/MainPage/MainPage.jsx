import React from 'react';
import {NavLink} from 'react-router-dom';

import {MenuItems} from "../Global/Menu/MenuItems";

export const MainPage = () => {
  return (
      <div className="jumbotron">
          <h1 className="display-3">Welcome to our Agency!</h1>
          <hr className="my-4" />
          <nav className="lead navbar navbar-expand-lg navbar-light bg-light">
                  <ul className="navbar-nav">
                      {MenuItems.map(item => (
                          <li className={`nav-item`}
                              key={item.label}>
                              <NavLink className="nav-link"
                                       to={item.path}
                              >
                                  {item.label}
                              </NavLink>
                          </li>
                      ))}
                  </ul>
          </nav>
      </div>
  )
};