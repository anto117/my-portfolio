/* ═══════════════════════════════════════════════
   PRELOADER & INITIALIZATION
═══════════════════════════════════════════════ */
window.addEventListener('load', () => {
    const loader = document.getElementById('pageLoader');
    const timelineEl = document.querySelector('.timeline');

    // Simulate a slight loading delay to showcase the sleek preloader
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
        }
        
        // Trigger GSAP entrance animations
        initHeroAnimations();
        
        // Draw timeline connection line after loading
        setTimeout(() => {
            if (timelineEl) {
                timelineEl.classList.add('line-drawn');
            }
        }, 1000);
    }, 1400);
});

/* ═══════════════════════════════════════════════
   GSAP HERO TEXT ENTRANCE (AWWWARDS-STYLE)
═══════════════════════════════════════════════ */
function initHeroAnimations() {
    const greeting = document.getElementById('heroGreeting');
    const name = document.getElementById('heroName');
    const tagline = document.getElementById('heroTagline');
    const cta = document.getElementById('heroCta');

    // Make sure elements are visible before animating them with GSAP
    gsap.set([greeting, name, tagline, cta], { opacity: 1 });

    const tl = gsap.timeline();

    // Use clip-path curtain reveal to avoid nesting spans which breaks Webkit gradient text clip
    if (greeting) {
        tl.fromTo(greeting, 
            { y: 30, opacity: 0, clipPath: 'inset(100% 0 0 0)' }, 
            { y: 0, opacity: 0.55, clipPath: 'inset(0% 0 0 0)', duration: 0.8, ease: 'power3.out' }
        );
    }
    
    if (name) {
        tl.fromTo(name, 
            { y: 40, opacity: 0, clipPath: 'inset(100% 0 0 0)' }, 
            { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 1.0, ease: 'power3.out' },
            '-=0.55'
        );
    }

    if (tagline) {
        tl.fromTo(tagline, 
            { y: 25, opacity: 0 }, 
            { y: 0, opacity: 0.5, duration: 0.8, ease: 'power3.out' },
            '-=0.5'
        );
    }

    if (cta) {
        tl.fromTo(cta, 
            { y: 20, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
            '-=0.6'
        );
    }

    // Launch typing engine after main titles appear
    setTimeout(tickTyping, 1200);
}

/* ═══════════════════════════════════════════════
   TYPING ANIMATION ENGINE
═══════════════════════════════════════════════ */
const phrases = [
    "I'm a Tech Enthusiast.",
    "I'm an ML Engineer.",
    "I'm a Python Developer.",
    "I build Intelligent Software."
];

const typedEl = document.getElementById('typedText');
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;

const TYPE_SPEED = 68;
const DELETE_SPEED = 35;
const PAUSE_AFTER = 1700;
const PAUSE_BEFORE = 300;

function tickTyping() {
    if (!typedEl) return;
    const current = phrases[phraseIdx];

    if (!isDeleting) {
        charIdx++;
        typedEl.textContent = current.slice(0, charIdx);

        if (charIdx === current.length) {
            setTimeout(() => {
                isDeleting = true;
                tickTyping();
            }, PAUSE_AFTER);
            return;
        }
        setTimeout(tickTyping, TYPE_SPEED);
    } else {
        charIdx--;
        typedEl.textContent = current.slice(0, charIdx);

        if (charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            setTimeout(tickTyping, PAUSE_BEFORE);
            return;
        }
        setTimeout(tickTyping, DELETE_SPEED);
    }
}

/* ═══════════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════════ */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
}, { passive: true });

/* ═══════════════════════════════════════════════
   AWARDS-STYLE CURSOR & CANVAS TRAIL
═══════════════════════════════════════════════ */
const cursorEl = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
const trailCanvas = document.getElementById('cursorTrail');

let PARTICLE_COLOR = '91, 76, 245'; // Synced with active theme

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (window.matchMedia('(hover: hover)').matches && !isTouchDevice) {
    let mx = -100, my = -100;
    let cx = -100, cy = -100;

    window.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (cursorDot) {
            cursorDot.style.left = mx + 'px';
            cursorDot.style.top = my + 'px';
        }
    }, { passive: true });

    // Cursor ring lerped follow
    (function cursorLoop() {
        cx += (mx - cx) * 0.14;
        cy += (my - cy) * 0.14;
        if (cursorEl) {
            cursorEl.style.left = cx + 'px';
            cursorEl.style.top = cy + 'px';
        }
        requestAnimationFrame(cursorLoop);
    })();

    // Custom interactive hover triggers
    document.querySelectorAll('a, button, .flip-card, .skill-group, .theme-option').forEach((el) => {
        el.addEventListener('mouseenter', () => cursorEl && cursorEl.classList.add('cursor--hover'));
        el.addEventListener('mouseleave', () => cursorEl && cursorEl.classList.remove('cursor--hover'));
    });

    document.addEventListener('mousedown', () => cursorEl && cursorEl.classList.add('cursor--click'));
    document.addEventListener('mouseup', () => cursorEl && cursorEl.classList.remove('cursor--click'));

    // Canvas fluid ribbon trail
    if (trailCanvas) {
        const ctx = trailCanvas.getContext('2d');
        let points = [];
        const maxPoints = 24;

        function resizeCanvas() {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        window.addEventListener('mousemove', (e) => {
            points.push({ x: e.clientX, y: e.clientY, age: 0 });
        }, { passive: true });

        (function trailLoop() {
            ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

            // Update ages and filter out old points
            points.forEach(p => p.age++);
            points = points.filter(p => p.age < maxPoints);

            if (points.length > 1) {
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);

                for (let i = 1; i < points.length - 1; i++) {
                    const xc = (points[i].x + points[i + 1].x) / 2;
                    const yc = (points[i].y + points[i + 1].y) / 2;
                    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
                }

                ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, 0.15)`;
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke();
            }
            requestAnimationFrame(trailLoop);
        })();
    }
} else {
    if (cursorEl) cursorEl.style.display = 'none';
    if (cursorDot) cursorDot.style.display = 'none';
    if (trailCanvas) trailCanvas.style.display = 'none';
}

/* ═══════════════════════════════════════════════
   SPOTLIGHT MOUSE FOLLOW
═══════════════════════════════════════════════ */
const spotlightEl = document.getElementById('spotlight');

if (window.matchMedia('(hover: hover)').matches && !isTouchDevice && spotlightEl) {
    let slx = -300, sly = -300;

    window.addEventListener('mousemove', (e) => {
        slx += (e.clientX - slx) * 0.06;
        sly += (e.clientY - sly) * 0.06;
    }, { passive: true });

    (function spotlightLoop() {
        spotlightEl.style.left = slx + 'px';
        spotlightEl.style.top = sly + 'px';
        requestAnimationFrame(spotlightLoop);
    })();

    const darkSections = document.querySelectorAll('.hero, .services');
    const spotObserver = new IntersectionObserver(() => {
        const anyVisible = [...darkSections].some(s => {
            const r = s.getBoundingClientRect();
            return r.top < window.innerHeight && r.bottom > 0;
        });
        spotlightEl.style.opacity = anyVisible ? '1' : '0';
    }, { threshold: 0 });
    darkSections.forEach(s => spotObserver.observe(s));
} else if (spotlightEl) {
    spotlightEl.style.display = 'none';
}

/* ═══════════════════════════════════════════════
   MAGNETIC BUTTONS TILT EFFECT
═══════════════════════════════════════════════ */
if (window.matchMedia('(hover: hover)').matches && !isTouchDevice) {
    document.querySelectorAll('.mag-btn, .magnetic').forEach((el) => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Push button background and text slightly
            gsap.to(el, {
                x: x * 0.28,
                y: y * 0.28,
                rotationX: -y * 0.08,
                rotationY: x * 0.08,
                ease: 'power2.out',
                duration: 0.4
            });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                rotationX: 0,
                rotationY: 0,
                ease: 'elastic.out(1, 0.4)',
                duration: 0.8
            });
        });
    });
}

/* ═══════════════════════════════════════════════
   STATS COUNTER ANIMATION
═══════════════════════════════════════════════ */
function animateCounter(el, target, duration = 1400) {
    const start = performance.now();
    const update = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const numEl = entry.target.querySelector('.stat-num');
            if (numEl) {
                const target = parseInt(numEl.dataset.target, 10);
                animateCounter(numEl, target);
            }
            statObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach((el) => statObserver.observe(el));

/* ═══════════════════════════════════════════════
   CANVAS BACKGROUND PARTICLE NETWORK
═══════════════════════════════════════════════ */
const bgCanvas = document.getElementById('bgCanvas');
if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 55;
    let mouse = { x: null, y: null, radius: 160 };

    if (window.matchMedia('(hover: hover)').matches) {
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    function resize() {
        bgCanvas.width = window.innerWidth;
        bgCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => { resize(); initParticles(); });

    function randomBetween(a, b) { return a + Math.random() * (b - a); }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * bgCanvas.width,
                y: Math.random() * bgCanvas.height,
                r: randomBetween(1.2, 3.2),
                vx: randomBetween(-0.15, 0.15),
                vy: randomBetween(-0.15, 0.15),
                alpha: randomBetween(0.12, 0.4),
            });
        }
    }
    initParticles();

    function drawParticles() {
        ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${(1 - dist / 130) * 0.1})`;
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }

            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${(1 - dist / mouse.radius) * 0.22})`;
                    ctx.lineWidth = 0.9;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();

                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    particles[i].x += Math.cos(angle) * force * 1.6;
                    particles[i].y += Math.sin(angle) * force * 1.6;
                }
            }
        }

        particles.forEach((p) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${p.alpha})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -10) p.x = bgCanvas.width + 10;
            if (p.x > bgCanvas.width + 10) p.x = -10;
            if (p.y < -10) p.y = bgCanvas.height + 10;
            if (p.y > bgCanvas.height + 10) p.y = -10;
        });

        requestAnimationFrame(drawParticles);
    }
    drawParticles();
}

// Track reveals
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .section-header').forEach((el) => revealObserver.observe(el));

/* ═══════════════════════════════════════════════
   NAV SCROLL & ACTIVE INDICATORS
═══════════════════════════════════════════════ */
const nav = document.getElementById('nav');
const hero = document.getElementById('hero');

if (hero && nav) {
    const navScrollObserver = new IntersectionObserver(
        ([entry]) => nav.classList.toggle('scrolled', !entry.isIntersecting),
        { threshold: 0 }
    );
    navScrollObserver.observe(hero);
}

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

const activeLinkObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            navLinks.forEach((l) => l.classList.remove('active'));
            const active = document.querySelector(`.nav__link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach((s) => activeLinkObserver.observe(s));

/* ═══════════════════════════════════════════════
   MOBILE NAV TOGGLE
═══════════════════════════════════════════════ */
const navToggle = document.getElementById('navToggle');
if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
        nav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    
    document.querySelectorAll('.nav__link').forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ═══════════════════════════════════════════════
   SMOOTH LENIS-STYLE INNER ANCHOR SCROLLING
═══════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - (nav ? nav.offsetHeight : 64);
            
            // GSAP ScrollTo plugin feel using native JS scrollTo with custom easing
            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    });
});

/* ═══════════════════════════════════════════════
   CARD GLOW CURSOR POSITIONING
═══════════════════════════════════════════════ */
if (window.matchMedia('(hover: hover)').matches && !isTouchDevice) {
    document.querySelectorAll('.glow-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }, { passive: true });
    });
}

/* ═══════════════════════════════════════════════
   DYNAMIC COLOR THEMES
═══════════════════════════════════════════════ */
const themes = {
    indigo: {
        '--clr-accent': '#5b4cf5',
        '--clr-accent-2': '#9b59f5',
        '--clr-accent-glow': 'rgba(91, 76, 245, 0.18)',
        '--clr-accent-rgb': '91, 76, 245',
        '--clr-border': '#dddaf5',
        '--clr-tag-bg': '#eceaf9',
        '--orb-1': 'radial-gradient(circle at center, #a78bfa 0%, #7c3aed 40%, transparent 70%)',
        '--orb-2': 'radial-gradient(circle at center, #60a5fa 0%, #3b82f6 40%, transparent 70%)',
        '--orb-3': 'radial-gradient(circle at center, #f472b6 0%, #ec4899 40%, transparent 70%)',
        rgb: '91, 76, 245'
    },
    cyberpunk: {
        '--clr-accent': '#f43f5e',
        '--clr-accent-2': '#fb923c',
        '--clr-accent-glow': 'rgba(244, 63, 94, 0.18)',
        '--clr-accent-rgb': '244, 63, 94',
        '--clr-border': '#fecdd3',
        '--clr-tag-bg': '#ffe4e6',
        '--orb-1': 'radial-gradient(circle at center, #f43f5e 0%, #f43f5e 40%, transparent 70%)',
        '--orb-2': 'radial-gradient(circle at center, #fb923c 0%, #ea580c 40%, transparent 70%)',
        '--orb-3': 'radial-gradient(circle at center, #fb7185 0%, #e11d48 40%, transparent 70%)',
        rgb: '244, 63, 94'
    },
    emerald: {
        '--clr-accent': '#10b981',
        '--clr-accent-2': '#34d399',
        '--clr-accent-glow': 'rgba(16, 185, 129, 0.18)',
        '--clr-accent-rgb': '16, 185, 129',
        '--clr-border': '#d1fae5',
        '--clr-tag-bg': '#e6fbf2',
        '--orb-1': 'radial-gradient(circle at center, #34d399 0%, #059669 40%, transparent 70%)',
        '--orb-2': 'radial-gradient(circle at center, #6ee7b7 0%, #10b981 40%, transparent 70%)',
        '--orb-3': 'radial-gradient(circle at center, #a7f3d0 0%, #047857 40%, transparent 70%)',
        rgb: '16, 185, 129'
    },
    ocean: {
        '--clr-accent': '#00bcd4',
        '--clr-accent-2': '#0288d1',
        '--clr-accent-glow': 'rgba(0, 188, 212, 0.18)',
        '--clr-accent-rgb': '0, 188, 212',
        '--clr-border': '#e0f7fa',
        '--clr-tag-bg': '#e0f7fa',
        '--orb-1': 'radial-gradient(circle at center, #00bcd4 0%, #00acc1 40%, transparent 70%)',
        '--orb-2': 'radial-gradient(circle at center, #29b6f6 0%, #0288d1 40%, transparent 70%)',
        '--orb-3': 'radial-gradient(circle at center, #4dd0e1 0%, #00838f 40%, transparent 70%)',
        rgb: '0, 188, 212'
    }
};

function applyTheme(themeKey) {
    const root = document.documentElement;
    const theme = themes[themeKey];
    if (!theme) return;

    Object.keys(theme).forEach(key => {
        if (key !== 'rgb') {
            root.style.setProperty(key, theme[key]);
        }
    });

    PARTICLE_COLOR = theme.rgb;

    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.theme === themeKey);
    });

    localStorage.setItem('portfolio-accent-theme', themeKey);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('portfolio-accent-theme') || 'indigo';
    applyTheme(savedTheme);

    const themeSwitcher = document.getElementById('themeSwitcher');
    const themeBtn = document.getElementById('themeBtn');

    if (themeBtn && themeSwitcher) {
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            themeSwitcher.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            themeSwitcher.classList.remove('open');
        });
    }

    document.querySelectorAll('.theme-option').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            applyTheme(opt.dataset.theme);
            if (themeSwitcher) themeSwitcher.classList.remove('open');
        });
    });

    /* ═══════════════════════════════════════════════
       FLIP CARDS — MOBILE TOUCH TOGGLE
    ═══════════════════════════════════════════════ */
    document.querySelectorAll('.flip-card').forEach((card) => {
        let touchStartX = 0;
        let touchStartY = 0;

        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            if (e.target.closest('a')) return;

            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;

            const diffX = Math.abs(touchEndX - touchStartX);
            const diffY = Math.abs(touchEndY - touchStartY);

            // Only toggle flip if it was a clean tap, not a scroll drag
            if (diffX < 8 && diffY < 8) {
                e.preventDefault();
                card.classList.toggle('flipped');
            }
        }, { passive: false });
    });
});
