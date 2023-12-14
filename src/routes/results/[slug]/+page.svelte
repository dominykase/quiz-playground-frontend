<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import Header from '$lib/components/Header.svelte';
	import ResultsOverviewComponent from '$lib/components/ResultsOverviewComponent.svelte';
	import type { Quiz } from '$lib/types/Quiz';
    import type { ResultsOverview } from '$lib/types/results/ResultsOverview';
	import axios from 'axios';

	let slug: number|undefined = undefined;
	let quiz: Quiz|undefined = undefined;
    let results: ResultsOverview|undefined = undefined;

	$: {
		slug = parseInt($page.params.slug);
	}

    $: {
		axios.get(PUBLIC_API_URL + `/quiz/${slug}`).then((res) => {
			if (res.status == 200) {
				quiz = res.data;
			}
		}).catch((e) => {
            console.log(e);
            
            if (browser) {
                window.location.href = '/404';
            }
        })

        axios.get(PUBLIC_API_URL + `/quiz/${slug}/results`).then((res) => {
            if (res.status == 200) {
                results = res.data;
            }
        }).catch((e) => {
            console.log(e);

            if (browser) {
                window.location.href = '/404';
            }
        })
    }
</script>

{#if quiz == undefined || results == undefined}
	<div class="spinner" />
{:else}
    <div class="w-full h-full flex flex-col items-center overflow-y-scroll">
        <Header />
        <ResultsOverviewComponent {quiz} {results} />
    </div>
{/if}
