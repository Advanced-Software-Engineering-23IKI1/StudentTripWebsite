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
 * Sends contact form content to backend mail endpoint and handles UI feedback.
 * @param {string} formContent JSON string containing form fields.
 * @param {HTMLFormElement} form Contact form element to reset on success.
 */
function sendContactMail(formContent, form) {
    fetch('send_email_contact_page.php', {
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