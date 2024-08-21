<script>
    import { userStore } from "$lib/stores/firebaseuser";
    import { onMount } from "svelte";

    let variable = "loading";
    let ct = 0;

    onMount(() => {
        const unsubFirebase = userStore.subscribe((value) => {
            firebaseUser = value;
            ct++
            if (firebaseUser === undefined) {
            	variable = "loading";
            }else if (firebaseUser === null) {
            	variable = "no user";
            } else if (firebaseUser) {
            	if(firebaseUser.email) {
                    if (firebaseUser.emailVerified){
                        variable = firebaseUser.email;
                    } else {
                        variable = firebaseUser.email + " unverified!";
                    }
                } else {
                    variable = "no email??";
                }
            }
        });

        return () => {
            unsubFirebase();
        };
    });
</script>

<div>Variable: {variable}</div>
<div>Ct: {ct}</div>
