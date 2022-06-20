<script setup lang="ts">
import { PropType } from 'vue';
import { PreviousExamSidebar } from '@/models/admin/exams/PreviousExamSidebar';
import RouteNames from '@/router/routes';
defineProps({
	examsSidebar: {
		type: Object as PropType<PreviousExamSidebar[]>,
		required: true,
	},
	isLoading: {
		type: Boolean,
		required: true,
	},
});
</script>

<template>
	<div v-if="isLoading">
		<Card style="width: 100%">
			<template #content>
				<div class="custom-skeleton">
					<div class="flex mb-3">
						<Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>
						<div>
							<Skeleton width="10rem" class="mb-2"></Skeleton>
							<Skeleton width="5rem" class="mb-2"></Skeleton>
							<Skeleton height=".5rem"></Skeleton>
						</div>
					</div>
					<Skeleton width="100%" height="150px"></Skeleton>
					<div class="flex justify-content-center mt-3">
						<Skeleton width="4rem" height="2rem"></Skeleton>
						<Skeleton width="4rem" height="2rem"></Skeleton>
					</div>
				</div>
			</template>
		</Card>
	</div>
	<div v-if="!isLoading && examsSidebar && examsSidebar.length > 0" id="sidebar">
		<Card class="me-5 ms-2 w-100 flex">
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
