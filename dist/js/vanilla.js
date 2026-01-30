window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    }

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

function $ID(id) {
    return document.getElementById(id)
}

//renders navigation bar and the footer
function renderPartials() {
    renderPartial("navbar")
    renderPartial("footer")
}

//loads a partial by a given name
async function loadPartial(name) {
    const code = await fetch("partials/" + name + ".html").then(response => response.text())
    Handlebars.registerPartial(name, code)
}

//renders a partial by a given name
async function renderPartial(name) {
    await loadPartial(name)
    render($ID(name + "-template"), $ID(name), {})
}

function round(val, amount) {
    return Math.round(val * Math.pow(10, amount)) / Math.pow(10, amount);
}

//renders handlebars template objects
function render(template_obj, dest_obj, data) {
    const template = Handlebars.compile(template_obj.innerHTML);
    dest_obj.innerHTML = template(data)
}

//Shared Logic for the senior and student sites

function updatePriceFields() {
    total = subTotal + activityPrice;

    priceDiv.textContent = `Subtotal (without activities): \u00A3${subTotal.toFixed(2)}`;
    totalPriceDiv.textContent = `Total (with activities): \u00A3${(total).toFixed(2)}`;
}

function changeNumberParticipants(peopleCountField, btn, oppositeBtn, isMinusBtn, price=0, numberDisableBtn = 0)    {
    let countBtn = peopleCountField.textContent;
    if (isMinusBtn) {
        countBtn --;
        peopleCountField.textContent = countBtn;
        btn.disabled = countBtn === numberDisableBtn;
    } else {
        countBtn ++;
        peopleCountField.textContent = countBtn;
        btn.disabled = countBtn === count;
    }
    oppositeBtn.disabled = false;

    if (price !== 0)    {
        calc_Activity_Price(price)
    }
}

function enableButtons(buttons) {

    buttons.forEach(button => {button.disabled = false;})
}

function calc_Activity_Price(price) {
    activityPrice += price;
    updatePriceFields()
}

function addExtrasCost(price) {
    totalExtrasCost += price;
    calculatePrice();
}

function checkEnable(plusButton)    {
    plusButton.disabled = false;
}

function checkDisable(plusButtonFirst, plusButtonSecond, peopleCountFirst, peopleCountSecond)    {
    if (parseInt(peopleCountFirst.textContent) + parseInt(peopleCountSecond.textContent) === count) {
        plusButtonFirst.disabled = true;
        plusButtonSecond.disabled = true;
    }
}

function saveInformation(date)  {
    //p tag with optional activities
    const optionalActivities = document.querySelectorAll('.optional-activity');

    let i = 0;
    let activities = [];

    optionalActivities.forEach((element, index) => {
        let peopleCountAct = parseInt(peopleCountArr[index].textContent)

        if (peopleCountAct !== 0)    {
            let activityDesc = "";

            if (element.textContent.startsWith('Optional: ')) {
                activityDesc = element.textContent.replace('Optional: ', '');
            } else {
                activityDesc = element.textContent;
            }

            let activity = {}
            activity.description = activityDesc;
            activity.amountPeople = peopleCountAct;
            activities[i] = activity;

            i += 1;
        }
    });

    const extras = document.querySelectorAll('.extras');

    i = 0;
    let extraArr = [];

    extras.forEach((element, index) => {
        let extrasAct = parseInt(extrasCountArr[index].textContent)

        if (extrasAct !== 0)    {
            let extraDesc = "";

            if (element.textContent.startsWith('Optional: ')) {
                extraDesc = element.textContent.replace('Optional: ', '');
            } else {
                extraDesc = element.textContent;
            }

            let extra = {}
            extra.description = extraDesc;
            extra.amountPeople = extrasAct;
            extraArr[i] = extra;
            i += 1;
        }
    });

    let other_information = {}
    other_information.subTotal = subTotal;
    other_information.total = total;
    other_information.amountPeople = parseInt(peopleCount.textContent);
    if(JSON.parse(localStorage.getItem("studentTrip"))) {
        other_information.tripType = "Student Trip";
    } else {
        other_information.tripType = "Senior Trip";
    }
    other_information.date = date;

    let information = {};
    information.otherInformation = other_information;
    information.activityInfo = activities;
    information.extraInfo = extraArr;

    localStorage.setItem("tripInfo", JSON.stringify(information));
}

function goToForm(personCount, students) {

    localStorage.setItem("numberOfPersons", JSON.stringify(personCount));

    localStorage.setItem("formInfo", JSON.stringify([]));
    for (let i = 0; i < personCount; i++) {
        //every empty dict is a placeholder for a persons form
        setPersonInfo(i)
    }

    localStorage.setItem("studentTrip", JSON.stringify(students));

    window.location.href = "form.html";
}