import React from "react";
import { Link } from "react-router-dom";
import "./Taskbar.css";

const Taskbar = () => {
    return (
        <div className="taskbar">
            <ul>
                <li>
                    <button className="link-button">
                        <Link to="/expense-tracker">Dashboard</Link>
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
        </div>
    );
};

export default Taskbar;
