<script>
  import { onMount } from "svelte";
  import QRCode from "qrcode";
  import down from "$lib/images/downloadb.png";
  import { userStore } from "$lib/stores/firebaseuser";
  import { CheckBoth } from "$lib/stores/userInfoStore";

  let QRText = "";

  let error = "";
  let qrImageURL = "";

  const close = () => {
    chartOrQR = "none";
  };

  async function setQR(string) {
    try {
      qrImageURL = await QRCode.toDataURL(string, {
        width: 750,
      });
    } catch (err) {
      error = err;
    }
  }

  $: if (QRText === "") {
    setQR("https://shortentrack.com");
  } else {
    setQR(QRText);
  }

  onMount(async () => {
    await setQR("https://shortentrack.com");
    const unsubFirebase = userStore.subscribe(async (value) => {
      if (value !== undefined) {
        await CheckBoth();
      }
    });
    return unsubFirebase;
  });
</script>

<div class="outer">
  <h2>Just QR Code generator</h2>
  <div>Enter text or url below to create a QR Code</div>
  <div>
    <input
      type="text"
      bind:value={QRText}
      maxLength="2048"
      placeholder="https://shortentrack.com"
    />
  </div>

  {#if qrImageURL}
    <div class="contain-qr">
      <img src={qrImageURL} alt="QR Code" class="qrcode" />
    </div>
    <div>
      <button class="qrbutton"
        ><a href={qrImageURL} download="qrcode.png" class="hasImg">
          Download <img src={down} alt="download icon" />
        </a>
      </button>
    </div>
    <div class="bottom">
      If you want QR Codes with tracking, start by entering a URL in the
      shortener <a class="link-button" href="/">here</a>
    </div>
  {:else if error}
    <div>Error generating QR Code :/ Please close and try again.</div>
  {:else}
    <div>Generating QR code...</div>
  {/if}
</div>

<style>
  .outer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .hasImg img {
    height: 0.89em;
  }
  .contain-qr {
    display: flex;
    flex-direction: column;
    margin: 8px;
  }
  .qrbutton {
    width: fit-content;
  }
  img.qrcode {
    height: 400px;
    width: 400px;
  }
  button {
    margin: 8px;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    border: none;
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

  a {
    text-decoration: none;
    color: inherit;
  }

  button:hover {
    background: var(--color-theme-1);
    color: white;
    outline: none;
  }
  input {
    margin: 7px;
    width: min(100dvw, 400px);
  }

  h2 {
    font-size: 2em;
  }

  .bottom {
    max-width: 400px;
  }
</style>
