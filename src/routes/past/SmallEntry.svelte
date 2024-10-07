<script>
  import { goto } from "$app/navigation";

  export let domain;
  export let entryOb;
  export let paying = false;

  let date = new Date(entryOb.date);

  let page = "/past/" + entryOb.param;

  let firstXChar = (word) => {
    if (word.length > 60) {
      return word.slice(0, 58) + "...";
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

  console.log(entryOb.custom);
</script>

<tr>
  <td>
    <button
      on:click={() =>
        (window.location.href = `${window.location.protocol}//${window.location.host}${page}`)}
      >Open</button
    >
  </td>
  <td>
    <a href={"http://" + domain + "/" + entryOb.param}
      >{domain + "/" + entryOb.param}</a
    >
  </td>
  <td>{firstXChar(entryOb.url)}</td>

  <td>
    {#if isSameCalendarDay(date, new Date())}
      {date.toLocaleTimeString()}
    {:else}
      {date.toLocaleDateString()}
    {/if}
  </td>

  <td class="count">{entryOb.count}</td>

  {#if paying}
    <td>
      {#if entryOb.custom && entryOb.custom !== ""}
        <a href={"http://" + domain + "/" + entryOb.custom}
          >{domain + "/" + entryOb.custom}</a
        >
        {:else}
        [None]
      {/if}
    </td>
  {/if}
</tr>

<style>
    button {
    padding: 0.5rem;
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

  td {
    border: 1px solid white;
    padding: 8px;
  }

  .count {
    text-align: center;
  }
</style>
