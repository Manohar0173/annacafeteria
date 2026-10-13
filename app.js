window.checkLogin = function() { // ◄ Changed this line to bind to global scope
    // 1. Grab what the user typed in the input box
    const userTyped = document.getElementById("passcode-input").value;
    
    // 2. Check if it matches our secret password
    if (userTyped === "AnnaOffice123") {
        // Hide the login screen and show the success screen!
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("success-screen").style.display = "block";
    } else {
        // Show an error message if it's wrong
        document.getElementById("login-error").innerText = "Wrong passcode! Try again.";
    }
}

window.logout = function() { // ◄ Changed this line too
    // Reload the page to log back out safely
    window.location.reload();
}
