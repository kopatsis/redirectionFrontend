<script>
	// import Counter from './Counter.svelte';
	// import welcome from '$lib/images/svelte-welcome.webp';
	// import welcome_fallback from '$lib/images/svelte-welcome.png';

	import { onMount } from 'svelte';
    import { getKey } from '../getKey.js';
    import Entry from './Entry.svelte';

	let domain = '';
    let key = 0;

	let error = null;
  let loading = true;

	let entries = [];
	let displayedEntries = [];
  let currentIndex = 0;
  const batchSize = 3;

  function updateDisplayedEntries() {
    const nextBatch = entries.slice(currentIndex, currentIndex + batchSize);
    displayedEntries = [...displayedEntries, ...nextBatch];
    currentIndex += batchSize;
  }
  
  async function fetchData() {
    try {
		console.log(key);
      const response = await fetch(`http://cs361a.wl.r.appspot.com/user/${key}/entries`);
      if (!response.ok) {
        throw new Error('Unable to reach EZPZ Service');
      }
      const data = await response.json();
      if (data.results.length === 0) {
        entries = [];
      } else {
        entries = data.results;
		updateDisplayedEntries()
      }
    } catch (err) {
      error = err.message;
    }
	loading = false;
  }

    onMount(async () => {
		domain = window.location.hostname;
        key = await getKey();
		fetchData();
    });
</script>

<svelte:head>
	<title>History</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	{#if loading}
		<div>Loading</div>
	{:else if error !== null}
		<div>Error fetching data</div>
	{:else if entries.length === 0}
		<div>No data for key</div>
	{:else}
		<ul>
			{#each displayedEntries as entry (entry.param)}
  				<Entry domain={domain} entryOb={entry}/>
			{/each}

			{#if currentIndex < entries.length}
  				<button on:click={updateDisplayedEntries}>More</button>
			{/if}
	  	</ul>
	{/if}
</section>