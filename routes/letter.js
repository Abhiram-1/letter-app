// routes/letter.js
const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const {
  saveLetterToDrive,
  getLettersFromDrive,
  getLetterFromDrive,
} = require("../utils/googleDrive");

// Get all letters for current user
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const letters = await getLettersFromDrive(req.user);
    res.status(200).json(letters);
  } catch (error) {
    console.error("Error fetching letters:", error);
    res.status(500).json({
      error: "Failed to fetch letters",
      message: error.message,
    });
  }
});

// Get a specific letter
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    const letter = await getLetterFromDrive(req.user, req.params.id);
    res.status(200).json(letter);
  } catch (error) {
    console.error("Error fetching letter:", error);
    res.status(500).json({
      error: "Failed to fetch letter",
      message: error.message,
    });
  }
});

// Create a new letter
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Title and content are required",
      });
    }

    const letter = await saveLetterToDrive(req.user, { title, content });
    res.status(201).json(letter);
  } catch (error) {
    console.error("Error creating letter:", error);
    res.status(500).json({
      error: "Failed to create letter",
      message: error.message,
    });
  }
});

// Update an existing letter (this would require more complex Google Docs API usage)
// This is a simplified version
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const fileId = req.params.id;

    // This is a simplified approach - in reality, you'd need to handle
    // Google Docs document updating more carefully
    const letter = await saveLetterToDrive(req.user, {
      title,
      content,
      fileId,
    });

    res.status(200).json(letter);
  } catch (error) {
    console.error("Error updating letter:", error);
    res.status(500).json({
      error: "Failed to update letter",
      message: error.message,
    });
  }
});

module.exports = router;
