<script>
	import { goto } from "$app/navigation";
	import { page } from "$app/stores";
	import { onMount } from "svelte";
	import user from "$lib/stores/userStore.js";
	import github from "$lib/images/github.svg";

	const login = () => {
		let baseUrl = `${window.location.protocol}//${window.location.host}/callback`;
		if ($page.url.pathname.startsWith("/past")) {
			baseUrl += "/past";
		}

		const encodedBaseUrl = encodeURIComponent(baseUrl);

		const targetUrl = `https://cs361l.uw.r.appspot.com/login?url=${encodedBaseUrl}`;

		window.location.href = targetUrl;
	};

	const logout = () => {
		console.log("clicked");
		localStorage.removeItem("361UserKey");
		localStorage.removeItem("userPicture");
		localStorage.removeItem("userName");

		user.set({
			userKey: null,
			userName: null,
			userPicture: null,
		});


		goto("/");
	};

	onMount(() => {
		user.set({
			userKey: localStorage.getItem("361UserKey"), // Set the new key
			userName: localStorage.getItem("userName"), // Set the new name
			userPicture: localStorage.getItem("userPicture"), // Set the new picture URL
		});
	});
</script>

<header>
	<div class="corner">
		<a href="https://github.com/kopatsis" target="_blank">
			<img src={github} alt="GitHub" />
		</a>
	</div>

	<nav>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L1,2 C1.5,3 1.5,3 2,3 L2,0 Z" />
		</svg>
		<ul>
			<li aria-current={$page.url.pathname === "/" ? "page" : undefined}>
				<a href="/">Home</a>
			</li>
			<li>
				<a href="/" class="main">EZPZ URL Shortener</a>
			</li>
			<li
				aria-current={$page.url.pathname.startsWith("/past")
					? "page"
					: undefined}
			>
				<a href="/past">History</a>
			</li>
		</ul>
		<svg viewBox="0 0 2 3" aria-hidden="true">
			<path d="M0,0 L0,3 C0.5,3 0.5,3 1,2 L2,0 Z" />
		</svg>
	</nav>

	<div class="corner">
		{#if $user.userKey}
			<button on:click={logout} class="headuser">Logout</button>
			<img src={$user.userPicture} alt="Thumbnail of user" class="headuser" />
			<div>Welcome, {$user.userName}</div>
		{:else}
			<button on:click={login}>Login</button>
		{/if}
	</div>
</header>

<style>
	header {
		display: flex;
		justify-content: center;
	}

	.corner {
		width: 3em;
		height: 3em;
		display: flex;
	}

	.corner a {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}

	.corner img {
		width: 2em;
		height: 2em;
		object-fit: contain;
	}

	nav {
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	svg {
		width: 2em;
		height: 3em;
		display: block;
	}

	path {
		fill: var(--background);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current="page"]::before {
		--size: 6px;
		content: "";
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid var(--color-theme-1);
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		padding: 0 0.5rem;
		color: var(--color-text);
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	nav a.main {
		font-size: 1.5em;
	}

	a:hover {
		color: var(--color-theme-1);
	}
	button {
		padding: .5rem;
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
	.headuser{
		margin-right: 5px;
	}
</style>
