<script>
	import { onMount } from "svelte";
	import { getKey } from "./getKey.js";
	import { goto } from "$app/navigation";
	import Instructions from "./Instructions.svelte";
	import QrMessage from "./QRMessage.svelte";
	import { getToken, userStore } from "$lib/stores/firebaseuser.js";
	import { page } from "$app/stores";

	let user = null;
	let workingError = "";

	let key = 0;

	let url = "";

	let qrinst = false;

	let size = "Partial";
	let btext = "More...";

	let referred = false;

	const queryParams = $page.url.searchParams;
	referred = queryParams.has("dne");

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
		const url = import.meta.env.VITE_BACKEND_URL;
		try {
			const token = await getToken();
			const response = await fetch(`${url}/entry`, {
				method: "POST",
				headers: {
					Authorization: token,
					"X-User-ID": localStorage.getItem('ST_USER_KEY') || '',
				},
				credentials: "include",
			});

			if (!response.ok) {
				const errorData = await response.json();
				if (
					errorData["Error Type"] === "Not a URL that can be parsed"
				) {
					workingError =
						"Error: The URL you provided is not formatted correctly and would not work. Please try again.";
				} else {
					workingError =
						"Unable to reach our server :/ Check your internet but it might be us";
				}
			} else {
				const data = await response.json();
				if (data.parameter) {
					goto(`/past/${data.parameter}`);
				} else {
					workingError =
						"Unable to reach our server :/ Check your internet but it might be us";
				}
			}
		} catch (error) {
			workingError =
				"Unable to reach our server :/ Check your internet but it might be us";
		}
	}
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if referred}
		<div>
			Looks like that shortened URL didn't lead to anything that exists.
			But you can still make one here! :)
		</div>
	{/if}
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
	{#if workingError}{workingError}{/if}
	<br />
	<div>
		<button>Past Shortened URLs</button><button>Paid Member</button>
	</div>
	
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
</style>
