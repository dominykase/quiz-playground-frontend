<script lang="ts">
	import axios from 'axios';
	import CardTitle from './reusable/CardTitle.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { PUBLIC_API_URL } from '$env/static/public';

	let name: string = '';
	let description: string = '';

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
                    window.location.href = '/list';
				}, 2500);
			} else {
				toast.error('Something went wrong.');
			}
		});
	};
</script>

<div class="w-full flex items-center justify-center" style="height: calc(100% - 40px);">
    <div class="card card-normal bg-white rounded-none border-2 border-solid border-primary w-96">
        <div class="card-body flex items-center flex-col">
            <CardTitle text="Create a quiz" />
            <input
                type="text"
                bind:value={name}
                placeholder="Title"
                class="mb-2 p-2 h-10 w-80 rounded-lg border-2 border-solid border-primary"
            />
            <textarea bind:value={description} placeholder="Description" class="p-2 h-32 w-80 rounded-lg border-2 border-solid border-primary" />
            <button
                on:click={submitQuiz}
                class="btn btn-primary hover:bg-primary-focus mt-1 py-2 px-5 w-full rounded-lg text-white transition text-lg"
                style="text-transform: none;"
                disabled={name === '' || description === ''}
                >Create</button
            >
        </div>
    </div>
</div>
<Toaster />
