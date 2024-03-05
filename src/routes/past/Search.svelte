<script>
    export let entryArray;

    let searchval = '';

    let filterEntries = (sv) => {
        if (sv !== ''){
            entryArray = entryArray.filterEntries((entry) => entry.toLowerCase().includes(sv.toLowerCase()))
        }
    }

    $: filterEntries(searchval)


</script>

<div>Filter by original URL or new URL names: </div>
<input type="text" placeholder="Search..." bind:value={searchval}>