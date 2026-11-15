// Golden Child Complex School: menu, motion and forms. No libraries.
(function () {
    'use strict';
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var $ = function (sel, root) { return (root || document).querySelector(sel); };
    var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

    // ---------- Full-screen mobile menu ----------
    var menuBtn = $('.menu-btn');
    var menu = $('#mobile-nav');
    if (menuBtn && menu) {
        var setOpen = function (open) {
            menu.classList.toggle('open', open);
            document.body.classList.toggle('menu-open', open);
            menuBtn.setAttribute('aria-expanded', String(open));
            menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        };
        menuBtn.addEventListener('click', function () { setOpen(!menu.classList.contains('open')); });
        menu.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    }

    // ---------- Scroll-linked: progress bar, header, back-to-top ring, timeline ----------
    var header = $('.site-header');
    var bar = $('.scroll-progress span');
    var toTop = $('.to-top');
    var timeline = $('.timeline');
    var ticking = false;
    var onScroll = function () {
        ticking = false;
        var y = window.scrollY;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? Math.min(1, y / max) : 0;
        if (bar) bar.style.transform = 'scaleX(' + p + ')';
        if (header) header.classList.toggle('is-scrolled', y > 24);
        if (toTop) {
            toTop.classList.toggle('show', y > 700);
            toTop.style.setProperty('--scroll', p.toFixed(3));
        }
        if (timeline && !reduceMotion) {
            // The line fills as the timeline passes the middle of the screen.
            var r = timeline.getBoundingClientRect();
            var t = (window.innerHeight * 0.6 - r.top) / r.height;
            timeline.style.setProperty('--progress', Math.max(0, Math.min(1, t)).toFixed(3));
        }
    };
    window.addEventListener('scroll', function () {
        if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }); });

    // ---------- Count-up numbers (the real number is already in the HTML) ----------
    var countUp = function (el) {
        var target = Number(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduceMotion || !target) return;
        var start = null;
        var step = function (t) {
            if (start === null) start = t;
            var p = Math.min(1, (t - start) / 1500);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased).toLocaleString('en-GB') + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    // ---------- Scroll reveals; siblings arrive in turn ----------
    $$('[data-reveal]').forEach(function (el) {
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute('data-reveal'); });
        el.style.setProperty('--i', Math.min(siblings.indexOf(el), 6));
    });
    var watched = $$('[data-reveal], [data-reveal-line], [data-count], .timeline li');
    if (!('IntersectionObserver' in window) || reduceMotion) {
        watched.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                if (entry.target.hasAttribute('data-count')) countUp(entry.target);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
        watched.forEach(function (el) { io.observe(el); });
    }

    // ---------- Rotating words in the home hero ----------
    $$('.rotator__window').forEach(function (win) {
        var words = $$('.rotator__word', win);
        if (words.length < 2 || reduceMotion) return;
        var i = 0;
        setInterval(function () {
            if (document.hidden) return;
            var current = words[i];
            i = (i + 1) % words.length;
            current.classList.add('is-leaving');
            current.classList.remove('is-active');
            words[i].classList.remove('is-leaving');
            words[i].classList.add('is-active');
            setTimeout(function () { current.classList.remove('is-leaving'); }, 650);
        }, 2400);
    });

    // ---------- Testimonials carousel ----------
    $$('.carousel').forEach(function (carousel) {
        var track = $('.carousel__track', carousel);
        var slides = $$('.slide', carousel);
        var dotsWrap = $('.carousel__dots', carousel);
        var index = 0;
        var timer = null;
        var dots = slides.map(function (_, n) {
            var d = document.createElement('button');
            d.type = 'button';
            d.className = 'carousel__dot';
            d.setAttribute('aria-label', 'Show story ' + (n + 1) + ' of ' + slides.length);
            d.addEventListener('click', function () { go(n); restart(); });
            dotsWrap.appendChild(d);
            return d;
        });
        var go = function (n) {
            index = (n + slides.length) % slides.length;
            track.style.transform = 'translateX(' + (-100 * index) + '%)';
            slides.forEach(function (s, k) { s.setAttribute('aria-hidden', String(k !== index)); });
            dots.forEach(function (d, k) { d.setAttribute('aria-current', String(k === index)); });
        };
        var restart = function () {
            clearInterval(timer);
            if (!reduceMotion) timer = setInterval(function () { if (!document.hidden) go(index + 1); }, 6500);
        };
        $('.carousel__btn--prev', carousel).addEventListener('click', function () { go(index - 1); restart(); });
        $('.carousel__btn--next', carousel).addEventListener('click', function () { go(index + 1); restart(); });
        carousel.addEventListener('mouseenter', function () { clearInterval(timer); });
        carousel.addEventListener('mouseleave', restart);
        carousel.addEventListener('focusin', function () { clearInterval(timer); });
        // Swipe on phones
        var startX = null;
        carousel.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
        carousel.addEventListener('touchend', function (e) {
            if (startX === null) return;
            var dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
            startX = null;
        });
        go(0);
        restart();
    });

    // ---------- Tabs with a sliding indicator ----------
    $$('.tabs').forEach(function (tabs) {
        var list = $('.tabs__list', tabs);
        var buttons = $$('[role="tab"]', tabs);
        var indicator = document.createElement('span');
        indicator.className = 'tabs__indicator';
        list.prepend(indicator);
        var place = function (btn) {
            indicator.style.width = btn.offsetWidth + 'px';
            // offsetLeft and the indicator's left: 0 share the list's padding edge as origin.
            indicator.style.transform = 'translateX(' + btn.offsetLeft + 'px)';
        };
        var select = function (btn, focus) {
            buttons.forEach(function (b) {
                var on = b === btn;
                b.setAttribute('aria-selected', String(on));
                b.tabIndex = on ? 0 : -1;
                var panel = document.getElementById(b.getAttribute('aria-controls'));
                panel.hidden = !on;
                if (on) {
                    panel.classList.remove('is-entering');
                    void panel.offsetWidth; // restart the entrance animation
                    panel.classList.add('is-entering');
                }
            });
            place(btn);
            if (focus) btn.focus();
        };
        buttons.forEach(function (btn, k) {
            btn.addEventListener('click', function () { select(btn); });
            btn.addEventListener('keydown', function (e) {
                var next = e.key === 'ArrowRight' ? k + 1 : e.key === 'ArrowLeft' ? k - 1 : null;
                if (next === null) return;
                e.preventDefault();
                select(buttons[(next + buttons.length) % buttons.length], true);
            });
        });
        // Open the level named in the link (#kindergarten etc.) and bring the tabs into view,
        // both on arrival and when a link on this page changes the hash.
        var fromHash = function () {
            return buttons.filter(function (b) { return '#' + b.id.replace('tab-', '') === location.hash; })[0];
        };
        var openFromHash = function () {
            var btn = fromHash();
            if (!btn) return false;
            select(btn);
            tabs.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
            return true;
        };
        if (!openFromHash()) select(buttons[0]);
        window.addEventListener('hashchange', openFromHash);
        window.addEventListener('resize', function () { place($('[aria-selected="true"]', tabs)); });
    });

    // ---------- Gentle 3D tilt on cards (mouse only) ----------
    if (finePointer && !reduceMotion) {
        $$('.tilt').forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                var x = (e.clientX - r.left) / r.width - 0.5;
                var y = (e.clientY - r.top) / r.height - 0.5;
                card.classList.add('is-tilting');
                card.style.transform = 'perspective(800px) rotateX(' + (-y * 6).toFixed(2) + 'deg) rotateY(' + (x * 8).toFixed(2) + 'deg) translateY(-4px)';
            });
            card.addEventListener('pointerleave', function () {
                card.classList.remove('is-tilting');
                card.style.transform = '';
            });
        });
    }

    // ---------- Forms: open the visitor's email app, addressed to the school ----------
    var mailForm = function (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var get = function (name) { var f = form.elements[name]; return f ? f.value.trim() : ''; };
            var lines = [];
            if (form.dataset.kind === 'enquiry') {
                lines.push('Admission enquiry', '', 'Child: ' + get('child'), 'Level: ' + get('level'), 'Preferred campus: ' + get('campus'));
                if (get('message')) lines.push('', get('message'));
            } else {
                lines.push(get('message'));
            }
            lines.push('', 'From: ' + get('name'));
            if (get('email')) lines.push('Email: ' + get('email'));
            if (get('phone')) lines.push('Phone: ' + get('phone'));
            var subject = form.dataset.kind === 'enquiry' ? 'Admission enquiry: ' + get('level') : get('subject');
            window.location.href = 'mailto:goldenschool@yahoo.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
        });
    };
    $$('form[data-kind]').forEach(mailForm);

    var year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
})();
