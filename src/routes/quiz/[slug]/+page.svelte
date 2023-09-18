<script lang="ts">
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import type { Quiz } from '$lib/types/Quiz';
	import axios from 'axios';

	let slug: number;
	let quiz: Quiz;

	$: {
		slug = parseInt($page.params.slug);
	}

	$: {
		axios.get(PUBLIC_API_URL + `/quiz/${slug}`).then((res) => {
			if (res.status == 200) {
				quiz = res.data;
			}
		});
	}
</script>

{#if quiz == undefined}
	<div class="spinner" />
{:else}
	<p>{JSON.stringify(quiz)}</p>
{/if}
