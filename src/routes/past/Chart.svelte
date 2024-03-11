<script>
    export let param;

    import { onMount, onDestroy } from "svelte";
    import Chart from "chart.js/auto";

    let chartInstance;
    let chartElement;

    let hourly = null;
    let daily = null;
    let weekly = null;

    let pendingData = { "0": 0 };

    let displaying = "Hourly";

    let error = false;

    let loading = true;

    async function fetchClickData() {
        const urls = [
            `http://127.0.0.1:5000/clicks_last_day_by_hour/${param}`,
            `http://127.0.0.1:5000/clicks_last_week_by_day/${param}`,
            `http://127.0.0.1:5000/clicks_last_month_by_week/${param}`,
        ];

        try {
            const responses = await Promise.all(
                urls.map((url) => fetch(url).then((res) => res.json())),
            );

            hourly = responses[0];
            daily = responses[1];
            weekly = responses[2];
        } catch (error) {
            console.error("Error fetching data:", error);
            error = true;
        }
    }

    function updateChart(passed) {
        let entries;
        if (passed === null) {
            entries = Object.entries(pendingData);
        } else {
            entries = Object.entries(passed);
        }
        const sortedEntries = entries.sort((a, b) => a[0].localeCompare(b[0]));
        const labels = sortedEntries.map((entry) => entry[0]);
        const dataset = sortedEntries.map((entry) => entry[1]);

        if (chartInstance) {
            chartInstance.data.labels = labels;
            chartInstance.data.datasets[0].data = dataset;
            chartInstance.update();
        } else {
            chartInstance = new Chart(chartElement, {
                type: "bar",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "Count",
                            backgroundColor: "rgb(75, 192, 192)",
                            borderColor: "rgb(75, 192, 192)",
                            data: dataset,
                        },
                    ],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        }
    }

    onMount(async () => {
        await fetchClickData();

        loading = false;

        updateChart(hourly);
    });

    // $: chartData, updateChart(chartData);

    function clickHourly(){
        if (displaying !== "Hourly"){
            displaying = "Hourly";
            updateChart(hourly)
        }
    }

    function clickDaily(){
        if (displaying !== "Daily"){
            displaying = "Daily";
            updateChart(daily)
        }
    }

    function clickWeekly(){
        if (displaying !== "Weekly"){
            displaying = "Weekly";
            updateChart(weekly)
        }
    }

    onDestroy(() => {
        if (chartInstance) chartInstance.destroy();
    });
</script>

{#if loading}
    <div>Loading analytics</div>
{:else if error}
    <div>Error loading analytics</div>
{:else}
    
    <button class:bold={displaying === "Hourly"} on:click={clickHourly}>Hourly</button>
    <button class:bold={displaying === "Daily"} on:click={clickDaily}>Daily</button>
    <button class:bold={displaying === "Weekly"} on:click={clickWeekly}>Weekly</button>
{/if}
<div>
<canvas bind:this={chartElement}></canvas>
</div>

<style>
    .bold {
        font-weight: bold;
    }
</style>
