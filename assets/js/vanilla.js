


/**
 * Rounds a numeric value to a fixed number of decimal places.
 * @param {number} val Value to round.
 * @param {number} amount Number of decimal places.
 * @returns {number} Rounded value.
 */
function round(val, amount) {
    return Math.round(val * Math.pow(10, amount)) / Math.pow(10, amount);
}

//renders handlebars template objects
/**
 * Renders a Handlebars template into a destination element.
 * @param {HTMLElement} template_obj Element containing template markup.
 * @param {HTMLElement} dest_obj Element where rendered HTML is written.
 * @param {object} data Data context passed to Handlebars.
 */
function render(template_obj, dest_obj, data) {
    const template = Handlebars.compile(template_obj.innerHTML);
    dest_obj.innerHTML = template(data)
}

//Shared Logic for the senior and student sites

/**
 * Updates multiple price text fields.
 * @param {HTMLElement[]} fields Target elements for text output.
 * @param {string[]} texts Prefix labels for each field.
 * @param {number[]} prices Numeric prices to display.
 */
function updatePriceFields(fields, texts, prices) {
    for (let i = 0; i < fields.length; i++) {
        fields[i].textContent = texts[i] + `\u00A3${prices[i].toFixed(2)}`;
    }
}

/**
 * Changes a participant counter and updates related button states.
 * @param {HTMLElement} peopleCountField Element displaying the current count.
 * @param {HTMLButtonElement} btn Button that triggered this change.
 * @param {HTMLButtonElement} oppositeBtn Opposite direction button to re-enable.
 * @param {boolean} isMinusBtn True when decrementing, false when incrementing.
 * @param {number} [price=0] Optional activity price delta.
 * @param {number} [numberDisableBtn=0] Threshold where decrement button is disabled.
 */
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

/**
 * Enables all buttons in the provided list.
 * @param {HTMLButtonElement[]} buttons Button collection.
 */
function enableButtons(buttons) {

    buttons.forEach(button => {button.disabled = false;})
}

/**
 * Adds activity price to running total and refreshes price display.
 * @param {number} price Activity price increment.
 */
function calc_Activity_Price(price) {
    activityPrice += price;
    updatePriceFieldCall()
}

/**
 * Adds extra-cost amount and recalculates total price.
 * @param {number} price Extra-cost increment.
 */
function addExtrasCost(price) {
    totalExtrasCost += price;
    calculatePrice();
}

/**
 * Enables a plus button.
 * @param {HTMLButtonElement} plusButton Button to enable.
 */
function checkEnable(plusButton)    {
    plusButton.disabled = false;
}

/**
 * Disables plus buttons when combined participant counts reach max allowed count.
 * @param {HTMLButtonElement} plusButtonFirst First plus button.
 * @param {HTMLButtonElement} plusButtonSecond Second plus button.
 * @param {HTMLElement} peopleCountFirst First count display.
 * @param {HTMLElement} peopleCountSecond Second count display.
 */
function checkDisable(plusButtonFirst, plusButtonSecond, peopleCountFirst, peopleCountSecond)    {
    if (parseInt(peopleCountFirst.textContent) + parseInt(peopleCountSecond.textContent) === count) {
        plusButtonFirst.disabled = true;
        plusButtonSecond.disabled = true;
    }
}

/**
 * Collects selected activities/extras and stores trip information in localStorage.
 * @param {string} date Selected trip date.
 */
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
    other_information.tripType = JSON.parse(localStorage.getItem("tripName"));
    other_information.date = date;

    let information = {};
    information.otherInformation = other_information;
    information.activityInfo = activities;
    information.extraInfo = extraArr;

    localStorage.setItem("tripInfo", JSON.stringify(information));
}

