document.addEventListener("DOMContentLoaded", () => {
    const submitButton = document.getElementById("submit");

    submitButton.addEventListener("click", () => {
        const form = document.querySelector('.needs-validation');

        form.classList.add('was-validated');

        if(form.checkValidity())    {
            //TODO
        }
    });
});