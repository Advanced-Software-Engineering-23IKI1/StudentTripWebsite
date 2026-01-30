const bookButtonBarc = document.getElementById('bookButtonBarc');
const bookButtonMilan = document.getElementById('bookButtonMilan');
const bookButtonBerlin = document.getElementById('bookButtonBn');
const bookButtonParis = document.getElementById('bookButtonParis');
const tripCostGeneral = 400
const amountPeopleGeneral = 1

function fillGeneralInfo(destination, date)  {
    let information = {};
    let other_information = {}

    other_information.total = tripCostGeneral;
    other_information.amountPeople = amountPeopleGeneral;
    other_information.tripType = "Weekend trip to " + destination;
    other_information.date = date;

    information.otherInformation = other_information;

    localStorage.setItem("tripInfo", JSON.stringify(information));
}

function proceedReadingInfo(tripName, elementName)  {
    const dropdownElement = document.getElementById(elementName);
    const selectedOption = dropdownElement.options[dropdownElement.selectedIndex].textContent;

    fillGeneralInfo(tripName, selectedOption);
    goToForm(1, true);
}

bookButtonBarc.addEventListener('click', () => {
    proceedReadingInfo("Barcelona", "dateBarcelona");
});

bookButtonMilan.addEventListener('click', () => {
    proceedReadingInfo("Milan", "dateMilan");
});

bookButtonBerlin.addEventListener('click', () => {
    proceedReadingInfo("Berlin", "dateBerlin");
});

bookButtonParis.addEventListener('click', () => {
    proceedReadingInfo("Paris", "dateParis");
});