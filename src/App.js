// src/App.js
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Editor from "./components/Editor";
import Navbar from "./components/Navbar";
import { checkAuthStatus } from "./services/auth";
import "./App.css";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthStatus();
        setIsAuthenticated(response.isAuthenticated);
        if (response.isAuthenticated) {
          setUser(response.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return <div className="loading">Loading...</div>;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} user={user} />
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={<Home isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/login"
              element={<Login isAuthenticated={isAuthenticated} />}
            />
            <Route
              path="/editor"
              element={
                <ProtectedRoute>
                  <Editor user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/editor/:id"
              element={
                <ProtectedRoute>
                  <Editor user={user} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
