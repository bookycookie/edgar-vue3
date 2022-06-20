<script setup lang="ts">
import { ref } from 'vue';

const test = ref();
const boilerplate = '';
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title></template>
			<template #content></template>
		</Card>
	</div>
</template>
