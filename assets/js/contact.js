/**
 * Initializes the contact form by setting up event listeners when the DOM is fully loaded.
 * Adds click handler to submit button that validates the form and sends the contact email.
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit");

    submitButton.addEventListener("click", () => {
        const form = document.querySelector('.needs-validation');

        form.classList.add('was-validated');

        if(form.checkValidity())    {
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const phone = document.getElementById("phone").value;
            const message = document.getElementById("message").value;
            const formContent = JSON.stringify({name, email, phone, message});
            sendContactMail(formContent, form);
        }
    });
});

/**
 * Sends contact form data to the server via POST request and handles the response.
 * Displays success/error messages and resets the form on successful submission.
 * @param {string} formContent - JSON stringified object containing name, email, phone, and message fields
 * @param {HTMLFormElement} form - The HTML form element to be reset after successful submission
 * @returns {Promise<Response>} - The fetch promise (though not awaited in current implementation)
 * @throws {Error} - Logs error to console and displays alert if fetch fails
 */
function sendContactMail(formContent, form) {
    fetch('../send_email_contact_page.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: formContent
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Your message has been sent!');
                form.reset();
                form.classList.remove('was-validated');

            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An issue occurred while sending the contact form.');
        });
}