# Group Study Hub

## Purpose

Group Study Hub is a web application designed to facilitate online group study and collaboration among friends. Users can create assignments, complete them, and grade each other's work in a secure and interactive environment. The project leverages the MERN stack and Firebase authentication to provide a seamless and user-friendly study platform.

## Live URL

[https://project9-8be11.web.app/](https://project9-8be11.web.app/)

## Key Features

- User Authentication with Email/Password and Google Sign-In (Firebase)
- JWT-based Authorization for protected routes and secure API access
- Assignment Creation, Viewing, Updating, and Deletion
- Submit assignments with Google Docs link and notes
- View and grade pending assignments submitted by other users
- Role-based access: Users can only delete their own assignments and cannot grade their own submissions
- Responsive design for mobile, tablet, and desktop
- Theme toggling between light and dark modes
- Real-time feedback using Toast/SweetAlert notifications
- Search and filter assignments by difficulty level (easy, medium, hard)
- Animation effects on the homepage using Framer Motion
- Secure environment variable usage for Firebase and MongoDB credentials

## NPM Packages Used

### Frontend

- `react`
- `react-router-dom`
- `firebase`
- `react-toastify`
- `react-datepicker`
- `framer-motion`
- `axios`
- `sweetalert2`
- `tailwindcss`

### Backend

- `express`
- `cors`
- `jsonwebtoken`
- `cookie-parser`
- `mongodb`
- `dotenv`
