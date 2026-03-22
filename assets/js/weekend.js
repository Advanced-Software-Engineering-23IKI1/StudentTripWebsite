const tripCostGeneral = 285;
const amountPeopleGeneral = 1;

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

function goToForm(personCount, students) {

    localStorage.setItem("participants", JSON.stringify(personCount));

    localStorage.setItem("formInfo", JSON.stringify([]));
    localStorage.setItem("formInfo", JSON.stringify(
        Array.from({ length: personCount }, () => ({}))
    ));

    localStorage.setItem("studentTrip", JSON.stringify(students));

}