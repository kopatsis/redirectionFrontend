<script>
	// import Counter from './Counter.svelte';
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';

	import { onMount } from "svelte";
	import { getKey } from "./getKey.js";
	import { goto } from "$app/navigation";
	import Instructions from "./Instructions.svelte";
	import QrMessage from "./QRMessage.svelte";

	let key = 0;

	let url = "";

	let qrinst = false;

	let size = "Partial";
	let btext = "More...";

	let toggleText = () => {
		if (size === "Partial") {
			size = "Full";
			btext = "Less..";
		} else {
			size = "Partial";
			btext = "More...";
		}
	};

	async function handleSubmit() {
		try {
			const response = await fetch(
				"https://cs361a.wl.r.appspot.com/entry",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ user: key, url: url }),
				},
			);

			if (!response.ok) {
				goto("/error");
			}

			console.log(response);
			goto("/past");
		} catch (error) {
			console.error(
				"There was a problem with your fetch operation:",
				error,
			);
			goto("/error");
		}
	}

	onMount(async () => {
		await getKey();
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Enter your URL to shorten here:</h1>
	<form on:submit|preventDefault={handleSubmit} class="centeroverf">
		<input
			required
			type="text"
			placeholder="Enter URL here"
			bind:value={url}
			style="color: dark-gray;"
		/>
		<button type="submit">Create!</button>
	</form>
	<br />
	<div class="centeroverf">
		New Feature! Generate and download QR Code: &nbsp; <button
			on:click={() => (qrinst = !qrinst)}
			>{#if qrinst}▲{:else}▼{/if}See More</button
		>
	</div>
	{#if qrinst}
		<QrMessage />
	{/if}
	<h2>Instructions:</h2>
	<Instructions {size} />
	<button on:click={toggleText}>{btext}</button>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	input {
		margin-right: 8px;
		padding: 8px;
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 80vw;
		max-width: 500px;
		min-width: 300px;
	}
	input:focus {
		outline: none;
		border-color: var(--color-theme-1);
		border-radius: 3px solidx;
		outline-color: var(--color-theme-1);
	}
	button {
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 2px;
		border: none;
		color: var(--color-text);
	}

	button:hover {
		background: var(--color-theme-1);
		color: white;
		outline: none;
	}

	.centeroverf {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
	}

	h1 {
		width: 100%;
	}
	h2 {
		font-size: 1.5em;
	}
</style>
