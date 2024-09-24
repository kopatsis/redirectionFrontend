<script>
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  import "./styles.css";
  import { userStore } from "$lib/stores/firebaseuser";
  import { CheckPaymentStatus } from "$lib/shared/checkpaying";
  import { paidStore } from "$lib/stores/paidStore";
    import CookieSmall from "./CookieSmall.svelte";

  let paying = null;

  paidStore.subscribe((value) => {
    paying = value;
  });
</script>

<div class="app">
  <Header />

  <CookieSmall />

  {#if paying === null}
    <div>loading...</div>
  {:else if paying}
    <div>[]</div>
  {:else}
    <div>AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD AD</div>
  {/if}

  <main>
    <slot />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    /* width: 100%; */
    max-width: 64rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  /* footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	} */
</style>
