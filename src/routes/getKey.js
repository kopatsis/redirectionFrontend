export async function getKey() {
    if (!getCookie('userKey')) {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

        const response = await fetch(`${BACKEND_URL}/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `userKey=${data.key}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/; SameSite=None; Secure`;
        } else {
            throw new Error('Failed to fetch the key');
        }
    }
}

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) return value;
    }
}
