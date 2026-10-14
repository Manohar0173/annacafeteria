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
                    <div style="flex-grow:1;">
                        <strong style="color:#2f3542; display:block;">${order.item}</strong>
                        <small style="color:#747d8c; font-weight:500;">Sent at: ${formatOrderClockTime(order.timestamp)}</small>
                    </div> 
                        <span style="padding: 4px 10px; border-radius: 20px; font-size: 0.8em; font-weight: bold; background: ${statusBg}; color: ${statusColor};">
                            ${order.status}
                        </span>
                    </div>
                     <p style="margin:6px 0 0 0; font-size:0.9em; color:#747d8c;">
                        ${order.status === "Pending" ? '⏳ Awaiting kitchen confirmation...' : ''}
                        ${order.status === "Confirmed" && order.timeEstimate ? `⏱️ Ready in: <strong>${order.timeEstimate}</strong>` : ''}
                        ${order.status === "Ready" ? '✅ Your food is ready! Please collect it.' : ''}
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
        const thaliIngredientsText = document.getElementById('thali-ingredients-list');
        if (!container) return;
        
        container.innerHTML = "<h3>Today's Available Snacks & Beverages</h3>";
        
        let lunchIngredientsArray = [];

        snapshot.forEach(doc => {
            const item = doc.data();
            
            // If the item belongs to lunch, collect its name for the Thali banner summary text
            if (item.category === 'Lunch') {
                lunchIngredientsArray.push(item.name);
            } else {
                // Render standard snacks and beverage counters normally
                const div = document.createElement('div');
                div.style.display = "flex"; div.style.justifyContent = "space-between";
                div.style.alignItems = "center"; div.style.padding = "12px";
                div.style.backgroundColor = "white"; div.style.borderRadius = "8px";
                div.style.marginBottom = "8px"; div.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";

                const payload = JSON.stringify({ id: doc.id, name: item.name, price: item.price, sugar: item.requiresSugarOption || false }).replace(/"/g, '&quot;');

                div.innerHTML = `
                    <div>
                        <strong>${item.name}</strong> - <span style="color:#ff4757; font-weight:bold;">${item.price}</span>
                        <br><small style="color:#747d8c;">Category: ${item.category}</small>
                    </div>
                    <button style="width:auto; margin:0; padding:8px 16px; font-size:0.9em;" onclick="addItemToBasket('${payload}')">Add to Basket</button>
                `;
                container.appendChild(div);
            }
        });

        // Combine the array items cleanly to write out the dynamic description text string
        if (thaliIngredientsText) {
            thaliIngredientsText.innerText = lunchIngredientsArray.length > 0 
                ? "Today's Thali Contains: " + lunchIngredientsArray.join(", ") 
                : "The kitchen hasn't updated today's Thali items yet.";
        }
        
        // This links up the upcoming reservation toggle state checks
        if (typeof checkThaliReservationState === 'function') {
            checkThaliReservationState();
        }
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
    db.collection("orders").onSnapshot((snapshot) => {
        const container = document.getElementById('admin-orders');
        const thaliCountEl = document.getElementById('chef-thali-count');
        const thaliBookingsEl = document.getElementById('chef-thali-individual-bookings');
        if (!container) return;
        container.innerHTML = "";
        
        let activeOrders = [];
        let totalThalisCount = 0;
        let thaliBookingsHtml = "";

        snapshot.forEach(doc => {
            const data = doc.data();
            // 🍱 Filters Thali records to display them inside their dedicated panel card tracker container
            if (data.item === "🍱 Special Lunch Thali Reservation") {
                totalThalisCount++;
                thaliBookingsHtml += `
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px dashed #eee; font-size:0.9em;">
                        <strong>${data.user}</strong>
                        <span style="color:#747d8c; font-size:0.85em;">⏰ ${typeof formatOrderClockTime === 'function' ? formatOrderClockTime(data.timestamp) : ''}</span>
                    </div>
                `;
            } else {
                activeOrders.push({ id: doc.id, ...data });
            }
        });

        // 📊 Dynamically update the Thali Panel Tracker counters
        if (thaliCountEl) thaliCountEl.innerText = totalThalisCount;
        if (thaliBookingsEl) {
            thaliBookingsEl.innerHTML = thaliBookingsHtml || '<p style="color:#747d8c; margin:0; font-size:0.9em; font-style:italic;">No Thali reservations placed yet.</p>';
        }

        // Sort and render short-order snack cards normally
        activeOrders.sort((a, b) => b.timestamp - a.timestamp);
        activeOrders.forEach(order => {
            if (order.status !== "Ready") {
                const div = document.createElement('div');
                div.style.padding = "12px"; div.style.borderRadius = "8px"; div.style.marginBottom = "8px"; div.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
                
                let cardBg = "white"; let statusLabelHtml = ""; let showConfirmButton = true;
                
                if (order.status === "Confirmed") {
                    cardBg = "#e3f2fd"; showConfirmButton = false;
                    statusLabelHtml = ` <span style="float:right; padding:2px 8px; border-radius:10px; font-size:0.8em; font-weight:bold; background:#81ecec; color:#0984e3;">⏱️ ETA: ${order.timeEstimate || '10 mins'}</span>`;
                }
                
                div.style.background = cardBg;
                let confirmBtnHtml = showConfirmButton ? `<button style="width:auto; padding:6px 12px; margin:0; background:#0984e3; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;" onclick="modifyTicketStatus('${order.id}', 'Confirmed')">Confirm</button>` : '';
                
                div.innerHTML = `
                    <p style="margin:0 0 8px 0; color:#2f3542; font-size: 0.95em;">
                        <span style="color:#747d8c; font-size:0.85em; font-weight:bold; display:block; margin-bottom:4px;">📥 Incoming: ${typeof formatOrderClockTime === 'function' ? formatOrderClockTime(order.timestamp) : ''}</span>
                        <strong>${order.user}</strong> ordered <strong style="color:#ff4757;">${order.item}</strong>
                        ${statusLabelHtml}
                    </p>
                    <div style="display:flex; gap:8px;">
                        ${confirmBtnHtml}
                        <button style="width:auto; padding:6px 12px; margin:0; background:#2ed573; color:white; border:none; border-radius:4px; font-weight:bold; cursor:pointer;" onclick="modifyTicketStatus('${order.id}', 'Ready')">Mark Ready</button>
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
        let userInput = prompt("Enter preparation time (number only, e.g., 10):") || "10";
        let numberOnly = userInput.replace(/[^0-9]/g, '');
        eta = numberOnly ? numberOnly + " mins" : "10 mins";
    }
    db.collection("orders").doc(ticketId).update({ status: targetStatus, timeEstimate: eta });
};

window.logout = function() {
    window.location.reload();
}
  
function formatOrderClockTime(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return hours + ":" + minutes + " " + ampm;
}

window.toggleChefMenuPanel = function() {
    const wrapper = document.getElementById('chef-menu-collapsible-wrapper');
    const arrow = document.getElementById('menu-panel-arrow');
    if (!wrapper || !arrow) return;

    if (wrapper.style.display === 'none') {
        wrapper.style.display = 'block';
        arrow.innerText = '▲ Collapse Controls';
    } else {
        wrapper.style.display = 'none';
        arrow.innerText = '▼ Expand Controls';
    }
};

// Verification engine looking into the database to see if this specific user reserved a Thali today
function checkThaliReservationState() {
    db.collection("orders")
      .where("user", "==", window.currentUserName)
      .where("item", "==", "🍱 Special Lunch Thali Reservation")
      .onSnapshot((snapshot) => {
          const actionArea = document.getElementById('thali-action-area');
          if (!actionArea) return;

          if (!snapshot.empty) {
              // 🟢 FIXED SYNTAX: Extracts the correct unique document ID mapping token row
              const activeDoc = snapshot.docs[0];
              const activeDocId = activeDoc.id;
              
              actionArea.innerHTML = `
                  <button onclick="cancelThaliReservation('${activeDocId}')" style="background:#2f3542; color:#ff4757; border:2px solid #ff4757; width:auto; margin:0; padding:8px 14px; font-weight:bold; cursor:pointer; border-radius:6px;">
                      ❌ Cancel Reservation
                  </button>
              `;
          } else {
              actionArea.innerHTML = `
                  <button onclick="submitThaliReservation()" style="background:white; color:#ff4757; width:auto; margin:0; padding:8px 16px; font-weight:bold; border:none; border-radius:6px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
                      Reserve Thali
                  </button>
              `;
          }
      });
}

// Submits the reservation token cleanly to the kitchen dashboard queue lines
window.submitThaliReservation = function() {
    db.collection("orders").add({
        user: window.currentUserName,
        item: "🍱 Special Lunch Thali Reservation",
        status: "Pending",
        timeEstimate: "",
        timestamp: Date.now()
    }).then(() => {
        alert("Your Lunch Thali has been successfully reserved!");
    });
};

// Reversible option wiping the cancellation ticket document directly from the cloud logs
window.cancelThaliReservation = function(documentId) {
    if (confirm("Do you want to cancel your Thali reservation?")) {
        db.collection("orders").doc(documentId).delete().then(() => {
            alert("Your reservation has been cancelled successfully.");
        });
    }
};
