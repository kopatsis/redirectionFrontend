<script>
    import { onMount } from "svelte";
    import QRCode from "qrcode";
    import down from "$lib/images/downloadb.png";

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
    });
</script>

{#if qrImageURL}
    <div>Enter URL or other text to QR Codify</div>
    <div>
        <input
            type="text"
            bind:value={QRText}
            maxLength="2048"
            placeholder="https://shortentrack.com"
        />
    </div>

    <div class="contain-qr">
        <img src={qrImageURL} alt="QR Code" class="qrcode" />
        <button class="qrbutton"
            ><a href={qrImageURL} download="qrcode.png" class="hasImg">
                Download <img src={down} alt="download icon" />
            </a>
        </button>
    </div>
{:else if error}
    <div>Error generating QR Code :/ Please close and try again.</div>
{:else}
    <div>Generating QR code...</div>
{/if}

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
        height: 250px;
        width: 250px;
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
</style>
