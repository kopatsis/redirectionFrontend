<script>
  import { onMount } from "svelte";
  import CookiePop from "./CookiePop.svelte";

  let showSmall = false;
  let showBig = false;

  const closeSmall = () => {
    localStorage.setItem("CookiePolicy", "ALL");
    showSmall = false;
  };

  onMount(() => {
    showSmall = localStorage.getItem("CookiePolicy") === null;
  });
</script>

{#if showSmall}
  <!-- <div class="bottom"> -->
    <div class="inner">
      <div class="closeline">
        <button class="link-button" on:click={closeSmall}>&times;</button>
      </div>
      <div>
        By using this site, you agree to our cookie policy. If you want to
        remove all non-essential cookies and see the privacy policy, you can do
        so <button
          on:click={() => {
            showBig = true;
          }}>here</button
        >.
      </div>
    </div>
  <!-- </div> -->

  {#if showBig}
    <CookiePop bind:open={showBig} bind:openOther={showSmall} />
  {/if}
{/if}

<style>
  /* .bottom {
    z-index: -10;
    position: fixed;
    bottom: 0;
    width: 100dvw;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  } */

  .inner {
    z-index: 420;
    padding: 20px;
    background: #1a1d1e;
    max-width: 880px;
    border: 1px solid white;
    border-radius: 10px;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
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

  button {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    border: none;
  }

  button:focus,
  button:hover {
    background: var(--color-theme-1);
    color: white;
    outline: none;
  }
</style>
