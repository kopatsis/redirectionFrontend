<script>
    export let size
</script>

{#if size == 'Full'}
<div>Full</div>
{:else}
<div>Partial</div>
{/if}