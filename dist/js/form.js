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

