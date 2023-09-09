<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import QuizListComponent from '$lib/components/QuizListComponent.svelte';
	import type { Quiz } from '$lib/types/Quiz';
	import axios from 'axios';

	let data: Quiz[];

	axios.get(PUBLIC_API_URL + '/quiz').then((res) => {
		data = res.data;
	});
</script>

{#if data === undefined}
	<div class="spinner" />
{:else}
	<QuizListComponent quizzes={data} />
{/if}
