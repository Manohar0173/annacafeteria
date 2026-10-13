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
// 2. SECURE PASSCODE ROUTING LOGIC
// ==========================================
window.checkLogin = function() {
    const userTyped = document.getElementById("passcode-input").value.trim();
    const errorEl = document.getElementById("login-error");
    errorEl.innerText = "";

    if (userTyped === "AnnaOffice123") {
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("user-screen").style.display = "block";
       window.currentUserName = prompt("Please enter your name:") || "Employee";
        
        // Triggers the real-time live menu feed for your employees
        listenToMenuUser();
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

// ==========================================
// 4. REAL-TIME EMPLOYEE LIVE MENU FEED
// ==========================================
function listenToMenuUser() {
    // Looks into cloud data and ONLY pulls down items where available == true
    db.collection("menu").where("available", "==", true).onSnapshot((snapshot) => {
        const container = document.getElementById('menu-container');
        if (!container) return;
        
        container.innerHTML = "<h3>Today's Available Menu</h3>";
        
        if (snapshot.empty) {
            container.innerHTML += "<p style='color:#747d8c;'>The kitchen hasn't opened ordering for any items yet.</p>";
            return;
        }

        snapshot.forEach(doc => {
            const item = doc.data();
            const div = document.createElement('div');
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            div.style.alignItems = "center";
            div.style.padding = "12px";
            div.style.backgroundColor = "white";
            div.style.borderRadius = "8px";
            div.style.marginBottom = "8px";
            div.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";

            // Package data to send directly over to our click processing logic
            const clickParam = JSON.stringify({ name: item.name, needsSugar: item.requiresSugarOption || false }).replace(/"/g, '&quot;');

            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong> - <span style="color:#ff4757; font-weight:bold;">${item.price}</span>
                    <br><small style="color:#747d8c;">Category: ${item.category}</small>
                </div>
                <button style="width:auto; margin:0; padding:8px 16px; font-size:0.9em;" onclick="processUserSelection('${clickParam}')">Order Now</button>
            `;
            container.appendChild(div);
        });
    });
}

// Processing item quantities and custom sugar selections
window.processUserSelection = function(itemJsonString) {
    const itemData = JSON.parse(itemJsonString);
    
    if (itemData.needsSugar) {
        const qtyInput = prompt(`How many total cups of ${itemData.name} do you want to order for your group?`, "1");
        const totalQty = parseInt(qtyInput) || 1;
        
        if (totalQty > 1) {
            const sugarQtyInput = prompt(`Out of these ${totalQty} cups, how many should be WITH SUGAR?`, totalQty.toString());
            const withSugar = parseInt(sugarQtyInput) || 0;
            const withoutSugar = Math.max(0, totalQty - withSugar);
            
            alert(`Group Order Compiled:\n${itemData.name} x${totalQty}\n🟢 ${withSugar} With Sugar\n⚪ ${withoutSugar} Without Sugar`);
        } else {
            const sugarChoice = confirm(`Do you want sugar in your ${itemData.name}?\n\n[OK] = With Sugar\n[Cancel] = Without Sugar`);
            alert(`Order Selected: ${itemData.name} ${sugarChoice ? '(With Sugar)' : '(Without Sugar)'}`);
        }
    } else {
        const qtyInput = prompt(`How many portions of ${itemData.name} would you like to order?`, "1");
        const totalQty = parseInt(qtyInput) || 1;
        alert(`Order Selected: ${itemData.name} ${totalQty > 1 ? `x\${totalQty}` : ''}`);
    }
};

window.logout = function() {
    window.location.reload();
}
