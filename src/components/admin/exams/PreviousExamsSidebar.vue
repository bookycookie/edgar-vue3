<script setup lang="ts">
import { PropType } from 'vue';
import { PreviousExamSidebar } from '@/models/admin/exams/PreviousExamSidebar';
import RouteNames from '@/router/routes';
defineProps({
	examsSidebar: {
		type: Object as PropType<PreviousExamSidebar[]>,
		required: true,
	},
});
</script>

<template>
	<div v-if="examsSidebar && examsSidebar.length > 0" id="sidebar">
		<Card class="me-4 ms-2">
			<template #title>
				<span>
					<router-link :to="{ name: RouteNames.PreviousExams }" class="me-2">Total</router-link>
					<span>{{ examsSidebar[0].full_name }}</span>
				</span>
				<Divider></Divider>
			</template>
			<template #content>
				<p v-for="exam in examsSidebar" :key="exam.id" class="ml-3">
					<router-link
						:to="{
							name: 'PreviousExams',
							params: {
								id: exam.id,
							},
						}">
						{{ exam.title }}
					</router-link>
				</p>
			</template>
		</Card>
	</div>
</template>
