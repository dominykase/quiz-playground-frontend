<script lang="ts">
	import axios from 'axios';
	import CardTitle from './reusable/CardTitle.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { onMount } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	let name: string = '';
	let description: string = '';
	let redirectAnchor: HTMLAnchorElement;

	const submitQuiz = () => {
		axios({
			method: 'post',
			url: PUBLIC_API_URL + '/quiz',
			data: {
				name: name,
				description: description
			}
		}).then((res) => {
			if ((res.status = 200)) {
				toast.success('Your quiz is created.');
				setTimeout(() => {
					redirectAnchor.click();
				}, 2500);
			} else {
				toast.error('Something went wrong.');
			}
		});
	};

	onMount(() => {
		redirectAnchor = document.querySelector('a') as HTMLAnchorElement;
	});
</script>

<div class="floating-animation card card-normal bg-secondary rounded-xl">
	<div class="card-body flex items-center flex-col">
		<CardTitle text="Create a quiz :]" />
		<input
			type="text"
			bind:value={name}
			placeholder="Title"
			class="mb-2 p-2 h-10 w-80 rounded-lg"
		/>
		<textarea bind:value={description} placeholder="Description" class="p-2 h-32 w-80 rounded-lg" />
		<button
			on:click={submitQuiz}
			class="btn-neutral bg-white hover:bg-active mt-1 py-2 px-5 rounded-full text-black hover:text-white"
			>Create</button
		>
	</div>
</div>
<a style="display: none" href="/">redirect to quiz list</a>
<Toaster />
