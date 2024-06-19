import "./App.css";
import Taskbar from "./components/Taskbar/Taskbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth } from "./pages/auth/index";
import { AddFriends } from "./pages/add-friends/index";
import { ExpenseTracker } from "./pages/expense-tracker/index";
import { AddTransaction } from "./pages/add-transaction/index";
import { Groups } from "./pages/groups/index";

function App() {
    return (
        <div className="App">
            <Router>
                <div style={{ display: "flex" }}>
                    <Taskbar />
                    <div
                        style={{
                            marginLeft: "200px",
                            padding: "20px",
                            width: "100%",
                        }}
                    >
                        <Routes>
                            <Route path="/" exact element={<Auth />} />
                            <Route
                                path="/expense-tracker"
                                element={<ExpenseTracker />}
                            />
                            <Route
                                path="/add-transaction"
                                element={<AddTransaction />}
                            />
                            <Route path="/groups" element={<Groups />} />
                            <Route
                                path="/add-friends"
                                element={<AddFriends />}
                            />
                        </Routes>
                    </div>
                </div>
            </Router>
        </div>
    );
}

export default App;
