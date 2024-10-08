<script>
  import { auth } from "../../auth/firebase";
  import { onDestroy, onMount } from "svelte";
  import { goto, pushState } from "$app/navigation";
  import {
    createUserWithEmailAndPassword,
    getRedirectResult,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithRedirect,
    sendEmailVerification,
    sendSignInLinkToEmail,
  } from "firebase/auth";
  import ForgotPass from "./ForgotPass.svelte";
  import { FirebaseError } from "firebase/app";
  import { get } from "svelte/store";
  import {
    addHasPassword,
    noEmailSubs,
    refreshUserData,
    userStore,
  } from "$lib/stores/firebaseuser";
  import { page } from "$app/stores";
  import { sendPostRequest } from "$lib/shared/postpaying";
  import { CheckTurnstile } from "$lib/shared/turnstile";
  import { Turnstile } from "svelte-turnstile";
  import { CheckBoth, SetBothFalse } from "$lib/stores/userInfoStore";
  import TermsOfService from "../TermsOfService.svelte";
  import EmailLinkPop from "./EmailLinkPop.svelte";

  let loading = true;
  let waitingOnVerif = false;

  let signUp = false;
  let oldSignUp = true;

  let email = "";
  let password = "";

  let errorMessage = "";

  let isUserLoggedIn = false;
  let exUser = null;

  let forgotPass = false;

  let emailValid = false;
  let passwordActive = false;

  let allowsEmails = true;
  let tosOpen = false;
  let emailLinkPop = false;

  $: emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  $: hasMinimumLength = password.length >= 10;
  $: containsLetter = /[a-zA-Z]/.test(password);
  $: containsNumber = /\d/.test(password);

  $: isValidPassword = hasMinimumLength && containsLetter && containsNumber;

  $: if (signUp === oldSignUp) {
    swapSignUp();
  }

  let interval;

  getRedirectResult(auth)
    .then((result) => {
      if (result && result.user) {
        handleProceed();
      }
    })
    .catch((error) => {
      errorMessage = error.message;
    });

  function swapSignUp() {
    password = "";
    email = "";
    const url = new URL(window.location);
    if (signUp) {
      url.searchParams.set("new", "t");
    } else {
      url.searchParams.delete("new");
    }
    pushState(url.toString(), { replaceState: true });
    oldSignUp = !signUp;
  }

  function isCircleRedirTrue() {
    const queryParams = $page.url.searchParams;
    const circleRedir = queryParams.get("circleRedir");
    return queryParams.get("circleRedir") === "t";
  }

  async function handleProceed() {
    const queryParams = $page.url.searchParams;
    const circleRedir = queryParams.get("circleRedir");

    if (circleRedir === "t") {
      await sendPostRequest(false);
    }

    goto("/");
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

  function startEmailVerificationCheck() {
    if (!waitingOnVerif || interval) return;

    interval = setInterval(async () => {
      await refreshUserData();
      const user = get(userStore);
      console.log(user);

      if (user.emailVerified) {
        stopEmailVerificationCheck();
        handleProceed();
      } else {
        waitingOnVerif = true;
      }
    }, 5000);
  }

  function stopEmailVerificationCheck() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  async function signInFB() {
    if (!emailValid) {
      errorMessage = "Invalid email, please fill it correctly in to login";
      return;
    }
    loading = true;
    const continueVerif = await HandleTurnstile();
    if (!continueVerif) {
      loading = false;
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await addHasPassword();

      if (!user.emailVerified) {
        await sendVerificationEmail(user);
        exUser = user.email;
        waitingOnVerif = true;
        startEmailVerificationCheck();
      } else {
        await handleProceed();
      }
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        errorMessage = "No user with this email exists";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password for this user";
      } else {
        errorMessage = error.message;
      }
    } finally {
      loading = false;
    }
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
      return false, errorMessage;
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
    errorMessage = "Sent!";
  }

  async function signUpFB() {
    if (!emailValid || !isValidPassword) {
      errorMessage =
        "Invalid email and/or password, please fill those in correctly";
      return;
    }
    loading = true;
    const continueVerif = await HandleTurnstile();
    if (!continueVerif) {
      loading = false;
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await addHasPassword();

      if (!allowsEmails) {
        await noEmailSubs();
      }

      if (!user.emailVerified) {
        await sendVerificationEmail(user);
        exUser = user.email;
        waitingOnVerif = true;
        startEmailVerificationCheck();
      } else {
        handleProceed();
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        errorMessage =
          "Email already in use. Please login or use another email.";
      } else {
        errorMessage = err;
      }
    } finally {
      loading = false;
    }
  }

  async function logout() {
    await auth.signOut();
    stopEmailVerificationCheck();
    isUserLoggedIn = false;
    waitingOnVerif = false;
  }

  function loginWithGoogleRedirect() {
    var provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  }

  async function sendVerificationEmail(user) {
    if (user && user.email) {
      try {
        await sendEmailVerification(user);
      } catch (error) {
        errorMessage = error.message;
      }
    }
  }

  async function sendVerificationEmailFromStore() {
    const user = get(userStore);
    await sendVerificationEmail(user);
  }

  onMount(() => {
    const usub = userStore.subscribe(async (user) => {
      if (user === undefined) {
        return;
      }
      const queryParams = $page.url.searchParams;
      signUp = queryParams.has("new");

      if (user) {
        exUser = user.email;
        if (!user.emailVerified) {
          startEmailVerificationCheck();
          waitingOnVerif = true;
        } else {
          isUserLoggedIn = true;
          await CheckBoth();
        }
      } else {
        isUserLoggedIn = false;
        SetBothFalse();
      }
      loading = false;
    });

    return usub;
  });

  onDestroy(stopEmailVerificationCheck);
</script>

{#if loading}
  <div>loading...</div>
{:else if waitingOnVerif}
  <div class="logintxt">Verify your email before proceeeding</div>
  <div>
    We sent you an email with verification link{#if exUser}to the address <b
        >{exUser}</b
      >{/if}. Just click the link and this page will be automatically update to
    complete your sign in. No special code needed.
  </div>
  <button on:click={sendVerificationEmailFromStore}
    >Re-send verification email</button
  >
  <button on:click={logout}>Sign Out</button>
{:else if isUserLoggedIn}
  <div class="isloggedin">
    <div>
      You are already logged in{#if exUser}&nbsp;as {exUser}{/if}.
    </div>
    <div>Would you like to stay signed in?</div>
    <div class="isloggedbuttons">
      <button class="submit" on:click={handleProceed}>Definitely</button>
      <button class="submit" on:click={logout}>Sign out</button>
    </div>
  </div>
{:else}
  <div class="loginouter">
    {#if !signUp}
      <div class="logintxt">Sign in</div>
      <div class="signinopt">
        or <button
          class="link-button"
          type="button"
          on:click={() => (signUp = true)}>create an account</button
        >
      </div>
    {:else}
      <div class="logintxt">Sign up</div>
      <div class="signinopt">
        or <button
          class="link-button"
          type="button"
          on:click={() => (signUp = false)}>use an existing account</button
        >
      </div>
    {/if}
  </div>
  <form on:submit|preventDefault={() => (signUp ? signUpFB() : signInFB())}>
    {#if errorMessage}
      <p style="color: red;">{errorMessage}</p>
    {/if}
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
      <label class="hide" for="password">Password:</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        placeholder="Password"
        required
      />
    </div>
    <div>
      {#if !emailLinkPop}
        <Turnstile siteKey="0x4AAAAAAAiN0D-hYmv3ulQQ" />
      {/if}
    </div>
    {#if !signUp}
      <div>
        <button class="submit" type="submit">Sign In</button>
      </div>
    {:else}
      <div class="verif" class:complete={hasMinimumLength}>
        {#if hasMinimumLength}&check;{:else}&times;{/if} Password must be at least
        10 characters
      </div>
      <div class="verif" class:complete={containsLetter}>
        {#if containsLetter}&check;{:else}&times;{/if} Password must contain at least
        one letter
      </div>
      <div class="verif" class:complete={containsNumber}>
        {#if containsNumber}&check;{:else}&times;{/if} Password must contain at least
        one number
      </div>

      <label>
        <input type="checkbox" bind:checked={allowsEmails} />
        Allow Non-Essential Emails
      </label>

      <div>
        By creating an account, you agree to our <button
          class="link-button"
          on:click={() => (tosOpen = true)}>Terms of Service</button
        >
      </div>

      {#if isValidPassword && emailValid}
        <button class="submit" type="submit">Sign Up</button>
        <div class="verif complete">Ready to submit!</div>
      {:else}
        <button class="submit" type="button">Sign Up</button>
        {#if isValidPassword}
          <div class="verif">Please enter a valid email address</div>
        {:else}
          <div class="verif">Please complete all required fields</div>
        {/if}
      {/if}
    {/if}
    <div>
      <button
        class="link-button"
        type="button"
        on:click={() => (forgotPass = true)}>Forgot Password?</button
      >
    </div>
    {#if forgotPass}
      <ForgotPass {email} bind:open={forgotPass} />
    {/if}

    {#if emailLinkPop}
      <EmailLinkPop bind:email bind:open={emailLinkPop} />
    {/if}
  </form>

  {#if tosOpen}
    <TermsOfService bind:open={tosOpen} />
  {/if}

  <div class="bottomrow">
    <br>
    <div>--or--</div>
    <button on:click={() => (emailLinkPop = true)}
      >Authenticate with email link</button
    >
    <div>--or--</div>
    <a href="/">Use without an account</a>
  </div>
{/if}

<style>
  .link-button {
    background: none;
    border: none;
    color: var(--color-text);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
  }

  .link-button:hover,
  .link-button:focus {
    text-decoration: none;
  }

  .bottomrow {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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

  .logintxt {
    font-size: 48px;
  }

  .loginouter {
    display: flex;
    min-height: 40dvh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media (max-height: 700px) {
    .loginouter {
      min-height: 34.2857dvh;
    }
  }

  @media (max-height: 600px) {
    .loginouter {
      min-height: 28.5714dvh;
    }
  }

  @media (max-height: 500px) {
    .loginouter {
      min-height: 25dvh;
    }
  }

  @media (max-height: 400px) {
    .loginouter {
      min-height: fit-content;
    }
  }

  /* .submit {
    border-radius: 0px;
    transition: border-color 150ms ease-in-out 0s;
    outline: none;
    font-size: 16px;
    margin: 10px;
    padding-top: 6px;
    padding-bottom: 6px;
    padding-left: 12px;
    padding-right: 12px;
    border: 1px solid rgb(137, 151, 155);
    background-color: var(--main-color);
    color: black;
    font-weight: normal;
  }

  .submit:hover {
    background-color: aliceblue;
  } */

  button {
    cursor: pointer;
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

  input {
    border: 1px solid rgb(137, 151, 155);
    border-radius: 0px;
    transition: border-color 150ms ease-in-out 0s;
    outline: none;
    font-size: 16px;
    margin: 4px;
    padding-left: 10px;
    padding-right: 10px;
    min-width: min(444px, calc(100dvw - 50px));
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .isloggedin {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .isloggedbuttons {
    display: flex;
  }
</style>
