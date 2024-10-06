<script>
  import { onMount } from "svelte";
  import Header from "./Header.svelte";
  import "./styles.css";
  import { userStore } from "$lib/stores/firebaseuser";
  import { CheckPaymentStatus } from "$lib/shared/checkpaying";
  import { paidStore } from "$lib/stores/userInfoStore";
  import CookieSmall from "./CookieSmall.svelte";

  let paying = null;

  let hasScrolled = false;

  function handleScroll() {
    hasScrolled = window.scrollY > 15;
  }

  paidStore.subscribe((value) => {
    paying = value;
  });

  onMount(() => {
    window.addEventListener("scroll", handleScroll);
  });
</script>

<div class="app">
  <div class="inner">
    <Header />

    <CookieSmall />

    <main>
      <slot />
    </main>

    {#if hasScrolled}
      <a class="scrolltop" href="#header-scrto">^</a>
    {/if}
  </div>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    max-width: 100vw;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
	align-items: center;
  }

  .inner {
	width: min(80rem, 100vw);
	/* background-color: var(--color-bg-1); */
	position: relative;
  }

  main {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    /* width: 100%; */
    max-width: 80rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .scrolltop {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: orange;
    position: fixed;
    bottom: 50px;
    right: 50px;
    text-align: center;
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
