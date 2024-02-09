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
      goto('./home')
    }
  </script>
  
  <main>
    {#if errorMessage}
      <p>Error: {errorMessage}</p>
      <div>But you can add one here: </div>
      <button on:click={goHome}>Return Home</button>
    {/if}
  </main>