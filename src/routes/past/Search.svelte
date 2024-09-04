<script>
    export let searchParam = "";
    export let submitFunc = null;

    function clear() {
        searchParam = "";
        if (submitFunc) {
            submitFunc();
        }
    }
</script>

<div class="searchinst">Filter by original URL or new URL names:</div>
<form on:submit|preventDefault={submitFunc} class="searchcontain">
    <input 
        type="text" 
        placeholder="Search..." 
        bind:value={searchParam} 
        maxlength="128"
    />
    {#if searchParam !== ""}
        <button type="button" on:click={clear}>&times;</button>
    {/if}
    <button type="submit">Search</button>
</form>

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
