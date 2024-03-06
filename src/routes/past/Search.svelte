<script>
    export let entryArray;

    let originalArray = entryArray

    let searchval = "";
    let timeout;

    let filterEntries = (sv) => {
        if (sv !== "") {
            entryArray = originalArray.filterEntries((entry) =>
                entry.toLowerCase().includes(sv.toLowerCase()),
            );
        }
    };

    $: {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            filterEntries(searchval);
        }, 500);
    }

</script>

<div>Filter by original URL or new URL names:</div>
<input type="text" placeholder="Search..." bind:value={searchval} />
