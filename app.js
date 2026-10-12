// SECTION 1: Firebase Configuration & Master Menu
const firebaseConfig = {
  apiKey: "AIzaSyAKaiPq5tS3b3HLWbwaJtuuTeS2L5-YKOg",
  authDomain: "://firebaseapp.com",
  projectId: "project-anna-92aef",
  storageBucket: "project-anna-92aef.firebasestorage.app",
  messagingSenderId: "80365084788",
  appId: "1:80365084788:web:e9609123431ca0f051b121"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const masterSnacksList = [
    { id: 'lemon_tea', name: '🍋 Lemon Tea', price: '₹15', category: 'Beverages', requiresSugarOption: true },
    { id: 'black_coffee', name: '☕ Black Coffee', price: '₹15', category: 'Beverages', requiresSugarOption: true },
    { id: 'black_tea', name: '☕ Black Tea', price: '₹10', category: 'Beverages', requiresSugarOption: true },
    { id: 'tea', name: '☕ Tea', price: '₹10', category: 'Beverages', requiresSugarOption: true },
    { id: 'masala_chai', name: '☕ Masala Chai', price: '₹12', category: 'Beverages', requiresSugarOption: true },
    { id: 'idli_sambar', name: '🍲 Idli Sambar', price: '₹30', category: 'Breakfast' },
    { id: 'dal_vada', name: '🧆 Dal Vada', price: '₹25', category: 'Breakfast' },
    { id: 'kanda_poha', name: '🥣 Kanda Poha', price: '₹20', category: 'Breakfast' },
    { id: 'misal_pav', name: '🍲 Misal Pav', price: '₹40', category: 'Breakfast' },
    { id: 'veg_upma', name: '🥣 Veg Upma', price: '₹20', category: 'Breakfast' },
    { id: 'dhokla', name: '🫓 Dhokla', price: '₹25', category: 'Breakfast' },
    { id: 'aloo_paratha', name: '🫓 Aloo Paratha', price: '₹35', category: 'Breakfast' },
    { id: 'sevai_upma', name: '🥣 Sevai Upma', price: '₹20', category: 'Breakfast' },
    { id: 'medu_vada_sambar', name: '🧆 Medu Vada Sambar', price: '₹35', category: 'Breakfast' },
    { id: 'dal_pakvan', name: '🫓 Dal Pakvan', price: '₹40', category: 'Breakfast' },
    { id: 'vada_usal_2pav', name: '🍲 Vada Usal 2 Pav', price: '₹45', category: 'Breakfast' },
    { id: 'kanchipuram_idli', name: '🍲 Kanchipuram Idli Sambar', price: '₹35', category: 'Breakfast' },
    { id: 'mini_masala_idli', name: '🍲 Mini Masala Idli', price: '₹30', category: 'Breakfast' },
    { id: 'chawli_masala', name: '🍛 Chawli Masala', price: '₹45', category: 'Lunch' },
    { id: 'baigan_bharta', name: '🍆 Baigan Bharta', price: '₹45', category: 'Lunch' },
    { id: 'dal_fry', name: '🍲 Dal Fry', price: '₹30', category: 'Lunch' },
    { id: 'rice', name: '🍚 Rice', price: '₹20', category: 'Lunch' },
    { id: 'chapaathi', name: '🫓 Chapaathi', price: '₹7', category: 'Lunch' },
    { id: 'salad', name: '🥗 Salad', price: '₹15', category: 'Lunch' },
    { id: 'papad', name: '🫓 Papad', price: '₹5', category: 'Lunch' },
    { id: 'sweet_sev_kheer', name: '🍨 Sweet Sev Kheer', price: '₹30', category: 'Lunch' },
    { id: 'dahi_bhendi_masala', name: '🍛 Dahi Bhendi Masala', price: '₹45', category: 'Lunch' },
    { id: 'aloo_methi_dry', name: '🥔 Aloo Methi Dry', price: '₹40', category: 'Lunch' },
    { id: 'sweet_sona_papadi', name: '🍨 Sweet Sona Papadi', price: '₹25', category: 'Lunch' },
    { id: 'veg_kolapuri', name: '🌶️ Veg Kolapuri', price: '₹50', category: 'Lunch' },
    { id: 'katol_dey', name: '🍛 Katol Dey', price: '₹45', category: 'Lunch' },
    { id: 'sweet_gulab_jamun', name: '🍨 Sweet Gulab Jamun', price: '₹30', category: 'Lunch' },
    { id: 'chole_masala', name: '🍛 Chole Masala', price: '₹50', category: 'Lunch' },
    { id: 'doodi_channa_dry', name: '🥒 Doodi Channa Dry', price: '₹40', category: 'Lunch' },
    { id: 'sweet_dahi', name: '🍨 Sweet Dahi', price: '₹20', category: 'Lunch' },
    { id: 'soyabean_chilli', name: '🧆 Soyabean Chilli', price: '₹45', category: 'Lunch' },
    { id: 'mix_veg_dry', name: '🥦 Mix Veg Dry', price: '₹45', category: 'Lunch' },
    { id: 'sweet_jalebi', name: '🍨 Sweet Jalebi', price: '₹30', category: 'Lunch' },
    { id: 'samosa', name: '🌯 Samosa', price: '₹15', category: 'Snacks' },
    { id: 'bun_maska', name: '🍞 Bun Maska', price: '₹20', category: 'Snacks' },
    { id: 'veg_toast_sandwich_maker', name: '🥪 Veg Toast Sandwich Maker', price: '₹35', category: 'Snacks' },
    { id: 'veg_toast_sandwich', name: '🥪 Veg Toast Sandwich', price: '₹30', category: 'Snacks' },
    { id: 'batata_vada_pav', name: '🍔 Batata Vada Pav', price: '₹20', category: 'Snacks' },
    { id: 'dahi_kachori', name: '🥣 Dahi Kachori', price: '₹35', category: 'Snacks' },
    { id: 'veg_cheese_toast', name: '🥪 Veg Cheese Toast Sandwich', price: '₹45', category: 'Snacks' },
    { id: 'sev_puri', name: '🫓 Sev Puri', price: '₹30', category: 'Snacks' },
    { id: 'jalebi_papadi', name: '🥨 Jalebi Papadi', price: '₹35', category: 'Snacks' }
];

let currentRole = null;
let currentUserName = "";

// SECTION 2: Navigation & Employee Logic
window.checkLogin = function() {
    const code = document.getElementById('passcode-input').value;
    const errorEl = document.getElementById('login-error');
    
    if(code === 'admin') {
        currentRole = 'admin';
        showScreen('admin-screen');
        initializeMenuInFirebase(); 
        listenToMenuChef();
        listenToOrdersKitchen();
    } else if(code === 'AnnaOffice123') {
        currentRole = 'user';
        currentUserName = prompt("Please enter your name:") || "Employee";
        showScreen('user-screen');
        listenToMenuUser();
        listenToUserOrders();
    } else {
        errorEl.innerText = "Invalid passcode. Try 'AnnaOffice123' or 'admin'";
    }
}

window.logout = function() { location.reload(); }

function showScreen(screenId) {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('user-screen').classList.add('hidden');
    document.getElementById('admin-screen').classList.add('hidden');
    document.getElementById(screenId).classList.remove('hidden');
}

function listenToMenuUser() {
    db.collection("menu").where("available", "==", true).onSnapshot((snapshot) => {
        const container = document.getElementById('menu-container');
        container.innerHTML = "<h3>Today's Available Menu</h3>";
        if(snapshot.empty) {
            container.innerHTML += "<p style='color:#747d8c;'>The kitchen hasn't opened ordering for any items yet.</p>";
        }
        snapshot.forEach(doc => {
            const item = doc.data();
            const div = document.createElement('div');
            div.className = 'card menu-item';
            const clickParam = JSON.stringify({ name: item.name, needsSugar: item.requiresSugarOption || false }).replace(/"/g, '&quot;');
            div.innerHTML = `
                <div><strong>${item.name}</strong> - ${item.price} <small style='color:#747d8c;'>(${item.category})</small></div>
                <button style="width:auto; margin:0;" onclick="handleUserOrderButtonClick('${clickParam}')">Order Now</button>
            `;
            container.appendChild(div);
        });
    });
}

window.handleUserOrderButtonClick = function(itemJsonString) {
    const itemData = JSON.parse(itemJsonString);
    if (itemData.needsSugar) {
        const totalQtyInput = prompt(`How many total portions of ${itemData.name} do you want to order?`, "1");
        const totalQty = parseInt(totalQtyInput) || 1;
        if (totalQty > 1) {
            const sugarQtyInput = prompt(`Out of these ${totalQty} items, how many should be WITH SUGAR?`, totalQty.toString());
            const withSugarQty = parseInt(sugarQtyInput) || 0;
            const withoutSugarQty = Math.max(0, totalQty - withSugarQty);
            const finalItemName = `${itemData.name} x${totalQty} (${withSugarQty} With Sugar, ${withoutSugarQty} Without Sugar)`;
            placeOrder(finalItemName);
        } else {
            const sugarChoice = confirm(`Do you want sugar in your ${itemData.name}?\n\n[OK] = With Sugar\n[Cancel] = Without Sugar`);
            placeOrder(`${itemData.name} ${sugarChoice ? '(With Sugar)' : '(Without Sugar)'}`);
        }
    } else {
        const totalQtyInput = prompt(`How many portions of ${itemData.name} would you like to order?`, "1");
        const totalQty = parseInt(totalQtyInput) || 1;
        placeOrder(totalQty > 1 ? `${itemData.name} x${totalQty}` : itemData.name);
    }
}

function placeOrder(itemName) {
    db.collection("orders").add({
        user: currentUserName, item: itemName, status: "Pending", timeEstimate: "", timestamp: Date.now()
    }).then(() => { alert(`Order for ${itemName} sent successfully!`); });
}

function listenToUserOrders() {
    db.collection("orders").onSnapshot((snapshot) => {
        const container = document.getElementById('user-orders');
        container.innerHTML = "";
        let userDocs = []; // ◄ Cleaned up formatting bug safely
        snapshot.forEach(doc => userDocs.push(doc.data()));
        userDocs.sort((a,b) => b.timestamp - a.timestamp);
        userDocs.forEach(order => {
            if(order.user === currentUserName) {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `
                    <strong>${order.item}</strong> <span class="order-status status-${order.status}">${order.status}</span>
                    <p>${order.timeEstimate ? `⏱️ Ready in: \${order.timeEstimate}` : '⏳ Awaiting confirmation...'}</p>
                `;
                container.appendChild(div);
            }
        });
    });
}

// SECTION 3: Kitchen Controls
function initializeMenuInFirebase() {
    masterSnacksList.forEach(snack => {
        const isBeverage = snack.category === 'Beverages';
        db.collection("menu").doc(snack.id).set({
            name: snack.name, price: snack.price, category: snack.category,
            requiresSugarOption: snack.requiresSugarOption || false, available: isBeverage ? true : false 
        }, { merge: true });
    });
}

function listenToMenuChef() {
    db.collection("menu").onSnapshot((snapshot) => {
        const container = document.getElementById('chef-menu-toggle-container');
        container.innerHTML = "";
        const categories = ['Beverages', 'Snacks', 'Breakfast', 'Lunch'];
        categories.forEach(cat => {
            const catHeading = document.createElement('h4');
            catHeading.style.margin = "20px 0 8px 0"; catHeading.style.color = "#ff4757";
            catHeading.innerText = `● ${cat.toUpperCase()}`;
            container.appendChild(catHeading);
            snapshot.forEach(doc => {
                const item = doc.data();
                if(item.category === cat) {
                    const itemId = doc.id;
                    const div = document.createElement('div');
                    div.className = 'menu-item';
                    const controlEl = (cat === 'Beverages') 
                        ? `<span style="color: #2ed573; font-weight: bold; font-size: 0.9em;">✔️ Always On</span>`
                        : `<button class="toggle-btn ${item.available ? 'active-menu' : 'inactive-menu'}" onclick="toggleAvailability('${itemId}', ${item.available})">${item.available ? '🟢 Available' : '🔴 Hidden'}</button>`;
                    div.innerHTML = `<div><strong>${item.name}</strong> (${item.price})</div>${controlEl}`;
                    container.appendChild(div);
                }
            });
        });
    });
}

window.toggleAvailability = function(itemId, currentStatus) {
    db.collection("menu").doc(itemId).update({ available: !currentStatus });
}

function listenToOrdersKitchen() {
    db.collection("orders").onSnapshot((snapshot) => {
        const container = document.getElementById('admin-orders');
        container.innerHTML = "";
        let kitchenDocs = []; // ◄ Cleaned up formatting bug safely here too
        snapshot.forEach(doc => kitchenDocs.push({ id: doc.id, ...doc.data() }));
        kitchenDocs.sort((a,b) => b.timestamp - a.timestamp);
        kitchenDocs.forEach(order => {
            if(order.status !== "Ready") {
                const div = document.createElement('div');
                div.className = 'card';
                div.innerHTML = `
                    <p><strong>${order.user}</strong> ordered <strong style="color:#ff4757; font-size:1.1em;">${order.item}</strong></p>
                    <button onclick="updateStatus('${order.id}', 'Confirmed')">Confirm</button>
                    <button class="btn-secondary" style="margin-top:5px;" onclick="updateStatus('${order.id}', 'Ready')">Mark Ready</button>
                `;
                container.appendChild(div);
            }
        });
    });
}

window.updateStatus = function(orderId, newStatus) {
    let timeEstimate = "";
    if(newStatus === 'Confirmed') {
        timeEstimate = prompt("Enter preparation time (e.g., 10 mins):") || "10 mins";
    }
    db.collection("orders").doc(orderId).update({ status: newStatus, timeEstimate: timeEstimate });
}

window.clearAllOrders = function() {
    if(confirm("Are you sure you want to completely clear out the order history board?")) {
        db.collection("orders").get().then((snapshot) => {
            snapshot.forEach((doc) => doc.ref.delete());
        });
    }
}
