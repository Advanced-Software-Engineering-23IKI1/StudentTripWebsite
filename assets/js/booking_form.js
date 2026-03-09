// ============================
// CONFIG
// ============================

const INITIAL_PRICE = 2199;
const SINGLE_ROOM_PRICE = 250;

// ============================
// STATE (Single Source of Truth)
// ============================

let state = {
    participants: 1,
    singleRooms: 0
};

// ============================
// DOM ELEMENTS
// ============================

const peopleCountEl = document.getElementById("peopleCount");
const extraCountEl = document.getElementById("extraCount");
const totalPriceEl = document.getElementById("totalPrice");

const minusPeopleBtn = document.getElementById("minusPeople");
const plusPeopleBtn = document.getElementById("plusPeople");

const minusExtraBtn = document.getElementById("minusExtra");
const plusExtraBtn = document.getElementById("plusExtra");

const bookButton = document.getElementById("bookButton");

// ============================
// PRICE CALCULATION
// ============================

function calculateTotal() {
    const baseTotal = state.participants * INITIAL_PRICE;
    const extrasTotal = state.singleRooms * SINGLE_ROOM_PRICE;
    return baseTotal + extrasTotal;
}

function updateUI() {
    peopleCountEl.textContent = state.participants;
    extraCountEl.textContent = state.singleRooms;

    totalPriceEl.textContent = `Total: £${calculateTotal().toFixed(2)}`;

    // Disable buttons when limits reached
    minusPeopleBtn.disabled = state.participants <= 1;
    minusExtraBtn.disabled = state.singleRooms <= 0;
    plusExtraBtn.disabled = state.singleRooms >= state.participants;
}

// ============================
// EVENT LISTENERS
// ============================

plusPeopleBtn.addEventListener("click", () => {
    state.participants++;
    updateUI();
});

minusPeopleBtn.addEventListener("click", () => {
    if (state.participants > 1) {
        state.participants--;

        // Adjust extras if needed
        if (state.singleRooms > state.participants) {
            state.singleRooms = state.participants;
        }

        updateUI();
    }
});

plusExtraBtn.addEventListener("click", () => {
    if (state.singleRooms < state.participants) {
        state.singleRooms++;
        updateUI();
    }
});

minusExtraBtn.addEventListener("click", () => {
    if (state.singleRooms > 0) {
        state.singleRooms--;
        updateUI();
    }
});

bookButton.addEventListener("click", () => {
    localStorage.setItem("studentTrip", JSON.stringify(true));
    localStorage.setItem("tripName", JSON.stringify("Visitors Trip"));
    localStorage.setItem("participants", JSON.stringify(state.participants));
    localStorage.setItem("singleRooms", JSON.stringify(state.singleRooms));
    localStorage.setItem("totalPrice", JSON.stringify(calculateTotal()));

    alert("Booking information saved. Redirecting to form...");
    // window.location.href = "list.html";
});

// ============================
// INIT
// ============================

updateUI();