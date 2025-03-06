import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import { getAuth, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyDxoIs6Nn5dMCpPj8JjNqbv-O3SVpiac0A",
  authDomain: "login-6cdd8.firebaseapp.com",
  projectId: "login-6cdd8",
  storageBucket: "login-6cdd8.firebasestorage.app",
  messagingSenderId: "518535069226",
  appId: "1:518535069226:web:8925106a250805bbf24d53",
  measurementId: "G-5S5XBHDN02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('signinForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential);

        // Set authentication cookie
        document.cookie = "auth=true; path=/; max-age=86400"; // 1-day expiry

        // Redirect to index page
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error during sign-in:", error.message);
        document.getElementById('signin-error-message').textContent = error.message;
    }
});
