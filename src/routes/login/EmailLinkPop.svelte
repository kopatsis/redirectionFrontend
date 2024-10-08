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

  async function fetchIdFromServer() {
    const API_URL = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await fetch(`${API_URL}/emailexchange`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Passcode-ID": import.meta.env.VITE_CHECK_PASSCODE,
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.id || "";
      } else {
        return "";
      }
    } catch (error) {
      return "";
    }
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

  <div class="resethead">Email Link Authentication</div>
  <br />

  <div class="expl">
    Enter your email below and you will receive an email from us with a link.
    Click it and you'll be signed into your account if you already have one, if
    not one will be created for you.
  </div>

  <br />
  <div class="expl">
    If you create an account with this method and want to use email + password
    as well, use the Add Password/Reset Password function from the main menu on
    the site's header after signing in.
  </div>

  <form on:submit|preventDefault={sendLink}>
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
        <br>
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

  .resethead {
    font-size: 24px;
	margin-bottom: 15px;
  }

  .expl {
	font-size: 0.85em;
	font-family: "Poppins" Arial, Helvetica, sans-serif;
  }

  button {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    border: none;
  }

  button:focus,
  button:hover {
    background: var(--color-theme-1);
    color: white;
    outline: none;
  }

  .closeline {
    display: flex;
    justify-content: right;
    width: 100%;
  }

  input {
    border: 1px solid rgb(137, 151, 155);
    border-radius: 0px;
    transition: border-color 150ms ease-in-out 0s;
    outline: none;
    font-size: 16px;
    margin: 20px;
    padding-left: 10px;
    padding-right: 10px;
	min-width: min(90dvw, 420px);
  }

  .hide {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    border: 0;
    clip: rect(0, 0, 0, 0);
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
