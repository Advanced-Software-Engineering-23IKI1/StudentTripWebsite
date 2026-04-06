/**
 * Initializes booking forms for each trip card on the page.
 * Sets up event listeners for participant counters, activity selectors, and the booking button.
 * Manages trip pricing, room upgrades, and optional activities.
 */
document.querySelectorAll('.trip').forEach(form => {
    // State object tracks all selections for this trip
    let state = {
        participants: 1,        // Number of trip participants
        singleRooms: 0,         // Number of single room upgrades selected
        activities: {}          // Map of activity IDs to their count and price
    };

    // DOM elements for displaying participant, room, and price information
    const peopleCountEl = form.querySelector('.peopleCount');
    const extraCountEl = form.querySelector('.extraCount');
    const totalPriceEl = form.querySelector('.totalPrice');

    // Buttons for adjusting participant and room counts
    const minusPeopleBtn = form.querySelector('.minusPeople');
    const plusPeopleBtn = form.querySelector('.plusPeople');
    const minusExtraBtn = form.querySelector('.minusExtra');
    const plusExtraBtn = form.querySelector('.plusExtra');
    const bookButton = form.querySelector('.bookButton');

    // Activity-related DOM elements
    const activityCounters = form.querySelectorAll('.activityCount');
    const activityTexts = form.querySelectorAll('.activityText');
    const minusActivityBtns = form.querySelectorAll('.minusActivity');
    const plusActivityBtns = form.querySelectorAll('.plusActivity');

    // Price configuration (with fallback for missing data attributes)
    const basePrice = parseFloat(form.dataset.basePrice) || 2199;
    const singleRoomPrice = 250;

    /**
     * Calculates the total trip price based on current selections.
     * Total = (participants × basePrice) + (single rooms × 250) + (each activity × its price)
     * @returns {number} - The total price rounded to nearest integer
     */
    function calculateTotal() {
        let total = state.participants * basePrice + state.singleRooms * singleRoomPrice;

        // Add activity costs safely
        Object.values(state.activities).forEach(activity => {
            if (activity.count && activity.price) {
                total += activity.count * activity.price;
            }
        });

        return Math.round(total); // Avoid decimal issues
    }

    /**
     * Updates all DOM elements to reflect current state.
     * Enables/disables buttons based on state constraints and updates price display.
     * @returns {void}
     */
    function updateUI() {
        peopleCountEl.textContent = state.participants;
        extraCountEl.textContent = state.singleRooms;
        totalPriceEl.textContent = `Total: £${calculateTotal().toLocaleString()}`;

        minusPeopleBtn.disabled = state.participants <= 1;
        minusExtraBtn.disabled = state.singleRooms <= 0;
        plusExtraBtn.disabled = state.singleRooms >= state.participants;

        Array.from(activityCounters).forEach((counter, index) => {
            const minusBtn = minusActivityBtns[index];
            const plusBtn = plusActivityBtns[index];
            const activityId = `activity-${index}`;

            if (state.participants <= state.activities[activityId].count) {
                plusBtn.disabled = true;
            }
            if (state.participants > state.activities[activityId].count) {
                plusBtn.disabled = false;
            }

            //disable minus button, if 0 people have currently selected the ability
            minusBtn.disabled = state.activities[activityId].count === 0;
        });
    }

    /**
     * Synchronizes counts with participant numbers.
     * Ensures single rooms and activities don't exceed participant count.
     * @returns {void}
     */
    function updateCounts() {
        //if less participants than selected rooms --> decrease selected rooms to number participants
        if(state.singleRooms > state.participants) state.singleRooms = state.participants;
        //do the same for the activities
        Array.from(activityCounters).forEach((counter, index) => {
            const activityId = `activity-${index}`;
            counter.textContent = state.activities[activityId].count;
            if(state.singleRooms > state.participants) state.singleRooms = state.participants;

            if (state.activities[activityId].count > state.participants)  {
                state.activities[activityId].count = state.participants;
                counter.textContent = state.participants
            }
        });
    }

    /**
     * Event handler for increasing participant count.
     * Increments participants and updates UI.
     */
    // People counters
    plusPeopleBtn.addEventListener('click', () => {
        state.participants++;
        updateUI();
    });

    /**
     * Event handler for decreasing participant count.
     * Decrements participants (minimum 1), updates counts and UI.
     */
    minusPeopleBtn.addEventListener('click', () => {
        if(state.participants > 1){
            state.participants--;
            updateCounts();
            updateUI();
        }
    });

    /**
     * Event handler for increasing single room count.
     * Adds single room upgrade (limited by participant count).
     */
    // Single room counters
    plusExtraBtn.addEventListener('click', () => {
        if(state.singleRooms < state.participants){
            state.singleRooms++;
            updateUI();
        }
    });

    /**
     * Event handler for decreasing single room count.
     * Removes single room upgrade (minimum 0).
     */
    minusExtraBtn.addEventListener('click', () => {
        if(state.singleRooms > 0){
            state.singleRooms--;
            updateUI();
        }
    });

    /**
     * Initializes activity counters with event listeners.
     * Each activity tracks its selected count and price.
     */
    // FIXED: Activity counters with proper parsing
    Array.from(activityCounters).forEach((counter, index) => {
        const minusBtn = minusActivityBtns[index];
        const plusBtn = plusActivityBtns[index];

        // FIXED: Safe parsing with fallback
        const price = parseFloat(minusBtn.dataset.price) || parseFloat(plusBtn.dataset.price) || 0;
        const activityId = `activity-${index}`;

        state.activities[activityId] = { count: 0, price: price };

        /**
         * Event handler for increasing activity count.
         * Increments activity selection for this trip.
         */
        plusBtn.addEventListener('click', () => {
            state.activities[activityId].count++;
            counter.textContent = state.activities[activityId].count;
            updateUI();
        });

        /**
         * Event handler for decreasing activity count.
         * Decrements activity selection (minimum 0).
         */
        minusBtn.addEventListener('click', () => {
            if (state.activities[activityId].count > 0) {
                state.activities[activityId].count--;
                counter.textContent = state.activities[activityId].count;
                updateUI();
            }
        });
    });

    /**
     * Extracts single room upgrade information from current state.
     * Returns array with room upgrade details if any rooms are selected.
     * @param {Array} arrToSave - The array to store extra information (typically single room upgrades)
     * @returns {Array} - Array with extra information object if rooms selected, otherwise empty
     * @note Currently hardcoded for single room extras only
     */
    //function saving the extra info. Is kinda hardcoded right now. Needs to be changed if there can be more than one extra
    function getExtraInfo(arrToSave) {
        if (state.singleRooms > 0) {
            let extra = {}
            extra.description = "Single Room Upgrade (£250)";
            extra.amountPeople = state.singleRooms;
            arrToSave[0] = extra;
        }
        return arrToSave;
    }

    /**
     * Extracts activity information from current state.
     * Filters out activities with count of 0 and formats into objects.
     * @returns {Array} - Array of activity objects with description and amountPeople properties
     */
    function getActivityInfo()  {
        let i = 0;
        let activities = [];

        Array.from(activityCounters).forEach((counter, index) => {
            const activityText = activityTexts[index];

            const activityId = `activity-${index}`;

            const peopleCountAct = state.activities[activityId].count;

            if (peopleCountAct !== 0)    {
                let activityDesc;

                if (activityText.textContent.startsWith('Optional: ')) {
                    activityDesc = activityText.textContent.replace('Optional: ', '');
                } else {
                    activityDesc = activityText.textContent;
                }

                let activity = {}
                activity.description = activityDesc;
                activity.amountPeople = peopleCountAct;
                activities[i] = activity;

                i += 1;
            }
        });

        return activities;
    }

    /**
     * Determines trip type from the current URL path.
     * Extracts the first part of the URL path and capitalizes it.
     * Works for visitor/voyager trips; weekend trips use different logic.
     * @returns {string} - Formatted trip type (e.g., "Voyagers Trip", "Visitors Trip")
     */
    /*
    * get Trip type from URL of the current window (only for voyagers and visitors --> weekend has different
    * logic, that also gets the date
    */
    function getTripType() {
        url = new URL(window.location.href);
        //now contains last part of URL --> page name --> voyagers or visitors
        const pathParts = url.pathname.split("/").filter(Boolean);
        let tripType = pathParts[0];
        //Capitalizes the String (eg. "voyager" to "Voyager")
        let tripTypeCapitalized = tripType.charAt(0).toUpperCase() + tripType.slice(1);
        return `${tripTypeCapitalized} Trip`;
    }

    /**
     * Collects general trip information from current state and constants.
     * @returns {Object} - Object with total cost, participant count, trip type, and date
     */
    function getGeneralInfo()   {
        let other_information = {};
        other_information.total = calculateTotal();
        other_information.amountPeople = parseInt(state.participants);
        other_information.tripType = getTripType();
        //can be filled with info from visitors and voyagers in the future
        other_information.date = "";

        return other_information;
    }

    /**
     * Compiles all trip information into a single object ready for storage.
     * Combines general info, activities, and extras (upgrades).
     * @returns {Object} - Complete trip information object
     */
    function saveInformation()  {
        let information = {};
        information.otherInformation = getGeneralInfo();

        information.activityInfo = getActivityInfo();

        let extraArr = [];
        information.extraInfo = getExtraInfo(extraArr);

        return information;
    }

    /**
     * Event handler for the book button click.
     * Saves all trip information to localStorage and redirects to the form page.
     * Prevents default link behavior and manually handles navigation.
     */
    bookButton.addEventListener('click', (e) => {
        e.preventDefault();
        //const tripIndex = bookButton.dataset.tripIndex;
        //if we ever want to be able to have multiple trips at the same time in the future: localStorage.setItem(`studentTrip-${tripIndex}`
        //and do it like that for every item needed multiple times. Not used for now, since the form.js code would have to be changed
        //to allow for the use of tripindices too
        let information = saveInformation();
        localStorage.setItem("tripInfo", JSON.stringify(information));
        localStorage.setItem(`studentTrip`, JSON.stringify(true));
        localStorage.setItem(`participants`, JSON.stringify(state.participants));
        localStorage.setItem(`totalPrice`, JSON.stringify(calculateTotal()));

        window.location.href = bookButton.href;
    });

    // Initialize UI display with default state
    updateUI();
});