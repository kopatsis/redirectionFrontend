export async function CheckTurnstile(email, TSR) {
    const checkURL = import.meta.env.VITE_PAY_URL || 'https://pay.shortentrack.com';
    const passcode = import.meta.env.VITE_CHECK_PASSCODE;

    if (!passcode) {
        return null;
    }

    const url = `${checkURL}/verifyturn`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-Passcode-ID': passcode
            },
            body: JSON.stringify({email: email, "cf-turnstile-response": TSR})
        });

        if (response.status === 401) return false;
        if (response.status === 204) return true;
        return null;

    } catch {
        return null;
    }
}