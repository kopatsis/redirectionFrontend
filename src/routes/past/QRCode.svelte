<script>
    import { onMount } from "svelte";
    import QRCode from "qrcode";

    export let QRText = "";

    let qrImageURL = "";

    onMount(async () => {
        if (QRText) {
            try {
                qrImageURL = await QRCode.toDataURL(QRText);
            } catch (err) {
                console.error(err);
            }
        }
    });
</script>

{#if qrImageURL}
<div class="contain-qr">
   <button class="qrbutton"
        ><a href={qrImageURL} download="qrcode.png" class="download-button">
            Download
        </a>
    </button>
    <img src={qrImageURL} alt="QR Code" class="qrcode" /> 
</div>
    
{:else}
    <div>Generating QR code...</div>
{/if}

<style>
    .contain-qr{
        display: flex;
        flex-direction: column;
    }
    .qrbutton{
        width: fit-content;
    }
    /* img.qrcode {
        height: 222px;
        width: 222px
    } */
</style>
