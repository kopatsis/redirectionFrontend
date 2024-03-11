<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores'; // Import the page store
    import { goto } from '$app/navigation'; // Import goto for SvelteKit navigation
  
    let errorMessage = '';
  
    onMount(async () => {
      const { slug } = $page.params; // Destructure the slug from the page params
  
      try {
        const response = await fetch(`https://cs361a.wl.r.appspot.com/entry/${slug}`);
        const data = await response.json();
        
        if (data.url) {
          // HERE! Increment the python api with slug and current time. 
          window.location.href = data.url; // Redirects to the URL
        } else {
          console.error('No URL found in the response');
          errorMessage = 'No original URL is associated with this shortened URL';
        }
      } catch (error) {
        console.error('Fetch error:', error);
        errorMessage = error.message || 'An error occurred while fetching data.';
      }
    });

    let goHome = () => {
      goto('./')
    }
  </script>
  
  <main>
    {#if errorMessage}
      <h1>Error: {errorMessage}</h1>
      <h2>But you can add one here: </h2>
      <button on:click={goHome}>Return Home</button>
    {/if}
  </main>

  <style>
    h1{
        font-size: 1.5em;
    }
    h2{
        font-size: 1.25em;
    }
    main{
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