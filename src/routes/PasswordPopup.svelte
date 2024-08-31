<script>
    import { addPassword } from "$lib/stores/firebaseuser";
    import Modal from "./login/Modal.svelte";

    export let open = true;

    let password = "";

    let errorMessage = "";

    let emailValid = false;
    let success = false;

    $: emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    $: hasMinimumLength = password.length >= 10;
    $: containsLetter = /[a-zA-Z]/.test(password);
    $: containsNumber = /\d/.test(password);

    $: isValidPassword = hasMinimumLength && containsLetter && containsNumber;

    async function submitPassword() {
        const result = await addPassword(password);
        if (result === "Password added successfully!")   {
            success = true;
        } else {
            errorMessage = result;
        }
    }
</script>

<Modal bind:open>
    <div class="closeline">
        <button class="link-button" on:click={() => (open = false)}
            >&times;</button
        >
    </div>

    {#if success}
        <div>Thanks! You can now log in with email and password too</div>
    {:else}
        <div>
            Enter a password here so you can sign in with the traditional
            email/password as well
        </div>

        <div>
            <label class="hide" for="password">Password:</label>
            <input
                id="password"
                type="password"
                bind:value={password}
                placeholder="Password"
                required
            />
        </div>

        <div class="verif" class:complete={hasMinimumLength}>
            {#if hasMinimumLength}&check;{:else}&times;{/if} Password must be at
            least 10 characters
        </div>
        <div class="verif" class:complete={containsLetter}>
            {#if containsLetter}&check;{:else}&times;{/if} Password must contain
            at least one letter
        </div>
        <div class="verif" class:complete={containsNumber}>
            {#if containsNumber}&check;{:else}&times;{/if} Password must contain
            at least one number
        </div>

        {#if isValidPassword}
            <button class="submit" type="button" on:click={submitPassword}>Sign Up</button>
            <div class="verif complete">Ready to submit!</div>
        {:else}
            <button class="submit" type="button">Sign Up</button>
            <div class="verif">Please complete all required fields</div>
        {/if}

        {#if errorMessage}
            <div>{errorMessage}</div>
        {/if}
    {/if}
</Modal>
