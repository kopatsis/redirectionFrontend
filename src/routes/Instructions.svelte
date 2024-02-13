<script>
    export let size
</script>

{#if size == 'Full'}
<ol>
    <li>Enter your URL into the text box. A URL is like the street address of any website or web service.</li>
    <li>Click the "Create!" button. This will take you to a page with all URLs you have shortened so far.</li>
    <li>This new feature allows you to see what you have generated in the past, while still not getting in the way of your most recent entry.</li>
    <li>You can copy the new URL (or any past URLS) by clicking the copy button, or highlighting it and using your keyboard to copy.</li>
    <li>When you paste this shortened URL on any computer's browser, it will take you to the original URL.</li>
    <li>You can share this shortened URL with anyone and it take them to the same address.</li>
    <li>If you don't want the shortened URL to redirect you anymore, you can delete it from the "History" page.</li>
</ol>
{:else}
<ol>
    <li>Enter the URL you want to shorten in the text box and click create.</li>
    <li>Copy this shortened URL or any others you have enetered in the past.</li>
    <li>Enter it in any browser and you will be taken to the original URL.</li>
</ol>
{/if}