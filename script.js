// Typing animation for the hero subtitle
document.addEventListener('DOMContentLoaded', function () {
	const roles = ["Full Stack Developer", "Java Developer", "Technical Trainer"];
	const typedTextEl = document.getElementById('typed-text');
	const cursorEl = document.querySelector('.cursor');

	let roleIndex = 0;
	let charIndex = 0;
	let typing = true;

	const TYPING_SPEED = 80; // ms per char
	const BACKSPACE_SPEED = 40; // ms per char
	const HOLD_DELAY = 1500; // how long to keep the full word

	function type() {
		const current = roles[roleIndex];
		if (typing) {
			if (charIndex < current.length) {
				typedTextEl.textContent += current.charAt(charIndex);
				charIndex++;
				setTimeout(type, TYPING_SPEED);
			} else {
				// word complete
				typing = false;
				setTimeout(type, HOLD_DELAY);
			}
		} else {
			// backspace
			if (charIndex > 0) {
				typedTextEl.textContent = current.substring(0, charIndex - 1);
				charIndex--;
				setTimeout(type, BACKSPACE_SPEED);
			} else {
				// move to next word
				roleIndex = (roleIndex + 1) % roles.length;
				typing = true;
				setTimeout(type, 200);
			}
		}
	}

	// small fade when switching to next role for smoothness
	function startTyping() {
		typedTextEl.classList.add('typed-fade');
		type();
	}

	startTyping();
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