// ==========================================
// 1. YOUR SECURE GOOGLE FIREBASE DATA KEYS
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyAKaiPq5tS3b3HLWbwaJtuuTeS2L5-YKOg",
  authDomain: "://firebaseapp.com",
  projectId: "project-anna-92aef",
  storageBucket: "project-anna-92aef.firebasestorage.app",
  messagingSenderId: "80365084788",
  appId: "1:80365084788:web:e9609123431ca0f051b121"
};

// Wake up the database engine using our keys
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ==========================================
// 2. MASTER INVENTORY REGISTRY (All 36 Items)
// ==========================================
const masterSnacksList = [
    // --- ALWAYS AVAILABLE BEVERAGES ---
    { id: 'lemon_tea', name: '🍋 Lemon Tea', price: '₹15', category: 'Beverages', requiresSugar: true },
    { id: 'black_coffee', name: '☕ Black Coffee', price: '₹15', category: 'Beverages', requiresSugar: true },
    { id: 'black_tea', name: '☕ Black Tea', price: '₹10', category: 'Beverages', requiresSugar: true },
    { id: 'tea', name: '☕ Tea', price: '₹10', category: 'Beverages', requiresSugar: true },
    { id: 'masala_chai', name: '☕ Masala Chai', price: '₹12', category: 'Beverages', requiresSugar: true },

    // --- BREAKFAST ITEMS ---
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

    // --- LUNCH THALI SYSTEM ---
    { id: 'lunch_thali', name: "🍛 Today's Lunch Thali", price: '₹80', category: 'Lunch', description: 'Check with chef for today special contents description' },

    // --- EVENING SNACKS ---
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
