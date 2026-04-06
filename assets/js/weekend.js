/** @const {number} - Base cost for weekend trips in pounds */
const tripCostGeneral = 285;

/** @const {number} - Default number of participants for a weekend trip */
const amountPeopleGeneral = 1;

/**
 * Stores general trip information for a weekend trip to localStorage.
 * Creates a tripInfo object with destination, date, cost, and participant information.
 * @param {string} destination - The destination city for the weekend trip (e.g., 'Athens', 'Barcelona')
 * @param {string} date - The selected date for the trip in string format
 * @returns {void}
 * @example
 * fillGeneralInfo('Paris', '2026-06-15');
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
 * Retrieves the selected date from a dropdown, stores trip information, and redirects to the form page.
 * @param {string} destination - The destination city for the weekend trip
 * @param {string} selectId - The HTML ID of the date selection dropdown element
 * @returns {void}
 * @example
 * proceedReadingInfo('Barcelona', 'dateSelect');
 */
function proceedReadingInfo(destination, selectId) {
    const dropdownElement = document.getElementById(selectId);

    if (!dropdownElement) return;

    const selectedOption =
        dropdownElement.options[dropdownElement.selectedIndex].textContent;

    fillGeneralInfo(destination, selectedOption);
    goToForm(1, true);
}

/**
 * Initializes booking buttons when the DOM is loaded.
 * Attaches click event listeners to all booking buttons that trigger the trip selection process.
 * @returns {void}
 */
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
 * Stores participant count and student trip status to localStorage.
 * Prepares the application state for the form page navigation.
 * @param {number} personCount - The number of participants for the trip
 * @param {boolean} students - Whether this is a student trip (true) or not (false)
 * @returns {void}
 * @example
 * goToForm(3, true);
 */
function goToForm(personCount, students) {

    localStorage.setItem("participants", JSON.stringify(personCount));

    localStorage.setItem("studentTrip", JSON.stringify(students));

}