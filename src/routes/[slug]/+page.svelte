<script>
  import { onMount } from "svelte";
  import { page } from "$app/stores"; // Import the page store
  import { goto } from "$app/navigation"; // Import goto for SvelteKit navigation

  let errorMessage = "";

  onMount(async () => {
    const { slug } = $page.params;

    try {
      const response = await fetch(
        `https://cs361a.wl.r.appspot.com/entry/${slug}`,
      );
      const data = await response.json();

      if (data.url) {
        postClick(slug);
        window.location.href = data.url;
      } else {
        console.error("No URL found in the response");
        errorMessage = "No original URL is associated with this shortened URL";
      }
    } catch (error) {
      console.error("Fetch error:", error);
      errorMessage = error.message || "An error occurred while fetching data.";
    }
  });

  let postClick = async (slug) => {
    const url = "https://cs361a.wl.r.appspot.com/analyze";
    const data = JSON.stringify({ param: slug });

    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: data,
        keepalive: true
    });
};

  let goHome = () => {
    goto("./");
  };
</script>

<main>
  {#if errorMessage}
    <h1>Error: {errorMessage}</h1>
    <h2>If you want to use this service,:</h2>
    <button on:click={goHome}>Return Home</button>
  {/if}
</main>

<style>
  h1 {
    font-size: 1.5em;
  }
  h2 {
    font-size: 1.25em;
  }
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
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
</style>
