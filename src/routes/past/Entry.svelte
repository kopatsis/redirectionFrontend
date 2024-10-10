<script>
  import { removeItem, addBack, updateItem } from "$lib/stores/linkstore.js";
  import Chart from "./Chart.svelte";
  import copy from "$lib/images/copy.png";
  import del from "$lib/images/delete.png";
  import add from "$lib/images/plus.png";
  import edit from "$lib/images/edit-icon-md.png";
  import close from "$lib/images/close.jpg";
  import save from "$lib/images/save.png";
  import QrCode from "./QRCode.svelte";
  import { getToken } from "$lib/stores/firebaseuser";

  export let domain;
  export let entryOb;
  export let paying = false;
  export let allentries = [];

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

  function updateOgUrlAll() {
    if (allentries && allentries.length > 0) {
      allentries.forEach((entry) => {
        if (entry.param && entry.param === entryOb.param) {
          entry.url = entryOb.url;
        }
      });
    }
  }

  function updateCustomHandleAll() {
    if (allentries && allentries.length > 0) {
      allentries.forEach((entry) => {
        if (entry.param === entryOb.param) {
          entry.custom = entryOb.custom;
        }
      });
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
        workingURL = "";
        workingError = "";
        updateOgUrlAll();
        editing = false;
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
        customHandle = "";
        customError = "";
        updateCustomHandleAll();
        customEditing = false;
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
        customHandle = "";
        customError = "";
        updateCustomHandleAll();
        customEditing = false;
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
      await navigator.clipboard.writeText("http://" + url);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  }

  async function copyCustomToClipBoard() {
    try {
      await navigator.clipboard.writeText(
        "http://" + domain + "/" + entryOb.custom,
      );
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  }

  async function copyOriginalToClipBoard() {
    try {
      await navigator.clipboard.writeText(entryOb.url);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  }
</script>

<div class="line"></div>
{#if error}{error}{/if}

<!-- Normal Portion -->

{#if state == "Present"}
  <div class="outergrid">
    <!-- Row -->
    <div class="deletecont">
      <button on:click={toMessage} class="hasImg"
        ><img src={del} alt="delete symbol" /></button
      >
    </div>
    <div>Shortened URL:</div>
    <div>
      <a href={"http://" + url}>{url}</a>
    </div>
    <div class="buttonhold">
      <button on:click={copyToClipboard} class="hasImg"
        ><img src={copy} alt="copy symbol" /></button
      >
    </div>

    <!-- Row -->
    <div></div>
    <div>Original URL:</div>
    {#if editing}
      <div>
        <input type="text" bind:value={workingURL} />
        {#if workingError}
          <div>{workingError}</div>
        {/if}
      </div>
      <div class="buttonhold">
        <button on:click={toggleEditing} class="hasImg"
          ><img src={close} alt="cancel symbol" /></button
        >
        {#if workingURL !== entryOb.url}
          <button on:click={submitEdits} class="hasImg"
            ><img src={save} alt="save symbol" /></button
          >
        {/if}
      </div>
    {:else}
      <div class="overflow">
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
      <div class="buttonhold">
        <button on:click={copyOriginalToClipBoard} class="hasImg"
          ><img src={copy} alt="copy symbol" /></button
        >
        <button on:click={toggleEditing} class="hasImg"
          ><img src={edit} alt="edit symbol" /></button
        >
      </div>
    {/if}

    {#if paying}
      <!-- Row -->
      <div></div>
      <div>Custom URL:</div>
      <div>
        {#if customEditing}
          <div>
            <div>
              {domain + "/"}<input
                type="text"
                bind:value={customHandle}
                maxlength="128"
                placeholder="Enter custom handle"
              />
            </div>
            {#if customAvail === true}
              <div>Available</div>
            {:else if customAvail === false}
              <div>Not Available</div>
            {:else}
              <div>
                Must be 6-128 chars. Only lowercase & uppercase letters,
                numbers, _, and -.
              </div>
            {/if}

            {#if customError}
              <div>{customError}</div>
            {/if}
          </div>
        {:else if entryOb.custom}
          <a href={"http://" + domain + "/" + entryOb.custom}
            >{domain + "/" + entryOb.custom}</a
          >
        {:else}
          No custom URL yet
        {/if}
      </div>
      <div class="buttonhold">
        {#if customEditing}
          <button on:click={toggleCustomEditing} class="hasImg"
            ><img src={close} alt="cancel symbol" /></button
          >
          {#if customHandle !== entryOb.custom && customValid}
            {#if customAvail === true}
              <button on:click={submitCustomURL} class="hasImg"
                ><img src={save} alt="save symbol" /></button
              >
            {:else if customValidLoading}
              <button>loading...</button>
            {:else if customAvail === null}
              <button on:click={checkCustomAvailability}
                >Check Availability</button
              >
            {/if}
          {/if}
        {:else if entryOb.custom}
          <button on:click={copyCustomToClipBoard} class="hasImg"
            ><img src={copy} alt="copy symbol" /></button
          >
          <button on:click={toggleCustomEditing} class="hasImg"
            ><img src={edit} alt="edit symbol" /></button
          >
          <button on:click={deleteCustomURL} class="hasImg"
            ><img src={del} alt="delete symbol" /></button
          >
        {:else}
          <button on:click={toggleCustomEditing} class="hasImg"
            ><img src={add} alt="plus symbol" /></button
          >
        {/if}
      </div>
    {/if}
  </div>

  <div class="bottompart">
    <div class="bottomrow">
      {#if isSameCalendarDay(date, new Date())}
        <div class="bottomcell">Created: {date.toLocaleTimeString()}</div>
      {:else}
        <div class="bottomcell">Created: {date.toLocaleDateString()}</div>
      {/if}
      <div class="bottomcell">Last Click Count: {entryOb.count}</div>
    </div>
    <div class="bottomrow">
      <div class="bottomcell">
        <button on:click={toggleQR}>QR Code</button>
      </div>
      <div class="bottomcell">
        <button on:click={toggleChart}>Analytics</button>
      </div>
    </div>
  </div>

  <!-- Message Portion -->
{:else if state == "Message"}
  <div class="outergrid">
    <!-- Row -->
    <div class="deletecont">
      <button on:click={toMessage} class="hasImg"
        ><img src={del} alt="delete symbol" /></button
      >
    </div>
    <div>Shortened URL:</div>
    <div>
      {url}
    </div>
    <div class="buttonhold"></div>

    <!-- Row -->
    <div></div>
    <div>Original URL:</div>
    <div class="overflow">
      {firstHund}
    </div>
    <div class="buttonhold"></div>

    {#if paying}
      <!-- Row -->
      <div></div>
      <div>Custom URL:</div>
      <div>
        {#if entryOb.custom}
          {domain + "/" + entryOb.custom}
        {:else}
          No custom URL yet
        {/if}
      </div>
      <div class="buttonhold"></div>
    {/if}
  </div>
  <div>
    <div>Are you sure you want to delete this URL?</div>
    <div>
      <button on:click={toRemoved}>Yes</button>
      <button on:click={toPresent}>No</button>
    </div>
  </div>

  <!-- Deleted Portion -->
{:else if state == "Removed"}
  <div class="outergrid">
    <!-- Row -->
    <div class="deletecont">
      <button on:click={toMessage} class="hasImg"
        ><img src={del} alt="delete symbol" /></button
      >
    </div>
    <div>Shortened URL:</div>
    <div>
      {url}
    </div>
    <div class="buttonhold"></div>

    <!-- Row -->
    <div></div>
    <div>Original URL:</div>
    <div class="overflow">
      {firstHund}
    </div>
    <div class="buttonhold"></div>

    {#if paying}
      <!-- Row -->
      <div></div>
      <div>Custom URL:</div>
      <div>
        {#if entryOb.custom}
          {domain + "/" + entryOb.custom}
        {:else}
          No custom URL yet
        {/if}
      </div>
      <div class="buttonhold"></div>
    {/if}
  </div>
  <div>This URL has been deleted</div>
  <div>
    <button on:click={undoDelete}>Undo</button>
  </div>
{:else}
  <div>Error, shouldn't be reachable here</div>
{/if}

{#if chartOrQR === "chart"}
  <Chart param={entryOb.param} bind:chartOrQR />
{/if}
{#if chartOrQR === "qr"}
  <QrCode
    QRText={"http://" + url + "?q=t"}
    OGUrl={entryOb.url}
    custom={entryOb.custom
      ? "http://" + domain + "/" + entryOb.custom + "?q=t"
      : ""}
    bind:chartOrQR
  />
{/if}

<br />

<style>
  .outergrid {
    display: grid;
    grid-template-columns: max-content max-content minmax(0, 400px) max-content;
    gap: 10px;
  }
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
  div {
    font-size: 18px;
  }
  .hasImg img {
    height: 0.89em;
  }
  .deletecont {
    margin-right: 5px;
  }

  .overflow {
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: normal;
  }

  .bottomrow {
    display: flex;
  }

  .bottomrow > * {
    flex: 1;
  }

  .bottomcell {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5px;
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
