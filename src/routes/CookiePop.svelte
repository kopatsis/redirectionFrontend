<script>
    import Modal from "./login/Modal.svelte";

    export let open = true;
    export let openOther = true;

    const closerFunc = (saved=true) => {
        if(saved){
            localStorage.setItem("CookiePolicy", "N/A");
        } else {
            localStorage.setItem("CookiePolicy", "None");
        }
        openOther = false;
        open = false;
    }
</script>

<Modal closerFunc={closerFunc}>
    <div class="closeline">
        <button class="link-button" on:click={closerFunc}
            >&times;</button
        >
    </div>

    <p>Here's all the stuff with our cookies: blah blah blah blah blah blah blah blah blah blah blah blah blah blah 
        blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
        blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
        blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
        blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
        blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah
    </p>
    <div><button on:click={closerFunc}>Accept All Cookies</button><button on:click={() => closerFunc(false)}>Only essential cookies</button></div>
</Modal>
