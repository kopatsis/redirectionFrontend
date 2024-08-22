<script>
  import { removeItem, addBack } from "$lib/stores/linkstore.js";
  import Chart from "./Chart.svelte";
  import copy from "$lib/images/copy.png";
  import del from "$lib/images/delete.png";
  import QrCode from "./QRCode.svelte";
  import { getToken } from "$lib/stores/firebaseuser";
  export let domain;
  export let entryOb;

  let url = domain + "/" + entryOb.param;
  let date = new Date(entryOb.date);
  let error = "";

  let state = "Present";
  let editing = false;
  let chartOrQR = "none";

  let workingURL = "";
  let workingError = "";

  function toggleEditing() {
    if (editing === true) {
      workingURL = "";
      workingError = "";
      editing = false;
    } else {
      workingURL = entryOb.url;
      workingError = "";
      editing = true;
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
          error =
            "Unable to reach our server :/ Check your internet but it might be us";
        }
      } else {
        workingError = "";
      }
    } catch (err) {
      error = err;
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
    addBack(entryOb);

    let url = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/entry/${entryOb.param}/unarchive`, {
        method: "PATCH",
        headers: {
          Authorization: token,
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
    removeItem(entryOb);

    let url = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/entry/${entryOb.param}/archive`, {
        method: "PATCH",
        headers: {
          Authorization: token,
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
        <div class="ogurl">Original URL: {firstHundredChar(entryOb.url)}</div>
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
      <button on:click={toggleQR}>
        {#if chartOrQR === "qr"}▲{:else}▼{/if} QR</button
      >
      <button on:click={toggleChart}>
        {#if chartOrQR === "chart"}▲{:else}▼{/if} Analytics</button
      >
    </div>
  </div>
  {#if chartOrQR === "chart"}
    <Chart param={entryOb.param} />
  {/if}
  {#if chartOrQR === "qr"}
    <QrCode QRText={"https://" + url + "?q=t"} />
  {/if}
{:else if state == "Message"}
  <div>URL: <a href={url}>{url}</a></div>
  <div class="ogurl">Original URL: {entryOb.url}</div>
  <div>Are you sure you want to delete this URL?</div>
  <button on:click={toRemoved}>Yes</button>
  <button on:click={toPresent}>No</button>
{:else if state == "Removed"}
  <div>URL: <a href={url}>{url}</a></div>
  <div class="ogurl">Original URL: {entryOb.url}</div>
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
