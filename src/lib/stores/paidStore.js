import { get, writable } from "svelte/store";
import { userStore } from "./firebaseuser";

const paid = writable(false);

export async function CheckPay() {
    let user = get(userStore);

    let tr = 0;
    while (user === undefined) {
        tr++
        if (tr > 10) {
            paid.set(false)
            return
        }
        await sleep();
        let user = get(userStore)
    }

    if (user === null || !user || !user.email || !user.emailVerified || !user.uid) {
        paid.set(false)
        return
    }

    const checkURL = import.meta.env.VITE_PAY_URL || 'https://pay.shortentrack.com';
    const passcode = import.meta.env.VITE_CHECK_PASSCODE;

    if (!passcode) {
        paid.set(false)
        return
    }

    const url = `${checkURL}/check/${user.uid}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Passcode-ID': passcode
            }
        });

        if (!response.ok) {
            paid.set(false)
            return
        }

        const result = await response.json();
        paid.set(result.paying === true);

    } catch {
        paid.set(false)
    }
}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 250));
  }