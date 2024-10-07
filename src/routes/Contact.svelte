<script>
  import { getRealToken } from "$lib/stores/firebaseuser";
  import { Turnstile } from "svelte-turnstile";
  import Modal from "./login/Modal.svelte";

  export let email = "";
  export let open = true;
  export let loggedIn = false;
  let success = false;
  let message = "";

  async function submitForm(event) {
    try {
      const url =
        import.meta.env.VITE_PAY_URL || "https://pay.shortentrack.com";

      event.preventDefault();

      const formData = new FormData(event.target);

      if (!loggedIn) {
        await new Promise((resolve) => setTimeout(resolve, 1750));
      }

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
  <div class="outer">
    <div class="closeline">
      <button class="link-button" on:click={() => (open = false)}
        >&times;</button
      >
    </div>
    <h2>Contact Us</h2>
    {#if message}
      <div>{message}</div>
    {/if}

    {#if !success}
      <form on:submit|preventDefault={submitForm}>
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name" placeholder="Your Name" required/>
        </div>
        <div>
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            placeholder="your@email.com"
            required
          />
        </div>

        <div>
          <label for="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Suggestion"
            required
          />
        </div>
        <div>
          <label for="body">Body:</label>
          <textarea
            rows="5"
            id="body"
            name="body"
            placeholder="Content of email"
            required
          ></textarea>
        </div>

        <div class="buttonsend">
          <Turnstile siteKey="0x4AAAAAAAiN0D-hYmv3ulQQ" />
        </div>

        <div class="buttonsend">
          <button type="submit">Send</button>
        </div>
      </form>
    {/if}
  </div>
</Modal>

<style>
  .buttonsend {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .link-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: inherit;
    font-size: inherit;
    font-size: 24px;
    color: var(--color-text);
  }

  .link-button:hover,
  .link-button:focus {
    background: none;
    color: var(--color-text);
  }

  .closeline {
    display: flex;
    justify-content: right;
    width: 100%;
  }

  h2 {
    font-size: 2em;
    font-weight: bold;
  }

  textarea {
    width: 100%;
    font-size: 1em;
    font-family: inherit;
    margin-bottom: 8px;
  }

  label {
    display: block;
  }

  input {
    width: 100%;
    margin-bottom: 8px;
  }

  .outer {
    margin: 20px;
    min-width: min(500px, 95dvw);
  }

  button {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    border: none;
  }
  button:hover {
    background: var(--color-theme-1);
    color: white;
    outline: none;
  }
</style>
