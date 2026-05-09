const ALLOWED_ENQUIRY_TYPES = new Set(['Residential', 'Commercial', 'General Enquiry']);
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        }
    });
}

function sanitizeText(value, maxLength) {
    return String(value || '')
        .replace(/\r/g, '')
        .trim()
        .slice(0, maxLength);
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export async function POST(request) {
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const toEmailList = (process.env.CONTACT_TO_EMAIL || '')
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);

    if (!resendApiKey || !fromEmail || toEmailList.length === 0) {
        return jsonResponse({ error: 'Email service is not configured.' }, 500);
    }

    let payload;

    try {
        payload = await request.json();
    } catch {
        return jsonResponse({ error: 'Invalid request body.' }, 400);
    }

    if (sanitizeText(payload.company, 200)) {
        return jsonResponse({ ok: true }, 200);
    }

    const name = sanitizeText(payload.name, 120);
    const phone = sanitizeText(payload.phone, 40);
    const email = sanitizeText(payload.email, 160);
    const message = sanitizeText(payload.message, 4000);
    const enquiryType = ALLOWED_ENQUIRY_TYPES.has(payload.enquiry_type)
        ? payload.enquiry_type
        : 'General Enquiry';

    if (name.length < 2) {
        return jsonResponse({ error: 'Name is required.' }, 400);
    }

    if (phone.length < 7) {
        return jsonResponse({ error: 'Phone is required.' }, 400);
    }

    if (!EMAIL_REGEX.test(email)) {
        return jsonResponse({ error: 'A valid email is required.' }, 400);
    }

    if (message.length < 10) {
        return jsonResponse({ error: 'Message is required.' }, 400);
    }

    const html = `
        <h2>New enquiry from Atharva Enterprises website</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Enquiry Type:</strong> ${escapeHtml(enquiryType)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
    `;

    const text = [
        'New enquiry from Atharva Enterprises website',
        `Name: ${name}`,
        `Phone: ${phone}`,
        `Email: ${email}`,
        `Enquiry Type: ${enquiryType}`,
        'Message:',
        message
    ].join('\n');

    const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: fromEmail,
            to: toEmailList,
            reply_to: email,
            subject: `New ${enquiryType} enquiry from ${name}`,
            html,
            text
        })
    });

    if (!resendResponse.ok) {
        const resendError = await resendResponse.text();
        return jsonResponse({ error: 'Failed to send email.', details: resendError }, 502);
    }

    return jsonResponse({ ok: true });
}

export function GET() {
    return jsonResponse({ error: 'Method not allowed.' }, 405);
}
