/**
 * Initializes the form page by setting up all event listeners, displaying trip information,
 * and preparing form fields for participant data entry.
 * Clears localStorage when the page is closed or hidden.
 * @returns {void}
 */
function init() {
    displayTripType();
    determineLegalGuardianNecessary();
    initializeDisplayedForm();

    window.addEventListener("pagehide", function (event) {
        localStorage.clear()
    });

    //set person info items
    personCount = JSON.parse(localStorage.getItem("participants"))
    localStorage.setItem("formInfo", JSON.stringify([]));
    for (let i = 0; i < personCount; i++) {
        //every empty dict is a placeholder for a persons form
        setPersonInfo(i)
    }

    const previousButton = document.getElementById("previousPerson");
    const nextButton = document.getElementById("nextPerson");
    const confirmButton = document.getElementById("toPDF");

    previousButton.addEventListener("click", () => {
        loadDifferentForm(false);
    })

    nextButton.addEventListener("click", () => {
        loadDifferentForm(true);
    })

    confirmButton.addEventListener("click", () => {
        //to prevent double submissions: prevent clicking of button while click event is running
        confirmButton.disabled = true;
        setPersonInfo(JSON.parse(sessionStorage.getItem("currentPerson")));

        const form = document.querySelector('.needs-validation');
        if (check_validity_all_persons()) {
            sendPDF()
        }
        form.classList.add('was-validated');
        confirmButton.disabled = false;
    });

    document
        .getElementById("disability_present")
        .addEventListener("change", function () {
            change_visibility(this.checked, "data-disability");
        });

    document
        .getElementById("allergies_present")
        .addEventListener("change", function () {
            change_visibility(this.checked, "data-allergies");
        });

    document
        .getElementById("same_as_emergency_co")
        .addEventListener("change", function () {
            same_as_ec(this.checked);
        })

}

/**
 * Initializes the entire form when the DOM content is fully loaded.
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
    init();
});

/**
 * Displays the trip type information on the form page header.
 * Retrieves trip type from localStorage and updates the corresponding DOM element.
 * @returns {void}
 * @throws {Error} - Will throw if tripInfo is not in localStorage or is malformed JSON
 */
function displayTripType() {
    let tripType = JSON.parse(localStorage["tripInfo"]).otherInformation.tripType
    let tripTypeField = document.getElementById("tripType");
    tripTypeField.textContent = `Trip Type: ${tripType}`;
}

/**
 * Determines if the legal guardian section should be displayed based on whether this is a student trip.
 * If it's a student trip, shows and enables the legal guardian form fields.
 * @returns {void}
 */
function determineLegalGuardianNecessary() {
    if (JSON.parse(localStorage.getItem("studentTrip"))) {
        change_visibility(true, 'data-legal');
    }

}

/**
 * Shows or hides form sections based on a checkbox state and data attribute.
 * When checked is true, removes 'hidden' attribute and adds 'required' to form items.
 * When checked is false, adds 'hidden' attribute and removes 'required' from form items.
 * @param {boolean} checked - Whether the items should be visible (true) or hidden (false)
 * @param {string} tag_name - The data attribute name to query for form items (e.g., 'data-disability', 'data-allergies')
 * @returns {void}
 * @example
 * change_visibility(true, 'data-disability');
 */
function change_visibility(checked, tag_name) {
    let hiddenFormItems = document.querySelectorAll('[' + tag_name + ']');

    if (checked) {
        hiddenFormItems.forEach(function (item) {
            item.removeAttribute('hidden');
            item.setAttribute('required', '');
        })
    } else {
        hiddenFormItems.forEach(function (item) {
            item.setAttribute('hidden', '');
            item.removeAttribute('required');
        })
    }
}

/**
 * Toggles the legal guardian form fields to match or clear the emergency contact information.
 * When checked is true, copies emergency contact data to legal guardian fields.
 * When checked is false, clears all legal guardian fields and unchecks gender radio button.
 * @param {boolean} checked - Whether to copy emergency contact info (true) or clear it (false)
 * @returns {void}
 * @example
 * same_as_ec(true);
 */
function same_as_ec(checked) {
    let lg_first_name = document.getElementById("first-name-lg");
    let lg_last_name = document.getElementById("last-name-lg");
    let lg_address = document.getElementById("address-lg");
    let lg_postal_code = document.getElementById("postal-code-lg");
    let lg_town = document.getElementById("town-lg");
    let lg_mobile = document.getElementById("mobile-lg");
    let lg_email = document.getElementById("email-lg");

    if (checked) {
        lg_first_name.value = document.getElementById("first-name-ec").value;
        lg_last_name.value = document.getElementById("last-name-ec").value;
        lg_address.value = document.getElementById("address-ec").value;
        lg_postal_code.value = document.getElementById("postal-code-ec").value;
        lg_town.value = document.getElementById("town-ec").value;
        lg_mobile.value = document.getElementById("mobile-ec").value;
        lg_email.value = document.getElementById("email-ec").value;

        let ec_gender_selected = "";
        let ec_gender_arr = document.getElementsByName("flexRadioGenderEmContact");
        for (let i = 0; i < ec_gender_arr.length; i++) {
            if (ec_gender_arr[i].checked) {
                ec_gender_selected = ec_gender_arr[i].value;
                break;
            }
        }

        switch (ec_gender_selected) {
            case "m":
                document.getElementById("male-lg").checked = true;
                break;
            case "f":
                document.getElementById("female-lg").checked = true;
                break;
            case "d":
                document.getElementById("diverse-lg").checked = true;
                break;
        }

    } else {

        lg_first_name.value = "";
        lg_last_name.value = "";
        lg_address.value = "";
        lg_postal_code.value = "";
        lg_town.value = "";
        lg_mobile.value = "";
        lg_email.value = "";

        let lg_gender_arr = document.getElementsByName("flexRadioGenderLegalGu");
        for (let i = 0; i < lg_gender_arr.length; i++) {
            if (lg_gender_arr[i].checked) {
                lg_gender_arr[i].checked = false;
                break;
            }
        }
    }
}

/**
 * Retrieves and trims the value of an input element by its ID.
 * Returns an empty string if the element doesn't exist or has no value.
 * @param {string} id - The HTML ID of the input element
 * @returns {string} - The trimmed input value or empty string if not found
 * @example
 * const name = getInputValue('first-name');
 */
function getInputValue(id) {
    const value = document.getElementById(id)?.value.trim();
    return value || "";
}

/**
 * Collects all form data for a person and stores it in localStorage at the specified index.
 * Gathers personal info, emergency contact info, and legal guardian info (if applicable).
 * @param {number} personIndex - The index in the formInfo array where this person's data should be stored
 * @returns {void}
 * @example
 * setPersonInfo(0);
 */
function setPersonInfo(personIndex) {
    let person = {}

    //set values of person
    person.first_name = getInputValue("first-name");
    person.last_name = getInputValue("last-name");
    person.birthdate = getInputValue("birthdate");
    person.address = getInputValue("address");
    person.postal_code = getInputValue("postal-code");
    person.town = getInputValue("town");
    person.mobile = getInputValue("mobile");
    person.email = getInputValue("email");
    person.passport_number = getInputValue("passport-number");

    let gender_arr = document.getElementsByName("flexRadioGender");
    person.gender = "";
    for (let i = 0; i < gender_arr.length; i++) {
        if (gender_arr[i].checked) {
            person.gender = gender_arr[i].value;
            break;
        }
    }

    person.disability = getInputValue("disability") || "/";
    if (document.getElementById("disability_present") === null) {
        person.disability_checked = false;
    } else {
        person.disability_checked = document.getElementById("disability_present").checked
    }

    person.allergies = getInputValue("allergies") || "/";
    if (document.getElementById("allergies_present") === null) {
        person.allergies_checked = false;
    } else {
        person.allergies_checked = document.getElementById("allergies_present").checked
    }

    // Info of emergency contact
    person.first_name_ec = getInputValue("first-name-ec");
    person.last_name_ec = getInputValue("last-name-ec");
    person.address_ec = getInputValue("address-ec");
    person.postal_code_ec = getInputValue("postal-code-ec");
    person.town_ec = getInputValue("town-ec");
    person.mobile_ec = getInputValue("mobile-ec");
    person.email_ec = getInputValue("email-ec");

    let gender_ec_arr = document.getElementsByName("flexRadioGenderEmContact");
    person.gender_ec = "";
    for (let i = 0; i < gender_ec_arr.length; i++) {
        if (gender_ec_arr[i].checked) {
            person.gender_ec = gender_ec_arr[i].value;
            break;
        }
    }

    // Info of legal guardian
    person.first_name_lg = getInputValue("first-name-lg");
    person.last_name_lg = getInputValue("last-name-lg");
    person.address_lg = getInputValue("address-lg");
    person.postal_code_lg = getInputValue("postal-code-lg");
    person.town_lg = getInputValue("town-lg");
    person.mobile_lg = getInputValue("mobile-lg");
    person.email_lg = getInputValue("email-lg");

    let gender_lg_arr = document.getElementsByName("flexRadioGenderLegalGu");
    person.gender_lg = "";
    for (let i = 0; i < gender_lg_arr.length; i++) {
        if (gender_lg_arr[i].checked) {
            person.gender_lg = gender_lg_arr[i].value;
            break;
        }
    }

    person.wishes = getInputValue("wishes") || "/";

    //last button, agreeing to pay. Wanted to be funny. Im sorry.
    if (document.getElementById("payment_agreement") === null) {
        person.soldTheirSoul = false;
    } else {
        person.soldTheirSoul = document.getElementById("payment_agreement").checked;
    }

    //save person
    let formInfo = JSON.parse(localStorage.getItem("formInfo"));
    formInfo[personIndex] = person;
    localStorage.setItem("formInfo", JSON.stringify(formInfo));
}

/**
 * Initializes the form display based on the number of participants.
 * For single participant: hides previous/next buttons.
 * For multiple participants: disables previous button, shows person counter in header.
 * @returns {void}
 */
function initializeDisplayedForm() {

    sessionStorage.setItem("currentPerson", JSON.stringify(0));
    //if its just one person, hide the previous/next button and let the name stay form
    if (JSON.parse(localStorage.getItem("participants")) === 1) {
        document.getElementById("nextPerson").setAttribute('hidden', 'true');
        document.getElementById("previousPerson").setAttribute('hidden', 'true');

    } else {
        document.getElementById("previousPerson").setAttribute('disabled', 'disabled');
        document.getElementById("headerForm").innerHTML = "Form for Person 1";
    }
}

/**
 * Loads a person's previously saved form data from localStorage and populates all form fields.
 * Handles personal info, emergency contact, legal guardian info, checkboxes, and radio buttons.
 * @param {number} personIndex - The index of the person to load from the formInfo array
 * @returns {void}
 * @example
 * loadCurrentPerson(0);
 */
function loadCurrentPerson(personIndex) {
    let person = JSON.parse(localStorage.getItem("formInfo"))[personIndex];

    document.getElementById("first-name").value = person.first_name;
    document.getElementById("last-name").value = person.last_name;
    document.getElementById("birthdate").value = person.birthdate;
    document.getElementById("address").value = person.address;
    document.getElementById("postal-code").value = person.postal_code;
    document.getElementById("town").value = person.town;
    document.getElementById("mobile").value = person.mobile;
    document.getElementById("email").value = person.email;
    document.getElementById("passport-number").value = person.passport_number;

    let genderArr = document.getElementsByName("flexRadioGender");
    for (let i = 0; i < genderArr.length; i++) {
        genderArr[i].checked = genderArr[i].value === person.gender;
    }

    document.getElementById("disability").value = person.disability !== "/" ? person.disability : "";
    // click or unclick and hide or unhide disability checkbox and field
    document.getElementById("disability_present").checked = person.disability_checked;
    change_visibility(person.disability_checked, "data-disability")

    document.getElementById("allergies").value = person.allergies !== "/" ? person.allergies : "";
    // click or unclick and hide or unhide allergies checkbox and field
    document.getElementById("allergies_present").checked = person.allergies_checked;
    change_visibility(person.allergies_checked, "data-allergies")

    // Info of emergency contact
    document.getElementById("first-name-ec").value = person.first_name_ec;
    document.getElementById("last-name-ec").value = person.last_name_ec;
    document.getElementById("address-ec").value = person.address_ec;
    document.getElementById("postal-code-ec").value = person.postal_code_ec;
    document.getElementById("town-ec").value = person.town_ec;
    document.getElementById("mobile-ec").value = person.mobile_ec;
    document.getElementById("email-ec").value = person.email_ec;

    let genderEcArr = document.getElementsByName("flexRadioGenderEmContact");
    for (let i = 0; i < genderEcArr.length; i++) {
        genderEcArr[i].checked = genderEcArr[i].value === person.gender_ec;
    }

    //it technically doesnt matter that this button is always disabled, when loading a person into the form. The data in lg-contact has been saved and clicking the button again wont change anything, as long as the data itself isnt changed
    const sameAs = document.getElementById("same_as_emergency_co");
    if (sameAs) sameAs.checked = false;

    // Info of legal guardian
    document.getElementById("first-name-lg").value = person.first_name_lg;
    document.getElementById("last-name-lg").value = person.last_name_lg;
    document.getElementById("address-lg").value = person.address_lg;
    document.getElementById("postal-code-lg").value = person.postal_code_lg;
    document.getElementById("town-lg").value = person.town_lg;
    document.getElementById("mobile-lg").value = person.mobile_lg;
    document.getElementById("email-lg").value = person.email_lg;

    let genderLgArr = document.getElementsByName("flexRadioGenderLegalGu");
    for (let i = 0; i < genderLgArr.length; i++) {
        genderLgArr[i].checked = genderLgArr[i].value === person.gender_lg;
    }

    document.getElementById("wishes").value = person.wishes !== "/" ? person.wishes : "";

    document.getElementById("payment_agreement").checked = person.soldTheirSoul
}

/**
 * Saves current person's form data and navigates to the next or previous person's form.
 * Updates button states (enabled/disabled) based on navigation position.
 * Updates the form header to show which person is being edited.
 * @param {boolean} nextForm - True to go to next person, false to go to previous person
 * @returns {void}
 * @example
 * loadDifferentForm(true); // Navigate to next person
 */
function loadDifferentForm(nextForm) {
    let currentPerson = JSON.parse(sessionStorage.getItem("currentPerson"));

    setPersonInfo(currentPerson);
    if (nextForm) {
        currentPerson += 1
        sessionStorage.setItem("currentPerson", JSON.stringify(currentPerson));
        document.getElementById("previousPerson").removeAttribute('disabled');
        if (currentPerson === JSON.parse(localStorage.getItem("participants")) - 1) {
            document.getElementById("nextPerson").setAttribute('disabled', 'disabled');
        }
    } else {
        currentPerson -= 1
        sessionStorage.setItem("currentPerson", JSON.stringify(currentPerson));
        document.getElementById("nextPerson").removeAttribute('disabled');
        if (currentPerson === 0) {
            document.getElementById("previousPerson").setAttribute('disabled', 'disabled');
        }
    }
    loadCurrentPerson(currentPerson);
    document.getElementById("headerForm").innerHTML = "Form for Person " + (currentPerson + 1);
}

/**
 * Validates that all required form fields are filled for every participant.
 * Iterates through each person, loads their data, and checks validity.
 * Shows an alert and returns false if any person has missing required information.
 * Restores the original person's form if validation fails.
 * @returns {boolean} - True if all persons' forms are valid, false otherwise
 * @example
 * if (check_validity_all_persons()) { submitForm(); }
 */
function check_validity_all_persons() {

    let currentPerson = JSON.parse(sessionStorage.getItem("currentPerson"));

    for (let i = 0; i < JSON.parse(localStorage.getItem("participants")); i++) {
        loadCurrentPerson(i);

        const form = document.querySelector('.needs-validation');

        form.classList.add('was-validated');

        if (!form.checkValidity()) {
            loadCurrentPerson(currentPerson);
            alert("There is missing information for person " + (i + 1) + ". \n Please make sure you've filled all required fields.")
            return false;
        }
    }

    return true;
}

/**
 * Sends the complete form data and uploaded files to the server via POST request.
 * Validates file sizes (max 5MB each) before sending.
 * On success, clears localStorage and redirects to the thanks page.
 * On error, displays an alert with the error message.
 * @returns {Promise<Response>} - The fetch promise
 * @throws {Error} - Logs error to console and displays alert if submission fails
 * @example
 * sendPDF();
 */
function sendPDF() {
    const formInfo = JSON.parse(localStorage.getItem("formInfo"));
    const tripInfo = JSON.parse(localStorage.getItem("tripInfo"));

    const files = document.querySelector('[type=file]').files;
    const formData = new FormData();

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB

    for (let file of files) {
        if (file.size > MAX_SIZE) {
            alert(`File ${file.name} is too large (max 5MB)`);
            return;
        }
    }

// Add files
    for (let i = 0; i < files.length; i++) {
        formData.append('files[]', files[i]);
    }

// Add JSON as string
    const form_Content = {
        formInfo: formInfo,
        tripInfo: tripInfo
    };

    formData.append('form_content', JSON.stringify(form_Content));


    return fetch('../send_email.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.clear();
                window.location.replace("../thanks/index.html");

            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An issue occurred while sending the email.');
        });
}

/**
 * Export functions for Jest testing in Node.js environment.
 * Has no effect when running in the browser.
 * Allows unit tests to import and test individual functions.
 */
// Export for Jest (Node). Has no effect in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    determineLegalGuardianNecessary,
    change_visibility,
    same_as_ec,
    getInputValue,
    setPersonInfo,
    initializeDisplayedForm,
    loadCurrentPerson,
    loadDifferentForm,
    check_validity_all_persons,
    sendPDF,
  };
}