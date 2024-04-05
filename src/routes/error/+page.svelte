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
  