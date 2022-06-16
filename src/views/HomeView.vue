<script setup lang="ts">
import { useRouter } from 'vue-router';
import RouteNames from '../router/routes';
const router = useRouter();
</script>

<template>
	<div>
		First view
		<Button label="Login" @click="router.push({ name: RouteNames.Login })"></Button>
	</div>
</template>
