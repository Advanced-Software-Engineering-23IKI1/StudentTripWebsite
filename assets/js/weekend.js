const tripCostGeneral = 285;
const amountPeopleGeneral = 1;

/**
 * Saves basic weekend-trip information to localStorage.
 * @param {string} destination Selected destination name.
 * @param {string} date Selected travel date label.
 */
function fillGeneralInfo(destination, date) {
    const information = {
        otherInformation: {
            total: tripCostGeneral,
            amountPeople: amountPeopleGeneral,
            tripType: `Weekend trip to ${destination}`,
            date: date
        }
    };

    localStorage.setItem("tripInfo", JSON.stringify(information));
}

/**
 * Reads the selected date from a dropdown, stores trip info, and prepares form flow.
 * @param {string} destination Selected destination name.
 * @param {string} selectId Id of the date-select element.
 */
function proceedReadingInfo(destination, selectId) {
    const dropdownElement = document.getElementById(selectId);

    if (!dropdownElement) return;

    const selectedOption =
        dropdownElement.options[dropdownElement.selectedIndex].textContent;

    fillGeneralInfo(destination, selectedOption);
    goToForm(1, true);
}

// Attach event listener to ALL booking buttons
document.addEventListener("DOMContentLoaded", () => {
    const bookButtons = document.querySelectorAll(".book-trip-btn");

    bookButtons.forEach(button => {
        button.addEventListener("click", () => {
            const destination = button.dataset.destination;
            const selectId = button.dataset.selectId;

            proceedReadingInfo(destination, selectId);
        });
    });
});

/**
 * Initializes form-related localStorage keys for the selected booking.
 * @param {number} personCount Number of participants.
 * @param {boolean} students Whether this is treated as a student trip.
 */
function goToForm(personCount, students) {

    localStorage.setItem("numberOfPersons", JSON.stringify(personCount));

    localStorage.setItem("formInfo", JSON.stringify([]));
    localStorage.setItem("formInfo", JSON.stringify(
        Array.from({ length: personCount }, () => ({}))
    ));

    localStorage.setItem("studentTrip", JSON.stringify(students));

}