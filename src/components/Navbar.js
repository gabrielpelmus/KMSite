import logo from '../../src/assets/images/mester.jpg'
import React , {useContext} from 'react';
import { NavLink, Link, useLocation  } from 'react-router-dom';
import * as firebase from "firebase/app";
import "firebase/auth"; 

import { AuthContext } from '../features/auth/AuthContext';



export default function Navbar() {
    const { isAuthenticated, user } = useContext(AuthContext);

    async function handleLogout(e) {
        e.preventDefault();

        try {
            await firebase.auth().signOut();
        } catch(e) {
            console.warn(e);
        } 
}



    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <img src={logo} alt="logo-mistru" className="logo"></img>
            <Link className="navbar-brand" to="/">DL. Maistru</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse"  aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <SrNavLink className="nav-link active" to="/workers">Anunturi</SrNavLink>
                    </li>
                
                    <li className="nav-item">
                    { isAuthenticated ?
                        <SrNavLink className="nav-link" to="/userworkers">Anunturile mele</SrNavLink> : null
                    }
                    </li>

                    <li className="nav-item">
                    { isAuthenticated ?
                        <SrNavLink className="nav-link" to="/add">Adaugare anunt</SrNavLink> : null
                    }
                    </li>
                </ul>
                <ul className="navbar-nav">
                    {!isAuthenticated ? (
                        <>
                            <li className="nav-item">
                                <SrNavLink className="nav-link" to="/login">Conectare</SrNavLink>
                            </li>
                            <li className="nav-item">
                                <SrNavLink className="nav-link" to="/register">Inregistrare</SrNavLink>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                Bine ati venit, {user.email}!
                            </li>
                            <li className="nav-item">
                                <a href="/" onClick={handleLogout}>Deconectare</a>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}

function SrNavLink({ children, ...rest}) {
    const location = useLocation();

    return (
        <NavLink {...rest}>
            { children }
            { location.pathname === rest.to && <span className="sr-only">(current)</span> }
        </NavLink>
    );
}
