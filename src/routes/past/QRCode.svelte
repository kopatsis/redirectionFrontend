<script>
    import { onMount } from "svelte";
    import QRCode from "qrcode";
    import down from "$lib/images/downloadb.png";

    export let QRText = "";

    let qrImageURL = "";

    onMount(async () => {
        if (QRText) {
            try {
                qrImageURL = await QRCode.toDataURL(QRText, {
                    width: 750,
                });
            } catch (err) {
                console.error(err);
            }
        }
    });
</script>

{#if qrImageURL}
<div class="contain-qr">
   
    <img src={qrImageURL} alt="QR Code" class="qrcode" /> 
    <button class="qrbutton"
        ><a href={qrImageURL} download="qrcode.png" class="hasImg">
            Download <img src={down} alt="download icon"/> 
        </a>
    </button>
</div>
    
{:else}
    <div>Generating QR code...</div>
{/if}

<style>
    .hasImg img {
        height: .89em;
    }
    .contain-qr{
        display: flex;
        flex-direction: column;
    }
    .qrbutton{
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
    a{
        text-decoration: none;
        color: inherit;
    }
    button:hover {
        background: var(--color-theme-1);
        color: white;
        outline: none;
    }
</style>
