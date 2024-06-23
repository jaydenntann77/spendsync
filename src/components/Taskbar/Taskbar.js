import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import "./Taskbar.css";

export const Taskbar = () => {
    const { profilePhoto } = useGetUserInfo();
    const navigate = useNavigate();

    const signUserOut = async () => {
        try {
            await signOut(auth);
            localStorage.clear(); // clears local storage after signing out
            navigate("/");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="taskbar">
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
                <li>
                    <button className="link-button">
                        <Link to="/add-friends">Add Friends</Link>
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
