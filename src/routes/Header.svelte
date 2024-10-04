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

  let user = undefined;
  let dropdown = false;

  let errorMess = false;

  let contactModal = false;
  let cookieModal = false;

  let needsPass = false;
  let sentReset = false;

  let sentVerif = false;
  let verifError = false;

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
  }

  function firstFortyEmail(email) {
    if (email && email.length && email.length > 40) {
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

<header id="header-scrto">
  <div class="corner">
    <a href="https://github.com/kopatsis" target="_blank">
      <img src={github} alt="GitHub" />
    </a>
  </div>

  <nav>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
    </svg>
    <ul>
      <li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
        <a href="/">Home</a>
      </li>
      <li>
        <a href="/" class="main message small">EZPZ</a>
        <a href="/" class="main message large">EZPZ URL Shortener</a>
      </li>
      <li
        aria-current={$page.url.pathname.startsWith("/past")
          ? "page"
          : undefined}
      >
        <a href="/past">History</a>
      </li>
    </ul>
    <svg viewBox="0 0 2 3" aria-hidden="true">
      <path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
    </svg>
  </nav>

  <div class="corner">
    <!-- {#if user === undefined}
      <button>loading...</button>
    {:else if user === null}
      <button on:click={() => goto("/login")}>Log In</button>
    {:else} -->
    <button on:click={swapDrop}
      >Account {#if dropdown}▲{:else}▼{/if}
      {#if needsPass}
        !!!
      {/if}</button
    >
    <!-- {/if}
  </div> -->
  </div>
</header>

{#if dropdown}
  <Modal bind:open={dropdown}>
    <div class="closeline">
      <button class="link-button" on:click={() => (dropdown = false)}
        >&times;</button
      >
    </div>
    <div>
      {#if user === undefined}
        <div>loading...</div>
      {:else if !user}
        <a href="/login">Log in</a>
        <a href="/login?new=t">Create account</a>
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
        <div>Account: {firstFortyEmail(user.email)}</div>
        {#if !user.emailVerified}
          <div style="color: red;">Verify your email to finish sign in</div>
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
          <a href="/login">Change Account</a>
        {:else}

          <div><button on:click={clickManage}>Manage Subscription</button></div>
          {#if errorMess}
            <div style="color: red;">
              Error opening up membership management window :/ Try again and if
              the issue persists, contact us please :)
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

          <div><button class="link-button" on:click={logout}>Sign Out</button></div>

        {/if}
      {:else}
        <div>loading...</div>
      {/if}
    </div>
  </Modal>
{/if}

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
  header {
    display: flex;
    justify-content: center;
  }

  .corner {
    width: 3em;
    height: 3em;
    display: flex;
  }

  .corner a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .corner img {
    width: 2em;
    height: 2em;
    object-fit: contain;
  }

  nav {
    display: flex;
    justify-content: center;
    --background: rgba(255, 255, 255, 0.7);
  }

  svg {
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
  }

  nav a {
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 0.5rem;
    color: var(--color-text);
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-decoration: none;
    transition: color 0.2s linear;
  }

  nav a.main {
    font-size: 1.5em;
  }

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
  /* .headuser {
    margin-right: 5px;
  } */

  /* @media (max-width: 880px) {
    .pardisp {
      display: none;
    }
  } */

  @media (max-width: 667px) {
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
  }
</style>
