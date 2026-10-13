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
        
        // Triggers the real-time layout card builder for the chef dashboard
        listenToMenuChef();
    } 
    else {
        errorEl.innerText = "Wrong passcode! Try 'AnnaOffice123' or 'admin'.";
    }
}

// ==========================================
// 3. REAL-TIME KITCHEN MENU TOGGLE INTERFACE
// ==========================================
function listenToMenuChef() {
    // Dynamically pulls items straight out of the cloud—no heavy local lists needed!
    db.collection("menu").onSnapshot((snapshot) => {
        const container = document.getElementById('chef-menu-toggle-container');
        if (!container) return;
        
        container.innerHTML = ""; // Clear old cards to prevent duplicate loading
        const categories = ['Beverages', 'Breakfast', 'Lunch', 'Snacks'];

        categories.forEach(cat => {
            const catHeading = document.createElement('h4');
            catHeading.style.margin = "20px 0 8px 0";
            catHeading.style.color = "#ff4757";
            catHeading.innerText = `● ${cat.toUpperCase()}`;
            container.appendChild(catHeading);

            snapshot.forEach(doc => {
                const item = doc.data();
                if (item.category === cat) {
                    const itemId = doc.id;
                    const div = document.createElement('div');
                    
                    div.style.display = "flex";
                    div.style.justifyContent = "space-between";
                    div.style.alignItems = "center";
                    div.style.padding = "10px 0";
                    div.style.borderBottom = "1px solid #eee";

                    let controlElement = "";
                    if (cat === 'Beverages') {
                        controlElement = `<span style="color: #2ed573; font-weight: bold; font-size: 0.9em;">✔️ Always On</span>`;
                    } else {
                        controlElement = `
                            <button 
                                style="width: auto; margin: 0; padding: 6px 12px; font-size: 0.85em; border: none; border-radius: 4px; color: white; font-weight: bold; cursor: pointer; background-color: ${item.available ? '#2ed573' : '#747d8c'}" 
                                onclick="changeMenuStatus('${itemId}', ${item.available})"
                            >
                                ${item.available ? '🟢 Available' : '🔴 Hidden'}
                            </button>
                        `;
                    }

                    div.innerHTML = `<div><strong>${item.name}</strong> (${item.price})</div>${controlElement}`;
                    container.appendChild(div);
                }
            });
        });
    });
}

// Switches item availability status instantly inside Firebase cloud data folders
window.changeMenuStatus = function(itemId, currentStatus) {
    db.collection("menu").doc(itemId).update({ available: !currentStatus });
};

window.logout = function() {
    window.location.reload();
}
