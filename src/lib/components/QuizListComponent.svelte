<script lang="ts">
	import { browser } from '$app/environment';
	import type { Quiz } from '$lib/types/Quiz';

	export let quizzes: Quiz[];

	const editQuizRedirect = (id: number) => {
		if (browser) {
			window.location.href = `/quiz/${id}`;
		}
	}

    const takeQuizRedirect = (id: number) => {
        if (browser) {
            window.location.href = `/take/quiz/${id}`;
        }
    }
</script>

<div class="my-10 w-8/12 flex flex-col items-center">
    <div class="w-full">
        {#each quizzes as quiz}
            <div class="w-full h-wrap m-1 collapse collapse-arrow bg-primary rounded-none border-2 border-solid border-primary text-white">
                <input type="checkbox" />
                <div class="collapse-title w-wrap flex justify-center flex-col">
                    <div class="flex w-full flex-row items-start">
                        <span class="text-white font-bold text-lg">{quiz.name}</span>
                    </div>
                </div>
                <div class="collapse-content bg-white w-full flex justify-between">
                    <div class="flex items-center w-1/2">
                        <span class="text-black text-lg font-bold bg-white border-b-2 border-solid border-primary p-3"
                            >{quiz.description}</span
                        >
                    </div>
                    <div class="flex items-center">
                        <button
                            class="btn btn-primary text-white mt-3 mr-3 rounded-lg hover:btn-primary-foxus"
                            style="text-transform: none;"
                            on:click={() => editQuizRedirect(quiz.id)}>Edit</button
                        >
                        <button
                            class="btn btn-primary text-white mt-3 mr-3 rounded-lg hover:btn-primary-foxus"
                            style="text-transform: none;"
                            on:click={() => takeQuizRedirect(quiz.id)}
                            >Take this quiz</button
                        >
                        <button
                            class="btn btn-primary text-white mt-3 mr-3 rounded-lg hover:btn-primary-foxus"
                            style="text-transform: none;"
                            >See results</button
                        >
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>
