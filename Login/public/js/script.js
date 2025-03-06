// Import Firebase Modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxoIs6Nn5dMCpPj8JjNqbv-O3SVpiac0A",
  authDomain: "login-6cdd8.firebaseapp.com",
  projectId: "login-6cdd8",
  storageBucket: "login-6cdd8.firebaseapp.com",
  messagingSenderId: "518535069226",
  appId: "1:518535069226:web:8925106a250805bbf24d53",
  measurementId: "G-5S5XBHDN02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// DOM Elements
const openPackButton = document.getElementById("openPackButton");
const videoContainer = document.getElementById("videoContainer");
const packVideo = document.getElementById("packVideo");
const cardContainer = document.getElementById("cardContainer");
const cardImage = document.getElementById("cardImage");
const cardTitle = document.getElementById("cardTitle");
const cardDetails = document.getElementById("cardDetails");
const coinBalanceElement = document.getElementById("coinBalance");
const binderContainer = document.getElementById("binderContainer");

const openPackTab = document.getElementById("openPackTab");
const binderTab = document.getElementById("binderTab");
const openPackSection = document.getElementById("openPackSection");
const binderSection = document.getElementById("binderSection");

// Game Configuration
const packCost = 100;
let coins = 10000;
let ownedCards = [];
const baseValue = 100;
const multiplier = 1.05;
let cardPendingAction = false;

// Check Authentication Status
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User logged in:", user.email);
        currentUser = user;
        loadUserCards();
    } else {
        console.log("No user logged in.");
        currentUser = null;
    }
});

// Load Card Data from External JSON
fetch("list.json")
    .then(response => response.json())
    .then(cards => {
        const parsedCards = cards.map(file => {
            const fileName = file.replace(/-/g, "_").replace(".png", ""); 
            const [overall, firstName, lastName, type] = fileName.split("_");
            return {
                name: `${overall} ${firstName} ${lastName} ${type}`,
                overall: parseInt(overall),
                typeVideo: "Assets/gold.mp4",
                image: `Assets/cards/${file}`,
            };
        });
        window.parsedCards = parsedCards;
    })
    .catch(error => console.error("Error loading card data:", error));


    
// 🎯 PLACE THIS NEAR THE TOP, ABOVE ANY FUNCTION CALLING IT
function displayCard(card) {
    console.log("Displaying card:", card);

    if (!card) {
        console.error("displayCard() received undefined card.");
        return;
    }

    
function quicksellCard(card, quicksellValue) {
    console.log("Quickselling card:", card, "Value:", quicksellValue);

    if (!card) {
        console.error("Quicksell failed: No card provided.");
        return;
    }

    // Increase coins by quicksell value
    coins += quicksellValue;
    updateCoinDisplay();
    alert(`You quicksold ${card.name} for ${quicksellValue} coins!`);

    // Remove the card from the local binder
    ownedCards = ownedCards.filter(c => c.name !== card.name);

    // If user is logged in, remove from Firestore
    if (currentUser) {
        removeCardFromFirestore(card);
    }

    updateBinder();
}



// 🎯 PLACE THIS NEAR THE TOP, ABOVE `displayCard()`
async function addToBinder(card) {
    console.log("Adding card to binder:", card);

    if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);

        try {
            await updateDoc(userRef, {
                cards: arrayUnion(card)
            });
            console.log("Card saved to Firestore:", card);
        } catch (error) {
            if (error.code === "not-found") {
                await setDoc(userRef, { cards: [card] });
                console.log("New user document created, card saved.");
            } else {
                console.error("Error saving card:", error);
            }
        }
    }

    ownedCards.push(card);
    updateBinder();
}

// ✅ NOW, `addToBinder()` IS DEFINED BEFORE `displayCard()`

function displayCard(card) {
    console.log("Displaying card:", card);

    if (!card) {
        console.error("displayCard() received undefined card.");
        return;
    }

    const quicksellValue = calculateQuicksellValue(card.overall);
    cardImage.src = card.image;
    cardTitle.textContent = card.name;
    cardDetails.innerHTML = `You pulled a card: ${card.name}`;

    const actionButton = document.createElement("button");
    actionButton.textContent = "Add to Binder";
    actionButton.classList.add("add-to-binder-btn");
    actionButton.addEventListener("click", () => {
        console.log("Adding card to binder:", card);
        addToBinder(card);
        cardContainer.style.display = "none";
        cardPendingAction = false;
        toggleButton(true);
    });

    const quicksellButton = document.createElement("button");
    quicksellButton.textContent = `Quick Sell (${quicksellValue} Coins)`;
    quicksellButton.classList.add("quicksell-btn");
    quicksellButton.addEventListener("click", () => {
        console.log("Quickselling card:", card);
        quicksellCard(card, quicksellValue);
        cardContainer.style.display = "none";
        cardPendingAction = false;
        toggleButton(true);
    });

    cardDetails.appendChild(actionButton);
    cardDetails.appendChild(quicksellButton);
    cardContainer.style.display = "block";
}


// ✅ NOW, `quicksellCard()` IS DEFINED BEFORE `displayCard()`

function displayCard(card) {
    console.log("Displaying card:", card);

    if (!card) {
        console.error("displayCard() received undefined card.");
        return;
    }

    const quicksellButton = document.createElement("button");
    quicksellButton.textContent = `Quick Sell (${quicksellValue} Coins)`;
    quicksellButton.classList.add("quicksell-btn");
    quicksellButton.addEventListener("click", () => {
        console.log("Quickselling card:", card);
        quicksellCard(card, quicksellValue);
        cardContainer.style.display = "none";
        cardPendingAction = false;
        toggleButton(true);
    });

    cardDetails.appendChild(actionButton);
    cardDetails.appendChild(quicksellButton);
    cardContainer.style.display = "block";
}

    
    const quicksellValue = calculateQuicksellValue(card.overall);
    cardImage.src = card.image;
    cardTitle.textContent = card.name;
    cardDetails.innerHTML = `You pulled a card: ${card.name}`;

    const actionButton = document.createElement("button");
    actionButton.textContent = "Add to Binder";
    actionButton.classList.add("add-to-binder-btn");
    actionButton.addEventListener("click", () => {
        console.log("Adding card to binder:", card);
        addToBinder(card);
        cardContainer.style.display = "none";
        cardPendingAction = false;
        toggleButton(true);
    });

    const quicksellButton = document.createElement("button");
    quicksellButton.textContent = `Quick Sell (${quicksellValue} Coins)`;
    quicksellButton.classList.add("quicksell-btn");
    quicksellButton.addEventListener("click", () => {
        console.log("Quickselling card:", card);
        quicksellCard(card, quicksellValue);
        cardContainer.style.display = "none";
        cardPendingAction = false;
        toggleButton(true);
    });

    cardDetails.appendChild(actionButton);
    cardDetails.appendChild(quicksellButton);
    cardContainer.style.display = "block";
}

// ✅ NOW, YOU CAN CALL `displayCard()` BELOW


openPackButton.addEventListener("click", () => {
    console.log("Open Pack button clicked."); // Debugging

    if (coins >= packCost && !cardPendingAction) {
        coins -= packCost;
        updateCoinDisplay();
        toggleButton(false);
        console.log("Coins deducted. Playing pack opening video...");

        playVideo("Assets/pack.mp4", () => {
            const randomCard = getRandomCard();
            console.log("Random card pulled:", randomCard);

            if (randomCard.typeVideo.includes("gold.mp4")) {
                displayCard(randomCard);
            } else {
                playVideo(randomCard.typeVideo, () => {
                    displayCard(randomCard);
                });
            }
            cardPendingAction = true;
        });
    } else {
        alert(cardPendingAction ? "You must act on your current card before opening another pack!" : "You don't have enough coins to open a pack!");
    }
});


// Utility Functions
function toggleButton(state) {
    openPackButton.disabled = !state;
    openPackButton.style.opacity = state ? "1" : "0.5";
    openPackButton.style.cursor = state ? "pointer" : "not-allowed";
}

function updateCoinDisplay() {
    coinBalanceElement.textContent = `Coins: ${coins}`;
}

function calculateQuicksellValue(overall) {
    return Math.floor(baseValue * Math.pow(multiplier, overall));
}

function getRandomCard() {
    const weights = window.parsedCards.map(card => 1 / card.overall);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    const cumulativeWeights = [];
    weights.reduce((acc, weight, index) => {
        cumulativeWeights[index] = acc + weight / totalWeight;
        return cumulativeWeights[index];
    }, 0);
    const random = Math.random();
    const selectedIndex = cumulativeWeights.findIndex(cumWeight => random < cumWeight);
    return window.parsedCards[selectedIndex];
}



// ✅ Define updateBinder() BEFORE loadUserCards()
async function updateBinder() {
    console.log("Updating binder...");

    binderContainer.innerHTML = "";

    if (currentUser) {
        console.log("Loading cards from Firestore...");
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            ownedCards = userSnap.data().cards || [];
            console.log("Loaded from Firestore:", ownedCards);
        } else {
            console.log("No previous cards found.");
        }
    }

    if (ownedCards.length === 0) {
        binderContainer.innerHTML = "<p>No cards in your binder.</p>";
        return;
    }

    ownedCards.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");

        const img = document.createElement("img");
        img.src = card.image;

        const cardName = document.createElement("div");
        cardName.textContent = card.name;

        const quicksellValue = calculateQuicksellValue(card.overall);
        const quicksellButton = document.createElement("button");
        quicksellButton.textContent = `Quicksell (${quicksellValue} Coins)`;
        quicksellButton.addEventListener("click", async () => {
            quicksellCard(card, quicksellValue);
            ownedCards.splice(index, 1);
            if (currentUser) {
                await removeCardFromFirestore(card);
            }
            updateBinder();
        });

        cardDiv.appendChild(img);
        cardDiv.appendChild(cardName);
        cardDiv.appendChild(quicksellButton);
        binderContainer.appendChild(cardDiv);
    });
}

// ✅ Now, loadUserCards() can safely call updateBinder()
async function loadUserCards() {
    console.log("Loading user cards...");

    if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            ownedCards = userSnap.data().cards || [];
            console.log("Loaded cards from Firestore:", ownedCards);
        } else {
            console.log("No previous cards found.");
        }
    }
    updateBinder();
}

async function removeCardFromFirestore(card) {
    if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        let userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            let cards = userSnap.data().cards.filter(c => c.name !== card.name);
            await updateDoc(userRef, { cards });
        }
    }
}

// Handle Tab Switching (Ensures Binder is Displayed)
binderTab.addEventListener("click", () => {
    console.log("Binder tab clicked"); // Debugging
    openPackSection.style.display = "none";
    binderSection.style.display = "block";
    openPackTab.classList.remove("active");
    binderTab.classList.add("active");
    updateBinder(); // Ensure the binder updates when switching tabs
});

function playVideo(videoSrc, callback) {
    console.log("Playing video:", videoSrc);

    videoContainer.style.display = "block";
    packVideo.src = videoSrc;
    packVideo.muted = true; // Ensures autoplay works in most browsers

    packVideo.onloadeddata = () => {
        console.log("Video loaded successfully, playing...");
        packVideo.play().catch(error => {
            console.error("Autoplay failed. User interaction required.", error);
        });
    };

    packVideo.onended = () => {
        console.log("Video finished.");
        videoContainer.style.display = "none";
        callback();
    };
}


// Final Coin Update
updateCoinDisplay();
