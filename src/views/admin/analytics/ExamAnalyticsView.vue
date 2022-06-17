<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import { TestsSingle } from '@/models/admin/analytics/TestsSingle';
import ApiService from '@/services/ApiService';

const service = new ApiService();

const courseId = 155;
const academicYearId = 2020;

const boilerplate = '';
const tests = ref<TestsSingle[]>([]);

onMounted(async () => {
	await service
		.getManyAsync<TestsSingle>('/tests/single', {
			courseId: courseId,
			academicYearId: academicYearId,
		})
		.then((testsSingle: TestsSingle[]) => {
			tests.value = testsSingle;
		});
});
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Exam analytics (click on the boxplot to see details)</template>
			<template #content>{{ tests }}</template>
		</Card>
	</div>
</template>
