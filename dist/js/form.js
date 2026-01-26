function determineStudentOrSenior() {
    //for debugging purposes
    sessionStorage.setItem("studentTrip", JSON.stringify(true));
    if (JSON.parse(sessionStorage.getItem("studentTrip")))    {
        change_visibility(true, 'data-legal');
    }

}

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

function same_as_ec(checked)  {
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

        switch(ec_gender_selected)  {
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

function getInputValue(id)  {
    const value = document.getElementById(id)?.value.trim();
    return value || "";
}

function setPersonInfo(personIndex)  {
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
    person.allergies = getInputValue("allergies") || "/";

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

    //save person
    let formInfo = JSON.parse(localStorage.getItem("formInfo"));
    formInfo[personIndex] = person;
    localStorage.setItem("formInfo", JSON.stringify(formInfo));
}

//TODO unsure if I need this
function getPersonInfo(personIndex) {

}

//TODO this is an awful name. We're not writing Java code and this is not an subclass that extends a class, which implements another class. And the name is not specific despite being that long. It has no business being this long. My brain hurts.
function initializeAmountSpecificThings()   {
    //for debugging purposes
    localStorage.setItem("numberOfPersons", JSON.stringify(3));

    //TODO initialize this array when clicking whichever button lets you get to the form with the amount of persons selected doing it here is just for debugging purposes --> just copy this codeblock in a method thats called there and it should be fine
    localStorage.setItem("formInfo", JSON.stringify([]));
    for (let i = 0; i < JSON.parse(localStorage.getItem("numberOfPersons")); i++) {
        //every empty dict is a placeholder for a persons form
        setPersonInfo(i)
    }

    sessionStorage.setItem("currentPerson", JSON.stringify(1));
    //if its just one person, hide the previous/next button and let the name stay form
    if (JSON.parse(localStorage.getItem("numberOfPersons")) === 1)    {
        document.getElementById("nextPerson").setAttribute('hidden', 'true');
        document.getElementById("previousPerson").setAttribute('hidden', 'true');

    } else {
        document.getElementById("previousPerson").setAttribute('disabled', 'disabled');
        document.getElementById("headerForm").innerHTML = "Form for Person 1";
    }
}

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
    document.getElementById("allergies").value = person.allergies !== "/" ? person.allergies : "";

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
}

function loadDifferentForm(nextForm)    {
    let currentPerson = JSON.parse(sessionStorage.getItem("currentPerson"));

    setPersonInfo(currentPerson-1);
    if (nextForm) {
        currentPerson += 1
        sessionStorage.setItem("currentPerson", JSON.stringify(currentPerson));
        document.getElementById("previousPerson").removeAttribute('disabled');
        if (currentPerson === JSON.parse(localStorage.getItem("numberOfPersons")))    {
            document.getElementById("nextPerson").setAttribute('disabled', 'disabled');
        }
    } else {
        currentPerson -= 1
        sessionStorage.setItem("currentPerson", JSON.stringify(currentPerson));
        document.getElementById("nextPerson").removeAttribute('disabled');
        if (currentPerson === 1)    {
            document.getElementById("previousPerson").setAttribute('disabled', 'disabled');
        }
    }
    loadCurrentPerson(currentPerson-1);
    document.getElementById("headerForm").innerHTML = "Form for Person " + currentPerson;
}

document.addEventListener("DOMContentLoaded", () => {
    determineStudentOrSenior()
    initializeAmountSpecificThings()

    const previousButton = document.getElementById("previousPerson");
    const nextButton = document.getElementById("nextPerson");
    const confirmButton = document.getElementById("toPDF");

    previousButton.addEventListener("click", function (event) {
        loadDifferentForm(false);
    })

    nextButton.addEventListener("click", function (event) {
        loadDifferentForm(true);
    })

    confirmButton.addEventListener("click", () => {

        const form = document.querySelector('.needs-validation');

        if (form.checkValidity()) {
            process_form();
        }
        form.classList.add('was-validated');
    });


});

function process_form() {
    //info of person that goes on the trip


    sendPDF(first_name, last_name, birthdate, address, postal_code, town, mobile, email, passport_number, gender, disability, allergies, first_name_ec, last_name_ec,
        address_ec, postal_code_ec, town_ec, mobile_ec, email_ec, gender_ec, first_name_lg, last_name_lg, address_lg, postal_code_lg, town_lg, mobile_lg, email_lg, gender_lg, wishes);
}

function sendPDF(first_name, last_name, birthdate, address, postal_code, town, mobile, email, passport_number, gender, disability, allergies, first_name_ec, last_name_ec,
                 address_ec, postal_code_ec, town_ec, mobile_ec, email_ec, gender_ec, first_name_lg, last_name_lg, address_lg, postal_code_lg, town_lg, mobile_lg, email_lg, gender_lg, wishes) {
    fetch('send_email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({first_name, last_name, birthdate, address, postal_code, town, mobile, email, passport_number, gender, disability, allergies, first_name_ec, last_name_ec,
            address_ec, postal_code_ec, town_ec, mobile_ec, email_ec, gender_ec, first_name_lg, last_name_lg, address_lg, postal_code_lg, town_lg, mobile_lg, email_lg, gender_lg, wishes})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (email_lg !== "")    {
                    alert('A copy of the form has been send to your legal guardians email address.\n' +
                        'Please check your spam folder and ensure, that the information in the form is correct.');
                } else {
                    alert('A copy of the form has been send to your email address.\n' +
                        'Please check your spam folder and ensure, that the information in the form is correct.');
                }

            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An issue occurred while sending the email.');
        });
}