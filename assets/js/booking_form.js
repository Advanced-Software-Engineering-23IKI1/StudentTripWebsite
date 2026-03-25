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
    }

    // People counters
    plusPeopleBtn.addEventListener('click', () => {
        state.participants++;
        updateUI();
    });

    minusPeopleBtn.addEventListener('click', () => {
        if(state.participants > 1){
            state.participants--;
            if(state.singleRooms > state.participants) state.singleRooms = state.participants;
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
            minusBtn.disabled = false;
            if (state.participants <= state.activities[activityId].count) {
                plusBtn.disabled = true;
            }
            updateUI();
        });

        minusBtn.addEventListener('click', () => {
            if (state.activities[activityId].count > 0) {
                state.activities[activityId].count--;
                counter.textContent = state.activities[activityId].count;
                minusBtn.disabled = state.activities[activityId].count === 0;
                if (plusBtn.disabled) {
                    plusBtn.disabled = false;
                }
                updateUI();
            }
        });
    });

    bookButton.addEventListener('click', (e) => {
        e.preventDefault();
        const tripIndex = bookButton.dataset.tripIndex;
        //if we ever want to be able to have multiple trips at the same time in the future: localStorage.setItem(`studentTrip-${tripIndex}`
        //and do it like that for every item needed multiple times. Not used for now, since the form.js code would have to be changed
        //to allow for the use of tripindices too
        localStorage.setItem(`studentTrip`, JSON.stringify(true));
        localStorage.setItem(`tripName`, JSON.stringify(`Trip ${tripIndex}`));
        localStorage.setItem(`participants`, JSON.stringify(state.participants));
        localStorage.setItem(`singleRooms`, JSON.stringify(state.singleRooms));
        localStorage.setItem(`activities`, JSON.stringify(state.activities));
        localStorage.setItem(`totalPrice`, JSON.stringify(calculateTotal()));

        alert(`Booking saved!\n${state.participants} people\n${state.singleRooms} single rooms\nTotal: £${calculateTotal().toLocaleString()}`);
        window.location.href = bookButton.href;
    });

    updateUI();
});