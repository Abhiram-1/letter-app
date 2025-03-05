// src/components/Editor.js with improved document-like appearance
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLetter, createLetter, updateLetter } from "../services/api";
import "./Editor.css";

const Editor = ({ user }) => {
  const [letter, setLetter] = useState({
    title: "",
    content: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);
  const editorRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Load letter if editing an existing one
  useEffect(() => {
    const fetchLetter = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setLoadError("");
        const letterData = await getLetter(id);
        setLetter({
          title: letterData.name || "",
          content: letterData.content || "",
        });
      } catch (error) {
        console.error("Failed to load letter:", error);
        setLoadError("Failed to load the letter. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetter();
  }, [id]);

  // Initialize editor content after loading
  useEffect(() => {
    if (editorRef.current && letter.content) {
      editorRef.current.innerHTML = letter.content;
    }
  }, [letter.content, isLoading]);

  // Handle title change
  const handleTitleChange = (e) => {
    setLetter((prev) => ({ ...prev, title: e.target.value }));
  };

  // Handle content change
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      setLetter((prev) => ({ ...prev, content }));

      // Clear any previous auto-save timer
      if (autoSaveTimer) clearTimeout(autoSaveTimer);

      // Set a new auto-save timer
      if (letter.title && content) {
        const timer = setTimeout(() => {
          handleSave(true);
        }, 5000); // Auto-save after 5 seconds of inactivity

        setAutoSaveTimer(timer);
      }
    }
  };

  // Cleanup auto-save timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) clearTimeout(autoSaveTimer);
    };
  }, [autoSaveTimer]);

  // Format handling functions
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  // Handle save
  const handleSave = async (isAutoSave = false) => {
    if (!letter.title || !editorRef.current.innerHTML) {
      setSaveError("Please provide both title and content for your letter");
      return;
    }

    // Get the latest content from the editor
    const currentContent = editorRef.current.innerHTML;

    try {
      setIsSaving(true);
      setSaveError("");
      setSaveStatus(isAutoSave ? "Auto-saving..." : "Saving...");

      const letterToSave = {
        ...letter,
        content: currentContent,
      };

      let response;
      if (id) {
        // Update existing letter
        response = await updateLetter(id, letterToSave);
      } else {
        // Create new letter
        response = await createLetter(letterToSave);
        // Redirect to edit page with new ID if not auto-saving
        if (!isAutoSave) {
          navigate(`/editor/${response.id}`, { replace: true });
        }
      }

      setSaveStatus(isAutoSave ? "Auto-saved" : "Saved to Google Drive");

      // Reset status message after a delay
      setTimeout(() => {
        setSaveStatus("");
      }, 3000);
    } catch (error) {
      console.error("Failed to save letter:", error);
      setSaveError("Failed to save your letter. Please try again.");
      setSaveStatus("");
    } finally {
      setIsSaving(false);
    }
  };

  // Create a folder in Google Drive (bonus feature)
  const createFolder = async () => {
    // Implementation would go here
    // This would require backend endpoint to create a folder
    alert("This feature will create a 'Letters' folder in your Google Drive");
  };

  // Handle back to home
  const handleBack = () => {
    navigate("/");
  };

  // Handle text color change
  const handleTextColor = () => {
    const color = prompt("Enter color (e.g., #FF0000 for red):", "#000000");
    if (color) {
      execCommand("foreColor", color);
    }
  };

  // Handle background color change
  const handleBackgroundColor = () => {
    const color = prompt(
      "Enter background color (e.g., #FFFF00 for yellow):",
      "#FFFFFF"
    );
    if (color) {
      execCommand("hiliteColor", color);
    }
  };

  // Handle font size change
  const handleFontSize = () => {
    const size = prompt("Enter font size (1-7):", "3");
    if (size) {
      execCommand("fontSize", size);
    }
  };

  if (isLoading) {
    return <div className="editor-loading">Loading letter...</div>;
  }

  if (loadError) {
    return (
      <div className="editor-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p>{loadError}</p>
        <button onClick={handleBack}>Back to Home</button>
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <button className="back-button" onClick={handleBack}>
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
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back
        </button>
        <div className="editor-title-container">
          <input
            type="text"
            name="title"
            value={letter.title}
            onChange={handleTitleChange}
            placeholder="Letter Title"
            className="editor-title-input"
          />
        </div>
        <div className="editor-actions">
          <div className="save-status">
            {saveStatus && <span className="save-success">{saveStatus}</span>}
            {saveError && <span className="save-error">{saveError}</span>}
          </div>
          <button
            className="organize-button"
            onClick={createFolder}
            title="Create a Letters folder in Google Drive"
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
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Organize
          </button>
          <button
            className="save-button"
            onClick={() => handleSave(false)}
            disabled={isSaving || !letter.title}
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
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {isSaving ? "Saving..." : "Save to Drive"}
          </button>
        </div>
      </div>

      <div className="editor-toolbar">
        <div className="toolbar-group">
          <button onClick={() => execCommand("bold")} title="Bold">
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
              <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
              <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
            </svg>
          </button>
          <button onClick={() => execCommand("italic")} title="Italic">
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
              <line x1="19" y1="4" x2="10" y2="4"></line>
              <line x1="14" y1="20" x2="5" y2="20"></line>
              <line x1="15" y1="4" x2="9" y2="20"></line>
            </svg>
          </button>
          <button onClick={() => execCommand("underline")} title="Underline">
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
              <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"></path>
              <line x1="4" y1="21" x2="20" y2="21"></line>
            </svg>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button onClick={handleTextColor} title="Text Color">
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
              <path d="M9 3h6l3 7-9 11L3 10z"></path>
            </svg>
          </button>
          <button onClick={handleBackgroundColor} title="Background Color">
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            </svg>
          </button>
          <button onClick={handleFontSize} title="Font Size">
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
              <polyline points="4 7 4 4 20 4 20 7"></polyline>
              <line x1="9" y1="20" x2="15" y2="20"></line>
              <line x1="12" y1="4" x2="12" y2="20"></line>
            </svg>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button
            onClick={() => execCommand("insertUnorderedList")}
            title="Bullet List"
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
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          </button>
          <button
            onClick={() => execCommand("insertOrderedList")}
            title="Numbered List"
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
              <line x1="10" y1="6" x2="21" y2="6"></line>
              <line x1="10" y1="12" x2="21" y2="12"></line>
              <line x1="10" y1="18" x2="21" y2="18"></line>
              <path d="M4 6h1v4"></path>
              <path d="M4 10h2"></path>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            </svg>
          </button>
        </div>

        <div className="toolbar-divider"></div>

        <div className="toolbar-group">
          <button onClick={() => execCommand("justifyLeft")} title="Align Left">
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
              <line x1="17" y1="10" x2="3" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="17" y1="18" x2="3" y2="18"></line>
            </svg>
          </button>
          <button
            onClick={() => execCommand("justifyCenter")}
            title="Align Center"
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
              <line x1="18" y1="10" x2="6" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="18" y1="18" x2="6" y2="18"></line>
            </svg>
          </button>
          <button
            onClick={() => execCommand("justifyRight")}
            title="Align Right"
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
              <line x1="21" y1="10" x2="7" y2="10"></line>
              <line x1="21" y1="6" x2="3" y2="6"></line>
              <line x1="21" y1="14" x2="3" y2="14"></line>
              <line x1="21" y1="18" x2="7" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <div className="document-container">
        <div className="document-page">
          <div
            ref={editorRef}
            className="document-editor"
            contentEditable
            onInput={handleContentChange}
            dangerouslySetInnerHTML={{ __html: letter.content }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
