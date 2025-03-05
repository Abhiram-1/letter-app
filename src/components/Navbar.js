// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../services/auth";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, user }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <svg
            className="logo"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M7 18H17V16H7V18Z" fill="#4F46E5" />
            <path d="M7 14H17V12H7V14Z" fill="#4F46E5" />
            <path d="M7 10H11V8H7V10Z" fill="#4F46E5" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 4C4 2.89543 4.89543 2 6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4ZM6 4H18V20H6V4Z"
              fill="#4F46E5"
            />
          </svg>
          <h1>Letter App</h1>
        </Link>
      </div>
      <div className="navbar-menu">
        {isAuthenticated ? (
          <div className="navbar-user">
            {user && user.photo && (
              <img
                src={user.photo}
                alt={user.displayName}
                className="navbar-user-photo"
              />
            )}
            <span className="navbar-user-name">
              {user ? user.displayName : "User"}
            </span>
            <button className="navbar-logout" onClick={logout}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="navbar-login">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
              <polyline points="10 17 15 12 10 7"></polyline>
              <line x1="15" y1="12" x2="3" y2="12"></line>
            </svg>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
