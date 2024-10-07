<script>
  import { sendSignInLinkToEmail } from "firebase/auth";
  import Modal from "./Modal.svelte";
  import { auth } from "../../auth/firebase";
  import { CheckTurnstile } from "$lib/shared/turnstile";
  import { page } from "$app/stores";
  import { Turnstile } from "svelte-turnstile";

  export let open = true;
  export let email = "";

  let errorMessage = "";
  let success = false;
  let loading = false;

  let emailValid;
  $: emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  function isCircleRedirTrue() {
    const queryParams = $page.url.searchParams;
    const circleRedir = queryParams.get("circleRedir");
    return queryParams.get("circleRedir") === "t";
  }

  async function sendLink() {
    if (!emailValid) {
      errorMessage = "Invalid email, please fill it in to get a login link";
      return;
    }
    loading = true;
    const continueVerif = await HandleTurnstile();
    if (!continueVerif) {
      loading = false;
      return;
    }

    const actionCodeSettings = {
      url: `${window.location.protocol}//${window.location.host}/refer`,
      handleCodeInApp: true,
    };

    if (isCircleRedirTrue()) {
      actionCodeSettings.url += `/circleredir`;
    }
    const id = await fetchIdFromServer();
    if (id !== "") {
      actionCodeSettings.url += `/${id}`;
    }

    window.localStorage.setItem("CBEmailForSignIn", email);
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    loading = false;
    success = true;
  }

  async function HandleTurnstile() {
    const turnstileItem = document.querySelector(
      '[name="cf-turnstile-response"]'
    );
    if (turnstileItem === null || turnstileItem === undefined) {
      errorMessage = "Turnstile verification failed.)";
      return false;
    }
    const turnstileResponse = turnstileItem.value;
    if (!turnstileResponse) {
      errorMessage = "Turnstile verification failed.";
      return false;
    }
    const valid = await CheckTurnstile(email, turnstileResponse);
    if (valid === null) {
      errorMessage = "Cannot connect to our server to verify your request";
      return false;
    } else if (valid === false) {
      errorMessage =
        "Turnstile verification failed. Please try again (if you are not a bot)";
      return false;
    }
    return true;
  }
</script>

<Modal bind:open>
  <div class="closeline">
    <button class="link-button" on:click={() => (open = false)}>&times;</button>
  </div>

  {#if success}
    <div>Successfully sent authentication email to {email}</div>
  {/if}

  <div>
    Enter your email below and you will receive an email from us with a link.
    Once you click it, you'll be redirected back to this site. If you already
    have an account, you will be automatically signed in. If not, an
    account will be created and you'll be signed in with it.
  </div>

  <div>
    If you create an account with this method and want to switch to the
    traditional email + password as well, use the Add Password/Reset Password
    functiona from the main menu on the site's header after signing in.
  </div>

  <form on:submit|preventDefault={sendLink}>
    <div class="resethead">Send Email Link</div>
    <div>
      <label class="hide" for="email">Email:</label>
      <input
        id="email"
        type="email"
        bind:value={email}
        placeholder="Email"
        required
      />
    </div>

    <div>
        <Turnstile siteKey="0x4AAAAAAAiN0D-hYmv3ulQQ" />
    </div>

    <div>
      <button class="submit" type="submit">Send Sign In Link</button>
    </div>
    {#if loading}
        <div>loading...</div>
    {/if}
    {#if errorMessage}
      <p style="color: red;">{errorMessage}</p>
    {/if}
  </form>
</Modal>

<style>
    .link-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    font-size: 24px;
    color: var(--color-text);
  }

  .link-button:hover,
  .link-button:focus {
    background: none;
    color: var(--color-text);
  }

  .closeline {
    display: flex;
    justify-content: right;
    width: 100%;
  }
</style>