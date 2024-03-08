<script>

    import {removeItem, addBack} from '$lib/stores/linkstore.js';
    export let domain;
    export let entryOb;

    let url = domain + '/' + entryOb.param
    let date = new Date(entryOb.date);

    let state = 'Present';

    let toMessage = () =>{
        state = 'Message';
    }

    let toPresent = () =>{
        state = 'Present';
    }

    let undoDelete = () =>{
        state = 'Present';
        addBack(entryOb);
        fetch(`http://cs361a.wl.r.appspot.com/entry/${entryOb.param}`, {
                method: 'PATCH',
                })
                .then(response => {
                    if (!response.ok) {
                        console.error('Error deleting entry:', error);
                    }
                })
                .catch(error => {
                    console.error('Error deleting entry:', error);
                });
    }

    let toRemoved = () =>{
        state = 'Removed';
        removeItem(entryOb);
        fetch(`http://cs361a.wl.r.appspot.com/entry/${entryOb.param}`, {
                method: 'DELETE',
                })
                .then(response => {
                    if (!response.ok) {
                        console.error('Error deleting entry:', error);
                    }
                })
                .catch(error => {
                    console.error('Error deleting entry:', error);
                });
    }

    function isSameCalendarDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(url);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    }

</script>

<div class="line"></div>
{#if state == 'Present'}
    <div class="sections">
        <div>
            <div>URL: <a href="{url}">{url}</a></div>
            <div>Original URL: {entryOb.url}</div>
            {#if isSameCalendarDay(date, new Date())}
            <div>Created: {date.toLocaleTimeString()}</div>
            {:else}
            <div>Created: {date.toLocaleDateString()}</div>
            {/if}
        </div>
        <div>
            <button on:click={toMessage}>Delete</button>
            <button on:click={copyToClipboard}>Copy</button>
            <button>Analytics</button>
        </div>
    </div>
      
{:else if state == 'Message'}
    <div>Are you sure you want to delete this URL?</div>
    <button on:click={toRemoved}>Yes</button>
    <button on:click={toPresent}>No</button>
{:else if state == 'Removed'}
    <div>This URL has been deleted</div>
    <button on:click={undoDelete}>Undo</button>
{:else}
    <div>Error, shouldn't be reachable here</div>
{/if}
<br>

<style>
    button {
		padding: 1rem;
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
    .line{
        height: 2px;
        background-color: var(--color-theme-2);
        margin-bottom: 10px;
        margin-top: 10px;
    }
    .sections{
        display: flex;
        justify-content: space-between;
    }
    div{
        font-size: 20px;
    }
</style>