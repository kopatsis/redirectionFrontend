<script>
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";

  let currentTop = " ";
  let currentBottom = " ";

  const altBottom = "Example Shortened URL";

  let arrayNum = 1;
  let iterator = 0;

  let intervalId;

  function UpdateText() {
    if(arrayNum === 1) {
        if (iterator + 1 < array1.length) {
            iterator++;
            currentTop = array1[iterator];
        } else {
            arrayNum++;
            iterator = 0;
            currentTop = array2[iterator]
        }
    } else if (arrayNum === 2) {
        if (iterator + 1 < array2.length) {
            iterator++;
            currentTop = array2[iterator];
        } else {
            arrayNum++;
            iterator = 0;
            currentTop = array3[iterator];
            currentBottom = " ";
        }
        if (iterator === 22) {
            currentBottom = altBottom
        }
    } else {
        if (iterator + 1 < array3.length) {
            iterator++;
            currentTop = array3[iterator];
        } else {
            arrayNum = 1;
            iterator = 0;
            currentTop = array1[iterator]
        }
    }
  }

  const array1 = [
    " ",
    " ",
    " ",
    " ",
    " ",
    " ",
    "s",
    "sh",
    "sho",
    "shor",
    "short",
    "shorte",
    "shorten",
    "shorten ",
    "shorten +",
    "shorten + ",
    "shorten + t",
    "shorten + tr",
    "shorten + tra",
    "shorten + trac",
    "shorten + track",
    "shorten + track ",
    "shorten + track f",
    "shorten + track fo",
    "shorten + track for",
    "shorten + track for ",
    "shorten + track for m",
    "shorten + track for me",
    "shorten + track for me ",
    "shorten + track for me|",
    "shorten + track for me|",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me|",    
    "shorten + track for me|",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me ",
    "shorten + track for me|",
    "shorten + track for me|",
    "shorten + track for me ",
    "shorten + track for me ",
  ];

  const array2 = [
    "shorten + track for me",
    "shorten + trak for me",
    "shorten + trk for me",
    "shorten + tk for me",
    "shorten + k for me",
    "shorten +k for me",
    "shorten k for me",
    "shortenk for me",
    "shortek for me",
    "shortk for me",
    "shork for me",
    "shok for me",
    "shk for me",
    "shk for m",
    "shk form",
    "shk fom",
    "shk fm",
    "shk.fm",
    "shk.fm/",
    "shk.fm/a",
    "shk.fm/aX",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
    "shk.fm/aX3",
  ];

  const array3 = [
    "shk.fm/aX3",
    "shk.fm/aX",
    "shk.fm/a",
    "shk.fm/",
    "shk.fm",
    "shk.f",
    "shk.",
    "shk",
    "sh",
    "s",
    " ",
    " ",
    ":",
    ":)",
    ":)",
    ":",
    " ",
    " ",
  ];

  onMount(() => {
    intervalId =setInterval(UpdateText, 88);
  })

  onDestroy(() => {
    clearInterval(intervalId);
  });
</script>

<div class="outer">
  <h1>{currentTop}</h1>
  <h4 transition:fade={{ duration: 1000 }}>{currentBottom}</h4>
</div>

<style>
    .outer {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: baseline;
        justify-content: baseline;
    }

    h1, h4 {
        padding: 0px;
        margin: 8px;
    }
</style>
