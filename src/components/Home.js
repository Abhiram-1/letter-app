// src/components/Home.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getLetters, deleteLetter } from "../services/api";
import "./Home.css";

const Home = ({ isAuthenticated }) => {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  // In Home.js, add an effect to refresh the list when the component gets focus
  useEffect(() => {
    if (isAuthenticated) {
      fetchLetters();

      // Add an event listener for when the window gets focus
      const handleFocus = () => {
        fetchLetters();
      };

      window.addEventListener("focus", handleFocus);

      // Clean up
      return () => {
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [isAuthenticated]);

  const fetchLetters = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLetters();
      setLetters(data);
    } catch (error) {
      console.error("Failed to fetch letters:", error);
      setError("Failed to load your letters. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    // Navigate to empty editor (create new)
    navigate("/editor");
  };

  const handleDelete = async (id, e) => {
    e.preventDefault(); // Prevent clicking through to edit
    e.stopPropagation(); // Stop event propagation

    if (!window.confirm("Are you sure you want to delete this letter?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await deleteLetter(id);
      // Update the letters list
      setLetters(letters.filter((letter) => letter.id !== id));
    } catch (error) {
      console.error("Failed to delete letter:", error);
      alert("Failed to delete letter. Please try again.");
    } finally {
      setDeleteLoading(null);
    }
  };
  const refreshLetters = async () => {
    setLoading(true);
    try {
      const data = await getLetters();
      setLetters(data);
      setError(null);
    } catch (error) {
      console.error("Failed to refresh letters:", error);
      setError("Failed to refresh your letters. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a refresh button next to the "Create New Letter" button
  <div className="header">
    <h1>Your Letters</h1>
    <div className="header-actions">
      <button
        className="refresh-button"
        onClick={refreshLetters}
        disabled={loading}
      >
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
          <path d="M23 4v6h-6"></path>
          <path d="M1 20v-6h6"></path>
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
        Refresh
      </button>
      <button className="create-button" onClick={handleCreateNew}>
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
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Create New Letter
      </button>
    </div>
  </div>;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!isAuthenticated) {
    return (
      <div className="home">
        <div className="hero">
          <h1>Create Beautiful Letters with Drive Integration</h1>
          <p>
            Write, edit, and save your letters directly to Google Drive with our
            simple and elegant letter editor.
          </p>
          <Link to="/login" className="cta-button">
            Get Started
          </Link>
        </div>
        <div className="features">
          <div className="feature">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <h2>Easy to Use</h2>
            <p>
              Our clean, distraction-free editor makes writing letters a breeze.
              Focus on your content, not complicated tools.
            </p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <h2>Google Drive Integration</h2>
            <p>
              Save your letters directly to your Google Drive. Access them from
              any device at any time.
            </p>
          </div>
          <div className="feature">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2>Secure Authentication</h2>
            <p>
              Login securely with your Google account. Your data is protected
              and only accessible by you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-authenticated">
      <div className="header">
        <h1>Your Letters</h1>
        <button className="create-button" onClick={handleCreateNew}>
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
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Letter
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading your letters...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : letters.length > 0 ? (
        <div className="letters-grid">
          {letters.map((letter) => (
            <div key={letter.id} className="letter-card">
              <h3>{letter.name}</h3>
              <p>Created: {formatDate(letter.createdTime)}</p>
              <div className="letter-actions">
                <Link to={`/editor/${letter.id}`} className="edit-button">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                  Edit
                </Link>
                <a
                  href={letter.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-letters">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <p>
            You don't have any letters yet. Create your first letter to get
            started!
          </p>
          <button className="create-button" onClick={handleCreateNew}>
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
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Your First Letter
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
