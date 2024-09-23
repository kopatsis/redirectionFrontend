<script>
  import { goto } from "$app/navigation";
  import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
  import { onMount } from "svelte";
  import { auth } from "../../auth/firebase";

  let error = "";

  onMount(async () => {
    const email = localStorage.getItem("CBEmailForSignIn");
    if (email && isSignInWithEmailLink(auth, window.location.href)) {
      try {
        await signInWithEmailLink(auth, email, window.location.href);
        localStorage.removeItem("CBEmailForSignIn");
        localStorage.removeItem("HASPASS");
        goto("./teststrict");
      } catch (err) {
        error = "Error, could not sign in: " + err;
      }
    }
  });
</script>

<div>
  {#if !error}
    <h1>Finishing Sign-In...</h1>
  {:else}
    {error}
  {/if}
</div>
