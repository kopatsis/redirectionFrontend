<script>
  import { getRealToken } from "$lib/stores/firebaseuser";
  import { Turnstile } from "svelte-turnstile";
  import Modal from "./login/Modal.svelte";

  export let email = "";
  export let open = true;
  let success = false;
  let message = "";

  async function submitForm(event) {
    try {
      const url =
        import.meta.env.VITE_PAY_URL || "https://pay.shortentrack.com";

      event.preventDefault();

      const formData = new FormData(event.target);
      const jsonObject = {};
    //   formData.forEach((value, key) => {
    //     jsonObject[key] = value;
    //   });

      const token = await getRealToken();

      const response = await fetch(`${url}/administrative/helpemail`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      message = data.message || "Form submitted successfully!";
    } catch (error) {
      message = "Failed to send the email. Please close and try again later.";
    } finally {
      success = true;
    }
  }
</script>

<Modal bind:open>
  <div class="closeline">
    <button class="link-button" on:click={() => (open = false)}>&times;</button>
  </div>
  {#if message}
    <div>{message}</div>
  {/if}

  {#if !success}
    <form on:submit|preventDefault={submitForm}>
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" value={email} />
      </div>

      <div>
        <label for="subject">Subject:</label>
        <input type="text" id="subject" name="subject" />
      </div>
      <div>
        <label for="body">Body:</label>
        <textarea id="body" name="body"></textarea>
      </div>

      <div>
        <Turnstile siteKey="0x4AAAAAAAiN0D-hYmv3ulQQ" />
      </div>

      <button type="submit">Send</button>
    </form>
  {/if}
</Modal>
