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

    function isSameCalendarDay(date1) {
        const date2 = new Date();
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    async function fetchClickData() {
        // const urls = [
        //     `http://127.0.0.1:5000/clicks_last_day_by_hour/${param}`,
        //     `http://127.0.0.1:5000/clicks_last_week_by_day/${param}`,
        //     `http://127.0.0.1:5000/clicks_last_month_by_week/${param}`,
        // ];

        const urls = [
            `https://cs361a.wl.r.appspot.com/analyze/hourly/${param}`,
            `https://cs361a.wl.r.appspot.com/analyze/daily/${param}`,
            `https://cs361a.wl.r.appspot.com/analyze/weekly/${param}`,
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
        // const sortedEntries = entries.sort((a, b) => a[0].localeCompare(b[0]));
        const sortedEntries = entries.sort((a, b) => {
            const dateA = new Date(a[0]);
            const dateB = new Date(b[0]);

            return dateA - dateB;
        });

        // const labels = sortedEntries.map((entry) => entry[0]);
        const labels = sortedEntries.map((entry) => {
            const entryDate = new Date(entry[0]);

            if (passed !== hourly){
                let date = new Date(entryDate)
                date.setDate(entryDate.getDate() + 1)
                return date.toLocaleDateString();
            }

            return isSameCalendarDay(entryDate)
                ? entryDate.toLocaleTimeString()
                : entryDate.toLocaleString();
        });
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
                            label: "Number of Visits",
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

    function clickHourly() {
        if (displaying !== "Hourly") {
            displaying = "Hourly";
            updateChart(hourly);
        }
    }

    function clickDaily() {
        if (displaying !== "Daily") {
            displaying = "Daily";
            updateChart(daily);
        }
    }

    function clickWeekly() {
        if (displaying !== "Weekly") {
            displaying = "Weekly";
            updateChart(weekly);
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
    <button class:bold={displaying === "Hourly"} on:click={clickHourly}
        >Hourly</button
    >
    <button class:bold={displaying === "Daily"} on:click={clickDaily}
        >Daily</button
    >
    <button class:bold={displaying === "Weekly"} on:click={clickWeekly}
        >Weekly</button
    >
{/if}
<div>
    <canvas bind:this={chartElement}></canvas>
</div>

<style>
    .bold {
        font-weight: bold;
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
