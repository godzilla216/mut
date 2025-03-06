import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxoIs6Nn5dMCpPj8JjNqbv-O3SVpiac0A",
  authDomain: "login-6cdd8.firebaseapp.com",
  projectId: "login-6cdd8",
  storageBucket: "login-6cdd8.firebaseapp.com",
  messagingSenderId: "518535069226",
  appId: "1:518535069226:web:8925106a250805bbf24d53",
  measurementId: "G-5S5XBHDN02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const signOutButton = document.getElementById('signOutBtn');

    if (signOutButton) {
        signOutButton.addEventListener('click', async () => {
            try {
                await signOut(auth);
                console.log("User signed out successfully");

                // Clear authentication cookie
                document.cookie = "auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC";

                // Redirect to index.html
                window.location.href = "index.html";
            } catch (error) {
                console.error("Error signing out:", error.message);
            }
        });
    } else {
        console.error("Sign-out button not found!");
    }
});
