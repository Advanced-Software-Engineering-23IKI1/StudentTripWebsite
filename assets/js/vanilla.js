//renders handlebars template objects
function render(template_obj, dest_obj, data) {
    const template = Handlebars.compile(template_obj.innerHTML);
    dest_obj.innerHTML = template(data)
}
