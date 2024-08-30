<script>
    import { userStore } from "$lib/stores/firebaseuser";
    import { onMount } from "svelte";

    let variable = "not logged in";
    let ct = 0;

    onMount(() => {
        const unsubFirebase = userStore.subscribe((value) => {
            let firebaseUser = value;
            ct++

            if (firebaseUser) {
                if(firebaseUser.email) {
                    if (firebaseUser.emailVerified){
                        variable = firebaseUser.email;
                    } else {
                        variable = firebaseUser.email + " unverified!";
                    }
                } else {
                    variable = "no email??";
                }
            } else {
                variable = "no user";
            }
        });

        return () => {
            unsubFirebase();
        };
    });
</script>

<div>Variable: {variable}</div>
<div>Ct: {ct}</div>
