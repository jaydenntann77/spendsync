// src/components/Taskbar/Taskbar.js
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartBar,
    faDollarSign,
    faUsers,
    faSignOutAlt,
    faMapMarkerAlt, // Import the icon for Nearby
} from "@fortawesome/free-solid-svg-icons";
import "./Taskbar.css";

export const Taskbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { profilePhoto } = useGetUserInfo();
    const navigate = useNavigate();
    const taskbarRef = useRef(null);

    const signUserOut = async () => {
        try {
            await signOut(auth);
            localStorage.clear(); // clears local storage after signing out
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    const toggleTaskbar = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (taskbarRef.current && !taskbarRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div ref={taskbarRef} className={`taskbar ${isOpen ? "open" : ""}`}>
            <div className="toggle-button" onClick={toggleTaskbar}>
                {isOpen ? "Close" : "Open"}
            </div>
            <ul>
                <li>
                    <button className="link-button">
                        <FontAwesomeIcon icon={faChartBar} className="icon" />
                        <Link to="/">Dashboard</Link>
                    </button>
                </li>
                <li>
                    <button className="link-button">
                        <FontAwesomeIcon icon={faDollarSign} className="icon" />
                        <Link to="/add-transaction">Add Transaction</Link>
                    </button>
                </li>
                <li>
                    <button className="link-button">
                        <FontAwesomeIcon icon={faUsers} className="icon" />
                        <Link to="/groups">Groups</Link>
                    </button>
                </li>
                <li>
                    <button className="link-button">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="icon" /> {/* Add Nearby icon */}
                        <Link to="/nearby">Nearby</Link> {/* Add Nearby link */}
                    </button>
                </li>
            </ul>
            <div className="profile-section">
                {profilePhoto && (
                    <div className="profile">
                        <img
                            className="profile-photo"
                            src={profilePhoto}
                            alt="Profile"
                        />
                    </div>
                )}
                <button className="sign-out-button" onClick={signUserOut}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
                    Sign Out
                </button>
            </div>
        </div>
    );
};
