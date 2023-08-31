<script>
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

<div class="container">
	<input type="text" bind:value={name} placeholder="Give your quiz a title!" />
	<textarea bind:value={description} placeholder="... and a description :)" />
	<button on:click={submitQuiz}>create!!</button>
</div>

<style>
	.container {
		width: 30rem;
		height: 20rem;
		border: 1px solid black;
		border-radius: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	input {
		margin-bottom: 1rem;
		width: 20rem;
		height: 3rem;
	}

	textarea {
		width: 20rem;
		height: 6rem;
	}

	button {
		margin-top: 1rem;
	}
</style>
