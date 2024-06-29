import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
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
                        <Link to="/">Dashboard</Link>
                    </button>
                </li>
                <li>
                    <button className="link-button">
                        <Link to="/add-transaction">Add Transaction</Link>
                    </button>
                </li>
                <li>
                    <button className="link-button">
                        <Link to="/groups">Groups</Link>
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
                    Sign Out
                </button>
            </div>
        </div>
    );
};
