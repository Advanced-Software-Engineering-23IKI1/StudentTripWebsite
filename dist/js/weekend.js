const bookButtonBarc = document.getElementById('bookButtonBarc');
const bookButtonBerlin = document.getElementById('bookButtonBn');
const bookButtonParis = document.getElementById('bookButtonParis');
const bookButtonIrScWa = document.getElementById('bookButtonIrScWa');
const tripCostGeneral = 285
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

bookButtonBerlin.addEventListener('click', () => {
    proceedReadingInfo("Berlin", "dateBerlin");
});

bookButtonParis.addEventListener('click', () => {
    proceedReadingInfo("Paris", "dateParis");
});

bookButtonIrScWa.addEventListener('click', () => {
    proceedReadingInfo("IrelandSoctlandWales", "dateIrelandScotlandWales");
});