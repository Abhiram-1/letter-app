# Letter App

A full-stack web application that allows users to create and edit text-based letters and save them directly to their Google Drive.

## Features

- **Google Authentication**: Secure sign-in using Google OAuth 2.0
- **Rich Text Editor**: Create and format letters with styling options:
  - Text formatting (bold, italic, underline)
  - Lists (ordered and unordered)
  - Text alignment
  - Color options
- **Google Drive Integration**: Save letters directly to Google Drive in Google Docs format
- **Auto-save Functionality**: Automatically save drafts while editing
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Frontend**: React
- **Backend**: Node.js with Express
- **Authentication**: Google OAuth via Passport.js
- **Storage**: Google Drive API
- **Styling**: Custom CSS

## Implementation Details

### Authentication Flow
The application implements a secure authentication flow using Google OAuth:
1. User clicks "Login with Google"
2. User authorizes the application to access their Google account
3. Google returns an auth token which is used for subsequent API calls
4. User session is maintained securely

### Google Drive Integration
- Letters are saved as Google Docs in the user's Drive
- Users can view, edit, and manage their saved letters
- Proper scopes ensure the app only has access to files it creates

### Rich Text Editor
- Document-like interface with paper styling
- Text formatting controls (bold, italic, underline)
- List formatting (bullet points, numbered lists)
- Text color and alignment options

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Developer Account (for OAuth credentials)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/letter-app.git
cd letter-app
