import React from 'react';
import Logo from './react.svg'

export const MainMenu = ({screens, activeScreen, changeScreen}) => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="#">
            <img src={Logo} width="30" height="30" className="d-inline-block align-top" alt="" />
            Agency
        </a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
                {Object.keys(screens).map(key => (
                    <li className={`nav-item ${screens[key] === activeScreen ? 'active' : ''}`}
                        key={screens[key]}>
                        <a className="nav-link"
                           href="#"
                           onClick={e => {
                               e.preventDefault();
                               changeScreen(screens[key]);
                           }}>{screens[key]}<span className="sr-only">(current)</span></a>
                    </li>
                ))}
            </ul>
        </div>
    </nav>
);
