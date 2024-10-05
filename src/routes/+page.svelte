<script>
  import { onMount } from "svelte";
  import { getKey } from "./getKey.js";
  import { goto } from "$app/navigation";
  import Instructions from "./Instructions.svelte";
  import QrMessage from "./QRMessage.svelte";
  import { getToken, userStore } from "$lib/stores/firebaseuser.js";
  import { page } from "$app/stores";
  import {
    CheckBoth,
    CheckHasPass,
    CheckPay,
    paidStore,
  } from "$lib/stores/userInfoStore.js";
  import Chart from "./past/Chart.svelte";
  import Contact from "./Contact.svelte";

  let user = null;
  let workingError = "";

  let key = 0;

  let actual_url = "";

  let qrinst = false;

  let size = "Partial";
  let btext = "More...";

  let contact = false;

  let referred = false;
  let paying = null;
  paidStore.subscribe((value) => {
    paying = value;
  });

  async function handleSubmit() {
    const url = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/entry`, {
        method: "POST",
        headers: {
          Authorization: token,
          "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ url: actual_url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData["Error Type"] === "Not a URL that can be parsed") {
          workingError =
            "Error: The URL you provided is not formatted correctly and would not work. Please try again.";
        } else {
          workingError =
            "Unable to reach our server :/ Check your internet but it might be us";
        }
      } else {
        const data = await response.json();
        if (data.parameter) {
          goto(`/past/${data.parameter}`);
        } else {
          workingError =
            "Unable to reach our server :/ Check your internet but it might be us";
        }
      }
    } catch (error) {
      workingError =
        "Unable to reach our server :/ Check your internet but it might be us";
    }
  }

  onMount(async () => {
    const queryParams = $page.url.searchParams;
    referred = queryParams.has("dne");
    const unsubFirebase = userStore.subscribe(async (value) => {
      if (value !== undefined) {
        user = value;
        await CheckBoth();
      }
    });
    return unsubFirebase;
  });
</script>

<svelte:head>
  <title>Home</title>
  <meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
  <div>
    The shortest, fastest, easiest, all around best URL Shortener + Analytics
    Tracker + QR Code generator + more
  </div>
  {#if referred}
    <div>
      Looks like that shortened URL didn't lead to anything that exists. But you
      can still make one here! :)
    </div>
  {/if}
  <h3>Enter your URL to shorten here:</h3>
  <form on:submit|preventDefault={handleSubmit} class="centeroverf">
    <input
      required
      type="text"
      placeholder="Enter URL here"
      bind:value={actual_url}
      style="color: dark-gray;"
    />
    <button type="submit">Shorten!</button>
  </form>
  {#if workingError}{workingError}{/if}

  <div>
    <div>The shortest possible URLs</div>
    <div>Shortened URLs never expire</div>
    <div>Unlimited shortened URL generation</div>
    <div>The fastest speed to original URL</div>
    <div>Custom, SEO-friendly shortened URL handles</div>
    <div>Click tracking analytics dashboard</div>
    <div>Custom QR Code generation for shortened URLs</div>
    <div>Editable original URL after shortening</div>
    <div>Easy, pain-free removal if needed</div>
    <div>CSV export for data analytics</div>
  </div>

  <div>
    <div>
      <div><a href="#about-mp">About</a></div>
      <div><a href="#benefits-mp">Subscription Benefits</a></div>
      <div><a href="#faq-mp">FAQs</a></div>
      <div><a href="#contact-mp">Contact</a></div>
    </div>

    <div>
      <h3 id="about-mp">More Details About Us</h3>
      <div>
        <h4>How does this service work?</h4>
        <div>
          Shorten Track's URL shortening process is as straightforward as we
          could possibly make it. Just enter any URL of any length in the bar
          above, then click "Shorten!". A URL like the one below will be
          generated for you. Our shortened URLs are MAXIMUM 12 characters total,
          in the format of "shk.fm/" + a randomly generated 2-5 digit string.
          You can use this shortened URL on any device in place of your previous
          URL and it will take you to the same place every time. The shortened
          URL NEVER expires and will always work, unless you choose to delete
          it. You can also edit what the original URL is while keeping the
          shortened one the same. We don't share your shortened URLs with anyone
          else (ex. if someone has entered the same original URL as you, they'll
          still get a different shortened one).
        </div>
      </div>

      <div>
        <h4>Do I have to make an account?</h4>
        <div>
          No, but it's really easy if you want to. Without an account, you can
          use all of Shorten Track's free features and previous shortened URLs
          will be saved on your device. But if you want to access all your
          shortened URLs and/or use our high-end paid features, you can create
          an account. You can either enter an email and password, verify your
          email, then bam, account created. If that sounds like too much work
          (understandable), you can use the email link authentication, where you
          enter your email, click the link sent to that email address, and your
          account has automatically been created and you're signed in. You can
          add a password to this account later if you want.
        </div>
      </div>

      <div>
        <h4>Can I see my previous shortened URLs?</h4>
        <div>
          Yes, with or without an account. After the shortened URL is generated,
          you will be taken to a page where you can copy, modify, or delete that
          shortened URL. This page is also where you get the QR code, see
          analytics, or add a custom shortened URL handle (for paid members).
          Below, you'll find all of your other shortened URLs for your account
          (or if you don't have one, your current device). You can use the
          search bar and sorting to find any of your old ones if you have
          generated many of them in the past. And if you're a paid member and
          need a list of all shortened URLs on your account, you can download a
          CSV with everything generated on your account.
        </div>
      </div>

      <div>
        <h4>How do shortened URLs work? Is it fast?</h4>
        <div>
          All services that offer shortened URLs use HTTP redirection to shorten
          URLs. This means when someone visits your shortened URL, our server
          searches for your original URL, then tells the browser to go there.
          Pretty simple. An issue many URL shortening services run into is
          speed. If their server is sluggish or overused, it can take an
          embarrassing amount of time to finally get you to the original URL's
          page. Yikes. Not us though. Shorten Track leverages the power of Redis
          and Go to make sure there is no waiting for the shortened URL to work.
          The combination of these futuristic technologies allows the
          redirection to the original URL to take place typically in less than
          15 milliseconds or faster (1/10th of the time it takes to blink),
          whereas other services can take up to a second or more, making users
          wonder what's going wrong. Our service is also set to autoscale, so it
          doesn't matter if everyone on earth tries to use your shortened URL at
          the same time, it'll still be fast.
        </div>
      </div>

      <div>
        <h4>Can I choose what my shortened URL says?</h4>
        <div>
          Yes, you can add a custom handle for shortened URLs. If you have a
          paid membership, you can add a custom handle (the portion after the
          shk.fm/) to your shortened URL. You can enter any letter, number, or
          dashes/underscores and as long as no one else has that handle claimed,
          it'll work the same as your auto-generated shortened URL.
          Personalized, shortened URLs like this are excellent for SEO (search
          engine optimization), especially for small businesses. We recommend
          you try to keep the custom handle brief and memorable (like
          shk.fm/flowers-by-gustavo), compared to overly lengthy handles (like
          shk.fm/no-one-will-remember-this-super-long-url-handle-for-flowers-by-gustavo).
          And yes, those two are both taken.
        </div>
      </div>

      <div>
        <h4>What do you mean by analytics? What can I see?</h4>
        <div>
          Every time someone clicks your shortened URL, we track and save all
          data that we are legally allowed to, such as the browser, city and
          country, and more. When you click Analytics, you can see this
          information presented with number metrics such as total click count,
          graphs of clicks over time, and pie charts of what browsers were used
          to access your shortened URL. Here's a comparison of what analytics
          data you'll be able to see based on your membership.
          <br /><br />
          FREE:<br />
          - Total Click Counts<br />
          - % of clicks from QR code<br />
          - Weekly click count graph (over 6 weeks)<br />
          - Browsers used Pie Chart<br /><br />

          PAID:<br />
          - Total Click Counts<br />
          - Total Unique Visitor Counts<br />
          - % of clicks from QR code<br />
          - % of clicks from Bots<br />
          - % of clicks from Mobile<br />
          - % of clicks from Custom Shortened URL Handle<br />
          - Weekly click count graph (over 6 weeks)<br />
          - Daily click count graph (over 1 week)<br />
          - Browser share Pie Chart<br />
          - Operating Systems share Pie Chart<br />
          - Country share Pie Chart<br />
          - City share Pie Chart
        </div>
      </div>

      <div>
        <h4>You can create QR Codes? Free?</h4>
        <div>
          Yes, for every shortened URL, you can generate a QR code. You can
          download this as a PNG image to use if you need to efficiently share
          your shortened URL. You can also specify whether the QR code goes to
          the shortened URL (or custom shortened URL if you have one) or the
          original URL you entered. Just bear in mind that if the QR code goes
          directly to your original URL, you won't be able to track click
          analytics... Looking for JUST a QR code generator without any
          shortened URL nonsense? We have that here, where you can generate and
          download a QR code for any URL or other piece of text instantly.
        </div>
      </div>

      <div>
        <h4>Can I access or export any of this data?</h4>
        <div>
          Yes, with a paid membership you can generate and download a CSV with
          detailed information of all shortened URLs on your account. You'll
          find the button to export it next to the search bar on the Past
          Shortened URLs page (here). Additionally, when looking at the
          analytics dashboard for a specific shortened URL, you can download all
          click analytics for that entry as a CSV. This button is at the top of
          the window. Note that if you have a lot of data to export, it may take
          a second to generate and download in your browser.
        </div>
      </div>
    </div>

    <div>
      <h3 id="benefits-mp">Free Membership vs Paid Benefits</h3>
      <div>
        BOTH <br />
        Unlimited Shortened URL generation <br />
        No expiration <br />
        QR Codes and analytics dashboard <br /><br />

        FREE -- PAID <br />
        Ad supported -- NO ads ever <br />
        No custom shortened URL handles -- Unlimited custom shortened URL handles
        <br />
        No CSVs to export -- Unlimited CSV exports of shortened URLs and click tracking
        analytics <br />
        Basic entry-level analytics tracking -- Full-scale data-oriented analytics
        tracking <br /><br />

        FREE: <br />
        - Total Click Counts <br />
        - % of clicks from QR code <br />
        - Weekly click count graph (over 6 weeks) <br />
        - Browsers used Pie Chart <br /><br />

        PAID: <br />
        - Total Click Counts <br />
        - Total Unique Visitor Counts <br />
        - % of clicks from QR code <br />
        - % of clicks from Bots <br />
        - % of clicks from Mobile <br />
        - % of clicks from Custom Shortened URL Handle <br />
        - Weekly click count graph (over 6 weeks) <br />
        - Daily click count graph (over 1 week) <br />
        - Browser shard Pie Chart <br />
        - Operating Systems share Pie Chart <br />
        - Country share Pie Chart <br />
        - City share Pie Chart <br /><br />

        $0 / month -- $4.99 / month <br /><br />

        Trying to find corporate memberships? Contact Us here to let us know
        what you're looking for and how many are in your team, and we'll proceed
        from there :).
      </div>
    </div>

    <div>
      <h3 id="faq-mp">Some Frequently Asked Questions</h3>

      <div>
        <div>
          Do I need to enter the "https://" or "www" in the URL I want to
          shorten.
        </div>
        <div>No, if you leave those out, it will still work correctly.</div>
      </div>

      <div>
        <div>
          Do I need to enter the "https://" before the shk.fm/... when accessing
          a shortened URL?
        </div>
        <div>No, browsers do not need it to access the shortened URL.</div>
      </div>

      <div>
        <div>
          Can I upload a CSV/Excel/other file to create many shortened URLs at
          once?
        </div>
        <div>
          Not yet, but we are working on adding that feature for paid users.
        </div>
      </div>

      <div>
        <div>What is the limit of shortened URLs I can create?</div>
        <div>There is no limit.</div>
      </div>

      <div>
        <div>
          Can I get more personal info, such as name or address, from users
          accessing my shortened URL?
        </div>
        <div>No that is illegal.</div>
      </div>

      <div>
        <div>
          If I visit a shk.fm shortened URL, is my IP address stored by Shorten
          Track?
        </div>
        <div>
          No, visitor IP addresses are securely encrypted before we do anything
          with them, so they are directly stored and cannot be accessed by
          anyone.
        </div>
      </div>

      <div>
        <div>Do shortened URLs work in all countries?</div>
        <div>Yes, anywhere with internet.</div>
      </div>

      <div>
        <div>
          Why do some of my shortened URLs show that bots have accessed them?
        </div>
        <div>
          Sometimes, when you share a shortened URL via text or social media and
          the title, image, etc from the original URL show up, this is recorded
          as a bot visiting the shortened URL.
        </div>
      </div>

      <div>
        <div>
          What happens if the original URL doesn't work or leads nowhere?
        </div>
        <div>
          We still shorten the URL and it will still track analytics, but the
          user will be taken to the exact same page as if you entered the
          inexistent URL directly in the browser.
        </div>
      </div>
    </div>

    <div>
      <h3 id="contact-mp">Contact Us</h3>
      <div>
        Still have questions? Use this form to contact us with any queries,
        suggestions, or woes.
      </div>
      <button on:click={() => (contact = true)}>Contact Form</button>
    </div>
  </div>
</section>

{#if contact}
  <Contact
    bind:open={contact}
    email={user ? (user.email ? user.email : "") : ""}
    loggedIn={user && user.email}
  />
{/if}

<style>
  section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 0.6;
  }

  input {
    margin-right: 8px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 80vw;
    max-width: 500px;
    min-width: 300px;
  }
  input:focus {
    outline: none;
    border-color: var(--color-theme-1);
    border-radius: 3px solidx;
    outline-color: var(--color-theme-1);
  }
  button {
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 2px;
    border: none;
    color: var(--color-text);
  }

  button:hover {
    background: var(--color-theme-1);
    color: white;
    outline: none;
  }

  .centeroverf {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }

  h3 {
    width: 100%;
  }
</style>
