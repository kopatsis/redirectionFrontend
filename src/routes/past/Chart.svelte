<script>
    import { onMount, onDestroy } from "svelte";
    import Chart from "chart.js/auto";
    import Modal from "../login/Modal.svelte";
    import { getToken } from "$lib/stores/firebaseuser";

    export let param;
    export let chartOrQR = "none";

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

    const close = () => {
        chartOrQR = "none";
    };

    function createDateChart(chartData, isdaily = true) {
        let labels;
        if (isdaily) {
            labels = chartData.keys.map((date) =>
                new Date(date).toLocaleDateString("en-US"),
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
        return new Chart(chartCanvas.getContext("2d"), {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: isdaily
                            ? "Click Count By Date"
                            : "Click Count By Week",
                        data: chartData.data,
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    }

    function createDonutChart(chartData, chartTitle) {
        let chartCanvas;

        chartCanvas = new Chart(chartCanvas.getContext("2d"), {
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

        return chartCanvas;
    }

    async function fetchClickData() {
        const url = import.meta.env.VITE_BACKEND_URL;
        try {
            const token = await getToken();
            const response = await fetch(`${url}/clicks/${param}`, {
                method: "GET",
                headers: {
                    Authorization: token,
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
        } catch (err) {
            error = true;
        }
    }

    onMount(async () => {
        await fetchClickData();
        loading = false;
    });

    function destroyCharts() {
        if (dailyChart) {
            dailyChart.destroy();
        }
        if (weeklyChart) {
            weeklyChart.destroy();
        }
        if (countryChart) {
            countryChart.destroy();
        }
        if (cityChart) {
            cityChart.destroy();
        }
        if (osChart) {
            osChart.destroy();
        }
        if (browserChart) {
            browserChart.destroy();
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
        <div>Error loading analytics</div>
    {:else}
        <div class="charthold">
            <!-- <canvas bind:this={chartElement}></canvas> -->
        </div>
    {/if}
</Modal>

