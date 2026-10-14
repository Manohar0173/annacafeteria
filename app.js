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
let userBasket = [];

window.currentUserName = "";

// ==========================================
// 2. SECURE PASSCODE ROUTING LOGIC
// ==========================================
window.checkLogin = function() {
    const userTyped = document.getElementById("passcode-input").value.trim();
    const errorEl = document.getElementById("login-error");
    errorEl.innerText = "";

    if (userTyped === "AnnaOffice123") {
        currentRole = 'user';
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("user-screen").style.display = "block";
       window.currentUserName = prompt("Please enter your name:") || "Employee";
        
        // Triggers the real-time live menu feed for your employees
        listenToMenuUser();
        listenToUserOrders();
    } 
    else if (userTyped === "admin") {
        currentRole = 'admin';
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("admin-screen").style.display = "block";
        
        // Triggers the real-time layout card builder for the chef dashboard
        listenToMenuChef();
        listenToOrdersKitchen(); // ◄ ADD THIS SINGLE EXPLICIT LINE HERE TO ACTIVATE THE KITCHEN FEED!
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

function listenToUserOrders() {
    db.collection("orders").onSnapshot((snapshot) => {
        const container = document.getElementById('user-orders');
        if (!container) return;
        container.innerHTML = "";
        
        let docs = [];
        snapshot.forEach(doc => docs.push(doc.data()));
        
        // Sort so the latest order sits at the top of the worker's feed
        docs.sort((a, b) => b.timestamp - a.timestamp);
        
        docs.forEach(order => {
            // ONLY show the orders that match the logged-in employee's name
            if(order.user === window.currentUserName) {
                const div = document.createElement('div');
                div.style.padding = "12px"; 
                div.style.background = "white"; 
                div.style.borderRadius = "8px"; 
                div.style.marginBottom = "8px";
                div.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
                
                // Set up status badge colors
                let statusBg = "#ffeaa7"; // Yellow for Pending
                let statusColor = "#d63031";
                if(order.status === "Confirmed") { statusBg = "#81ecec"; statusColor = "#0984e3"; }
                if(order.status === "Ready") { statusBg = "#55efc4"; statusColor = "#00b894"; }
                
                div.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong style="color:#2f3542;">${order.item}</strong> 
                        <span style="padding: 4px 10px; border-radius: 20px; font-size: 0.8em; font-weight: bold; background: ${statusBg}; color: ${statusColor};">
                            ${order.status}
                        </span>
                    </div>
                    <p style="margin:6px 0 0 0; font-size:0.9em; color:#747d8c;">
                        ${order.timeEstimate ? `⏱️ Ready in: <strong>\${order.timeEstimate}</strong>` : '⏳ Awaiting kitchen confirmation...'}
                    </p>
                `;
                container.appendChild(div);
            }
        });
    });
}


function listenToMenuUser() {
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

            // Packages data payload safely into a text string string mapping system
            const payload = JSON.stringify({ id: doc.id, name: item.name, price: item.price, sugar: item.requiresSugarOption || false }).replace(/"/g, '&quot;');

            // 🟢 FIXED: Button trigger explicitly mapped to addItemToBasket instead of processUserSelection
            div.innerHTML = `
                <div>
                    <strong>${item.name}</strong> - <span style="color:#ff4757; font-weight:bold;">${item.price}</span>
                    <br><small style="color:#747d8c;">Category: ${item.category}</small>
                </div>
                <button style="width:auto; margin:0; padding:8px 16px; font-size:0.9em;" onclick="addItemToBasket('${payload}')">Add to Basket</button>
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

window.changeMenuStatus = function(itemId, currentStatus) {
    db.collection("menu").doc(itemId).update({ available: !currentStatus });
};

window.addItemToBasket = function(payloadString) {
    const data = JSON.parse(payloadString);
    const existing = userBasket.find(item => item.id === data.id);
    
    if (existing) {
        existing.qty += 1;
        if (data.sugar) existing.sugarQty += 1;
    } else {
        userBasket.push({
            id: data.id, name: data.name, price: data.price, qty: 1,
            hasSugarOption: data.sugar, sugarQty: data.sugar ? 1 : 0
        });
    }
    renderBasketUI();
};

window.modifyBasketQty = function(itemId, amount) {
    const target = userBasket.find(item => item.id === itemId);
    if (!target) return;

    target.qty += amount;
    if (target.hasSugarOption) {
        if (amount > 0) target.sugarQty += 1;
        else target.sugarQty = Math.max(0, Math.min(target.qty, target.sugarQty - 1));
    }

    if (target.qty <= 0) userBasket = userBasket.filter(item => item.id !== itemId);
    renderBasketUI();
};

window.modifySugarQty = function(itemId, amount) {
    const target = userBasket.find(item => item.id === itemId);
    if (!target || !target.hasSugarOption) return;

    target.sugarQty = Math.max(0, Math.min(target.qty, target.sugarQty + amount));
    renderBasketUI();
};

function renderBasketUI() {
    const container = document.getElementById('basket-items-container');
    const submitBtn = document.getElementById('submit-order-btn');
    if (!container || !submitBtn) return;
    container.innerHTML = "";

    if (userBasket.length === 0) {
        container.innerHTML = '<p style="color: #747d8c; font-style: italic;">Your basket is currently empty. Click "Add to Basket" above!</p>';
        submitBtn.style.display = "none";
        return;
    }

    submitBtn.style.display = "block";
    userBasket.forEach(item => {
        const div = document.createElement('div');
        div.className = 'basket-item';
        
        let sugarControlsHtml = "";
        if (item.hasSugarOption) {
            const regularQty = item.qty - item.sugarQty;
            sugarControlsHtml = `
                <div style="margin-top: 4px; background: #f8f9fa; padding: 6px; border-radius: 6px; font-size: 0.85em;">
                    <span>Sugar Cups: <strong>${item.sugarQty}</strong> | No Sugar: <strong>${regularQty}</strong></span>
                    <div style="display:flex; gap:6px; margin-top:4px;">
                        <button style="width:auto; padding:2px 8px; font-size:0.8em; margin:0; background:#2ed573;" onclick="modifySugarQty('${item.id}', 1)">+ Sugar</button>
                        <button style="width:auto; padding:2px 8px; font-size:0.8em; margin:0; background:#747d8c;" onclick="modifySugarQty('${item.id}', -1)">- Sugar</button>
                    </div>
                </div>
            `;
        }

        div.innerHTML = `
            <div style="flex: 1;"><strong>${item.name}</strong> (${item.price})${sugarControlsHtml}</div>
            <div class="qty-controls">
                <button class="qty-btn dec" onclick="modifyBasketQty('${item.id}', -1)">-</button>
                <span style="font-weight:bold; min-width:20px; text-align:center;">${item.qty}</span>
                <button class="qty-btn" onclick="modifyBasketQty('${item.id}', 1)">+</button>
            </div>
        `;
        container.appendChild(div);
    });
}

window.submitFinalBasket = function() {
    if (userBasket.length === 0) return;

    let submissionPromises = userBasket.map(item => {
        let finalItemString = `${item.name} x${item.qty}`;
        if (item.hasSugarOption) {
            const regularQty = item.qty - item.sugarQty;
            finalItemString = `${item.name} x${item.qty} (${item.sugarQty} With Sugar, ${regularQty} Without Sugar)`;
        }
        return db.collection("orders").add({
            user: window.currentUserName, item: finalItemString, status: "Pending", timeEstimate: "", timestamp: Date.now()
        });
    });

    Promise.all(submissionPromises).then(() => {
        alert("Entire basket configuration sent to kitchen dashboard successfully!");
        userBasket = [];
        renderBasketUI();
    });
};


// ==========================================
// 5. LIVE KITCHEN ORDER TICKETS ENGINE
// ==========================================
function listenToOrdersKitchen() {
    // Listens to the cloud orders folder and updates the chef screen instantly when a worker checks out
    db.collection("orders").onSnapshot((snapshot) => {
        const container = document.getElementById('admin-orders');
        if (!container) return;
        container.innerHTML = ""; // Clear old cards to prevent duplicate loop loading
        
        let activeOrders = []; // Clean initialized empty array syntax
        snapshot.forEach(doc => activeOrders.push({ id: doc.id, ...doc.data() }));
        
        // Sort orders so the newest incoming tickets flash at the top of the chef screen
        activeOrders.sort((a, b) => b.timestamp - a.timestamp);
        
        activeOrders.forEach(order => {
            // Only show orders that are actively being worked on (Hide them once they are fully "Ready")
            if (order.status !== "Ready") {
                const div = document.createElement('div');
                div.style.padding = "12px"; 
                div.style.background = "white"; 
                div.style.borderRadius = "8px"; 
                div.style.marginBottom = "8px";
                div.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
                
                div.innerHTML = `
                    <p style="margin:0 0 8px 0;"><strong>${order.user}</strong> ordered <strong style="color:#ff4757;">${order.item}</strong></p>
                    <div style="display:flex; gap:8px;">
                        <button style="width:auto; padding:6px 12px; margin:0; background:#0984e3;" onclick="modifyTicketStatus('${order.id}', 'Confirmed')">Confirm</button>
                        <button style="width:auto; padding:6px 12px; margin:0; background:#2ed573;" onclick="modifyTicketStatus('${order.id}', 'Ready')">Mark Ready</button>
                    </div>
                `;
                container.appendChild(div);
            }
        });
    });
}

// Global scope definition connecting the chef dashboard button clicks directly to Firebase
window.modifyTicketStatus = function(ticketId, targetStatus) {
    let eta = "";
    if (targetStatus === 'Confirmed') {
        eta = prompt("Enter preparation time estimate (e.g., 10 mins):") || "10 mins";
    }
    db.collection("orders").doc(ticketId).update({ status: targetStatus, timeEstimate: eta });
};

window.logout = function() {
    window.location.reload();
}
