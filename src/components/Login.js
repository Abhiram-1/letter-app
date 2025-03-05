// src/components/Login.js
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getGoogleLoginUrl } from "../services/auth";
import "./Login.css";

const Login = ({ isAuthenticated }) => {
  useEffect(() => {
    // Initialize any required settings
    document.title = "Login - Letter App";
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl();
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <svg
          className="login-logo"
          width="48"
          height="48"
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

        <h2>Welcome to Letter App</h2>
        <p>Sign in to create and save your letters to Google Drive</p>

        <button className="google-login-button" onClick={handleGoogleLogin}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="24px"
            height="24px"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Sign in with Google
        </button>

        <div className="login-info">
          <p>By signing in, you'll be able to:</p>
          <ul>
            <li>Create and edit letters with a clean interface</li>
            <li>Save letters directly to your Google Drive</li>
            <li>Access your letters from any device</li>
            <li>Organize your written communications efficiently</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
