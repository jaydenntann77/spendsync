import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSignOutAlt,
    faBars,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Taskbar.css";

export const Taskbar = () => {
    const { profilePhoto, userID } = useGetUserInfo();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

    const signUserOut = async () => {
        try {
            await signOut(auth);
            localStorage.clear(); // clears local storage after signing out
            navigate("/"); // redirect to auth page
        } catch (err) {
            console.error(err);
        }
    };

    // If userID is not present, user is not authenticated
    if (!userID) {
        return null; // Do not render the Taskbar
    }

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        SpendSync
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleSidebar}
                    >
                        <FontAwesomeIcon icon={faBars} />
                    </button>
                    <div
                        className={`collapse navbar-collapse ${isSidebarOpen ? 'show' : ''}`}
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink
                                    exact
                                    className="nav-link"
                                    activeClassName="active"
                                    to="/expense-tracker"
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    activeClassName="active"
                                    to="/add-transaction"
                                >
                                    Add Transaction
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    activeClassName="active"
                                    to="/groups"
                                >
                                    Groups
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    activeClassName="active"
                                    to="/nearby"
                                >
                                    Nearby
                                </NavLink>
                            </li>
                        </ul>
                        <ul className="navbar-nav ml-auto">
                            {profilePhoto && (
                                <li className="nav-item">
                                    <img
                                        src={profilePhoto}
                                        alt="Profile"
                                        className="rounded-circle"
                                        width="40"
                                        height="40"
                                    />
                                </li>
                            )}
                            <li className="nav-item">
                                <button
                                    className="btn btn-outline-danger"
                                    onClick={signUserOut}
                                >
                                    <FontAwesomeIcon
                                        icon={faSignOutAlt}
                                        className="mr-2"
                                    />{" "}
                                    Sign Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            
        </>
    );
};
