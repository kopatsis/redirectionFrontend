<script>
    import { onMount } from 'svelte';
    import QRCode from 'qrcode';
  
    export let QRText = '';
  
    let qrImageURL = '';
  
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
    <img src={qrImageURL} alt="QR Code" />
  {:else}
    <div>Generating QR code...</div>
  {/if}