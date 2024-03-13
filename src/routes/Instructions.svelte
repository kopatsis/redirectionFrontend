<script>
    export let size
</script>

{#if size == 'Full'}
<ol>
    <li>Enter your URL into the text box. URLs are the street address of a website.</li>
    <li>Click the "Create!" button. This takes you to all URLs you've shortened so far.</li>
    <li>You can copy the new URL or past URLS with the copy button (two sheets of paper).</li>
    <li>If you paste the shortened URL in any browser, it takes you to the original URL.</li>
    <li>You can share the shortened URL with anyone and it takes them to the same address.</li>
    <li>If you don't want the shortened URL anymore, you can delete it (trash symbol).</li>
</ol>
{:else}
<ol>
    <li>Enter the URL you want to shorten in the text box and click "Create!".</li>
    <li>Copy this shortened URL or any others you have entered previously here.</li>
    <li>Paste it in any browser and you will be redirected to the original URL.</li>
</ol>
{/if}