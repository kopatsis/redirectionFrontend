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
        const dataString = $page.url.searchParams.get("data");
        let parsedData;
        if (dataString) {
            try {
                parsedData = JSON.parse(decodeURIComponent(dataString));
            } catch (e) {
                console.error("Error parsing JSON from URL parameter", e);
                parsedData = {}; // or any fallback you prefer
            }
        }
        data = parsedData;
        console.log("Receive");
        console.log(data);
    }

    onMount(() => {
        console.log("Send");
        console.log(data);
        postData("https://cs361a.wl.r.appspot.com/login", data)
            .then((response) => {
                console.log(response)
                key = response.key;
                localStorage.setItem("361UserKey", key.toString());
                localStorage.setItem("userPicture", data.picture);
                localStorage.setItem("userName", data.name);
                goto(`/`);
            })
            .catch((error) => {
                errorMessage = error.message;
                // setTimeout(() => goto("/"), 3000);
            });
    });
</script>

{#if errorMessage}
    <p style="color: red;">Error: {errorMessage}</p>
{:else}
    <h1>Processing Login...</h1>
{/if}
