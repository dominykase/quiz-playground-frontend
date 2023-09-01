<script>
	import Button from './Button.svelte';

	let name = '';
	let description = '';

	const submitQuiz = () => {
		console.log({
			message: 'sending request',
			data: {
				name: name,
				description: description
			}
		});
	};
</script>

<div class="card card-normal bg-secondary mt-20 rounded-xl">
	<div class="card-body flex items-center flex-col">
		<input
			type="text"
			bind:value={name}
			placeholder="Give your quiz a title!"
			class="mb-2 p-2 h-10 w-80 rounded-lg"
		/>
		<textarea
			bind:value={description}
			placeholder="... and a description :)"
			class="p-2 h-32 w-80 rounded-lg"
		/>
		<button on:click={submitQuiz} class="btn-active mt-1 p-2 rounded-lg"> create!! </button>
	</div>
</div>
