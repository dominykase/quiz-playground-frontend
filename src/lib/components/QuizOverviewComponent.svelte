<script lang="ts">
	import type { Quiz } from '$lib/types/Quiz';
	import axios from 'axios';
	import { PUBLIC_API_URL } from '$env/static/public';
	import toast, { Toaster } from 'svelte-french-toast';

	export let quiz: Quiz;
	let createCategoryName: string = '';
	let editCategoryId: number = 0;
	let editCategoryName: string = '';

	const populateEditCategory = (id: number, name: string) => {
		editCategoryId = id;
		editCategoryName = name;
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
	};

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
					<div
						class="w-full bg-secondary hover:bg-secondary-focus transition hover:cursor-pointer rounded-full p-3"
					>
						<div>{question.text}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
<Toaster />
