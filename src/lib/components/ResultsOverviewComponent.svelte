<script lang="ts">
    import Chart from "chart.js/auto";
	import type { Quiz } from "$lib/types/Quiz";
	import type { ResultsOverview } from "$lib/types/results/ResultsOverview";
	import { onMount } from "svelte";

    export let quiz: Quiz;
    export let results: ResultsOverview;

    let chart: Chart;

    let distributionLabels: string[] = Object.keys(results.categoryDistribution).map((c: string) => quiz.categories.filter((cat) => cat.id === parseInt(c))[0].name);
    let distribution: number[] = Object.values(results.categoryDistribution).map((c: number) => c);

    onMount(() => {
        chart = new Chart(document.getElementById("categoryChart") as HTMLCanvasElement, {
            type: 'bar',
            data: {
                labels: distributionLabels,
                datasets: [{
                    label: 'Count',
                    data: distribution,
                    backgroundColor: Object.keys(results.categoryDistribution).map(_ => "rgb(88, 12, 252)"),
                }],
            },
            options: {
                indexAxis: 'y',
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        ticks: {
                            font: { 
                                size: 14,
                            },
                        },
                    },
                },
            },
        });
    });
</script>

<div class="h-full w-2/3">
    <div class="mt-8 w-full border border-primary border-solid p-10">
        <h1 class="text-3xl font-bold">Distribution by Category</h1>
        <div class="w-full flex flex-row justify-center">
            <div class="w-1/2 flex">
                <canvas id="categoryChart"></canvas>
            </div>
            <div class="w-1/2 p-5">
                <div class="w-full bg-primary rounded-xl p-5 text-white text-xl">
                    <p>Here you can see the how your quiz results are distributed across categories.</p>
                </div>
            </div>
        </div>
    </div>
</div>
