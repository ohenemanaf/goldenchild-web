// Mobile menu, scroll motion, counters, contact form and footer year. No libraries.
(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---------- Mobile menu ----------
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
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) setOpen(false);
        });
    }

    // ---------- Header shadow + back-to-top ----------
    var header = document.querySelector('.site-header');
    var toTop = document.querySelector('.to-top');
    var onScroll = function () {
        var y = window.scrollY;
        if (header) header.classList.toggle('is-scrolled', y > 24);
        if (toTop) toTop.classList.toggle('show', y > 900);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    // ---------- Count-up numbers ----------
    // The real number is already in the HTML; this only animates up to it.
    var countUp = function (el) {
        var target = Number(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduceMotion || !target) return;
        var duration = 1400;
        var start = null;
        var step = function (t) {
            if (start === null) start = t;
            var p = Math.min(1, (t - start) / duration);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString('en-GB') + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    // ---------- Scroll reveals ----------
    // Give each revealed element its position among its revealed siblings, so grids arrive in turn.
    var revealed = document.querySelectorAll('[data-reveal]');
    Array.prototype.forEach.call(revealed, function (el) {
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
            return c.hasAttribute('data-reveal');
        });
        el.style.setProperty('--i', Math.min(siblings.indexOf(el), 6));
    });

    var watch = document.querySelectorAll('[data-reveal], [data-reveal-line], [data-count]');
    if (!('IntersectionObserver' in window) || reduceMotion) {
        Array.prototype.forEach.call(watch, function (el) { el.classList.add('is-visible'); });
    } else {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                el.classList.add('is-visible');
                if (el.hasAttribute('data-count')) countUp(el);
                observer.unobserve(el);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
        Array.prototype.forEach.call(watch, function (el) { observer.observe(el); });
    }

    // ---------- Contact form ----------
    // The site has no server, so the form opens the visitor's email app
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
