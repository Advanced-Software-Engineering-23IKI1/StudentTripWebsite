document.addEventListener("DOMContentLoaded", function () {
    const button = document.getElementById("toPDF");
    if (button) {
        button.addEventListener("click", function () {

            toPDF(); // Call your function
        });
    } else {
        console.error("Button with ID 'toPDF' not found");
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("toPDF");
    const emailField = document.getElementById("email");
    const firstNameField = document.getElementById("first-name");

    button.addEventListener("click", () => {
        const email = emailField.value.trim();
        const firstName = firstNameField.value.trim();

        if (!email || !validateEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        sendPDF(email, firstName);
    });
});

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function sendPDF(email, firstName) {
    fetch('send_email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, firstName })
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
function toPDF() {
    const data = {
        email: document.getElementById('email').value, // Get the email field value
        // You can include other form fields here as needed
    };

    fetch('send_email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)  // Convert the data to JSON format
    })
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            if (data.success) {
                alert('PDF sent successfully!');
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an issue with the request');
        });
}

