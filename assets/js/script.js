
document.addEventListener('DOMContentLoaded', function() {
const checkboxes = document.querySelectorAll('.custom-checkbox');
checkboxes.forEach(checkbox => {
checkbox.addEventListener('click', function() {
this.classList.toggle('checked');
});
});
});
document.addEventListener('DOMContentLoaded', function() {
const switches = document.querySelectorAll('.custom-switch');
switches.forEach(switchEl => {
switchEl.addEventListener('click', function() {
this.classList.toggle('active');
});
});
});
document.addEventListener('DOMContentLoaded', function() {
const tabButtons = document.querySelectorAll('.tab-button');
tabButtons.forEach(button => {
button.addEventListener('click', function() {
tabButtons.forEach(btn => btn.classList.remove('active'));
this.classList.add('active');
});
});
});
function toggleFAQ(element) {
const content = element.nextElementSibling;
const icon = element.querySelector('i');
if (content.classList.contains('hidden')) {
content.classList.remove('hidden');
icon.classList.replace('ri-add-line', 'ri-subtract-line');
} else {
content.classList.add('hidden');
icon.classList.replace('ri-subtract-line', 'ri-add-line');
}
}
