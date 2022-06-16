<script setup lang="ts">
import { ref } from 'vue';
const password = ref('');
const allowAnonymous = ref(false);

const start = (password: string, allowAnonymous: boolean) => password + allowAnonymous;
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>
				<div class="center">Start new lecture quiz</div>
			</template>
			<template #content>
				<div class="center">
					<h5>Enter quiz password:</h5>
					<br />
					<Password
						id="lecture-quiz-password"
						v-model="password"
						class="grid-item"
						toggle-mask
						placeholder="Password"></Password>
					<br />
					<div style="display: flex" class="grid-item">
						<Checkbox id="allow-anonymous" v-model="allowAnonymous" binary class="me-2"></Checkbox>
						<label for="allow-anonymous" class="checkbox-label">Allow anonymous</label>
					</div>
					<br />
					<Button class="grid-item button center" @click="start(password, allowAnonymous)">Start</Button>
				</div>
			</template>
		</Card>
	</div>
</template>
