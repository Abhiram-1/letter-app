// routes/auth.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Google OAuth Login route
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/drive.file"],
    accessType: "offline",
    prompt: "consent",
  })
);

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/login`,
  }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/editor`
    );
  }
);

// Check if user is authenticated
router.get("/status", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      isAuthenticated: true,
      user: {
        id: req.user.id,
        displayName: req.user.displayName,
        email: req.user.email,
        photo: req.user.photo,
      },
    });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
});

// Logout route
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy();
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:3000"}/login`
    );
  });
});

module.exports = router;
