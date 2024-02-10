<script>
    import { onDestroy } from 'svelte';

    export let domain;
    export let entryOb;

    let url = domain + '/' + entryOb.param
    let date = new Date();

    let state = 'Present';
    let removed = false;

    let toMessage = () =>{
        state = 'Message';
        removed = false;
    }

    let toPresent = () =>{
        state = 'Present';
        removed = false;
    }

    let toRemoved = () =>{
        state = 'Removed';
        removed = true;
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(url);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    }

    onDestroy(() => {
        if (removed){
            fetch(`http://cs361a.wl.r.appspot.com/entry/${entryOb.param}`, {
                method: 'DELETE',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to delete entry');
                    }
                })
                .catch(error => {
                    console.error('Error deleting entry:', error);
                });
            }
        })

</script>

{#if state == 'Present'}
    <button on:click={toMessage}>Delete</button>
    <div>URL: {url}</div>
    <button on:click={copyToClipboard}>Copy</button>
    <div>Original: {entryOb.url}</div>
    <div>Date: {date.toLocaleDateString()}</div>
{:else if state == 'Message'}
    <div>Are you sure you want to delete this URL?</div>
    <button on:click={toRemoved}>Yes</button>
    <button on:click={toPresent}>No</button>
{:else if state == 'Removed'}
    <div>This URL has been deleted</div>
    <button on:click={toPresent}>Undo</button>
{:else}
    <div>Error, shouldn't be reachable here</div>
{/if}
<br>