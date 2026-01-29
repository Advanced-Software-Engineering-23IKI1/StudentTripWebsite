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
    ;

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

//returns the discount value of a given discount
function getDiscountValue(discount) {
    if (discount == null)
        return 0
    const value = loadDiscounts().values[discount]
    if (Number.isInteger(value)) {
        return value
    } else {
        return (Number.parseFloat(value.slice(0, value.length - 1)) / 100) * Number.parseFloat($ID("total").innerText.substring(2))
    }
}

//updates current discount and removes current one if used
function updateDiscount(discount, used) {
    const discounts = loadDiscounts()
    if (used) {
        discounts.available.splice(discounts.available.indexOf(discounts.current), 1)
    }
    discounts.current = discount
    writeDiscounts(discounts)
}

// loads all discounts and their value from the local storage
function loadDiscounts() {
    var discounts = localStorage.getItem("discounts");
    if (discounts) {
        return JSON.parse(discounts)
    } else {
        discounts = {current: null, available: ["Michi10", "HAPPY10"], values: {"Michi10": 10, "HAPPY10": "0.1%"}}
        localStorage.setItem("discounts", JSON.stringify(discounts))
        return discounts
    }

}

// wirtes the discounts to the local storage
function writeDiscounts(discounts) {
    localStorage.setItem("discounts", JSON.stringify(discounts))
}

function goToForm(personCount, students) {

    localStorage.setItem("numberOfPersons", JSON.stringify(personCount));

    localStorage.setItem("formInfo", JSON.stringify([]));
    for (let i = 0; i < personCount; i++) {
        //every empty dict is a placeholder for a persons form
        setPersonInfo(i)
    }

    if (students) {
        localStorage.setItem("studentTrip", JSON.stringify(true));
    } else {
        localStorage.setItem("studentTrip", JSON.stringify(false));
    }

    window.location.href = "form.html";
}