<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import github from "$lib/images/github.svg";
  import {
    emailVerifEmail,
    hasPassword,
    userStore,
  } from "$lib/stores/firebaseuser";
  import { sendPostRequest } from "$lib/shared/postpaying";
  import Modal from "./login/Modal.svelte";
  import Contact from "./Contact.svelte";
  import PasswordPopup from "./PasswordPopup.svelte";
  import { auth } from "../auth/firebase";
  import { sendPasswordResetEmail } from "firebase/auth";
  import CookiePop from "./CookiePop.svelte";
  import { hasPasswordStore } from "$lib/stores/userInfoStore";
  import loginLogo from "$lib/images/loginR-awhite.png";
  import loginLogoBright from "$lib/images/loginR-bright.png";

  let user = undefined;
  let dropdown = false;

  let errorMess = false;

  let contactModal = false;
  let cookieModal = false;

  let needsPass = false;
  let sentReset = false;

  let sentVerif = false;
  let verifError = false;

  let logo = loginLogo;

  async function logout() {
    await auth.signOut();
    dropdown = false;
  }

  function swapDrop() {
    dropdown = !dropdown;
    sentReset = false;
    sentVerif = false;
    verifError = false;
    errorMess = false;
    if (dropdown) {
      logo = loginLogoBright;
    } else {
      logo = loginLogo;
    }
  }

  $: if ($page.url.pathname) {
    dropdown = false;
    sentReset = false;
    sentVerif = false;
    verifError = false;
    errorMess = false;
    logo = loginLogo;
  }

  function firstFiftyEmail(email) {
    if (email && email.length && email.length > 50) {
      return email.slice(0, 37) + "...";
    }
    return email;
  }

  async function clickManage() {
    errorMess = false;
    const res = await sendPostRequest(true);
    if (!res) {
      errorMess = true;
    }
  }

  async function resendVerif() {
    let sent = await emailVerifEmail();
    if (sent) {
      sentVerif = true;
    } else {
      verifError = false;
    }
  }

  hasPasswordStore.subscribe((value) => {
    console.log(value);
    needsPass = value !== true;
  });

  onMount(() => {
    userStore.subscribe((value) => {
      user = value;
    });
  });
</script>

<header id="header">
  <div class="corner">
    <a href="/" class="special-head orange"> ST </a>
    <a href="/" class="main-message">Shorten Track</a>
  </div>

  <nav>
    <a class:orange={$page.url.pathname === "/"} href="/">Home</a>
    <a class:orange={$page.url.pathname === "/past"} href="/past">History</a>
    <a class:orange={$page.url.pathname === "/articles"} href="/articles"
      >Articles</a
    >
    <a class:orange={$page.url.pathname === "/justqr"} href="/justqr"
      >QR Codes</a
    >
  </nav>

  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="corner">
    <button class="logheadbutton" on:click={swapDrop}>
      <img class="forheadimg" src={logo} alt="user login head logo" />
      <span class:orange={dropdown}
        >{#if dropdown}▲{:else}▼{/if}</span
      >
    </button>
  </div>
  {#if dropdown}
    <div class="dropdown-m">
      <div>
        <div class="undernav">
          {#if !user}
            <div>Not currently logged in</div>
          {:else if !user.emailVerified}
            <div>Verify your email to finish login</div>
          {:else}
            <div>{firstFiftyEmail(user.email)}</div>
          {/if}
        </div>
        {#if user === undefined}
          <div>loading...</div>
        {:else if !user}
          <div>
            <a class="link-button" href="/login">Log in</a>
          </div>
          <div>
            <a class="link-button" href="/login?new=t">Create account</a>
          </div>

          <div>
            <button class="link-button" on:click={() => (cookieModal = true)}
              >Privacy Policy</button
            >
          </div>
          <div>
            <button class="link-button" on:click={() => (contactModal = true)}
              >Contact Us</button
            >
          </div>
        {:else if user && user.email}
          {#if !user.emailVerified}
            {#if sentVerif}
              <div>Verification email sent!</div>
            {:else}
              {#if verifError}
                <div>Couldn't send verification email, please try again</div>
              {/if}
              <div>
                <button class="link-button">Re-send verification email</button>
              </div>
            {/if}
            <div>
              <button class="link-button" on:click={() => (cookieModal = true)}
                >Privacy Policy</button
              >
            </div>
            <div>
              <button class="link-button" on:click={() => (contactModal = true)}
                >Contact Us</button
              >
            </div>
            <div>
              <a class="link-button" href="/login">Change Account</a>
            </div>
          {:else}
            <div>
              <button class="link-button" on:click={clickManage}
                >Manage Subscription</button
              >
            </div>
            {#if errorMess}
              <div style="color: red;">
                Error opening up membership management window :/ Try again and
                if the issue persists, contact us please :)
              </div>
            {/if}

            <div>
              <button class="link-button" on:click={() => (cookieModal = true)}
                >Privacy Policy</button
              >
            </div>
            <div>
              <button class="link-button" on:click={() => (contactModal = true)}
                >Contact Us</button
              >
            </div>

            <div>
              {#if !sentReset}
                <button
                  class="link-button"
                  on:click={async () => {
                    await sendPasswordResetEmail(auth, user.email);
                    sentReset = true;
                  }}
                >
                  {#if needsPass}
                    ! Add a Password to Account
                  {:else}
                    Reset Password
                  {/if}
                </button>
              {:else}
                Check your email for the next step
              {/if}
            </div>

            <div>
              <button class="link-button" on:click={logout}>Sign Out</button>
            </div>
          {/if}
        {:else}
          <div>loading...</div>
        {/if}
      </div>
    </div>
  {/if}
</header>

{#if contactModal}
  <Contact
    bind:open={contactModal}
    email={user ? (user.email ? user.email : "") : ""}
    loggedIn={user && user.email}
  />
{/if}

{#if cookieModal}
  <CookiePop bind:open={cookieModal} />
{/if}

<style>
  .dropdown-m {
    z-index: 1000;
    position: absolute;
    top: 58px;
    right: 0;
    background: #24282a;
    min-width: 160px;
    padding: 20px;
  }

  .main-message {
    margin-left: 18px;
    font-size: 3em;
    font-weight: bold;
    text-decoration: none;
    /* position: absolute;
    left: 50%; */
    color: var(--color-text);
    /* transform: translateX(-50%); */
  }

  .main-message:hover,
  .main-message:focus {
    color: var(--color-text);
  }

  header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    position: relative;
  }

  .forheadimg {
    height: 2em;
    width: 2em;
  }

  .corner {
    /* width: 3em; */
    height: 3em;
    padding: 5px;
    display: flex;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    /* width: 100%; */
    height: 100%;
    font-size: 3em;
  }

  .special-head {
    font-family: "Anton", Impact, Haettenschweiler, "Arial Narrow Bold",
      sans-serif;
    text-decoration: none;
    font-size: 2em;
  }

  nav {
    display: flex;
    justify-content: center;
    padding-left: 5px;
    padding-right: 5px;
    --background: rgba(255, 255, 255, 0.7);
  }

  span {
    font-size: 1.25em;
  }

  header {
    width: min(80rem, 100vw);
  }

  /* svg {
    width: 2em;
    height: 3em;
    display: block;
  }

  path {
    fill: var(--background);
  }

  ul {
    position: relative;
    padding: 0;
    margin: 0;
    height: 3em;
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    background: var(--background);
    background-size: contain;
  }

  li {
    position: relative;
    height: 100%;
  }

  li[aria-current="page"]::before {
    --size: 6px;
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-top: var(--size) solid var(--color-theme-1);
  } */

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  /* nav a.main {
    font-size: 1.5em;
  } */

  a:hover {
    color: var(--color-theme-1);
  }
  button {
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

  .link-button {
    background: none;
    border: none;
    color: rgb(59, 59, 59);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    color: var(--color-text);
  }

  .link-button:hover,
  .link-button:focus {
    text-decoration: none;
    background: none;
    color: var(--color-theme-1);
  }

  .logheadbutton {
    display: flex;
    flex-direction: row;
    background-color: transparent;
    cursor: pointer;
    align-items: center;
    height: 100%;
    color: var(--color-text);
  }

  .logheadbutton:focus,
  .logheadbutton:hover {
    background-color: transparent;
  }

  .orange {
    color: var(--color-theme-1);
  }

  .undernav {
    display: flex;
    width: 100%;
    font-size: 1em;
    margin-top: 6px;
    font-family: "Poppins", Arial, Helvetica, sans-serif;
    color: var(--color-theme-1);
  }

  /* .headuser {
    margin-right: 5px;
  } */

  /* @media (max-width: 880px) {
    .pardisp {
      display: none;
    }
  } */

  /* @media (max-width: 667px) {
    nav a.main {
      font-size: 1em;
    }
    nav a {
      letter-spacing: normal;
    }
  }

  @media (max-width: 510px) {
    svg {
      display: none;
    }
  }

  .message.large {
    display: none;
  }

  @media (min-width: 451px) {
    .message.small {
      display: none;
    }

    .message.large {
      display: flex;
    }
  } */
</style>
