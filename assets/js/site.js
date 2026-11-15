// Mobile menu, contact form and footer year. No libraries.
(function () {
    var button = document.querySelector('.menu-btn');
    var menu = document.getElementById('mobile-nav');
    if (button && menu) {
        var setOpen = function (open) {
            menu.classList.toggle('open', open);
            button.setAttribute('aria-expanded', String(open));
            button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
            button.querySelector('use').setAttribute('href', 'assets/icons.svg#' + (open ? 'x' : 'menu'));
        };
        button.addEventListener('click', function () {
            setOpen(!menu.classList.contains('open'));
        });
        // Close after choosing a section.
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });
    }

    // The site has no server, so the contact form opens the visitor's email app
    // with the message filled in, addressed to the school.
    var form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var v = function (id) { return document.getElementById(id).value.trim(); };
            var body = [
                v('message'),
                '',
                'From: ' + v('name'),
                v('email') ? 'Email: ' + v('email') : '',
                v('phone') ? 'Phone: ' + v('phone') : '',
            ].filter(function (line, i) { return i < 2 || line; }).join('\n');
            window.location.href = 'mailto:goldenschool@yahoo.com?subject=' + encodeURIComponent(v('subject')) + '&body=' + encodeURIComponent(body);
        });
    }

    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
})();
