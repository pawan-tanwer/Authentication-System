const RESEND_API_URL = "https://api.resend.com/emails";

const sendMail = async ({ to, subject, html, text }) => {
    const { RESEND_API_KEY, EMAIL_FROM } = process.env;

    if (!RESEND_API_KEY) {
        throw new Error("Email is not configured: set RESEND_API_KEY.");
    }

    if (!EMAIL_FROM) {
        throw new Error("Email is not configured: set EMAIL_FROM to a verified sender.");
    }

    const response = await fetch(RESEND_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: EMAIL_FROM,
            to,
            subject,
            html,
            text,
        }),
        signal: AbortSignal.timeout(15000),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        const detail = result?.message || result?.name || `HTTP ${response.status}`;
        throw new Error(`Email provider rejected the message: ${detail}`);
    }

    return result;
};

module.exports = { sendMail };
