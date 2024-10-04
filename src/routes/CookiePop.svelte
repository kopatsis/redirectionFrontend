<script>
  import { onMount } from "svelte";
  import Modal from "./login/Modal.svelte";
  import { addEmailSubs, getEmailSubs, noEmailSubs } from "$lib/stores/firebaseuser";

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
    if(cookiePolicy) {
        localStorage.setItem("CookiePolicy", "ALL");
    } else {
        localStorage.setItem("CookiePolicy", "NONE");
    }

    if(emailAllowed) {
        await addEmailSubs();
    } else {
        await noEmailSubs();
    }

    openOther = false;
    open = false;
  }

  const selectAll = () => {
    cookiePolicy = true;
    if(loggedIn) {
        emailAllowed = true;
    }
  }

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

  <p>
    Here's all the stuff with our cookies: blah blah blah blah blah blah blah
    blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
    blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
    blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
    blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
    blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
    blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
    blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
    blah blah blah blah blah blah blah blah blah blah blah blah
  </p>
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
        <button on:click={saveAndClose}>Save and Close</button><button on:click={closerFunc}>Close without Saving</button>
      </div>
  </div>
</Modal>
