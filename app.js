window.checkLogin = function() {
    // 1. Grab what the user typed in the passcode box
    const userTyped = document.getElementById("passcode-input").value.trim();
    const errorEl = document.getElementById("login-error");
    
    // Clear out any previous error messages
    errorEl.innerText = "";

    // 2. CHECK RULE 1: Did they type the Employee passcode?
    if (userTyped === "AnnaOffice123") {
        // Hide Login and open the 👋 Employee Menu Room
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("user-screen").style.display = "block";
        
        // Ask for their name to track their orders
        window.currentUserName = prompt("Please enter your name:") || "Employee";
    } 
    // 3. CHECK RULE 2: Did they type the Kitchen passcode?
    else if (userTyped === "admin") {
        // Hide Login and open the 👨‍🍳 Kitchen Dashboard
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-screen").style.display = "block";
    } 
    // 4. CHECK RULE 3: Is it completely wrong?
    else {
        errorEl.innerText = "Wrong passcode! Try 'AnnaOffice123' or 'admin'.";
    }
}

window.logout = function() {
    // Reload the webpage to clear out current sessions and return to Login screen cleanly
    window.location.reload();
}
