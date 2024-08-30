<script>
  import { auth } from "../../auth/firebase";
  import { onDestroy, onMount } from "svelte";
  import { goto } from "$app/navigation";
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
  import { refreshUserData, userStore } from "$lib/stores/firebaseuser";

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

  $: emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  $: hasMinimumLength = password.length >= 10;
  $: containsLetter = /[a-zA-Z]/.test(password);
  $: containsNumber = /\d/.test(password);

  $: isValidPassword = hasMinimumLength && containsLetter && containsNumber;

  $: if (signUp === oldSignUp) {
    password = "";
    oldSignUp = !signUp;
  }

  let interval;

  getRedirectResult(auth)
    .then((result) => {
      console.log("uysdfasdfasdfsa");
      console.log("uysdfasdfasdfsa");
      console.log("uysdfasdfasdfsa");
      console.log("uysdfasdfasdfsa");
      console.log("uysdfasdfasdfsa");
      console.log(result);
      if (result && result.user) {
        goto("./teststrict");
      }
    })
    .catch((error) => {
      console.log(error);
      errorMessage = error.message;
    });

  function startEmailVerificationCheck() {
    if (!waitingOnVerif || interval) return;

    interval = setInterval(async () => {
      await refreshUserData();
      const user = get(userStore);
      console.log(user);

      if (user.emailVerified) {
        stopEmailVerificationCheck();
        goto("./teststrict");
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
    loading = true;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendVerificationEmail(user);
        exUser = user.email;
        waitingOnVerif = true;
        startEmailVerificationCheck();
      } else {
        goto("./teststrict");
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

async function sendLink() {
    const actionCodeSettings = {
      url: "http://localhost:5173/refer",
      handleCodeInApp: true,
    };

    window.localStorage.setItem("CBEmailForSignIn", email);
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    errorMessage = "Sent!"
  }

  async function signUpFB() {
    loading = true;
    if (isValidPassword && emailValid) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (!user.emailVerified) {
          await sendVerificationEmail(user);
          exUser = user.email;
          waitingOnVerif = true;
          startEmailVerificationCheck();
        } else {
          goto("./teststrict");
        }
      } catch (err) {
        if (err.code === "auth/email-already-in-use") {
          errorMessage = "Email already in use. Please login or use another email.";
        } else {
          errorMessage = err;
        }
      } finally {
        loading = false;
      }
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

  function proceed() {
    goto("./teststrict");
  }

  onMount(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        exUser = user.email;
        if (!user.emailVerified) {
          startEmailVerificationCheck();
          waitingOnVerif = true;
        }
        isUserLoggedIn = true;
      } else {
        isUserLoggedIn = false;
      }
    });
    loading = false;
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
      <button class="submit" on:click={proceed}>Definitely</button>
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
  </form>

  <div>--or--</div>
  <button on:click={sendLink}>Authenticate with email link</button>
  <div>--or--</div>
  <button on:click={proceed}>Use without an account</button>
{/if}

<style>
  .link-button {
    background: none;
    border: none;
    color: rgb(59, 59, 59);
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

  .submit {
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
  }

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
