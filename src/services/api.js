// src/services/api.js
import { API_BASE_URL } from "../config";

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Get all letters
export const getLetters = async () => {
  return apiRequest("/api/letters");
};

// Get a specific letter
export const getLetter = async (id) => {
  return apiRequest(`/api/letters/${id}`);
};

// Create a new letter
export const createLetter = async (letterData) => {
  return apiRequest("/api/letters", {
    method: "POST",
    body: JSON.stringify(letterData),
  });
};

// Update an existing letter
export const updateLetter = async (id, letterData) => {
  return apiRequest(`/api/letters/${id}`, {
    method: "PUT",
    body: JSON.stringify(letterData),
  });
};

// Delete a letter
export const deleteLetter = async (id) => {
  return apiRequest(`/api/letters/${id}`, {
    method: "DELETE",
  });
};
