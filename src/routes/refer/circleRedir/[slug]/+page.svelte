<script>
    import { goto } from "$app/navigation";
    import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
    import { onMount } from "svelte";
    import { auth } from "../../../../auth/firebase";
    import { page } from "$app/stores";
    import { sendPostRequest } from "$lib/shared/postpaying";

    let error = "";

    async function fetchEmailById(id) {
        const API_URL = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${API_URL}/emailexchange/${id}`, {
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
            email = await fetchEmailById(slug);

            if (!email) {
                email = localStorage.getItem("CBEmailForSignIn");
            } 
        } else {
            email = localStorage.getItem("CBEmailForSignIn");
        }

        if (email && isSignInWithEmailLink(auth, window.location.href)) {
            try {
                await signInWithEmailLink(auth, email, window.location.href);
                localStorage.removeItem("CBEmailForSignIn");
                localStorage.removeItem("HASPASS");

                const worked = await sendPostRequest(false);
                if (!worked) {
                    error = "Unable to redirect to original login page";
                } else {
                    goto("/teststrict");
                }
            } catch (err) {
                error = "Error, could not sign in: " + err
            }
        }
    });
</script>

<div>
    {#if !error}
        <h1>Finishing Sign-In...</h1>
    {:else}
        {error}
    {/if}
</div>