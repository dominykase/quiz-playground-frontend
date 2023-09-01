<script lang="ts">
	export let className: string = '';
	export let text: string = '';
</script>

<div class={'w-full' + ' ' + className}>
	<h1 class="text-3xl mb-4">{text}</h1>
</div>
