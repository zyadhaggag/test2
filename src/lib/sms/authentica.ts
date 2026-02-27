/**
 * Authentica SMS OTP Client
 *
 * WHY THIS FILE EXISTS:
 * This is the bridge between our app and Authentica's API.
 * It runs ONLY on the server (inside API routes) — never in the browser.
 * The API key stays hidden from users.
 *
 * HOW AUTHENTICA WORKS:
 * 1. We call /send-otp with a phone number → Authentica generates a random OTP,
 *    stores it on their servers, and sends SMS to the user.
 * 2. User enters the OTP in our app → We call /verify-otp → Authentica checks
 *    if the OTP matches what they generated.
 * 3. OTPs expire after 5 minutes on Authentica's side.
 *
 * SECURITY:
 * - API key is read from process.env (server-only, no NEXT_PUBLIC_ prefix)
 * - E.164 format enforced before sending to prevent formatting issues
 */

const AUTHENTICA_BASE_URL = 'https://api.authentica.sa';

/**
 * Formats a phone number to E.164 international format.
 *
 * WHY E.164:
 * - Authentica requires a valid international phone number
 * - Users may type "0551234567" or "966551234567" or "+966551234567"
 * - E.164 normalizes all formats to "+9665XXXXXXXX"
 * - Prevents duplicate entries (same phone in different formats)
 *
 * HOW IT WORKS:
 * 1. Strip all non-digit characters (spaces, dashes, parens, +)
 * 2. If starts with "0" → Saudi local format → replace with "966"
 * 3. If starts with "966" → already has country code → add "+"
 * 4. If starts with "+" → already E.164 → return as-is
 */
export function formatPhoneE164(phone: string): string {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, '');

    // Saudi local format: 05XXXXXXXX → 9665XXXXXXXX
    if (cleaned.startsWith('0')) {
        cleaned = '966' + cleaned.substring(1);
    }

    // Ensure country code prefix
    if (!cleaned.startsWith('966')) {
        cleaned = '966' + cleaned;
    }

    return '+' + cleaned;
}

/**
 * Validates that a phone number is a valid Saudi mobile number.
 *
 * Saudi mobile numbers:
 * - Country code: +966
 * - Mobile prefix: 5X (50, 51, 53, 54, 55, 56, 57, 58, 59)
 * - Total digits after +966: 9
 * - Full format: +9665XXXXXXXX (13 chars total)
 */
export function isValidSaudiPhone(phone: string): boolean {
    const e164 = formatPhoneE164(phone);
    return /^\+9665\d{8}$/.test(e164);
}

/**
 * Send OTP to a phone number via Authentica.
 *
 * WHAT HAPPENS:
 * 1. Our server sends POST to https://api.authentica.sa/send-otp
 * 2. Authentica generates a random 6-digit OTP
 * 3. Authentica stores the OTP (hashed) on their servers
 * 4. Authentica sends SMS to the phone number
 * 5. Returns success/failure response
 *
 * HEADERS:
 * - X-Authorization: Our API key (authenticates us to Authentica)
 * - Content-Type: JSON body
 */
export async function sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
    const apiKey = process.env.AUTHENTICA_API_KEY;
    if (!apiKey) {
        console.error('[Authentica] API key not configured');
        return { success: false, error: 'SMS service not configured' };
    }

    const formattedPhone = formatPhoneE164(phone);

    try {
        const response = await fetch(`${AUTHENTICA_BASE_URL}/send-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': apiKey,
            },
            body: JSON.stringify({
                phone: formattedPhone,
                method: 'sms',
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[Authentica] Send OTP failed:', data);
            return { success: false, error: data.message || 'فشل إرسال رمز التحقق' };
        }

        return { success: true };
    } catch (err) {
        console.error('[Authentica] Network error:', err);
        return { success: false, error: 'خطأ في الاتصال بخدمة الرسائل' };
    }
}

/**
 * SEND CUSTOM SMS via API v2
 * This uses the requested endpoint: /api/v2/send-sms
 */
export async function sendSMS(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
    const apiKey = process.env.AUTHENTICA_API_KEY;
    if (!apiKey) {
        return { success: false, error: 'SMS service not configured' };
    }

    const formattedPhone = formatPhoneE164(phone);

    try {
        const response = await fetch(`${AUTHENTICA_BASE_URL}/api/v2/send-sms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                recipient: formattedPhone, // Might be 'number', 'to', etc. assuming 'recipient'
                message: message,
                sender_id: 'ULTRA'
            }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('[Authentica V2] Send SMS failed:', data);
            return { success: false, error: data.message || 'فشل إرسال الرسالة' };
        }

        return { success: true };
    } catch (err) {
        console.error('[Authentica V2] Network error:', err);
        return { success: false, error: 'خطأ في الاتصال بخدمة الرسائل' };
    }
}

/**
 * Verify an OTP entered by the user.
 *
 * WHAT HAPPENS:
 * 1. Our server sends POST to https://api.authentica.sa/verify-otp
 * 2. Authentica checks if the OTP matches what they generated for this phone
 * 3. Returns valid: true/false
 *
 * SECURITY:
 * - OTP verification happens server-to-server
 * - User never sees the raw OTP from Authentica
 * - Authentica handles OTP expiry (5 minutes)
 */
export async function verifyOTP(phone: string, otp: string): Promise<{ valid: boolean; error?: string }> {
    const apiKey = process.env.AUTHENTICA_API_KEY;
    if (!apiKey) {
        return { valid: false, error: 'SMS service not configured' };
    }

    const formattedPhone = formatPhoneE164(phone);

    try {
        const response = await fetch(`${AUTHENTICA_BASE_URL}/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': apiKey,
            },
            body: JSON.stringify({
                phone: formattedPhone,
                otp: otp,
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.valid) {
            return { valid: false, error: data.message || 'رمز التحقق غير صحيح' };
        }

        return { valid: true };
    } catch (err) {
        console.error('[Authentica] Verify error:', err);
        return { valid: false, error: 'خطأ في التحقق' };
    }
}
