<div align="center">

<br />
<br />

<!-- MAIN TITLE & LOGO -->

<span style="font-size: 80px;">👻</span>

<h1>Stranger App</h1>

<p style="font-size: 1.2em; color: #8b949e;">
<strong>Connect Deeply. Remain a Mystery.</strong>
</p>

<p>
A real-time anonymous chat application built for instant global connections without data tracking.
</p>

<!-- BADGES -->

<p>
  <a href="https://reactjs.org/">
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  </a>
  <a href="https://firebase.google.com/">
    <img src="https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=firebase&logoColor=white" alt="Firebase" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  </a>
  <a href="https://vitejs.dev/">
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  </a>
</p>


<br />
<br />
<h2 align="center">📸 App Interface</h2>

<div align="center">

  <!-- Desktop Interfaces -->
  <img src="Screenshot 2025-12-04 153120.png" width="800" alt="Desktop Chat Interface" />
  
  <br/><br/>
  
  <img src="Screenshot 2025-12-04 152727.png" width="800" alt="Desktop Chat Interface" />

  <br/><br/>

  <!-- Mobile Interfaces -->
  <p align="center">
    <img src="screenshot-1764844135104.png" height="500" alt="Mobile Home Screen" style="border-radius: 10px; margin-right: 20px;" />
    &nbsp;&nbsp;&nbsp;&nbsp;
    <img src="screenshot-1764844201019.png" height="500" alt="Mobile Connecting Screen" style="border-radius: 10px;" />
  </p>

</div>



</div>

<hr />

📋 Table of Contents

✨ Features

🛠️ Tech Stack

🚀 Quick Start

📱 Mobile Testing

🔒 Security

✨ Features

Feature

Description

🎭 Total Anonymity

Uses Firebase Anonymous Auth. No names, emails, or logs are ever stored.

⚡ Real-Time Matching

Custom "Waiting Pool" algorithm connects users instantly (FIFO).

🔒 Isolated Rooms

Chat history is stored in unique, secure sub-collections for maximum privacy.

🆔 Auto-Identities

Users get temporary session personas like Neon Fox or Misty Owl.

📱 Fully Responsive

Optimized for all devices using Tailwind CSS mobile-first classes.

🛠️ Tech Stack

Frontend: React (Vite)

Styling: Tailwind CSS

Icons: Lucide React

Backend: Firebase (Firestore & Auth)

🚀 Quick Start

Follow these steps to run the project locally.

1. Clone & Install

# Clone the repository
git clone [https://github.com/naqvi10k/stranger-app.git](https://github.com/naqvi110k/stranger-app.git)

# Go into the app folder
cd stranger-app

# Install dependencies
npm install



2. Configure Firebase (Crucial)

This app requires a backend to work. Create a free project at console.firebase.google.com.

Enable Authentication: Go to Authentication > Sign-in method > Enable Anonymous.

Enable Database: Go to Firestore Database > Create Database > Start in Test Mode.

Get Config: Go to Project Settings > General > Your Apps > SDK Setup.

Copy your config keys into src/App.jsx:

const firebaseConfig = {
  apiKey: "YOUR_REAL_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};



3. Run the App

npm run dev



📱 Mobile Testing

To test the chat between your computer and phone on the same Wi-Fi:

Run the host command:

npm run dev -- --host




