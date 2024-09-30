<script>
  import { onMount } from "svelte";
  import { getKey } from "../../getKey";
  import { setData } from "$lib/stores/linkstore.js";
  import Entry from "../Entry.svelte";
  import Search from "../Search.svelte";
  import { getToken, userStore } from "$lib/stores/firebaseuser.js";
  import { goto, pushState, replaceState } from "$app/navigation";
  import { page } from "$app/stores";
  import { CheckPaymentStatus } from "$lib/shared/checkpaying.js";
  import SmallEntry from "../SmallEntry.svelte";
  import { CheckPay, paidStore } from "$lib/stores/paidStore";

  let domain = "";
  let loadingcsvs = false;
  let csverror = false;

  let error = null;
  let loading = true;
  let signedIn = false;

  let entries = [];

  let singleEntry = null;
  let singleArchived = false;
  let singleError = false;

  let pageParam = 1;
  let searchParam = "";
  let sortParam = "dd";

  let more = false;
  let less = false;

  let paying = null;
  paidStore.subscribe((value) => {
    paying = value;
  });

  function updateURL() {
    const url = new URL(`${window.location.origin}${window.location.pathname}`);

    url.searchParams.set("p", pageParam);
    url.searchParams.set("q", searchParam);
    url.searchParams.set("s", sortParam);

    pushState(url.toString(), { replaceState: true });
  }

  function setVariables() {
    const queryParams = $page.url.searchParams;

    pageParam = parseInt(queryParams.get("p")) || 1;
    searchParam = queryParams.get("q") || "";
    sortParam = queryParams.get("s") || "dd";

    if (searchParam.length > 128) {
      searchParam = searchParam.slice(0, 128);
    }
  }

  async function changePage(inc = true) {
    if (inc) {
      pageParam++;
    } else {
      pageParam--;
    }
    pageParam = Math.max(0, pageParam);
    await fetchData();
  }

  async function changeSearch() {
    if (searchParam.length > 128) {
      searchParam = searchParam.slice(0, 128);
    }
    pageParam = 1;
    await fetchData();
  }

  async function changeSort(event) {
    const newSort = event.target.value;
    if (
      (newSort === "dd" ||
        newSort === "da" ||
        newSort === "ad" ||
        newSort === "aa" ||
        newSort === "cd" ||
        newSort === "ca") &&
      newSort != sortParam
    ) {
      sortParam = newSort;
      pageParam = 1;
      await fetchData();
    }
  }

  async function fetchData() {
    loading = true;

    const url = import.meta.env.VITE_BACKEND_URL;

    const queryParams = new URLSearchParams();
    const id = $page.params.slug;

    if (pageParam) queryParams.append("p", encodeURIComponent(pageParam));
    if (searchParam) queryParams.append("q", encodeURIComponent(searchParam));
    if (sortParam) queryParams.append("s", encodeURIComponent(sortParam));

    try {
      const token = await getToken();
      const response = await fetch(
        `${url}/search/${id}?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
            "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Unable to reach Service");
      }
      const resp = await response.json();
      const data = resp.response ? resp.response : {};

      pageParam = data.page ? data.page : 1;
      searchParam = data.search ? data.search : "";
      sortParam = data.sort ? data.sort : "dd";
      more = data.more ? data.more : false;
      less = data.less ? data.less : false;

      updateURL();

      if (!data.entries || !data.entries.length || data.entries.length === 0) {
        entries = [];
      } else {
        entries = data.entries;
      }

      singleArchived = resp.archived ? resp.archived : false;
      singleError = resp.error ? resp.error !== "" : false;
      singleEntry = resp.entry ? resp.entry : null;
    } catch (err) {
      error = err.message;
    }
    loading = false;
  }

  async function fetchcsv() {
    if (!paying) {
      return;
    }
    const url = import.meta.env.VITE_BACKEND_URL;
    loadingcsvs = true;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/entriescsv`, {
        method: "GET",
        headers: {
          Authorization: token,
          "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
        },
        credentials: "include",
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `entry_data.csv`;
        document.body.appendChild(a);
        a.click();
        csvLoading = false;
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        csverror = false;
      } else {
        csverror = true;
      }
    } catch (error) {
      csverror = true;
    } finally {
      loadingcsvs = false;
    }
  }

  onMount(async () => {
    domain = import.meta.env.VITE_SHORT_DOMAIN;
    const unsubFirebase = userStore.subscribe(async (value) => {
      if (value !== undefined) {
        CheckPay();
        setVariables();
        if (value && value.email && value.emailVerified) {
          try {
            signedIn = true;

            const [firstResult, secondResult] = await Promise.all([
              CheckPaymentStatus(value.uid),
              fetchData(),
            ]);

            const [ispaying, worked] = firstResult;
            if (worked && ispaying) {
              paying = true;
            }
          } catch (err) {
            console.error(err);
            error = err.message;
          } finally {
            loading = false;
          }
        } else {
          await fetchData();
        }
      }
    });
    return unsubFirebase;
  });
</script>

<svelte:head>
  <title>History</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <h2>Your Past Shortened URLs</h2>
  {#if loading}
    <div>Loading</div>
  {:else if error !== null}
    <div>Error fetching data</div>
  {:else}
    {#if paying}
      {#if loadingcsvs}
        <div>loading...</div>
      {:else}
        <div>
          <button on:click={fetchcsv}>Export CSV of all shortened links</button>
        </div>
      {/if}
      {#if csverror}
        <div>
          Error fetching CSV, may be a server issue or lack of internet
          connection...
        </div>
      {/if}
    {/if}

    {#if singleArchived}
      <div>Looks like that shortened URL was deleted or never existed.</div>
    {:else if singleError || singleEntry === null}
      <div>Error fetching that specific shortned URL.</div>
    {:else}
      <Entry {domain} entryOb={singleEntry} {paying} bind:allentries={entries} />
    {/if}

    <Search bind:searchParam submitFunc={changeSearch} />

    <div>
      <div>Sort By:</div>
      <select on:change={changeSort} value={sortParam}>
        <option value="dd">Date Created (Descending)</option>
        <option value="da">Date Created (Ascending)</option>
        <option value="ad">Alphabetical (Descending)</option>
        <option value="aa">Alphabetical (Ascending)</option>
        <option value="cd">Click Count (Descending)</option>
        <option value="ca">Click Count (Ascending)</option>
      </select>
    </div>

    {#if !entries || !entries.length || entries.length === 0}
      <div>Nothing yet...</div>
    {:else}
      <ul>
        {#each entries as entry (entry.param)}
          <SmallEntry {domain} entryOb={entry} {paying} />
        {/each}
      </ul>
      {#if less}
        <button on:click={() => changePage(false)}>Previous</button>
      {/if}
      {#if more}
        <button on:click={changePage}>Next</button>
      {/if}
    {/if}
  {/if}
</section>

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
  h2 {
    font-size: 2em;
  }
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  ul {
    width: 100%;
    padding: 30px;
  }
</style>
