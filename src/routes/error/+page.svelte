<script>

    import { goto } from "$app/navigation";

    let goHome = () => {
      goto("./");
    };
    export let error = "No URL exists here";
    export let status = 404;
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
  