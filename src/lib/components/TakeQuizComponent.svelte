<script lang="ts">
    import Fa from 'svelte-fa/src/fa.svelte';
    import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
	import type { Quiz } from "$lib/types/Quiz";
    import type { Question } from "$lib/types/Question";
	import { onMount } from "svelte";
	import { PUBLIC_API_URL } from '$env/static/public';
	import axios from 'axios';
	import toast, { Toaster } from 'svelte-french-toast';

    export let quiz: Quiz;

    let currentQuestionId: number = 0;
    let currentQuestion: Question;
    let isComplete: boolean = false;

    let answers: {questionId: number; answerId: number;}[] = quiz.questions.map((question) => {
        return {
            questionId: question.id,
            answerId: -1
        }
    }); 

    $: currentQuestion = quiz.questions[currentQuestionId];

    const incrementQuestionId = () => {
        currentQuestionId = Math.min(currentQuestionId + 1, quiz.questions.length - 1);
    }

    const decrementQuestionId = () => {
        currentQuestionId = Math.max(currentQuestionId - 1, 0);
    }

    $: isComplete = answers.every((answer) => answer.answerId !== -1)
    
    const sendCompleteQuizRequest = () => {
        axios({
            method: 'post',
            url: PUBLIC_API_URL + '/question/answer',
            data: {
                quizId: quiz.id,
                questionAnswers: answers,
            }
        }).then((res) => {
            if (res.status = 204) {
                toast.success('Quiz completed successfully!');
            }
        }).catch((err) => {
            console.log(err);
            toast.error('Something went wrong!');
        });
    }
</script>

<div class="w-1/2">
    <div class="flex justify-between">
        <button 
            class="btn btn-primary text-white btn-circle text-2xl" 
            disabled={currentQuestionId == 0}
            on:click={decrementQuestionId}>
            <Fa icon={faChevronLeft} />
        </button>
        {#if currentQuestionId == quiz.questions.length - 1 && isComplete}
            <button 
                class="btn btn-primary text-white text-lg rounded-full" 
                style="text-transform: none;"
                on:click={sendCompleteQuizRequest}
            >
                Finish
            </button>
        {:else}
            <button 
                class="btn btn-primary text-white btn-circle text-2xl"
                disabled={currentQuestionId == quiz.questions.length - 1 || answers[currentQuestionId].answerId == -1}
                on:click={incrementQuestionId}
            >
                <Fa icon={faChevronRight} />
            </button>
        {/if}
    </div>
    <div class="my-6 p-3 text-2xl border-b-primary border-solid border-b-8">
        {currentQuestion.text}
    </div>
    <div class="flex flex-row flex-wrap">
        {#each currentQuestion.answers as answer}
            <div
                class="p-3 flex justify-center items-center bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100 {answers[currentQuestionId].answerId == answer.id ? 'border-primary border-solid border-4' : ''}" 
                style="flex: 0 0 calc(50% - 20px); margin: 10px"
                on:click={() => answers[currentQuestionId].answerId = answer.id}
            >
                {answer.text}
            </div>
        {/each}
    </div>
</div>
<Toaster />
