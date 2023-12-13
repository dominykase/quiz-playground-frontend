<script lang="ts">
    import Chart from "chart.js/auto";
	import type { Quiz } from "$lib/types/Quiz";
	import type { ResultsOverview } from "$lib/types/results/ResultsOverview";
	import { onMount } from "svelte";
	import type { FrequenciesAnswer } from "$lib/types/results/FrequenciesAnswer";

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

    const calculatePercentage = (all: FrequenciesAnswer[], answer: FrequenciesAnswer): string => {
        let sum: number = 0;
        all.forEach((a) => sum += a.count);
        return Math.round((answer.count / sum) * 100) + "%";
    }
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
    <div class="my-8 w-full border border-primary border-solid p-10">
        <h1 class="text-3xl font-bold mb-4">Answer frequencies</h1>
        {#each results.frequencies as question}
            <div class="w-full h-wrap m-1 collapse collapse-arrow bg-primary rounded-none border-2 border-solid border-primary text-white">
                <input type="checkbox" />
                <div class="collapse-title w-wrap flex justify-center flex-col">
                    <div class="flex w-full flex-row items-start">
                        <span class="text-white font-bold text-lg">{question.questionText}</span>
                    </div>
                </div>
                <div class="collapse-content bg-white w-full flex flex-col">
                    {#each question.answers as answer}
                        <div class="w-full flex flex-row justify-between items-center p-2 {question.answers.indexOf(answer) < question.answers.length - 1 ? 'border-b-primary border-solid border border-x-white' : ''}">
                            <span class="text-xl text-black">{answer.answerText}</span>
                            <span class="text-xl text-white bg-primary rounded-full px-2 py-1">{calculatePercentage(question.answers, answer)}</span>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>
