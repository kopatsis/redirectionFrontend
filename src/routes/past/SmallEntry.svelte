<script>
  import { goto } from "$app/navigation";

    export let domain;
    export let entryOb;
    export let paying = false;

    let date = new Date(entryOb.date);
    
    let page = "/past/" + entryOb.param

    let firstHundredChar = (word) => {
        if (word.length > 100) {
            return word.slice(0, 98) + "...";
        } else {
            return word;
        }
    };

    function isSameCalendarDay(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    let firstHund = firstHundredChar(entryOb.url);
</script>

<div>
    <div>
        <b>Shortened URL: <a href="{"http://" + domain + "/" + entryOb.param}">{domain + "/" + entryOb.param}</a></b>
        <button on:click={() => window.location.href=`${window.location.protocol}//${window.location.host}${page}`}>Open</button>
    </div>
    <div>Original URL: {firstHund}</div>
    {#if paying && entryOb.custom && entryOb.custom !== ""}
        <div>Custom Shortened URL: {domain + "/" + entryOb.custom}</div>
    {/if}
    {#if isSameCalendarDay(date, new Date())}
        <div>Created: {date.toLocaleTimeString()}</div>
    {:else}
        <div>Created: {date.toLocaleDateString()}</div>
    {/if}
    <div>Last Click Count: {entryOb.count}</div>
</div>
