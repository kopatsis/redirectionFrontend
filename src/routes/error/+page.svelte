<script>

    import { goto } from "$app/navigation";
    import { userStore } from "$lib/stores/firebaseuser";
    import { CheckBoth } from "$lib/stores/userInfoStore";
    import { onMount } from "svelte";

    export let error = "No URL exists here";
    export let status = 404;

    onMount(async () => {
        const unsubFirebase = userStore.subscribe(async (value) => {
            if (value !== undefined) {
                await CheckBoth();
            }
        });
        return unsubFirebase;
    });
  </script>
  
  <main>
    {#if error}
      <h1>Error: {error}</h1>
      <h2>Status: {status}</h2>
      <h2>If you want to use this service:</h2>
      <a href="/">Return Home</a>
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
  </style>
  