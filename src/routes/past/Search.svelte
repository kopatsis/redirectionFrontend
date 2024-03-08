<script>
    import { data } from '$lib/stores/linkstore.js';
    export let entryArray;

    let searchval = "";
    let timeout;

    let filterEntries = (sv) => {
        const search = String(sv).toLowerCase()
        if (search !== "") {
            entryArray = data.filter((entry) =>
                entry.param.toLowerCase().includes(search) || entry.url.toLowerCase().includes(search),
            );
        } else {
            entryArray = data;
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
