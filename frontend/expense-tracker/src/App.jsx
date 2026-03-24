import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";

import UserProvider from "./context/UserContext";
import { Toaster } from "react-hot-toast";


import { setNavigate } from "./utils/axiosInstance";


const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent /> 
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
};

export default App;


const AppContent = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate); 
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/income" element={<Income />} />
      <Route path="/expense" element={<Expense />} />
    </Routes>
  );
};


const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");

  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};