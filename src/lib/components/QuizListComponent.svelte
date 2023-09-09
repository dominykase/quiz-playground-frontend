<script lang="ts">
	import type { Quiz } from '$lib/types/Quiz';

	export let quizzes: Quiz[];
</script>

<div class="mt-20 h-full w-8/12 flex flex-col">
	{#each quizzes as quiz}
		<div class="w-full h-wrap m-1 collapse collapse-arrow bg-secondary rounded-xl">
			<input type="checkbox" />
			<div class="collapse-title rounded-xl w-wrap flex justify-center flex-col">
				<div class="flex w-full flex-row items-start">
					<span class="badge text-center rounded-xl p-5">name</span>
					<span class="badge bg-white rounded-xl p-5 ml-3">{quiz.name}</span>
				</div>
				<!-- <div class="h-1 w-1/6 mt-2 ml-5 rounded-3xl bg-gray-300">:)</div> -->
			</div>
			<div class="collapse-content bg-white w-full flex justify-between">
				<div class="flex items-center w-1/2">
					<span class="badge text-center rounded-xl mt-3 p-5">description</span>
					<span class="p-2 mt-3 ml-3 rounded-xl border-solid border-slate-200 border-2"
						>{quiz.description}</span
					>
				</div>
				<div class="flex items-center">
					<button
						class="btn-neutral bg-slate-200 text-black p-3 mt-3 mr-3 rounded-xl hover:btn-active hover:text-white transition"
						>Take this quiz!</button
					>
					<button
						class="btn-neutral bg-slate-200 text-black p-3 mt-3 rounded-xl hover:btn-active hover:text-white transition"
						>See results :]</button
					>
				</div>
			</div>
		</div>
	{/each}
</div>
