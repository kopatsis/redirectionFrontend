<script>
	// import Counter from './Counter.svelte';
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';

	import { onMount } from 'svelte';
    import { getKey } from '../getKey.js';

    let key = 0;

    onMount(async () => {
        key = await getKey();
        console.log(key);
    });
</script>

<svelte:head>
	<title>History</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div>{key}</div>
</section>