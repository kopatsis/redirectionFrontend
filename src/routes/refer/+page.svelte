<script>
  import { goto } from "$app/navigation";
  import { isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";
  import { onMount } from "svelte";
  import { auth } from "../../auth/firebase";

  onMount(() => {
    const email = localStorage.getItem("CBEmailForSignIn");
    if (email && isSignInWithEmailLink(auth, window.location.href)) {
      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          localStorage.removeItem("CBEmailForSignIn");
          goto("./teststrict");
        })
        .catch((error) => {
          console.error("Error signing in:", error);
        });
    }
  });
</script>

<div>
  <h1>Finishing Sign-In...</h1>
</div>
