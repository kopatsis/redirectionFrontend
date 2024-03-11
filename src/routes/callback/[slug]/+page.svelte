<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let data = {};
    let errorMessage = "";

    async function postData(url = "", data = {}) {
        const response = await fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
        });
        return response.json();
    }

    $: {
        const paramsObject = Object.fromEntries(
            $page.url.searchParams.entries(),
        );
        data = paramsObject;
    }

    onMount(() => {

        const { slug } = $page.params;

        postData("https://cs361a.wl.r.appspot.com/login", data)
            .then((response) => {
                const key = response.key;
                localStorage.setItem("361UserKey", key.toString());
                localStorage.setItem("userPicture", data.picture);
                localStorage.setItem("userName", data.name);
                goto(`/${slug}`);
            })
            .catch((error) => {
                errorMessage = error.message;
                setTimeout(() => goto("/"), 3000);
            });
    });
</script>

{#if errorMessage}
    <p style="color: red;">Error: {errorMessage}</p>
{:else}
    <h1>Processing Login...</h1>
{/if}
