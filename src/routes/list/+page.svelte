<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import axios from 'axios';

	let data: {
		id: number;
		name: string;
		description: string;
	}[];

	axios.get(PUBLIC_API_URL + '/quiz').then((res) => {
		data = res.data;
	});
</script>

{#if data === undefined}
	<div class="spinner" />
{:else}
	{JSON.stringify(data)}
{/if}
