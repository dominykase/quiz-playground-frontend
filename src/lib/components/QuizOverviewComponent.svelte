<script lang="ts">
	import type { Quiz } from '$lib/types/Quiz';
	import axios from 'axios';
	import { PUBLIC_API_URL } from '$env/static/public';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { Answer } from '$lib/types/Answer';
	import type { Question } from '$lib/types/Question';

	export let quiz: Quiz;
	let createCategoryName: string = '';

	let editCategoryId: number = -1;
	let editCategoryName: string = '';

	let editQuestionId: number = -1;
	let editQuestionText: string = '';

	let isCreateAnswerView: boolean = false;
	let createAnswerText: string = '';
	let editAnswer: Answer | undefined = undefined;

	const populateEditCategory = (id: number, name: string) => {
		editCategoryId = id;
		editCategoryName = name;
	};

	const populateEditQuestion = (id: number, text: string) => {
		editQuestionId = id;
		editQuestionText = text;
	};

	const sendCreateCategoryRequest = () => {
		axios({
			method: 'post',
			url: PUBLIC_API_URL + `/quiz/${quiz.id}/category`,
			data: {
				name: createCategoryName
			}
		}).then((res) => {
			if (res.status == 200) {
				quiz = res.data;
				const button = document.getElementById(
					'create_category_modal_close_button'
				) as HTMLButtonElement;
				button.click();
				toast.success('Category has been created!');
			} else {
				toast.error('Something went wrong :(');
			}
		});
	}

	const sendEditCategoryRequest = () => {
		axios({
			method: 'patch',
			url: PUBLIC_API_URL + `/quiz/${quiz.id}/category`,
			data: {
				id: editCategoryId,
				name: editCategoryName
			}
		}).then((res) => {
			if (res.status == 200) {
				quiz = res.data;
				const button = document.getElementById(
					'edit_category_modal_close_button' + editCategoryId.toString()
				) as HTMLButtonElement;
				button.click();
				toast.success('Category has been edited!');
			} else {
				toast.error('Something went wrong :(');
			}
		});
	};

	const sendDeleteCategoryRequest = () => {
		axios({
			method: 'delete',
			url: PUBLIC_API_URL + `/category/${editCategoryId}`
		}).then((res) => {
			if (res.status == 204) {
				const button = document.getElementById(
					'delete_category_modal_close_button' + editCategoryId.toString()
				) as HTMLButtonElement;
				button.click();
				toast.success('Category has been deleted :O');
				let tempQuiz = quiz;
				tempQuiz.categories = [
					...tempQuiz.categories.filter((category) => category.id !== editCategoryId)
				];
				quiz = tempQuiz;
			} else {
				toast.error('Something went wrong :(');
			}
		});
	};

	const sendUpdateQuestionRequest = () => {
		axios({
			method: 'patch',
			url: PUBLIC_API_URL + `/quiz/${quiz.id}/question`,
			data: {
				id: editQuestionId,
				text: editQuestionText
			}
		}).then((res) => {
			if (res.status == 200) {
				toast.success('Question text has been updated!');
				quiz = res.data;
			} else {
				toast.error('Something went wrong :(');
			}
		});
	};

	const sendCreateAnswerRequest = () => {
		axios({
			method: 'post',
			url: PUBLIC_API_URL + `/question/${editQuestionId}/answer`,
			data: {
				text: createAnswerText
			}
		}).then((res) => {
			if (res.status == 200) {
				toast.success('Answer has been created!');
				quiz = res.data;
				isCreateAnswerView = false;
				editAnswer = quiz.questions
					.find((question: Question) => question.id === editQuestionId)
					?.answers.find((answer: Answer) => answer.text == createAnswerText);
			} else {
				toast.error('Something went wrong :(');
			}
		});
	};

	console.log(quiz);
</script>

<div class="w-3/4 h-full flex flex-col">
	<div class="card-normal bg-white rounded-xl mt-10 p-5">
		<div class="card-body p-0">
			<div class="card-title">
				<h1 class="text-3xl rounded-full">{quiz.name}</h1>
			</div>
			<div>{quiz.description}</div>
		</div>
	</div>
	<div class="py-5 flex flex-row w-full h-94">
		<div class="card-normal bg-white rounded-xl p-5 w-1/3">
			<div class="card-normal bg-white rounded-xl mr-3">
				<div class="card-body p-0">
					<div class="card-title flex flex-row justify-between">
						<h1 class="text-3xl rounded-full p-2">Categories</h1>
						<button
							class="btn bg-slate-200 hover:bg-slate-300 transition btn-md btn-circle text-2xl text-black border-none"
							onclick="create_category_modal.showModal()"
							on:click={() => (createCategoryName = '')}>+</button
						>
						<dialog id="create_category_modal" class="modal">
							<div class="modal-box">
								<form method="dialog">
									<button
										id="create_category_modal_close_button"
										class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button
									>
								</form>
								<h3 class="font-bold text-lg mb-3">Create category</h3>
								<input
									type="text"
									name="category-name"
									bind:value={createCategoryName}
									class="p-2 rounded-lg"
									placeholder="Category name"
								/>
								<button
									on:click={sendCreateCategoryRequest}
									class="btn-neutral bg-slate-200 text-black p-1 rounded-lg hover:btn-active hover:text-white transition"
								>
									Create ;)
								</button>
							</div>
						</dialog>
					</div>
					{#each quiz.categories as category}
						<div
							class="w-full bg-secondary rounded-full p-3 flex flex-row justify-between items-center"
						>
							<div>{category.name}</div>
							<div>
								<button
									class="btn-neutral bg-slate-200 rounded-full px-2 text-black p-1 hover:btn-active hover:text-white transition"
									onclick={'edit_category_modal_' + category.id.toString() + '.showModal()'}
									on:click={() => populateEditCategory(category.id, category.name)}
								>
									Edit
								</button>
								<button
									class="btn-neutral bg-slate-200 rounded-full px-2 text-black p-1 hover:btn-active hover:text-white transition"
									onclick={'delete_category_modal_' + category.id.toString() + '.showModal()'}
									on:click={() => populateEditCategory(category.id, category.name)}
								>
									Delete
								</button>
							</div>
						</div>
						<dialog id={'edit_category_modal_' + category.id.toString()} class="modal">
							<div class="modal-box">
								<form method="dialog">
									<button
										id={'edit_category_modal_close_button' + category.id.toString()}
										class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button
									>
								</form>
								<h3 class="font-bold text-lg mb-3">Edit category</h3>
								<label for="category-name">Category name: </label>
								<input
									type="text"
									name="category-name"
									bind:value={editCategoryName}
									class="p-2 rounded-lg"
								/>
								<button
									on:click={sendEditCategoryRequest}
									class="btn-neutral bg-slate-200 text-black p-1 rounded-lg hover:btn-active hover:text-white transition"
								>
									Submit
								</button>
							</div>
						</dialog>
						<dialog id={'delete_category_modal_' + category.id.toString()} class="modal">
							<div class="modal-box">
								<form method="dialog">
									<button
										id={'delete_category_modal_close_button' + category.id.toString()}
										class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button
									>
								</form>
								<h3 class="font-bold text-lg mb-3">Are you sure?</h3>
								<div>Category will be removed from all quiz answers as well.</div>
								<button
									on:click={sendDeleteCategoryRequest}
									class="btn-neutral bg-slate-200 text-black p-1 rounded-lg hover:btn-active hover:text-white transition"
								>
									Delete
								</button>
							</div>
						</dialog>
					{/each}
				</div>
			</div>
		</div>
		<div class="card-normal bg-white rounded-xl w-2/3 h-94 ml-5 p-5">
			<div class="card-body p-0">
				<div class="card-title">
					<h1 class="text-3xl rounded-full p-2">Questions</h1>
				</div>
				{#each quiz.questions as question}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="w-full bg-secondary hover:bg-secondary-focus transition hover:cursor-pointer rounded-full p-3"
						onclick={'view_question_modal' + question.id + '.showModal()'}
						on:click={() => populateEditQuestion(question.id, question.text)}
					>
						<div>{question.text}</div>
					</div>
					<dialog id={'view_question_modal' + question.id.toString()} class="modal">
						<div class="modal-box w-11/12 max-w-5xl h-50">
							<div class="flex flex-row w-full h-full">
								<div class="w-1/2">
									<form method="dialog">
										<button
											id={'view_question_modal_close_button' + question.id.toString()}
											class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button
										>
									</form>
									<div class="text-lg font-bold">Question</div>
									<div class="w-full flex flex-row">
										<input class="ml-5 p-2 rounded-lg" type="text" bind:value={editQuestionText} />
										<button
											on:click={sendUpdateQuestionRequest}
											class="ml-3 btn-neutral bg-slate-200 text-black p-1 rounded-lg hover:btn-active hover:text-white transition"
										>
											Submit
										</button>
									</div>
									<div class="flex flex-row justify-start items-center py-2">
										<div class="text-lg font-bold">Answers</div>
										<button
											class="btn ml-3 bg-slate-200 hover:bg-slate-300 transition btn-sm btn-circle text-2xl text-black border-none"
											on:click={() => {
												isCreateAnswerView = true;
												createAnswerText = '';
											}}>+</button
										>
									</div>
									{#each question.answers as answer}
										<!-- svelte-ignore a11y-click-events-have-key-events -->
										<!-- svelte-ignore a11y-no-static-element-interactions -->
										<div
											class="w-fit bg-secondary hover:bg-secondary-focus transition hover:cursor-pointer rounded-full p-3 my-1 ml-5"
											on:click={() => {
												isCreateAnswerView = false;
												editAnswer = answer;
											}}
										>
											<div>{answer.text}</div>
										</div>
									{/each}
								</div>
								<div class="w-1/2">
									{#if isCreateAnswerView}
										<div class="text-lg font-bold">Add new answer</div>
										<input
											class="ml-5 p-2 rounded-lg"
											type="text"
											placeholder="Enter your answer :)"
											bind:value={createAnswerText}
										/>
										<button
											on:click={sendCreateAnswerRequest}
											class="ml-3 btn-neutral bg-slate-200 text-black p-1 rounded-lg hover:btn-active hover:text-white transition"
										>
											Submit
										</button>
									{:else}
										<div class="text-lg font-bold">{editAnswer?.text}</div>
									{/if}
								</div>
							</div>
						</div>
					</dialog>
				{/each}
			</div>
		</div>
	</div>
</div>
<Toaster />
