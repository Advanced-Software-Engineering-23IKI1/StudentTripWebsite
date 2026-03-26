document.querySelectorAll('.trip').forEach(form => {
    let state = {
        participants: 1,
        singleRooms: 0,
        activities: {}
    };

    const peopleCountEl = form.querySelector('.peopleCount');
    const extraCountEl = form.querySelector('.extraCount');
    const totalPriceEl = form.querySelector('.totalPrice');

    const minusPeopleBtn = form.querySelector('.minusPeople');
    const plusPeopleBtn = form.querySelector('.plusPeople');
    const minusExtraBtn = form.querySelector('.minusExtra');
    const plusExtraBtn = form.querySelector('.plusExtra');
    const bookButton = form.querySelector('.bookButton');

    const activityCounters = form.querySelectorAll('.activityCount');
    const activityTexts = form.querySelectorAll('.activityText');
    const minusActivityBtns = form.querySelectorAll('.minusActivity');
    const plusActivityBtns = form.querySelectorAll('.plusActivity');

    // ✅ FIXED: Use parseFloat with fallback for base price
    const basePrice = parseFloat(form.dataset.basePrice) || 2199;
    const singleRoomPrice = 250;

    function calculateTotal() {
        let total = state.participants * basePrice + state.singleRooms * singleRoomPrice;

        // Add activity costs safely
        Object.values(state.activities).forEach(activity => {
            if (activity.count && activity.price) {
                total += activity.count * activity.price;
            }
        });

        return Math.round(total); // ✅ Avoid decimal issues
    }

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

    // People counters
    plusPeopleBtn.addEventListener('click', () => {
        state.participants++;
        updateUI();
    });

    minusPeopleBtn.addEventListener('click', () => {
        if(state.participants > 1){
            state.participants--;
            updateCounts();
            updateUI();
        }
    });

    // Single room counters
    plusExtraBtn.addEventListener('click', () => {
        if(state.singleRooms < state.participants){
            state.singleRooms++;
            updateUI();
        }
    });

    minusExtraBtn.addEventListener('click', () => {
        if(state.singleRooms > 0){
            state.singleRooms--;
            updateUI();
        }
    });

    // ✅ FIXED: Activity counters with proper parsing
    Array.from(activityCounters).forEach((counter, index) => {
        const minusBtn = minusActivityBtns[index];
        const plusBtn = plusActivityBtns[index];

        // ✅ FIXED: Safe parsing with fallback
        const price = parseFloat(minusBtn.dataset.price) || parseFloat(plusBtn.dataset.price) || 0;
        const activityId = `activity-${index}`;

        state.activities[activityId] = { count: 0, price: price };

        plusBtn.addEventListener('click', () => {
            state.activities[activityId].count++;
            counter.textContent = state.activities[activityId].count;
            updateUI();
        });

        minusBtn.addEventListener('click', () => {
            if (state.activities[activityId].count > 0) {
                state.activities[activityId].count--;
                counter.textContent = state.activities[activityId].count;
                updateUI();
            }
        });
    });

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

    function getActivityInfo()  {
        let i = 0;
        let activities = [];

        Array.from(activityCounters).forEach((counter, index) => {
            const minusBtn = minusActivityBtns[index];
            const plusBtn = plusActivityBtns[index];
            const activityText = activityTexts[index];

            const price = parseFloat(minusBtn.dataset.price) || parseFloat(plusBtn.dataset.price) || 0;
            const activityId = `activity-${index}`;

            const peopleCountAct = state.activities[activityId].count;

            if (peopleCountAct !== 0)    {
                let activityDesc = "";

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

    function getGeneralInfo()   {
        let other_information = {};
        other_information.total = calculateTotal();
        other_information.amountPeople = parseInt(state.participants);
        other_information.tripType = JSON.parse(localStorage.getItem("tripName"));
        //can be filled with info from visitors and voyagers in the future
        other_information.date = "";

        return other_information;
    }

    function saveInformation()  {
        let information = {};
        information.otherInformation = getGeneralInfo();

        information.activityInfo = getActivityInfo();

        let extraArr = [];
        information.extraInfo = getExtraInfo(extraArr);

        return information;
    }

    bookButton.addEventListener('click', (e) => {
        e.preventDefault();
        const tripIndex = bookButton.dataset.tripIndex;
        //if we ever want to be able to have multiple trips at the same time in the future: localStorage.setItem(`studentTrip-${tripIndex}`
        //and do it like that for every item needed multiple times. Not used for now, since the form.js code would have to be changed
        //to allow for the use of tripindices too
        let information = saveInformation();
        localStorage.setItem("tripInfo", JSON.stringify(information));
        localStorage.setItem(`studentTrip`, JSON.stringify(true));
        localStorage.setItem(`tripName`, JSON.stringify(`Trip ${tripIndex}`));
        localStorage.setItem(`participants`, JSON.stringify(state.participants));
        localStorage.setItem(`totalPrice`, JSON.stringify(calculateTotal()));

        window.location.href = bookButton.href;
    });

    updateUI();
});