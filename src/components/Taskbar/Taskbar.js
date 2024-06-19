import React from "react";
import { Link } from "react-router-dom";
import "./Taskbar.css";

const Taskbar = () => {
    return (
        <div className="taskbar">
            <ul>
                <li>
                    <Link to="/">Dashboard</Link>
                </li>
                <li>
                    <Link to="/add-transaction">Add Transaction</Link>
                </li>
                <li>
                    <Link to="/groups">Groups</Link>
                </li>
                <li>
                    <Link to="/add-friends">Add Friends</Link>
                </li>
            </ul>
        </div>
    );
};

export default Taskbar;
