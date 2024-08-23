<script>
    export let numerator;
    export let denominator;
    export let blocked = false;

    let percentage;
    let text;

    if (blocked) {
        percentage = 0;
        text = " ??? / ??? (??%) ";
    } else {
        percentage = (numerator / denominator) * 100;
        text = ` ${numerator} / ${denominator} (${percentage.toFixed(2)}%) `;
    }
</script>

<div class="box">
    <div class="progress" style="width: {percentage}%"></div>
    <div class="text">{text}</div>
</div>

<style>
    .box {
        position: relative;
        min-width: 300px;
        padding: 4px 15px;
        display: inline-block;
        background-color: transparent;
        border: 1px solid #ccc;
    }

    .progress {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        background-color: green;
        z-index: -1;
    }

    .text {
        position: relative;
        z-index: 1;
        white-space: nowrap;
    }
</style>
