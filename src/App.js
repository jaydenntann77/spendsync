import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { Taskbar } from "./components/Taskbar/Taskbar";
import { Auth } from "./pages/auth/index";
import { ExpenseTracker } from "./pages/expense-tracker/index";
import { AddTransaction } from "./pages/add-transaction/index";
import { Groups } from "./pages/groups/index";
import { useGetUserInfo } from "./hooks/useGetUserInfo";
import { GroupDetails } from "./pages/group-details";
import { AddCategory } from "./pages/add-category/AddCategory";
import "bootstrap/dist/css/bootstrap.min.css";
import theme from "./theme.tsx";
import { Nearby } from "./pages/Nearby";
import { SnackbarProvider } from "notistack";

function App() {
    const { isAuth } = useGetUserInfo();

    return (
        <SnackbarProvider maxSnack={3}>
            <ThemeProvider theme={theme}>
                <div
                    className="App"
                    style={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        // Removed marginLeft to fill entire page
                    }}
                >
                    <Router>
                        <div
                            style={{
                                display: "flex",
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            {/* Remove Taskbar if not needed */}
                            {isAuth && <Taskbar />}
                            <div
                                className="content"
                                style={{ marginLeft: "0" }} // Remove the margin completely
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
                                    <Route
                                        path="/add-transaction/add-category"
                                        element={<AddCategory />}
                                    />
                                    <Route path="/groups" element={<Groups />} />
                                    <Route
                                        path="/group/:groupId"
                                        element={<GroupDetails />}
                                    />
                                    <Route path="/nearby" element={<Nearby />} />
                                </Routes>
                            </div>
                        </div>
                    </Router>
                </div>
            </ThemeProvider>
        </SnackbarProvider>
    );
}

export default App;
