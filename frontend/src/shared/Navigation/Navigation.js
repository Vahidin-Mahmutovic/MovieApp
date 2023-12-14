import React, { useState,useContext } from "react";

import { AuthContext } from "../auth-context";
import './Navigation.css'
import { Link} from "react-router-dom";

const Navigation = () => {
    const auth = useContext(AuthContext);
    
    const [menuOpen, setMenuOpen] = useState(false)

    return (
       
    <nav>
        <Link to='/' className="logo">MovieApp</Link>
            <div className="menu" onClick={()=> {
                setMenuOpen(!menuOpen)
            }}>
                <span></span>
                <span></span>
                <span></span>
            </div>
               {!auth.isLoggedIn &&(
               <ul className={menuOpen ? "open" : ""}>
                <li>
                    <Link to='/register'>Register</Link>
                </li>
                <li>
                    <Link to='/login'>Login</Link>
                </li>
            </ul> )}
           {auth.isLoggedIn &&( 
            <ul className={menuOpen ? "open" : ""}>
            <li>
                <Link to={`/${auth.userId}/movies`}> My Movies</Link>
            </li>
            <li>
                <Link to='/movies/new'>Add Movie</Link>
            </li>
            <li>
                <Link onClick={auth.logout}>Logout</Link>
            </li>
        </ul>)}
    </nav>
    )
}

export default Navigation