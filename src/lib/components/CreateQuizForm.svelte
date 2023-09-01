<script lang="ts">
	import CardTitle from './reusable/CardTitle.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	let name: string = '';
	let description: string = '';
	let redirectAnchor: HTMLAnchorElement;

	const submitQuiz = () => {
		console.log({
			message: 'sending request',
			data: {
				name: name,
				description: description
			}
		});

		toast.success('Your quiz is created.');

		setTimeout(() => {
			redirectAnchor.click();
		}, 2500);
	};

	onMount(() => {
		redirectAnchor = document.querySelector('a') as HTMLAnchorElement;
	});
</script>

<div class="card card-normal bg-secondary rounded-xl">
	<div class="card-body flex items-center flex-col">
		<CardTitle text="Create a Quiz" />
		<input
			type="text"
			bind:value={name}
			placeholder="Title"
			class="mb-2 p-2 h-10 w-80 rounded-lg"
		/>
		<textarea bind:value={description} placeholder="Description" class="p-2 h-32 w-80 rounded-lg" />
		<button
			on:click={submitQuiz}
			class="btn-neutral bg-white hover:bg-active mt-1 py-2 px-5 rounded-full">Create</button
		>
	</div>
</div>
<a style="display: none" href="/">redirect to quiz list</a>
<Toaster />
