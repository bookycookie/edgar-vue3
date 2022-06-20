<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { PreviousExam } from '@/models/admin/exams/PreviousExam';
import { PreviousExamNotOver } from '@/models/admin/exams/PreviousExamNotOver';
import { PreviousExamSidebar } from '@/models/admin/exams/PreviousExamSidebar';
import { ExamStatistics } from '@/models/admin/exams/ExamStatistics';
import PreviousExamsSidebar from '@/components/admin/exams/PreviousExamsSidebar.vue';
import PreviousExamsTable from '@/components/admin/exams/PreviousExamsTable.vue';
import { useRouter } from 'vue-router';
import PreviousExamsId from '@/views/admin/exams/PreviousExamsIdView.vue';
import RouteNames from '@/router/routes';
const router = useRouter();

const service = new ApiService();
const studentId = 23;
const courseId = 477;
const academicYearId = 2020;

const exams = ref<PreviousExam[]>([]);
const examsSidebar = ref<PreviousExamSidebar[]>([]);
const examsNotOver = ref<PreviousExamNotOver[]>([]);
const examStatistics = ref<ExamStatistics[]>([]);

// eslint-disable-next-line vue/require-default-prop
const props = defineProps({ id: { type: Number, required: false } });

watch(
	() => props.id,
	async () => {
		router.isReady().then(async () => await getQueryData());
	},
);

const getQueryData = async () => {
	if (!props.id) return;

	examsNotOver.value = await service.getManyAsync<PreviousExamNotOver>('/test_instances_not_over', {
		studentId: studentId,
		courseId: courseId,
		academicYearId: academicYearId,
		testId: props.id,
	});

	const examStats: ExamStatistics = {} as ExamStatistics;
	if (examsNotOver.value && examsNotOver.value.length > 0) {
		examStats.ts_started = examsNotOver.value[0].ts_started;
		examStats.ts_submitted = examsNotOver.value[0].ts_submitted;
		examStats.duration = examsNotOver.value[0].duration;
		examStats.correct_no = examsNotOver.value[0].correct_no;
		examStats.incorrect_no = examsNotOver.value[0].incorrect_no;
		examStats.unanswered_no = examsNotOver.value[0].unanswered_no;
		examStats.partial_no = examsNotOver.value[0].partial_no;
		examStats.t_score = examsNotOver.value[0].t_score;
		examStats.t_score_perc = examsNotOver.value[0].t_score_perc;
		examStats.passed = examsNotOver.value[0].passed;
		examStats.id_test_instance = examsNotOver.value[0].id_test_instance;
	}
	examStatistics.value = [examStats];
};

onMounted(async () => {
	exams.value = await service.getManyAsync<PreviousExam>('/test_instances', {
		studentId: studentId,
		courseId: courseId,
		academicYearId: academicYearId,
	});
	examsSidebar.value = await service.getManyAsync<PreviousExamSidebar>('/test_instances_sidebar', {
		studentId: studentId,
		courseId: courseId,
		academicYearId: academicYearId,
	});
	await getQueryData();
});
</script>

<template>
	<div class="container-fluid">
		<br />
		<div class="flex">
			<PreviousExamsSidebar :exams-sidebar="examsSidebar" />
			<Card style="width: 100%" class="ms-4">
				<template #title>
					<div class="grid p-fluid">
						<div class="col-12 md:col-10 flex">
							<div class="p-inputgroup"><h4>Total:</h4></div>
						</div>
						<div class="col-12 md:col-2 flex">
							<router-link :to="{ name: RouteNames.MyStats }" class="text-info me-3">
								<h4>
									<font-awesome-icon icon="chart-line" class="me-1" />
									Your stats here
								</h4>
							</router-link>
						</div>
					</div>
				</template>
				<template #content>
					<PreviousExamsTable v-if="!id" :exams="exams" :exams-sidebar="examsSidebar" />
					<PreviousExamsId
						v-else
						:exams-not-over="examsNotOver"
						:exam-statistics="examStatistics"
						:exams-sidebar="examsSidebar" />
				</template>
			</Card>
		</div>
	</div>
</template>
