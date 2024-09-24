<script>
    import { onMount } from "svelte";
    import CookiePop from "./CookiePop.svelte";

    let showSmall = false;
    let showBig = false;

    const closeSmall = () => {
        localStorage.setItem("CookiePolicy", "N/A");
        showSmall = false;
    }

    onMount(() => {
        showSmall = localStorage.getItem("CookiePolicy") === null;
    });
</script>

{#if showSmall}
    <div>
        <div class="closeline">
            <button class="link-button" on:click={closeSmall}
                >&times;</button
            >
        </div>
        <div>
            By using this site, you agree to our cookie policy. If you want to
            remove all non-essential cookies, you can do so <button class="link-button" on:click={() => {showBig = true}}>here</button
            >.
        </div>
    </div>

    {#if showBig}
        <CookiePop bind:open={showBig} bind:openOther={showSmall} />
    {/if}
{/if}
