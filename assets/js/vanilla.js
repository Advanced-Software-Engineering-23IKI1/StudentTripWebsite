/**
 * Renders a Handlebars template with the provided data and inserts it into the destination element.
 * @param {HTMLElement} template_obj - The HTML element containing the Handlebars template string
 * @param {HTMLElement} dest_obj - The destination HTML element where the compiled template will be inserted
 * @param {Object} data - The data object to be passed to the Handlebars template for rendering
 * @returns {void}
 * @example
 * render(document.getElementById('template'), document.getElementById('output'), { name: 'John' });
 */
function render(template_obj, dest_obj, data) {
    const template = Handlebars.compile(template_obj.innerHTML);
    dest_obj.innerHTML = template(data)
}
