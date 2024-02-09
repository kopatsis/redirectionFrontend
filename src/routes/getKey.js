export async function getKey() {
    let key = parseInt(localStorage.getItem('CS361Key'));

    if (!key) {
        // If the key is not found in localStorage, make a POST request to get a new key
        const response = await fetch('http://cs361a.wl.r.appspot.com/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            key = data.key;
            // Store the new key in localStorage
            localStorage.setItem('CS361Key', key.toString());
        } else {
            throw new Error('Failed to fetch the key');
        }
    }

    return key;
}