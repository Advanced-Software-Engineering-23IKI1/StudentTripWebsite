document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("toPDF");
    //const emailField = document.getElementById("email");
    //const firstNameField = document.getElementById("first-name");

    button.addEventListener("click", () => {

        const form = document.querySelector('.needs-validation');

        if (form.checkValidity()) {
            process_form();
        }
        form.classList.add('was-validated');

        //const email = emailField.value.trim();
        //const firstName = firstNameField.value.trim();

        //sendPDF(email, firstName);
    });
});

function process_form() {
    let first_name = document.getElementById("first-name").value.trim();
    let last_name = document.getElementById("last-name").value.trim();
    let birthdate = document.getElementById("birthdate").value.trim();
    let address = document.getElementById("address").value.trim();
    let postal_code = document.getElementById("postal-code").value.trim();
    let town = document.getElementById("town").value.trim();
    let mobile = document.getElementById("mobile").value.trim();
    let email = document.getElementById("email").value.trim();
    let passport_number = document.getElementById("passport-number").value.trim();
    let gender = ""
    let gender_arr = document.getElementsByName("flexRadioGender");
    for (let i = 0; i < gender_arr.length; i++) {
        if (gender_arr[i].checked) {
            gender = gender_arr[i].value;
            break;
        }
    }

    let wishes = document.getElementById("wishes").value.trim();
    //TODO es wird nicht vernünftig mit umlauten umgegangen
    sendPDF(first_name, last_name, birthdate, address, postal_code, town, mobile, email, passport_number, gender, wishes);
}

function sendPDF(first_name, last_name, birthdate, address, postal_code, town, mobile, email, passport_number, gender, wishes) {
    fetch('send_email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({first_name, last_name, birthdate, address, postal_code, town, mobile, email, passport_number, gender, wishes})
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('PDF sent successfully!');
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An issue occurred while sending the email.');
        });
}