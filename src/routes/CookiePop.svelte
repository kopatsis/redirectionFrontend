<script>
  import { onMount } from "svelte";
  import Modal from "./login/Modal.svelte";
  import {
    addEmailSubs,
    getEmailSubs,
    noEmailSubs,
  } from "$lib/stores/firebaseuser";

  export let open = true;
  export let openOther = true;

  let cookiePolicy = true;
  let oldCookiePolicy = null;
  let emailAllowed = false;
  let oldEmailAllowed = null;

  let loggedIn = false;

  const closerFunc = () => {
    if (localStorage.getItem("CookiePolicy") !== "NONE") {
      localStorage.setItem("CookiePolicy", "ALL");
    }
    openOther = false;
    open = false;
  };

  const saveAndClose = async () => {
    if (cookiePolicy) {
      localStorage.setItem("CookiePolicy", "ALL");
    } else {
      localStorage.setItem("CookiePolicy", "NONE");
    }

    if (emailAllowed) {
      await addEmailSubs();
    } else {
      await noEmailSubs();
    }

    openOther = false;
    open = false;
  };

  const selectAll = () => {
    cookiePolicy = true;
    if (loggedIn) {
      emailAllowed = true;
    }
  };

  onMount(async () => {
    cookiePolicy = localStorage.getItem("CookiePolicy") !== "NONE";
    oldCookiePolicy = cookiePolicy;
    loggedIn, (emailAllowed = await getEmailSubs());
    if (loggedIn) {
      oldEmailAllowed = emailAllowed;
    }
  });
</script>

<Modal {closerFunc}>
  <div class="closeline">
    <button class="link-button" on:click={closerFunc}>&times;</button>
  </div>

  <h1>Privacy Policy</h1>

  <p>
    This Cookie Policy explains how our website uses cookies and similar
    technologies to enhance the functionality and performance of our website. By
    continuing to browse or use our website, you agree to the use of cookies as
    outlined herein.
  </p>

  <h2>1. Required Cookies</h2>

  <p>
    Our website uses cookies that are essential for the operation of the site.
    These cookies are necessary to enable basic functionalities such as user
    authentication, session management, and securing your access to different
    areas of the website. Without these cookies, the services you have requested
    (such as logging in) cannot be provided. These cookies are automatically set
    when you visit our website and are required for its proper functioning.
  </p>

  <h2>2. Optional Cookies</h2>

  <p>
    In addition to the required cookies, our website also uses optional cookies
    for advertising purposes, specifically those provided by third-party
    services like Google AdSense. These cookies are designed to:
  </p>
  <ul>
    <li>
      Display personalized advertisements based on your browsing behavior across
      different websites.
    </li>
    <li>Collect data for ad performance measurement.</li>
    <li>Enhance the relevancy of ads shown to you.</li>
  </ul>

  <p>
    These optional cookies are not necessary for the core functionality of our
    website and can be disabled using the options provided below. Disabling
    these cookies may result in less relevant advertising being shown to you and
    may limit the extent to which Google AdSense can personalize your
    experience.
  </p>

  <h2>3. Managing Cookies</h2>

  <p>
    You can manage and disable optional cookies at any time through the cookie
    settings available on this page. However, please note that required cookies
    cannot be disabled as they are integral to the website's basic operations.
    For more information on how to manage cookies, please refer to your
    browser's help section.
  </p>

  <p>
    By continuing to use this website, you acknowledge that you have been
    informed of and consent to our use of cookies as described above.
  </p>

  {#if loggedIn}
    <h2>4. Managing Email Preferences</h2>

    <p>
      This section describes how you can manage your preferences regarding the
      receipt of non-essential emails from our website. Non-essential emails
      include communications such as newsletters, updates on new site features,
      promotional offers, and subscription-related notifications. You may opt in
      or out of receiving these emails at any time.
    </p>

    <p>
      Essential emails, however, are critical to the operation of the website
      and cannot be disabled. These include emails related to account
      management, such as payment confirmations, password reset instructions,
      and other transactional notifications that are necessary for maintaining
      the functionality of your account.
    </p>

    <p>
      To disable non-essential emails, you can adjust your email preferences in
      your account settings or use the unsubscribe link included in the footer
      of any non-essential email you receive. Please note that while opting out
      of these communications will prevent future non-essential emails, you will
      continue to receive essential communications as outlined above.
    </p>

    <p>
      By managing your email preferences, you acknowledge the distinction
      between essential and non-essential emails, and that essential emails will
      still be delivered to ensure your account functions properly.
    </p>
  {/if}

  <div>
    <div>
      <label>
        <input type="checkbox" checked disabled />
        {#if loggedIn}
          Allow Essential Cookies and Emails (required)
        {:else}
          Allow Essential Cookies (required)
        {/if}
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" bind:checked={cookiePolicy} />
        Allow Non-Essential Cookies
      </label>
    </div>
    {#if loggedIn}
      <div>
        <label>
          <input type="checkbox" bind:checked={emailAllowed} />
          Allow Non-Essential Emails
        </label>
      </div>
    {/if}
    <div>
      <button on:click={selectAll}>Select All</button>
    </div>
    <div>
      <button on:click={saveAndClose}>Save and Close</button><button
        on:click={closerFunc}>Close without Saving</button
      >
    </div>
  </div>
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