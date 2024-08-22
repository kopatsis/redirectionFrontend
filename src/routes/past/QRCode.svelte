<script>
    import { onMount } from "svelte";
    import QRCode from "qrcode";
    import down from "$lib/images/downloadb.png";
    import Modal from "../login/Modal.svelte";

    export let QRText = "";
    export let chartOrQR = "none";

    let error = "";
    let qrImageURL = "";

    const close = () => {
        chartOrQR = "none";
    };

    onMount(async () => {
        if (QRText) {
            try {
                qrImageURL = await QRCode.toDataURL(QRText, {
                    width: 750,
                });
            } catch (err) {
                error = err;
            }
        }
    });
</script>

<Modal closerFunc={close}>
    <div class="closeline">
        <button class="link-button" on:click={close}>&times;</button>
    </div>
    {#if qrImageURL}
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
