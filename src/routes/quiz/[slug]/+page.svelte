<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import QuizOverviewComponent from '$lib/components/QuizOverviewComponent.svelte';
	import type { Quiz } from '$lib/types/Quiz';
	import axios from 'axios';

	let slug: number|undefined = undefined;
	let quiz: Quiz|undefined = undefined;

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
    }
</script>

{#if quiz == undefined}
	<div class="spinner" />
{:else}
	<QuizOverviewComponent {quiz} />
{/if}
