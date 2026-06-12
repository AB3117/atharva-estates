const contactForm = document.getElementById('contact-form');

if (contactForm) {
    const submitButton = document.getElementById('contact-submit-btn');
    const statusMessage = document.getElementById('contact-form-status');

    const setStatus = (message, tone = '') => {
        if (!statusMessage) {
            return;
        }

        statusMessage.textContent = message;
        statusMessage.className = 'contact-form-status';

        if (tone) {
            statusMessage.classList.add(`is-${tone}`);
        }
    };

    const setSubmitting = (isSubmitting) => {
        if (!submitButton) {
            return;
        }

        submitButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? 'Submitting...' : 'Submit';
    };

    const validateForm = (payload) => {
        if (!payload.name || payload.name.trim().length < 2) {
            return 'Please enter your name.';
        }

        if (!payload.phone || payload.phone.trim().length < 7) {
            return 'Please enter a valid phone number.';
        }

        if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
            return 'Please enter a valid email address.';
        }

        if (!payload.message || payload.message.trim().length < 10) {
            return 'Please enter a short message with at least 10 characters.';
        }

        return '';
    };

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const payload = {
            name: (formData.get('name') || '').toString().trim(),
            phone: (formData.get('phone') || '').toString().trim(),
            email: (formData.get('email') || '').toString().trim(),
            enquiry_type: (formData.get('enquiry_type') || 'General Enquiry').toString().trim(),
            message: (formData.get('message') || '').toString().trim(),
            company: (formData.get('company') || '').toString().trim()
        };

        const validationError = validateForm(payload);
        if (validationError) {
            setStatus(validationError, 'error');
            return;
        }

        setSubmitting(true);
        setStatus('Sending your enquiry...', 'pending');

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(result.error || 'Unable to send your enquiry right now.');
            }

            contactForm.reset();

            const enquiryTypeInput = document.getElementById('contact-enquiry-type');
            const enquiryChips = Array.from(document.querySelectorAll('.enquiry-chip'));

            if (enquiryTypeInput) {
                enquiryTypeInput.value = 'Real Estate';
            }

            enquiryChips.forEach((chip) => {
                const isDefault = chip.dataset.enquiryValue === 'Real Estate';
                chip.classList.toggle('is-active', isDefault);
                chip.setAttribute('aria-pressed', isDefault ? 'true' : 'false');
            });

            setStatus('Thanks. Your enquiry has been sent.', 'success');
        } catch (error) {
            setStatus(error.message || 'Unable to send your enquiry right now.', 'error');
        } finally {
            setSubmitting(false);
        }
    });
}
