<script>
	import { onMount } from "svelte";
	import Header from "./Header.svelte";
	import "./styles.css";
	import { userStore } from "$lib/stores/firebaseuser";
	import { CheckPaymentStatus } from "$lib/shared/checkpaying";

	let loading = true;
	let paying = false;

	onMount(() => {
		const unsubFirebase = userStore.subscribe(async (value) => {
			if (value === undefined) {
				return;
			} else if (
				value &&
				value.email &&
				value.emailVerified &&
				value.uid
			) {
				let ispaying,
					worked = await CheckPaymentStatus(value.uid);
				if (worked && ispaying) {
					paying = true;
				}
			} else {
				paying = false;
			}
			loading = false;
		});

		return unsubFirebase;
	});
</script>

<div class="app">
	<Header />

	{#if loading}
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
