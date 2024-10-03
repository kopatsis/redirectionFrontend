<script>
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import github from "$lib/images/github.svg";
  import { hasPassword, userStore } from "$lib/stores/firebaseuser";
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

  async function logout() {
    await auth.signOut();
    dropdown = false;
  }

  function swapDrop() {
    dropdown = !dropdown;
    sentReset = false;
  }

  async function clickManage() {
    errorMess = false;
    const res = await sendPostRequest(true);
    if (!res) {
      errorMess = true;
    }
  }

  hasPasswordStore.subscribe((value) => {
    console.log(value);
    needsPass = value !== true;
  });

  onMount(() => {
    userStore.subscribe((value) => {
      user = value;
    })
  })
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
    {#if user === undefined}
      <button>loading...</button>
    {:else if user === null}
      <button on:click={() => goto("/login")}>Log In</button>
    {:else}
      <button on:click={swapDrop}
        >Account {#if dropdown}▲{:else}▼{/if}
        {#if needsPass}
          !!!
        {/if}</button
      >
    {/if}
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
      {#if user && user.email}<div>
          Email: {user && user.email ? user.email : ""}
        </div>{/if}
      <button on:click={clickManage}>Manage Membership</button>
      {#if errorMess}
        <div>
          Error opening up membership management window :/ Try again and if the
          issue persists, contact us please :)
        </div>
      {/if}
      <div>
        <button on:click={() => (cookieModal = true)}
          >Change Cookie Policy</button
        >
      </div>
      <div>
        <button on:click={() => (contactModal = true)}>Contact Us</button>
      </div>
      <div>
        <button on:click={logout}>Sign Out</button>
      </div>
      {#if user && user.email}
        <div>
          {#if !sentReset}
            <button
              on:click={async () => {
                await sendPasswordResetEmail(auth, user.email);
                sentReset = true;
              }}
            >
              {#if needsPass}
                !!! Add a Password to Account
              {:else}
                Reset Password
              {/if}
            </button>
          {:else if needsPass}
            Check your email and click Reset Password to add a new password
          {:else}
            Check your email and click Reset Password
          {/if}
        </div>
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

<!-- {#if passPop}
  <PasswordPopup bind:open={passPop} />
{/if} -->

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
