function checkAuthStatus() {
    // Check authentication status from cookies
    const isLoggedIn = document.cookie.split('; ').find(row => row.startsWith('auth='))?.split('=')[1];

    if (isLoggedIn === "true") {
        // Hide Login / Sign Up button and show Account Center button
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('accountButton').style.display = 'inline-block';
    } else {
        // Show Login / Sign Up button and hide Account Center button
        document.getElementById('loginButton').style.display = 'inline-block';
        document.getElementById('accountButton').style.display = 'none';
    }
}

// Run the function when the page loads
document.addEventListener("DOMContentLoaded", checkAuthStatus);
