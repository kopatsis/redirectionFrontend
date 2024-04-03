<script>
    import { removeItem, addBack } from "$lib/stores/linkstore.js";
    import Chart from "./Chart.svelte";
    import copy from "$lib/images/copy.png";
    import del from "$lib/images/delete.png";
    import QrCode from "./QRCode.svelte";
    export let domain;
    export let entryOb;

    let url = domain + "/" + entryOb.param;
    let date = new Date(entryOb.date);

    let state = "Present";

    let chartOrQR = "none";

    function toggleChart() {
        if (chartOrQR === "chart") {
            chartOrQR = "none";
        } else {
            chartOrQR = "chart";
        }
    }

    function toggleQR() {
        if (chartOrQR === "qr") {
            chartOrQR = "none";
        } else {
            chartOrQR = "qr";
        }
    }

    let toMessage = () => {
        state = "Message";
    };

    let toPresent = () => {
        state = "Present";
    };

    let undoDelete = () => {
        state = "Present";
        addBack(entryOb);
        fetch(`https://cs361a.wl.r.appspot.com/entry/${entryOb.param}`, {
            method: "PATCH",
        })
            .then((response) => {
                if (!response.ok) {
                    console.error("Error deleting entry:", error);
                }
            })
            .catch((error) => {
                console.error("Error deleting entry:", error);
            });
    };

    let toRemoved = () => {
        state = "Removed";
        removeItem(entryOb);
        fetch(`https://cs361a.wl.r.appspot.com/entry/${entryOb.param}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    console.error("Error deleting entry:", error);
                }
            })
            .catch((error) => {
                console.error("Error deleting entry:", error);
            });
    };

    let firstHundredChar = (word) => {
        if (word.length > 100) {
            return word.slice(0, 98) + "...";
        } else {
            return word;
        }
    };

    function isSameCalendarDay(date1, date2) {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(url);
        } catch (error) {
            console.error("Error copying to clipboard:", error);
        }
    }
</script>

<div class="line"></div>
{#if state == "Present"}
    <div class="sections">
        <div class="sections">
            <div class="deletecont">
                <button on:click={toMessage} class="hasImg"
                    ><img src={del} alt="delete symbol" /></button
                >
            </div>
            <div>
                <div>
                    URL: <a href={window.location.protocol + "//" + url}
                        >{url}</a
                    >
                </div>
                <div class="ogurl">Original URL: {firstHundredChar(entryOb.url)}</div>
                {#if isSameCalendarDay(date, new Date())}
                    <div>Created: {date.toLocaleTimeString()}</div>
                {:else}
                    <div>Created: {date.toLocaleDateString()}</div>
                {/if}
            </div>
        </div>
        <div class="buttonhold">
            <button on:click={copyToClipboard} class="hasImg"
                ><img src={copy} alt="copy symbol" /></button
            >
            <button on:click={toggleChart}>
                {#if chartOrQR === "chart"}▲{:else}▼{/if} Analytics</button
            >
            <button on:click={toggleQR}>
                {#if chartOrQR === "qr"}▲{:else}▼{/if} QR Code</button
            >
        </div>
    </div>
    {#if chartOrQR === "chart"}
        <Chart param={entryOb.param} />
    {/if}
    {#if chartOrQR === "qr"}
        <QrCode QRText={url} />
    {/if}
{:else if state == "Message"}
    <div>URL: <a href={url}>{url}</a></div>
    <div>Original URL: {entryOb.url}</div>
    <div>Are you sure you want to delete this URL?</div>
    <button on:click={toRemoved}>Yes</button>
    <button on:click={toPresent}>No</button>
{:else if state == "Removed"}
    <div>URL: <a href={url}>{url}</a></div>
    <div>Original URL: {entryOb.url}</div>
    <div>This URL has been deleted</div>
    <button on:click={undoDelete}>Undo</button>
{:else}
    <div>Error, shouldn't be reachable here</div>
{/if}
<br />

<style>
    .buttonhold {
        min-width: 243px;
    }
    button {
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 2px;
        border: none;
        font-size: 16px;
    }

    button:hover {
        background: var(--color-theme-1);
        color: white;
        outline: none;
    }
    .line {
        height: 2px;
        background-color: var(--color-theme-2);
        margin-bottom: 10px;
        margin-top: 10px;
    }
    .sections {
        display: flex;
        justify-content: space-between;
    }
    div {
        font-size: 18px;
    }
    .hasImg img {
        height: 0.89em;
    }
    .deletecont {
        margin-right: 5px;
    }
    .ogurl {
        word-break: break-all;
    }
</style>
