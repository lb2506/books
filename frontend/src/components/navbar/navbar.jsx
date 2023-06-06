import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";

import "./navbar.scss"

const Navbar = () => {

    const navigate = useNavigate();
    const [role, setRole] = useState(null);

    const isLoggedIn = Boolean(localStorage.getItem('token'));

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwt_decode(token);
            setRole(decodedToken.role);
        }
    }, [isLoggedIn]);

    const logout = () => {
        localStorage.removeItem('token');
        navigate('/');
        setRole(null);
    }

    return (
        <div className="navbar">
            <button onClick={() => navigate("/")}>Logo</button>
            <div>
                <button onClick={() => navigate("/")}>Accueil</button>
                {isLoggedIn && <button onClick={() => navigate("/booksList")}>Ma liste</button>}
                <button onClick={() => navigate("/findLibrary")}>Trouver une librairie</button>
            </div>
            <div>
                {role === "admin" && <button onClick={() => navigate("/adminPanel")}>Administration</button>}
                {!isLoggedIn && <button onClick={() => navigate("/register")}>Inscription</button>}
                {!isLoggedIn && <button onClick={() => navigate("/login")}>Connexion</button>}
                {isLoggedIn && <button onClick={logout}>Déconnexion</button>}
            </div>
        </div>
    )
}

export default Navbar;