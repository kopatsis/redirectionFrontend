<script>
  import { onMount } from "svelte";
  import QRCode from "qrcode";
  import down from "$lib/images/downloadb.png";
  import Modal from "../login/Modal.svelte";

  export let QRText = "";
  export let chartOrQR = "none";
  export let OGUrl = "";
  export let custom = "";

  let disp = "";

  let pointsTo = "shortened";

  let error = "";
  let qrImageURL = "";

  const close = () => {
    chartOrQR = "none";
  };

  async function setQR(string) {
    try {
      qrImageURL = await QRCode.toDataURL(string, {
        width: 1000,
      });
    } catch (err) {
      error = err;
    }
  }

  function cleanUrl(url) {
    return url.replace(/^https?:\/\//, "").replace(/\?q=t$/, "");
  }

  const firstXChar = (word) => {
    if (word.length > 40) {
      return word.slice(0, 58) + "...";
    } else {
      return word;
    }
  };

  disp = cleanUrl(QRText);

  $: if (pointsTo === "shortened") {
    setQR(QRText);
    disp = cleanUrl(QRText);
  } else if (pointsTo === "original") {
    setQR(OGUrl);
    disp = cleanUrl(OGUrl);
  } else {
    setQR(custom);
    disp = cleanUrl(custom);
  }

  onMount(async () => {
    if (QRText) {
      await setQR(QRText);
    }
  });
</script>

<Modal closerFunc={close}>
  <div class="closeline">
    <button class="link-button" on:click={close}>&times;</button>
  </div>

  <h2>QR Code for {firstXChar(disp)}</h2>

  {#if qrImageURL}
    <div class="contain-qr">
      <img src={qrImageURL} alt="QR Code" class="qrcode" />
      <div class="holddown">
        <button class="qrbutton"
          ><a href={qrImageURL} download="qrcode.png" class="hasImg">
            Download <img src={down} alt="download icon" />
          </a>
        </button>
      </div>
    </div>

    <div>What should this QR code point to:</div>
    <div>
      <div>
        <label>
          <input type="radio" value="shortened" bind:group={pointsTo} />
          Shortened URL
        </label>
      </div>

      {#if custom && custom !== ""}
        <div>
          <label>
            <input type="radio" value="custom" bind:group={pointsTo} />
            Custom URL
          </label>
        </div>
      {/if}

      <div>
        <label>
          <input type="radio" value="original" bind:group={pointsTo} />
          Original URL*
        </label>
      </div>
    </div>

    <div>* = Analytics cannot be tracked</div>
  {:else if error}
    <div>Error generating QR Code :/ Please close and try again.</div>
  {:else}
    <div>Generating QR code...</div>
  {/if}
</Modal>

<style>
  .hasImg img {
    height: 0.89em;
  }
  .contain-qr {
    display: flex;
    flex-direction: column;
  }
  .qrbutton {
    width: fit-content;
  }
  img.qrcode {
    height: 400px;
    width: 400px;
  }
  button {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    border: none;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  button:hover {
    background: var(--color-theme-1);
    color: white;
    outline: none;
  }

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

  .holddown {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 6px;
  }
</style>
