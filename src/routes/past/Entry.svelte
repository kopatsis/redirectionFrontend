<script>
  import { removeItem, addBack, updateItem } from "$lib/stores/linkstore.js";
  import Chart from "./Chart.svelte";
  import copy from "$lib/images/copy.png";
  import del from "$lib/images/delete.png";
  import QrCode from "./QRCode.svelte";
  import { getToken } from "$lib/stores/firebaseuser";

  export let domain;
  export let entryOb;
  export let paying = false;

  let url = domain + "/" + entryOb.param;
  let date = new Date(entryOb.date);
  let error = "";

  let state = "Present";
  let editing = false;
  let chartOrQR = "none";

  let workingURL = "";
  let workingError = "";

  let customEditing = false;
  let customHandle = "";
  let customError = "";
  let customAvail = null;
  let customValidLoading = false;

  $: customHandle, (customAvail = null);
  $: customValid = isValid(customHandle);

  function isValid(handle) {
    const regex = /^[a-zA-Z0-9_-]*$/;
    return handle.length >= 6 && handle.length <= 128 && regex.test(handle);
  }

  let expanded = false;

  function toggleEditing() {
    if (editing === true) {
      workingURL = "";
      workingError = "";
      editing = false;
    } else {
      customHandle = "";
      customError = "";
      customEditing = false;
      workingURL = entryOb.url;
      workingError = "";
      editing = true;
    }
  }

  function toggleCustomEditing() {
    if (customEditing === true) {
      customHandle = "";
      customError = "";
      customEditing = false;
    } else {
      workingURL = "";
      workingError = "";
      editing = false;
      customHandle = entryOb.custom;
      customError = "";
      customEditing = true;
    }
  }

  const submitEdits = async () => {
    let url = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/entry/${entryOb.param}`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
        },
        credentials: "include",
        body: JSON.stringify({
          url: workingURL,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData["Error Type"] === "Not a URL that can be parsed") {
          workingError =
            "Error: The URL you provided is not formatted correctly and would not work. Please try again.";
        } else {
          workingError =
            "Unable to reach our server :/ Check your internet but it might be us";
        }
      } else {
        const resp = await response.json();
        entryOb.url = resp.url;
        workingError = "";
      }
    } catch (err) {
      workingError = err;
    }
  };

  const checkCustomAvailability = async () => {
    if (!customValid) {
      customAvail = false;
      return;
    }
    customValidLoading = true;
    const url = import.meta.env.VITE_BACKEND_URL;
    const passcode = import.meta.env.VITE_CHECK_PASSCODE;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/customcheck/${customHandle}`, {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
          "X-Passcode-ID": passcode,
        },
        credentials: "include",
      });
      if (!response.ok) {
        customError =
          "Unable to reach our server :/ Check your internet but it might be us";
      } else {
        const resp = await response.json();
        customAvail = resp.available ? resp.available === true : false;
      }
    } catch (err) {
      customError =
        "Unable to reach our server :/ Check your internet but it might be us";
    } finally {
      customValidLoading = false;
    }
  };

  const submitCustomURL = async () => {
    if (!customValid || !customAvail) {
      customAvail = false;
      return;
    } 
    customValidLoading = true;
    const url = import.meta.env.VITE_BACKEND_URL;
    const passcode = import.meta.env.VITE_CHECK_PASSCODE;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/entry/${entryOb.param}/addcustom`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
          "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
        },
        credentials: "include",
        body: JSON.stringify({
          handle: customHandle,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData["Error Type"].includes("handle already exists")) {
          customError =
            "Looks like that one is no longer available, please try again";
        } else {
          customError =
            "Unable to reach our server :/ Check your internet but it might be us";
        }
      } else {
        const resp = await response.json();
        entryOb.custom = resp.custom;
        customError = "";
      }
    } catch (err) {
      customError =
        "Unable to reach our server :/ Check your internet but it might be us";
    } finally {
      customValidLoading = false;
    }
  };

  const deleteCustomURL = async () => {
    customValidLoading = true;
    const url = import.meta.env.VITE_BACKEND_URL;
    const passcode = import.meta.env.VITE_CHECK_PASSCODE;
    try {
      const token = await getToken();
      const response = await fetch(
        `${url}/entry/${entryOb.param}/deletecustom`,
        {
          method: "PATCH",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
            "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
          },
          credentials: "include",
        },
      );
      if (!response.ok) {
        customError =
          "Unable to reach our server :/ Check your internet but it might be us";
      } else {
        entryOb.custom = "";
        customError = "";
      }
    } catch (err) {
      customError =
        "Unable to reach our server :/ Check your internet but it might be us";
    } finally {
      customValidLoading = false;
    }
  };

  function toggleChart() {
    if (chartOrQR === "chart") {
      chartOrQR = "none";
    } else {
      chartOrQR = "chart";
    }
  }

  function toggleQR() {
    if (chartOrQR === "qr") {
      chartOrQR = "none";
    } else {
      chartOrQR = "qr";
    }
  }

  const toMessage = () => {
    state = "Message";
  };

  const toPresent = () => {
    state = "Present";
  };

  const undoDelete = async () => {
    state = "Present";

    let url = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/entry/${entryOb.param}/unarchive`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
        },
        credentials: "include",
      });
      if (!response.ok) {
        error =
          "Unable to reach our server :/ Check your internet but it might be us";
      }
    } catch (err) {
      error = err;
    }
  };

  const toRemoved = async () => {
    state = "Removed";

    let url = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/entry/${entryOb.param}/archive`, {
        method: "PATCH",
        headers: {
          Authorization: token,
          "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
        },
        credentials: "include",
      });
      if (!response.ok) {
        error =
          "Unable to reach our server :/ Check your internet but it might be us";
      }
    } catch (err) {
      error = err;
    }
  };

  let firstHundredChar = (word) => {
    if (word.length > 100) {
      return word.slice(0, 98) + "...";
    } else {
      return word;
    }
  };

  $: firstHund = firstHundredChar(entryOb.url);

  function isSameCalendarDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  }
</script>

<div class="line"></div>
{#if error}{error}{/if}
{#if state == "Present"}
  <div class="sections">
    <div class="sections">
      <div class="deletecont">
        <button on:click={toMessage} class="hasImg"
          ><img src={del} alt="delete symbol" /></button
        >
      </div>
      <div>
        <div>
          URL: <a href={"https://" + url}>{url}</a>
        </div>
        <div>
          {#if editing}
            <div>
              Original URL: <input type="text" bind:value={workingURL} />
            </div>
            <div>
              <button on:click={toggleEditing}>Cancel</button
              >{#if workingURL !== entryOb.url}<button on:click={submitEdits}
                  >Submit Change</button
                >{/if}
            </div>
            {#if workingError}
              <div>{workingError}</div>
            {/if}
          {:else}
            <div class="ogurl">
              Original URL:
              {#if entryOb.url === firstHund}
                {firstHund}
              {:else if !expanded}
                {firstHund}&nbsp;<button on:click={() => (expanded = true)}
                  >more...</button
                >
              {:else}
                {entryOb.url}<button on:click={() => (expanded = false)}
                  >less...</button
                >
              {/if}
            </div>
            <button on:click={toggleEditing}>Edit</button>
          {/if}
        </div>
        {#if paying}
          {#if customEditing}
            <div>
              Custom Shortened URL: {domain + "/"}<input
                type="text"
                bind:value={customHandle}
                maxlength="128"
                placeholder="Enter custom handle"
              />
            </div>
            <div>
              <button on:click={toggleCustomEditing}>Cancel</button>
              {#if customHandle !== entryOb.custom && customValid}
                {#if customAvail === true}
                  <button on:click={submitCustomURL}>Submit Change</button>
                {:else if customAvail === false}
                  <div>Not available</div>
                {:else if customValidLoading}
                  <button>loading...</button>
                {:else}
                  <button on:click={checkCustomAvailability}
                    >Check Availability</button
                  >
                {/if}
              {/if}
            </div>
            <div>
              Must be between 6 and 128 characters, only lowercase letters,
              uppercase letters, numbers, _, and -.
            </div>
            {#if customError}
              <div>{customError}</div>
            {/if}
          {:else if !entryOb.custom}
            <div>No custom shortened URL handle yet</div>
            <button on:click={toggleCustomEditing}>Add One</button>
          {:else}
            <div class="ogurl">
              Custom Shortened URL: {domain + "/" + entryOb.custom}
            </div>
            {#if customValidLoading}
              <button>loading...</button>
            {:else}
              <button on:click={toggleCustomEditing}>Edit</button>
              <button on:click={deleteCustomURL}>Remove</button>
            {/if}
          {/if}
        {/if}
        {#if isSameCalendarDay(date, new Date())}
          <div>Created: {date.toLocaleTimeString()}</div>
        {:else}
          <div>Created: {date.toLocaleDateString()}</div>
        {/if}
      </div>
    </div>
    <div class="buttonhold">
      <button on:click={copyToClipboard} class="hasImg"
        ><img src={copy} alt="copy symbol" /></button
      >
      <button on:click={toggleQR}>QR Code</button>
      <button on:click={toggleChart}>Analytics</button>
    </div>
  </div>
  {#if chartOrQR === "chart"}
    <Chart param={entryOb.param} bind:chartOrQR />
  {/if}
  {#if chartOrQR === "qr"}
    <QrCode
      QRText={"https://" + url + "?q=t"}
      OGUrl={entryOb.url}
      bind:chartOrQR
    />
  {/if}
{:else if state == "Message"}
  <div>URL: <a href={url}>{url}</a></div>
  <div class="ogurl">
    Original URL:
    {#if entryOb.url === firstHund}
      {firstHund}
    {:else if !expanded}
      {firstHund}&nbsp;<button on:click={() => (expanded = true)}
        >more...</button
      >
    {:else}
      {entryOb.url}<button on:click={() => (expanded = false)}>less...</button>
    {/if}
  </div>
  <div>Are you sure you want to delete this URL?</div>
  <button on:click={toRemoved}>Yes</button>
  <button on:click={toPresent}>No</button>
{:else if state == "Removed"}
  <div>URL: <a href={url}>{url}</a></div>
  <div class="ogurl">
    Original URL:
    {#if entryOb.url === firstHund}
      {firstHund}
    {:else if !expanded}
      {firstHund}&nbsp;<button on:click={() => (expanded = true)}
        >more...</button
      >
    {:else}
      {entryOb.url}<button on:click={() => (expanded = false)}>less...</button>
    {/if}
  </div>
  <div>This URL has been deleted</div>
  <button on:click={undoDelete}>Undo</button>
{:else}
  <div>Error, shouldn't be reachable here</div>
{/if}
<br />

<style>
  .buttonhold {
    min-width: fit-content;
  }
  button {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    border: none;
    font-size: 16px;
  }

  button:hover {
    background: var(--color-theme-1);
    color: white;
    outline: none;
  }
  .line {
    height: 2px;
    background-color: var(--color-theme-2);
    margin-bottom: 10px;
    margin-top: 10px;
  }
  .sections {
    display: flex;
    justify-content: space-between;
  }
  div {
    font-size: 18px;
  }
  .hasImg img {
    height: 0.89em;
  }
  .deletecont {
    margin-right: 5px;
  }
  .ogurl {
    word-break: break-all;
  }

  @media (max-width: 540px) {
    .buttonhold {
      display: flex;
      flex-direction: column;
    }
  }

  @media (max-width: 425px) {
    div {
      font-size: 15px;
    }
    button {
      font-size: 14px;
    }
  }
</style>
