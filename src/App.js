// src/App.js
import React from "react";
import "./App.css";
import { Taskbar } from "./components/Taskbar/Taskbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/auth/index";
import { ExpenseTracker } from "./pages/expense-tracker/index";
import { AddTransaction } from "./pages/add-transaction/index";
import { Groups } from "./pages/groups/index";
import { useGetUserInfo } from "./hooks/useGetUserInfo";
import { GroupDetails } from "./pages/group-details";
import { AddCategory } from "./pages/add-category/AddCategory";
import { Nearby } from "./pages/Nearby";



function App() {
    const { isAuth } = useGetUserInfo();

    return (
        <div className="App">
            <Router>
                <div style={{ display: "flex", width: "100%", height: "100%" }}>
                    {isAuth && <Taskbar />}
                    <div className="content" style={{ marginLeft: isAuth ? "200px" : "0" }}>
                        <Routes>
                            <Route path="/" exact element={<Auth />} />
                            <Route path="/expense-tracker" element={<ExpenseTracker />} />
                            <Route path="/add-transaction" element={<AddTransaction />} />
                            <Route path="/add-category" element={<AddCategory />} />
                            <Route path="/groups" element={<Groups />} />
                            <Route path="/group/:groupId" element={<GroupDetails />} />
                            <Route path="/nearby" element={<Nearby />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </div>
    );
}

export default App;

