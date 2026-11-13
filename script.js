/* Xikwembu Xa Borehole Jikelelee – site scripts */
(function () {
  'use strict';
  var WA_NUMBER = '27627924318'; // +27 62 792 4318
  var BRAND = 'Xikwembu Xa Borehole Jikelelee';

  function waLink(msg) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
  }
  function openWA(msg) {
    window.open(waLink(msg), '_blank', 'noopener');
  }
  function greeting() {
    var h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  }
  function fmt(n) { return 'R' + n.toLocaleString('en-ZA').replace(/ /g, ','); }
  window.XK = { openWA: openWA, waLink: waLink };

  /* ---------- automated WhatsApp messages by what was clicked ---------- */
  var MESSAGES = {
    general: 'I would like to make an inquiry.',
    book: 'I would like to BOOK a borehole drilling. Please tell me the available dates.',
    quote: 'I would like a FREE quote for borehole drilling. Please advise what you need from me.',
    survey: 'I would like to book a FREE geophysical survey to find water on my property.',
    pump: 'I need a water pump installed. Please send me options and prices.',
    filter: 'I am interested in a water filtration / purification system. Please send details.',
    tank: 'I am interested in JoJo water tanks and tank stands. Please send prices.',
    heater: 'I am interested in an instant water heater. Please send details.',
    casing: 'I need steel casing for a borehole. Please send me details and availability.',
    referral: 'I would like to refer a client and claim the R2,700 referral reward. How does it work?',
    emergency: 'URGENT: I need help with a borehole / pump problem. Please call me as soon as possible.',
    drilling_only: 'I would like a quote for DRILLING ONLY (R350 per metre).'
  };
  function buildMsg(key, extra) {
    var base = MESSAGES[key] || MESSAGES.general;
    var page = document.title.split('|')[0].trim();
    return greeting() + ' ' + BRAND + '. ' + base + (extra ? ' ' + extra : '') +
      '\n\n(Sent from your website – ' + page + ')';
  }
  window.XK.buildMsg = buildMsg;

  // any element with data-wa="key" (and optional data-wa-extra)
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-wa]');
    if (!t) return;
    e.preventDefault();
    openWA(buildMsg(t.getAttribute('data-wa'), t.getAttribute('data-wa-extra') || ''));
  });

  /* ---------- floating WhatsApp widget ---------- */
  var fab = document.querySelector('.wa-fab');
  if (fab) {
    var btn = fab.querySelector('.wa-btn');
    var nudge = fab.querySelector('.wa-nudge');
    btn.addEventListener('click', function () {
      fab.classList.toggle('open');
      if (nudge) nudge.classList.remove('show');
    });
    document.addEventListener('click', function (e) {
      if (!fab.contains(e.target)) fab.classList.remove('open');
    });
    if (nudge) {
      setTimeout(function () { if (!fab.classList.contains('open')) nudge.classList.add('show'); }, 5000);
      setTimeout(function () { nudge.classList.remove('show'); }, 13000);
    }
  }

  /* ---------- nav ---------- */
  var nav = document.querySelector('header.nav');
  var burger = document.querySelector('.burger');
  var menu = document.querySelector('.menu');
  if (burger) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        burger.classList.remove('open'); menu.classList.remove('open'); document.body.style.overflow = '';
      }
    });
  }
  var prog = document.getElementById('progress');
  function onScroll() {
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (nav) nav.classList.toggle('scrolled', y > 30);
    if (prog) prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- scroll reveal ---------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: .12 }) : null;
  document.querySelectorAll('.reveal').forEach(function (el) {
    if (io) io.observe(el); else el.classList.add('in');
  });

  /* ---------- counters ---------- */
  var cio = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (!en.isIntersecting) return;
      var el = en.target, to = +el.dataset.count, suf = el.dataset.suffix || '', t0 = null;
      (function step(ts) {
        t0 = t0 || ts; var p = Math.min((ts - t0) / 1600, 1);
        el.textContent = Math.floor(to * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(step);
      })(performance.now());
      cio.unobserve(el);
    });
  }, { threshold: .4 }) : null;
  document.querySelectorAll('[data-count]').forEach(function (el) { if (cio) cio.observe(el); else el.textContent = el.dataset.count + (el.dataset.suffix || ''); });

  /* ---------- 3D tilt cards (mouse + touch) ---------- */
  var canHover = matchMedia('(hover:hover)').matches;
  document.querySelectorAll('[data-tilt]').forEach(function (c) {
    function move(x, y) {
      var r = c.getBoundingClientRect();
      var px = (x - r.left) / r.width, py = (y - r.top) / r.height;
      c.style.transform = 'perspective(900px) rotateY(' + ((px - .5) * 16) + 'deg) rotateX(' + ((.5 - py) * 16) + 'deg) translateZ(10px)';
      c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%');
    }
    function reset() { c.style.transform = ''; }
    if (canHover) {
      c.addEventListener('mousemove', function (e) { move(e.clientX, e.clientY); });
      c.addEventListener('mouseleave', reset);
    } else {
      c.addEventListener('touchmove', function (e) { move(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
      c.addEventListener('touchend', reset);
    }
  });

  /* hero cube follows pointer */
  var stage = document.querySelector('.stage');
  if (stage && canHover) {
    var cube = stage.querySelector('.cube');
    stage.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      stage.style.perspectiveOrigin = (50 + x * 40) + '% ' + (50 + y * 40) + '%';
      cube.style.marginTop = (y * 30) + 'px';
    });
  }

  /* ---------- water bubbles canvas ---------- */
  var cv = document.getElementById('bubbles');
  if (cv && cv.getContext && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
    var cx = cv.getContext('2d'), W, H, bs = [];
    function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; }
    size(); addEventListener('resize', size);
    var N = innerWidth < 700 ? 22 : 45;
    for (var i = 0; i < N; i++) bs.push({ x: Math.random() * W, y: Math.random() * H, r: 3 + Math.random() * 14, s: .25 + Math.random() * .8, w: Math.random() * 6 });
    (function draw() {
      cx.clearRect(0, 0, W, H);
      bs.forEach(function (b) {
        b.y -= b.s; b.w += .02; b.x += Math.sin(b.w) * .4;
        if (b.y < -30) { b.y = H + 30; b.x = Math.random() * W; }
        var g = cx.createRadialGradient(b.x - b.r / 3, b.y - b.r / 3, 1, b.x, b.y, b.r);
        g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(.5, 'rgba(25,211,255,.12)'); g.addColorStop(1, 'rgba(25,211,255,.04)');
        cx.beginPath(); cx.arc(b.x, b.y, b.r, 0, 6.283); cx.fillStyle = g; cx.fill();
        cx.strokeStyle = 'rgba(122,240,255,.3)'; cx.stroke();
      });
      requestAnimationFrame(draw);
    })();
  }

  /* ---------- lightbox ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var imgs = [].slice.call(document.querySelectorAll('.gitem img')), idx = 0, lbi = lb.querySelector('img');
    function show(i) { idx = (i + imgs.length) % imgs.length; lbi.src = imgs[idx].src; lbi.alt = imgs[idx].alt; }
    imgs.forEach(function (im, i) { im.parentElement.addEventListener('click', function () { show(i); lb.classList.add('open'); }); });
    lb.querySelector('.close').onclick = function () { lb.classList.remove('open'); };
    document.getElementById('lbPrev').onclick = function (e) { e.stopPropagation(); show(idx - 1); };
    document.getElementById('lbNext').onclick = function (e) { e.stopPropagation(); show(idx + 1); };
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('open'); });
    addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lb.classList.remove('open');
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* ---------- pricing flip cards (tap on mobile) ---------- */
  document.querySelectorAll('.flip').forEach(function (f) {
    f.addEventListener('click', function (e) {
      if (e.target.closest('[data-wa]')) return;
      f.classList.toggle('on');
    });
  });

  /* ---------- price calculator ---------- */
  var RATES = { 30: 15800, 40: 20700, 50: 25600, 60: 30500, 70: 35400, 80: 40300, 90: 45200, 100: 50100 };
  var depth = document.getElementById('depth');
  if (depth) {
    var out = document.getElementById('calcPrice'), dv = document.getElementById('depthVal'),
      gl = document.getElementById('giftLine'), cbtn = document.getElementById('calcBook'),
      casing = document.getElementById('casingQty'), gifts = [].slice.call(document.querySelectorAll('.gift')), chosen = '';
    function calc() {
      var d = +depth.value, price = RATES[d], q = Math.max(0, +casing.value || 0), total = price + q * 2500;
      dv.textContent = d + ' m';
      out.textContent = fmt(total);
      var elig = d >= 50;
      gl.textContent = elig ? '🎁 Eligible for a FREE gift – pick one below' : '🎁 Free gift applies from 50m and above';
      gifts.forEach(function (g) { g.style.opacity = elig ? 1 : .35; g.style.pointerEvents = elig ? 'auto' : 'none'; if (!elig) g.classList.remove('sel'); });
      if (!elig) chosen = '';
      var extra = 'I am interested in ' + d + 'm drilling (' + fmt(price) + ')' + (q ? ' plus ' + q + ' x 3m steel casing (' + fmt(q * 2500) + ')' : '') +
        '. Estimated total: ' + fmt(total) + '.' + (chosen ? ' I choose the free gift: ' + chosen + '.' : '') + ' Free transport and free survey included.';
      cbtn.setAttribute('data-wa-extra', extra);
      cbtn.setAttribute('data-wa', 'book');
    }
    gifts.forEach(function (g) {
      g.addEventListener('click', function () {
        gifts.forEach(function (x) { x.classList.remove('sel'); });
        g.classList.add('sel'); chosen = g.dataset.gift; calc();
      });
    });
    depth.addEventListener('input', calc); casing.addEventListener('input', calc); calc();
  }
  var metres = document.getElementById('metres');
  if (metres) {
    var mo = document.getElementById('metresPrice'), mb = document.getElementById('metresBook');
    function mcalc() {
      var m = Math.max(0, +metres.value || 0), t = m * 350;
      mo.textContent = fmt(t);
      mb.setAttribute('data-wa', 'drilling_only');
      mb.setAttribute('data-wa-extra', 'I want ' + m + ' metres drilled = ' + fmt(t) + ' (R350 per metre).');
    }
    metres.addEventListener('input', mcalc); mcalc();
  }

  /* ---------- area chips ---------- */
  document.querySelectorAll('.chip[data-area]').forEach(function (c) {
    c.addEventListener('click', function () {
      openWA(buildMsg('book', 'My location is ' + c.dataset.area + '. Do you drill in my area?'));
    });
  });

  /* ---------- contact form -> WhatsApp ---------- */
  var form = document.getElementById('waForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form), name = (f.get('name') || '').trim(), phone = (f.get('phone') || '').trim(),
        area = f.get('area'), svc = f.get('service'), note = (f.get('message') || '').trim();
      var key = { 'Borehole drilling': 'book', 'Free quote': 'quote', 'Geophysical survey': 'survey', 'Pump installation': 'pump', 'Water filter': 'filter', 'JoJo tank': 'tank', 'Referral reward': 'referral' }[svc] || 'general';
      var extra = '\n\nName: ' + name + '\nPhone: ' + (phone || '—') + '\nArea: ' + area + '\nService: ' + svc + (note ? '\nDetails: ' + note : '');
      openWA(buildMsg(key, extra));
      var ok = document.getElementById('formOk'); if (ok) ok.style.display = 'block';
    });
  }

  /* year */
  document.querySelectorAll('.yr').forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
