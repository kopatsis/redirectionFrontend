<script>
  import Modal from "./login/Modal.svelte";
  export let open = false;
</script>

<Modal bind:open>
  <div class="closeline">
    <button class="link-button" on:click={() => (open = false)}>&times;</button>
  </div>

  <h1>Terms of Service</h1>

  <h2>1. Acceptance of Terms</h2>
  <p>
    By accessing or using our website, you agree to comply with and be bound by
    these Terms of Service. If you do not agree with any part of these terms,
    please do not use our services.
  </p>

  <h2>2. User Responsibilities</h2>
  <p>
    Users are responsible for providing accurate information when creating
    accounts and shortening URLs. You agree not to use our services for any
    unlawful or prohibited activities, including but not limited to spam,
    harassment, or malicious conduct.
  </p>

  <h2>3. Services Provided</h2>
  <p>
    Our services include URL shortening, QR code generation, and analytics
    tracking for how often shortened URLs are used. You acknowledge that we may
    track and analyze the usage of shortened URLs for performance and
    improvement purposes.
  </p>

  <h2>4. Privacy Settings</h2>
  <p>
    For information on how we collect and use your data, please refer to our
    Cookie Policy and Email Preferences, which can be accessed via a popup in
    the main menu.
  </p>

  <h2>5. Intellectual Property</h2>
  <p>
    All content, features, and functionalities on the website, including but not
    limited to text, graphics, logos, and software, are the exclusive property
    of our website or its licensors and are protected by copyright, trademark,
    and other intellectual property laws.
  </p>

  <h2>6. Limitation of Liability</h2>
  <p>
    To the fullest extent permitted by law, our website shall not be liable for
    any direct, indirect, incidental, special, consequential, or punitive
    damages arising from or related to your use of our services. This includes,
    but is not limited to, damages for loss of profits, data, or other
    intangible losses.
  </p>

  <h2>7. Governing Law</h2>
  <p>
    These Terms of Service shall be governed by and construed in accordance with
    the laws of California, United States, without regard to its conflict of law
    principles.
  </p>

  <h2>8. Modifications to Terms</h2>
  <p>
    We reserve the right to modify these Terms of Service at any time. Any
    changes will be effective immediately upon posting on our website. Your
    continued use of the services after any changes constitutes your acceptance
    of the new terms.
  </p>

  <h2>9. Contact Information</h2>
  <p>
    For any questions or concerns regarding these Terms of Service, please
    contact us via the popup accessible from the main menu.
  </p>
</Modal>

<style>
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
</style>