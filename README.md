# Text Storage App

A modern web app to store, retrieve, and share text with Firebase, QR code, and email sending (via Sendinblue/Brevo) — with all secrets hidden for safe public deployment.

## Features
- Store and retrieve text using Firebase
- Generate QR code for stored text
- Copy text to clipboard
- Send stored text to any email address (no login required)
- Modern dark UI, card layout, and chat-style animation

## Secure Email Sending
- Email sending is handled by a Node.js backend proxy (`server.js`) to keep your API keys and sender email secret.
- **Never expose your API keys or secrets in frontend code!**

## Setup Instructions

### 1. Clone the Repo
```
git clone <your-repo-url>
cd text storage
```

### 2. Backend Setup
- Copy `.env.example` to `.env` and fill in your real Sendinblue API key and sender email:
```
cp .env.example .env
# Edit .env with your credentials
```
- Install backend dependencies:
```
npm install express node-fetch cors dotenv
```
- Start the backend server:
```
node server.js
```

### 3. Frontend Setup
- No secrets are in the frontend. Just open `index.html` in your browser (or serve with a static server).
- The frontend will POST to `/send-email` for email sending.

### 4. Deploying
- Deploy both frontend and backend together (e.g., on Render, Vercel, Railway, or your own VPS).
- **Never commit your `.env` file or secrets to GitHub!**

## Notes
- All features are preserved: Firebase, QR, copy, email, modern UI.
- For production, use HTTPS and secure your backend.

---

**Enjoy your secure, modern text storage app!** 