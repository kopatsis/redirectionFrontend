<script>
    import { getRealToken } from "$lib/stores/firebaseuser";
    import { Turnstile } from "svelte-turnstile";

    export let email = "";
    let success = false;
    let message = '';

    async function submitForm(event) {
        try {
            const url =
                import.meta.env.VITE_PAY_URL || "https://pay.shortentrack.com";
            const form = event.target;
            const formData = new FormData(form);
            const token = await getRealToken();

            const response = await fetch(`${url}/administrative/helpemail`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();
            message = data.message || "Form submitted successfully!";
        } catch (error) {
            message = "Failed to send the email. Please close and try again later.";
        } finally {
            success = true;
        }
    }
</script>

{#if message}   
    <div>{message}</div>
{/if}

{#if !success}
    <form on:submit|preventDefault={submitForm}>
        <div>
            <label for="name">Name:</label>
            <input type="text" id="name" />
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" value={email} />
        </div>

        <div>
            <label for="subject">Subject:</label>
            <input type="text" id="subject" />
        </div>
        <div>
            <label for="body">Body:</label>
            <textarea id="body"></textarea>
        </div>

        <div>
            <Turnstile siteKey="0x4AAAAAAAiN0D-hYmv3ulQQ" />
        </div>

        <button type="submit">Send</button>
    </form>
{/if}