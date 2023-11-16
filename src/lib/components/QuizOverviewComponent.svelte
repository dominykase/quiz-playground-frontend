<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faPen, faX } from '@fortawesome/free-solid-svg-icons';
	import type { Quiz } from '$lib/types/Quiz';
	import axios from 'axios';
	import { PUBLIC_API_URL } from '$env/static/public';
	import toast, { Toaster } from 'svelte-french-toast';
	import type { Answer } from '$lib/types/Answer';
	import type { Question } from '$lib/types/Question';
    import type { CategoryWeight } from '$lib/types/CategoryWeight';

	export let quiz: Quiz;
	let createCategoryName: string = '';
    let createQuestionName: string = '';

	let editCategoryId: number = -1;
	let editCategoryName: string = '';

	let editQuestionId: number = -1;
	let editQuestionText: string = '';

	let isCreateAnswerView: boolean = false;
	let createAnswerText: string = '';
	let editAnswer: Answer | undefined = undefined;
    
    let editAnswerCategoryWeights: number[]|undefined; 
    $: editAnswerCategoryWeights = 
        editAnswer?.categoryWeights.map(
            (cw: CategoryWeight) => cw.weight
        );

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
                editAnswer = undefined;
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

    const sendUpdateAnswerCategoryWeightRequest = (weightId: number, weight: number) => {
        axios({
            method: 'patch',
            url: PUBLIC_API_URL + `/answer/${editAnswer?.id}/weight`,
            data: {
                id: weightId,
                weight: weight,
            }
        }).then((res) => {
            if (res.status == 200) {
                toast.success('Answer category weight has been updated!');
            } else {
                toast.error('Something went wrong.');
            }
        });
    }

    const sendDeleteAnswerRequest = (answerId: number) => {
        axios({
            method: 'delete',
            url: PUBLIC_API_URL + `/answer/${answerId}`,
        }).then((res) => {
            if (res.status == 204) {
                toast.success('Answer has been deleted!');
                const answers = quiz.questions.filter((question: Question) => question.id === editQuestionId)[0]
                    .answers.filter((answer: Answer) => answer.id !== answerId);
                const questions = quiz.questions.map((question: Question) => {
                    if (question.id === editQuestionId) {
                        question.answers = answers;
                    }
                    return question;
                });
                quiz = {
                    ...quiz,
                    questions: questions,
                };
                editAnswer = undefined;
            } else {
                toast.error('Something went wrong.');
            }
        });
    }

    const sendCreateQuestionRequest = () => {
        axios({
            method: 'post',
            url: PUBLIC_API_URL + `/quiz/${quiz.id}/question`,
            data: {
                text: createQuestionName,
            }
        }).then((res) => {
            console.log(res.status);
            console.log(res.data);
            if (res.status == 200) {
                toast.success('Question has been created!');
                quiz = res.data;
                const button = document.getElementById(
                    'create_question_modal_close_button'
                ) as HTMLButtonElement;
                button.click();
            } else {
                toast.error('Something went wrong.');
            }
        });
    }

    const sendDeleteQuestionRequest = (questionId: number) => {
        axios({
            method: "delete",
            url: PUBLIC_API_URL + `/question/${questionId}`,
        }).then((res) => {
            if (res.status == 204) {
                toast.success('Question has been deleted!');
                quiz = {
                    ...quiz,
                    questions: quiz.questions.filter((question: Question) => question.id !== questionId),
                }
                const button = document.getElementById(
                    'delete_question_modal_close_button' + questionId.toString()
                ) as HTMLButtonElement;
                button.click();
            } else {
                toast.error('Something went wrong.');
            }
        })
    }

    const sendDeleteQuizRequest = () => {
        axios({
            method: "delete",
            url: PUBLIC_API_URL + `/quiz/${quiz.id}`,
        }).then((res) => {
            if (res.status == 204) {
                toast.success('Quiz has been deleted!');
                window.location.href = '/list';
            } else {
                toast.error('Something went wrong.');
            }
        });
    }

	console.log(quiz);
</script>

<div class="w-3/4 h-full flex flex-col">
	<div class="card-normal bg-white rounded-xl mt-10 p-5">
		<div class="card-body p-0">
			<div class="card-title flex flex-row justify-between">
				<h1 class="text-3xl rounded-full">{quiz.name}</h1>
                <button
                    class="btn btn-error btn-sm btn-circle border-none"
                    onclick="delete_quiz_modal.showModal()"
                ><Fa icon={faX} /></button>
			</div>
			<div>{quiz.description}</div> 
		</div>
        <dialog id={'delete_quiz_modal'} class="modal">
            <div class="modal-box">
                <form method="dialog">
                    <button
                        id={'delete_quiz_modal_close_button'}
                        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button
                    >
                </form>
                <h3 class="font-bold text-lg mb-3">Are you sure?</h3>
                <div>Quiz will be removed.</div>
                <button
                    on:click={sendDeleteQuizRequest}
                    class="btn-error mt-2 w-full p-1 rounded-lg hover:btn-active"
                >
                    Delete
                </button>
            </div>
        </dialog>
	</div>
	<div class="py-5 flex flex-row w-full h-94">
		<div class="card-normal bg-white rounded-xl p-5 w-1/3">
			<div class="card-normal bg-white rounded-xl mr-3">
				<div class="card-body p-0">
					<div class="card-title flex flex-row justify-between">
						<h1 class="text-3xl rounded-full p-2">Categories</h1>
						<button
							class="btn btn-primary transition btn-md btn-circle text-2xl text-white border-none"
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
									Create
								</button>
							</div>
						</dialog>
					</div>
					{#each quiz.categories as category}
						<div
							class="w-full bg-primary rounded-full p-3 flex flex-row justify-between items-center"
						>
							<div class="ml-2 text-white">{category.name}</div>
							<div>
								<button
									class="btn-neutral bg-slate-200 btn-circle btn-sm px-2 text-black p-1 hover:btn-active hover:text-white transition"
									onclick={'edit_category_modal_' + category.id.toString() + '.showModal()'}
									on:click={() => populateEditCategory(category.id, category.name)}
								>
								    <Fa icon={faPen} />	
								</button>
								<button
									class="btn btn-error btn-sm btn-circle border-none ml-1"
									onclick={'delete_category_modal_' + category.id.toString() + '.showModal()'}
									on:click={() => populateEditCategory(category.id, category.name)}
								>
									<Fa icon={faX} />
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
									class="btn-error mt-2 w-full p-1 rounded-lg hover:btn-active"
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
				<div class="card-title flex flex-row justify-between">
					<h1 class="text-3xl rounded-full p-2">Questions</h1>
                    <button
                        class="btn bg-slate-200 hover:bg-slate-300 transition btn-md btn-circle text-2xl text-black border-none"
                        onclick="create_question_modal.showModal()"
                        on:click={() => (createQuestionName = '')}
                    >+</button>
				</div>
                <dialog id="create_question_modal" class="modal">
                    <div class="modal-box">
                        <form method="dialog">
                            <button
                                id="create_question_modal_close_button"
                                class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button
                            >
                        </form>
                        <h3 class="font-bold text-lg mb-3">Create category</h3>
                        <input
                            type="text"
                            name="question-name"
                            bind:value={createQuestionName}
                            class="p-2 rounded-lg"
                            placeholder="Question name"
                        />
                        <button
                            on:click={sendCreateQuestionRequest}
                            class="btn-neutral bg-slate-200 text-black p-1 rounded-lg hover:btn-active hover:text-white transition"
                        >
                        </button>
                    </div>
                </dialog>
				{#each quiz.questions as question}
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="w-full bg-primary text-white hover:bg-secondary-focus transition hover:cursor-pointer rounded-full p-3 flex flex-row justify-between"
						onclick={'view_question_modal' + question.id + '.showModal()'}
						on:click={() => populateEditQuestion(question.id, question.text)}
					>
						<div>{question.text}</div>
                        <button
                            class="btn btn-error btn-xs btn-circle border-none"
                            onclick={"delete_question_modal_" + question.id.toString() + ".showModal()"}
                            on:click={(e) => e.stopPropagation()}
                        >
                            <Fa icon={faX} />
                        </button>
					</div>
                    <dialog id={'delete_question_modal_' + question.id.toString()} class="modal">
                        <div class="modal-box">
                            <form method="dialog">
                                <button
                                    id={'delete_question_modal_close_button' + question.id.toString()}
                                    class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">x</button
                                >
                            </form>
                            <h3 class="font-bold text-lg mb-3">Are you sure?</h3>
                            <div>This question will be removed.</div>
								<button
									on:click={() => sendDeleteQuestionRequest(question.id)}
									class="btn-error mt-2 w-full p-1 rounded-lg hover:btn-active"
								>
									Delete
								</button>
                        </div>
                    </dialog>
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
											class="flex flex-row w-fit bg-secondary hover:bg-secondary-focus transition hover:cursor-pointer rounded-full p-3 my-1 ml-5"
											on:click={() => {
												isCreateAnswerView = false;
												editAnswer = answer;
											}}
										>
											<div>{answer.text}</div>
                                            <button
                                                class="btn ml-8 btn-error btn-xs btn-circle border-none"
                                                on:click={() => sendDeleteAnswerRequest(answer.id)}
                                            ><Fa icon={faX} /></button> 
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
                                        {#if editAnswer !== undefined }
                                            <div class="text-lg font-bold">Answer: {editAnswer?.text}</div>
                                            {#each editAnswer.categoryWeights as categoryWeight}
                                                <div class="my-2 flex flex-col">
                                                    <div class="flex flex-row w-full">
                                                        <div class="w-1/2 flex items-center">{categoryWeight.category.name}</div>
                                                        <input class="w-1/4 rounded-lg p-2 text-center text-lg" type="number" bind:value={categoryWeight.weight} />
                                                        <button
                                                            class="btn-neutral bg-slate-200 text-black p-3 w-1/4 ml-1 rounded-lg hover:btn-active hover:text-white transition"
                                                            on:click={() => sendUpdateAnswerCategoryWeightRequest(categoryWeight.id, categoryWeight.weight)}
                                                        >
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            {/each}
                                        {/if}
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
