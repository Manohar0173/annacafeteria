// ==========================================
// 1. FIREBASE SECURE CLOUD CONNECTION KEYS
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAKaiPq5tS3b3HLWbwaJtuuTeS2L5-YKOg",
  authDomain: "project-anna-92aef.firebaseapp.com",
  projectId: "project-anna-92aef",
  storageBucket: "project-anna-92aef.firebasestorage.app",
  messagingSenderId: "80365084788",
  appId: "1:80365084788:web:e9609123431ca0f051b121"
};

// Wake up the database engine using our keys
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentRole = null;
window.currentUserName = "";

// ==========================================
// 3. SECURE PASSCODE ROUTING LOGIC
// ==========================================
window.checkLogin = function() {
    const userTyped = document.getElementById("passcode-input").value.trim();
    const errorEl = document.getElementById("login-error");
    errorEl.innerText = "";

    if (userTyped === "AnnaOffice123") {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("user-screen").style.display = "block";
        window.currentUserName = prompt("Please enter your name:") || "Employee";
    } 
    else if (userTyped === "admin") {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-screen").style.display = "block";
        
        // Pushes all your inventory choices up into the cloud database the moment admin logs in
        initializeMenuInFirebase();
    } 
    else {
        errorEl.innerText = "Wrong passcode! Try 'AnnaOffice123' or 'admin'.";
    }
}

// Push our items up into the cloud database structure safely
function initializeMenuInFirebase() {
    masterSnacksList.forEach(snack => {
        const isBeverage = snack.category === 'Beverages';
        db.collection("menu").doc(snack.id).set({
            name: snack.name,
            price: snack.price,
            category: snack.category,
            description: snack.description || "",
            requiresSugarOption: snack.requiresSugar || false,
            available: isBeverage ? true : false // Beverages turn on automatically, items stay hidden
        }, { merge: true }).then(() => {
            console.log("Successfully stored item in cloud database: " + snack.id);
        });
    });
}

window.logout = function() {
    window.location.reload();
}
