<script>
  import { onMount, onDestroy } from "svelte";
  import Chart from "chart.js/auto";
  import Modal from "../login/Modal.svelte";
  import { getToken } from "$lib/stores/firebaseuser";
  import Percentile from "./Percentile.svelte";

  export let param;
  export let chartOrQR = "none";
  let domain = import.meta.env.VITE_SHORT_DOMAIN;

  let error = false;
  let loading = true;
  let status = "free";

  let allData = null;

  let dailyChart = null;
  let weeklyChart = null;

  let countryChart = null;
  let cityChart = null;
  let osChart = null;
  let browserChart = null;

  let dailyInstance = null;
  let weeklyInstance = null;

  let countryInstance = null;
  let cityInstance = null;
  let osInstance = null;
  let browserInstance = null;

  let showFree = false;
  let showPaid = false;

  let csvErr = false;
  let csvLoading = false;

  const close = () => {
    chartOrQR = "none";
  };

  async function downloadCSV() {
    const url = import.meta.env.VITE_BACKEND_URL;
    csvLoading = true;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/clickcsv/${param}`, {
        method: "GET",
        headers: {
          Authorization: token,
          "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
        },
        credentials: "include",
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${param}-clicks.csv`;
        document.body.appendChild(a);
        a.click();
        csvLoading = false;
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        csvErr = false;
      } else {
        csvErr = true;
      }
    } catch (error) {
      csvErr = true;
    } finally {
      csvLoading = false;
    }
  }

  function createDateChart(thisChart, chartData, isdaily = true) {
    let labels;
    if (isdaily) {
      labels = chartData.keys.map((date) =>
        new Date(date).toLocaleDateString("en-US")
      );
    } else {
      labels = chartData.keys.map((date, index, array) => {
        const currentLabel = new Date(date).toLocaleDateString("en-US");
        const nextLabel =
          index < array.length - 1
            ? new Date(array[index + 1]).toLocaleDateString("en-US")
            : "Now";
        return `${currentLabel} - ${nextLabel}`;
      });
    }
    return new Chart(thisChart, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: isdaily ? "Click Count By Date" : "Click Count By Week",
            data: chartData.data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  function createDonutChart(thisChart, chartData, chartTitle) {
    return new Chart(thisChart, {
      type: "doughnut",
      data: {
        labels: chartData.keys,
        datasets: [
          {
            label: chartTitle,
            data: chartData.data,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: chartTitle,
          },
        },
      },
    });
  }

  function createAllCharts() {
    showFree = true;
    weeklyInstance = createDateChart(weeklyChart, allData.weeklyGraph, false);
    browserInstance = createDonutChart(
      browserChart,
      allData.browserGraph,
      "Web Browsers Used"
    );

    if (status === "paid") {
      showPaid = true;
      dailyInstance = createDateChart(dailyChart, allData.dailyGraph, true);
      osInstance = createDonutChart(
        osChart,
        allData.operatingGraph,
        "Operating Systems Used"
      );
      cityInstance = createDonutChart(
        cityChart,
        allData.cityGraph,
        "Cities Accessing URL"
      );
      countryInstance = createDonutChart(
        countryChart,
        allData.countryGraph,
        "Countries Accessing URL"
      );
    }
  }

  async function fetchClickData() {
    const url = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = await getToken();
      const response = await fetch(`${url}/clicks/${param}`, {
        method: "GET",
        headers: {
          Authorization: token,
          "X-User-ID": localStorage.getItem("ST_USER_KEY") || "",
        },
        credentials: "include",
      });
      if (!response.ok) {
        error = true;
        return;
      }
      const result = await response.json();
      status = result.class ? result.class : "free";
      allData = result.data ? result.data : null;
      createAllCharts();
    } catch (err) {
      console.log(err);
      error = true;
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    await fetchClickData();
    loading = false;
  });

  function destroyCharts() {
    if (dailyInstance) {
      dailyInstance.destroy();
    }
    if (weeklyInstance) {
      weeklyInstance.destroy();
    }
    if (countryInstance) {
      countryInstance.destroy();
    }
    if (cityInstance) {
      cityInstance.destroy();
    }
    if (osInstance) {
      osInstance.destroy();
    }
    if (browserInstance) {
      browserInstance.destroy();
    }
  }

  onDestroy(destroyCharts);
</script>

<Modal closerFunc={close}>
  <div class="closeline">
    <button class="link-button" on:click={close}>&times;</button>
  </div>
  {#if loading}
    <div>Loading analytics</div>
  {:else if error}
    <div>Error loading analytics, please close and try again</div>
  {:else if allData}
    <div>All Click Data for {domain + "/" + param}</div>
    <div>Current extended url: {allData.realUrl}</div>
    <div>Total Clicks: {allData.total}</div>
    {#if status === "paid"}
      <div>Total Unique Visitors by IP: {allData.uniqueVisits}</div>
    {:else}
      <div>Total Unique Visitors by IP: ???</div>
    {/if}

    <div>
      Clicks from QR Code: <Percentile
        numerator={allData.fromQr}
        denominator={allData.total}
        blocked={false}
      />
    </div>

    <div>
      Clicks from Bots: <Percentile
        numerator={status === "paid" ? allData.fromBot : 0}
        denominator={allData.total}
        blocked={status === "free"}
      />
    </div>

    <div>
      Clicks from Mobile Devices: <Percentile
        numerator={status === "paid" ? allData.fromMobile : 0}
        denominator={allData.total}
        blocked={status === "free"}
      />
    </div>

    <div>
      Clicks from Custom URL: <Percentile
        numerator={status === "paid" ? allData.fromCustom : 0}
        denominator={allData.total}
        blocked={status === "free"}
      />
    </div>

    {#if status === "paid"}
      <div>Source for data analytics:</div>
      <div>
        Click below to download a csv with all data for each click this entry
        has gotten
      </div>

      {#if csvLoading}
        <div>loading csv...</div>
      {:else}
        <button on:click={downloadCSV}>Download CSV</button>
      {/if}
      {#if csvErr}
        <div>Error downloading csv</div>
      {/if}
    {/if}
  {:else}
    <div>Error loading analytics, please close and try again</div>
  {/if}
  <div>
    <div><canvas class:null={!showPaid} bind:this={dailyChart}></canvas></div>
    {#if !loading && !error & (status === "free")}
      <div>Start a paid membership to see clicks by day</div>
    {/if}

    <div>
      <canvas class:null={!showFree} bind:this={weeklyChart}></canvas>
    </div>

    <div><canvas class:null={!showPaid} bind:this={cityChart}></canvas></div>
    {#if !loading && !error & (status === "free")}
      <div>Start a paid membership to see share of clicks by city</div>
    {/if}

    <div><canvas class:null={!showPaid} bind:this={countryChart}></canvas></div>
    {#if !loading && !error & (status === "free")}
      <div>Start a paid membership to see share of clicks by country</div>
    {/if}

    <div><canvas class:null={!showPaid} bind:this={osChart}></canvas></div>
    {#if !loading && !error & (status === "free")}
      <div>
        Start a paid membership to see share of clicks by operating system
      </div>
    {/if}

    <div>
      <canvas class:null={!showFree} bind:this={browserChart}></canvas>
    </div>
  </div>
</Modal>

<style>
  .null {
    display: none;
  }
</style>
