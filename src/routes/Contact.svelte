<script>
    export let email = "";
    let name = "";
    let subject = "";
    let body = "";
    let message = "";
    let success = false;
    let turnstileToken = "";

    async function submitForm() {
        try {
            const response = await fetch("/helpemail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    body,
                    "cf-turnstile-response": turnstileToken,
                }),
            });

            if (!response.ok) {
                throw new Error();
            }

            const data = await response.json();
            message = data.message || "Form submitted successfully!";
        } catch (error) {
            message = "Failed to send the email. Please try again later.";
        } finally {
            success = true;
        }
    }
</script>

{#if !success}
    <form on:submit|preventDefault={submitForm}>
        <div>
            <label for="name">Name:</label>
            <input type="text" id="name" bind:value={name} />
        </div>
        <div>
            <label for="email">Email:</label>
            <input type="email" id="email" bind:value={email} />
        </div>

        <div>
            <label for="subject">Subject:</label>
            <input type="text" id="subject" bind:value={subject} />
        </div>
        <div>
            <label for="body">Body:</label>
            <textarea id="body" bind:value={body}></textarea>
        </div>

        <!-- <div class="cf-turnstile" use:turnstile on:change={e => turnstileToken = e.detail.token} data-sitekey="0x4AAAAAAAiN0D-hYmv3ulQQ"></div> -->

        <button type="submit">Send</button>
    </form>
{/if}

{#if success}
    <div>{message}</div>
{/if}
