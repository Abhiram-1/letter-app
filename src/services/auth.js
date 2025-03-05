// src/services/auth.js
import { API_BASE_URL } from "../config";

// Check if user is authenticated
export const checkAuthStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/status`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to check authentication status");
    }

    return await response.json();
  } catch (error) {
    console.error("Auth status check failed:", error);
    return { isAuthenticated: false };
  }
};

// Logout user
export const logout = () => {
  window.location.href = `${API_BASE_URL}/auth/logout`;
};

// Get Google login URL
export const getGoogleLoginUrl = () => {
  return `${API_BASE_URL}/auth/google`;
};
