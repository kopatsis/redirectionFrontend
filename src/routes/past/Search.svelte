<script>
    import { data } from "$lib/stores/linkstore.js";
    export let entryArray;

    let searchval = "";
    let timeout;

    let filterEntries = (sv) => {
        const search = String(sv).toLowerCase();
        if (search !== "") {
            entryArray = data.filter(
                (entry) =>
                    entry.param.toLowerCase().includes(search) ||
                    entry.url.toLowerCase().includes(search),
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

<div class="searchinst">Filter by original URL or new URL names:</div>
<div class="searchcontain">
    <input type="text" placeholder="Search..." bind:value={searchval} />
    <!-- {#if searchval !== ""} -->
    <button on:click={() => (searchval = "")}>X</button>
    <!-- {/if} -->
</div>

<style>
    .searchinst {
        font-size: 18px;
    }
    input {
        margin-right: 8px;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        width: 50vw;
        max-width: 400px;
        min-width: calc(50vw, 400px);
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
    }

    button:hover {
        background: var(--color-theme-1);
        color: white;
        outline: none;
    }
    .searchcontain {
        display: flex;
    }
</style>
