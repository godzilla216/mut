// Import required Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';

// Firebase configuration
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

// Get the form and error message elements
const signupForm = document.getElementById('signupForm');
const errorMessage = document.getElementById('error-message');

// Handle form submission
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get user input
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    // Log the email and password to ensure they're being passed correctly
    console.log("Attempting to sign up with email:", email);

    // Sign up the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential);

    // Redirect to the success page
    window.location.href = "success.html"; // Redirect to success page

  } catch (error) {
    // Log the error message
    console.error("Error during sign-up:", error.message);

    // Show error message
    errorMessage.textContent = error.message;
  }
});
