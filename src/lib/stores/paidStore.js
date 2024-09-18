import { get, writable } from "svelte/store";
import { userStore } from "./firebaseuser";

export const paidStore = writable(null);

export async function CheckPay() {
    let user = get(userStore);

    let tr = 0;
    while (user === undefined) {
        tr++
        if (tr > 10) {
            paidStore.set(false)
            return
        }
        await sleep();
        let user = get(userStore)
    }

    if (user === null || !user || !user.email || !user.emailVerified || !user.uid) {
        paidStore.set(false)
        return
    }

    const checkURL = import.meta.env.VITE_PAY_URL || 'https://pay.shortentrack.com';
    const passcode = import.meta.env.VITE_CHECK_PASSCODE;

    if (!passcode) {
        paidStore.set(false)
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
            paidStore.set(false)
            return
        }

        const result = await response.json();
        paidStore.set(result.paying === true);

    } catch {
        paidStore.set(false)
    }
}

function sleep() {
    return new Promise(resolve => setTimeout(resolve, 333));
  }