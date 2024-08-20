<script>
    import { getAuth, getRedirectResult } from "firebase/auth";
    import { goto } from "$app/navigation";

    async function handleRedirect() {
        const auth = getAuth();

        try {
            const result = await getRedirectResult(auth);

            if (result && result.user) {
                goto("./");
            } else {
                goto("./login");
            }
        } catch (error) {
            goto("./login");
        }
    }

    handleRedirect();
</script>

<p>Processing sign-in...</p>
