import React from 'react';
import {NavLink} from 'react-router-dom';

import {MenuItems} from "../Global/Menu/MenuItems";

export const MainPage = () => {
  return (
      <div className="jumbotron">
          <h1 className="display-3">Welcome to our Agency!</h1>
          <hr className="my-4" />
          <nav className="lead navbar navbar-expand-lg navbar-light bg-light">
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
      </div>
  )
};