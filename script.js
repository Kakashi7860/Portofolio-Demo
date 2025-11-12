// Main interactions: typing, theme toggle, observers, filters, parallax
document.addEventListener('DOMContentLoaded', function () {
	/* ---------- Theme toggle (persisted) ---------- */
	const themeToggle = document.getElementById('theme-toggle');
	const activeTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
	const setTheme = (t) => {
		if (t === 'dark') document.body.classList.add('theme-dark'); else document.body.classList.remove('theme-dark');
		localStorage.setItem('theme', t);
		if (themeToggle) themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
	};
	setTheme(activeTheme);
	if (themeToggle) themeToggle.addEventListener('click', () => setTheme(document.body.classList.contains('theme-dark') ? 'light' : 'dark'));

	/* ---------- Typing animation with fade between words ---------- */
	(function typingFade() {
		const roles = ["Full Stack Developer", "Java Developer", "Technical Trainer"];
		const typedTextEl = document.getElementById('typed-text');
		if (!typedTextEl) return;
		const TYPING_SPEED = 70;
		const HOLD_DELAY = 1400;
		let roleIndex = 0;

		function typeWord(word, cb) {
			let i = 0;
			typedTextEl.style.opacity = '1';
			typedTextEl.textContent = '';
			function step() {
				if (i < word.length) {
					typedTextEl.textContent += word.charAt(i++);
					setTimeout(step, TYPING_SPEED);
				} else {
					setTimeout(() => {
						// fade out, then callback
						typedTextEl.style.transition = 'opacity 0.45s ease';
						typedTextEl.style.opacity = '0';
						setTimeout(() => {
							typedTextEl.style.opacity = '1';
							cb();
						}, 480);
					}, HOLD_DELAY);
				}
			}
			step();
		}

		function next() {
			const word = roles[roleIndex];
			typeWord(word, () => {
				roleIndex = (roleIndex + 1) % roles.length;
				next();
			});
		}
		next();
	})();

	/* ---------- Animate skill bars when About enters view ---------- */
	const skillFills = document.querySelectorAll('.skill-fill');
	if ('IntersectionObserver' in window && skillFills.length) {
		const skillsObserver = new IntersectionObserver((entries, obs) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					skillFills.forEach(fill => {
						const pct = fill.getAttribute('data-fill') || fill.dataset.fill || '0';
						fill.style.width = pct + '%';
					});
					obs.disconnect();
				}
			});
		}, { threshold: 0.25 });
		const about = document.getElementById('about');
		if (about) skillsObserver.observe(about);
	} else {
		// fallback: set widths immediately
		skillFills.forEach(fill => { const pct = fill.getAttribute('data-fill') || '0'; fill.style.width = pct + '%'; });
	}

	/* ---------- Project filtering ---------- */
	const filterBtns = document.querySelectorAll('.filter-btn');
	const projectCards = document.querySelectorAll('.project-card');
	filterBtns.forEach(btn => btn.addEventListener('click', (e) => {
		const filter = btn.getAttribute('data-filter');
		filterBtns.forEach(b=>b.classList.remove('active'));
		btn.classList.add('active');
		projectCards.forEach(card => {
			const tags = (card.dataset.tags || '').split(',').map(s=>s.trim());
			if (filter === 'all' || tags.includes(filter)) {
				card.classList.remove('hidden');
			} else {
				card.classList.add('hidden');
			}
		});
	}));

	/* ---------- Project card reveal on scroll ---------- */
	if ('IntersectionObserver' in window && projectCards.length) {
		const cardObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.remove('hidden');
					entry.target.style.transitionDelay = '0.06s';
					cardObserver.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15 });
		projectCards.forEach(c => cardObserver.observe(c));
	}

	/* ---------- Simple parallax for hero decor ---------- */
	const heroDecor = document.querySelector('.hero-decor');
	if (heroDecor) {
		window.addEventListener('scroll', () => {
			const y = window.scrollY * 0.08;
			heroDecor.style.transform = `translateY(${y}px)`;
		}, { passive: true });
	}
});

// Contact form handling: validate and show a success message (no server)
document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('contact-form');
	if (!form) return;

	form.addEventListener('submit', function (e) {
		e.preventDefault();
		const firstName = document.getElementById('firstName').value.trim();
		const email = document.getElementById('email').value.trim();
		const message = document.getElementById('message').value.trim();

		// basic validation
		if (firstName === '' || email === '' || message === '') {
			showTemporaryMessage('Please fill in your name, email and message.', true);
			return;
		}

		// simulate submit success
		showTemporaryMessage('Thanks — your message has been sent!', false);
		form.reset();
	});

	function showTemporaryMessage(text, isError) {
		const msg = document.createElement('div');
		msg.className = 'contact-toast';
		msg.textContent = text;
		if (isError) msg.style.background = '#ffecec';
		document.body.appendChild(msg);
		setTimeout(() => { msg.style.opacity = '1'; }, 20);
		setTimeout(() => { msg.style.opacity = '0'; setTimeout(()=>msg.remove(),300); }, 3500);
	}
});