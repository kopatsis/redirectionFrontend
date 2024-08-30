<script>
    import { goto } from "$app/navigation";
    import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
    import { onMount } from "svelte";
    import { auth } from "../../../auth/firebase";
    import { page } from "$app/stores";

    async function fetchEmailById(id) {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${BACKEND_URL}/emailexchange/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Passcode-ID": import.meta.env.VITE_CHECK_PASSCODE,
                },
            });

            if (response.ok) {
                const data = await response.json();
                return data.email || "";
            } else {
                return "";
            }
        } catch (error) {
            return "";
        }
    }

    onMount(async () => {
        const slug = $page.params.slug;
        let email;
        if (slug) {
            let email = await fetchEmailById(slug);
            if (!email) {
                email = localStorage.getItem("CBEmailForSignIn");
            }
        } else {
            email = localStorage.getItem("CBEmailForSignIn");
        }

        if (email && isSignInWithEmailLink(auth, window.location.href)) {
            signInWithEmailLink(auth, email, window.location.href)
                .then(() => {
                    localStorage.removeItem("CBEmailForSignIn");
                    goto("./teststrict");
                })
                .catch((error) => {
                    console.error("Error signing in:", error);
                });
        }
    });
</script>

<div>
    <h1>Finishing Sign-In...</h1>
</div>
