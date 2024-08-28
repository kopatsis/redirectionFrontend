async function CheckPaymentStatus(userId) {
    const checkURL = import.meta.env.VITE_PAY_URL || 'https://pay.shortentrack.com';
    const passcode = import.meta.env.VITE_CHECK_PASSCODE;

    if (!passcode) {
        return [false, false];
    }

    const url = `${checkURL}/check/${userId}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Passcode-ID': passcode
            }
        });

        if (!response.ok) {
            if (response.status === 400 || response.status === 500) {
                return [false, false];
            }
            return [false, false];
        }

        const result = await response.json();
        return [result.paying === true, true];

    } catch {
        return [false, false];
    }
}
