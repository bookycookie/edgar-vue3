<script setup lang="ts">
import Button from 'primevue/button';
import { useRouter } from 'vue-router';
import RouteNames from '../router/routes';
console.log('hello script setup');
const router = useRouter();
</script>

<template>
	<div>
		First view
		<Button label="Login" @click="router.push({ name: RouteNames.Login })"></Button>
	</div>
</template>
