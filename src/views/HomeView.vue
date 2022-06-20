<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ApiService from '@/services/ApiService';
import humanize from '@/utilities/date-humanizer/humanizer';
import RouteNames from '../router/routes';
import CONSTANTS from '@/config/constants';

const service = new ApiService();

type UnsubmittedPrivateExam = {
	id: number;
	title: string;
	ts_started: string;
	ts_available_to: string;
	is_available: boolean;
};
type PublicExam = {
	ac_year: string;
	title: string;
	max_runs: number;
	questions_no: number;
	duration_seconds: number;
	test_score_ignored: boolean;
	forward_only: boolean;
	use_in_stats: boolean;
	is_global: boolean;
	password: string;
	seconds_available_to: number;
	ts_available_to: string;
	no_started: number;
	no_submitted: number;
};

type Tutorial = {
	id: number;
	tutorial_title: string;
	tutorial_desc: string;
	ts_finished: string;
	finished: string;
	courses: string;
	no_steps: number;
};

type Exercise = {
	id: number;
	title: string;
	description: string;
	is_active: boolean;
	last_activity: string;
	no_questions: number;
};

const router = useRouter();

const password = ref('');

const publicExams = ref<PublicExam[]>([]);
const getPublicExamsAsync = async () => {
	await service
		.getManyAsync<PublicExam>('/home/public_exams', {
			studentId: CONSTANTS.STUDENT_ID,
			courseId: CONSTANTS.COURSE_ID,
		})
		.then((pe: PublicExam[]) => (publicExams.value = pe));
};
const unsubmittedPrivateExams = ref<UnsubmittedPrivateExam[]>([]);
const getUnsubmittedPrivateExamsAsync = async () => {
	await service
		.getManyAsync<UnsubmittedPrivateExam>('/home/unsubmitted_private_exams', {
			studentId: CONSTANTS.STUDENT_ID,
			courseId: CONSTANTS.COURSE_ID,
			academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
		})
		.then((upe: UnsubmittedPrivateExam[]) => (unsubmittedPrivateExams.value = upe));
};
const tutorials = ref<Tutorial[]>([]);
const getTutorialsAsync = async () => {
	await service
		.getManyAsync<Tutorial>('/home/tutorials', {
			studentId: CONSTANTS.STUDENT_ID,
			courseId: CONSTANTS.COURSE_ID,
		})
		.then((t: Tutorial[]) => (tutorials.value = t));
};
const exercises = ref<Exercise[]>([]);
const getExercisesAsync = async () => {
	await service
		.getManyAsync<Exercise>('/home/exercises', {
			studentId: CONSTANTS.STUDENT_ID,
			courseId: CONSTANTS.COURSE_ID,
			academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
		})
		.then((e: Exercise[]) => (exercises.value = e));
};

onMounted(
	async () =>
		await Promise.all([
			getPublicExamsAsync(),
			getUnsubmittedPrivateExamsAsync(),
			getTutorialsAsync(),
			getExercisesAsync(),
		]),
);

//! TODO: Implement buttons
const startExamAsync = () => {};
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #content>
				<div class="row d-flex justify-content-center">
					<img id="img-spae" src="/images/sfae.png" alt="Speak friend and enter..." />
				</div>
				<div class="center">
					<div class="input-group mb-3">
						<span class="p-float-label me-2">
							<InputText v-model="password" style="min-width: 30rem" />
							<label>Password</label>
						</span>
						<Button label="Start" class="p-button-success p-button-outlined">
							<font-awesome-icon icon="play-circle" class="me-2" />
							<span>Start exam</span>
						</Button>
					</div>
				</div>
			</template>
		</Card>
		<br />
		<Card>
			<template #title>Unsubmitted private exams:</template>
			<template #content>
				<DataTable
					:value="unsubmittedPrivateExams"
					show-gridlines
					scroll-height="43rem"
					class="p-datatable-sm"
					responsive-layout="scroll"
					:paginator="true"
					:rows="7">
					<template #empty>
						<span class="center">No data to show.</span>
					</template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="title" header="Title" />
					<Column field="ts_started" header="Started at" />
					<Column field="ts_available_to" header="Available until" />
					<Column field="can_continue" header="Can continue?">
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.can_continue ? 'check-circle' : 'times-circle'"
									:class="data.can_continue ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
		<br />
		<Card>
			<template #title>Public exams:</template>
			<template #content>
				<DataTable
					:value="publicExams"
					show-gridlines
					scroll-height="43rem"
					class="p-datatable-sm"
					responsive-layout="scroll"
					:paginator="true"
					:rows="7">
					<template #empty>
						<span class="center">No data to show.</span>
					</template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="ac_year" header="Academic year" />
					<Column field="title" header="Title">
						<template #body="{ data }">
							<strong>{{ data.title }}</strong>
							<p>
								<em>
									<small>{{ data.questions_no }} question(s)</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="" header="Runs/Max">
						<template #body="{ data }">{{ data.no_started }} / {{ data.max_runs }}</template>
					</Column>
					<Column field="duration_seconds" header="Duration">
						<template #body="{ data }">{{ data.duration_seconds / 60 }} minutes</template>
					</Column>
					<Column field="test_score_ignored" header="Score ignored">
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.test_score_ignored ? 'check-circle' : 'times-circle'"
									:class="data.test_score_ignored ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
					<Column field="forward_only" header="Forward only">
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.forward_only ? 'check-circle' : 'times-circle'"
									:class="data.forward_only ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
					<Column field="use_in_stats" header="Used in stats">
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.use_in_stats ? 'check-circle' : 'times-circle'"
									:class="data.use_in_stats ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
					<Column field="is_global" header="Global">
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.is_global ? 'check-circle' : 'times-circle'"
									:class="data.is_global ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
					<Column field="is_public" header="Public">
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.is_public ? 'check-circle' : 'times-circle'"
									:class="data.is_public ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
					<Column field="ts_available_to" header="Available until" />

					<Column field="" header="Start exam">
						<template #body="{}">
							<div class="center-align">
								<Button class="p-button-warning">
									<font-awesome-icon icon="play-circle" />
								</Button>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
		<br />
		<Card>
			<template #title>Tutorials:</template>
			<template #content>
				<DataTable
					:value="tutorials"
					show-gridlines
					scroll-height="43rem"
					class="p-datatable-sm"
					responsive-layout="scroll"
					:paginator="true"
					:rows="7">
					<template #empty>
						<span class="center">No data to show.</span>
					</template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="tutorial_title" header="Title" />
					<Column field="tutorial_desc" header="Description" />
					<Column field="no_steps" header="Steps" />
					<Column field="finished" header="Finished" />
					<Column field="ts_finished" header="Finished at" />
					<Column field="" header="Start">
						<template #body="{}">
							<div class="center-align">
								<Button class="p-button-success">
									<font-awesome-icon icon="play-circle" />
								</Button>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
		<br />
		<Card>
			<template #title>Exercises:</template>
			<template #content>
				<DataTable
					:value="exercises"
					show-gridlines
					scroll-height="43rem"
					class="p-datatable-sm"
					responsive-layout="scroll"
					:paginator="true"
					:rows="7">
					<template #empty>
						<span class="center">No data to show.</span>
					</template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="title" header="Title" />
					<Column field="description" header="Description" />
					<Column field="no_questions" header="Questions" />
					<Column field="" header="Start">
						<template #body="{}">
							<div class="center-align">
								<Button class="p-button-success">
									<font-awesome-icon icon="play-circle" />
								</Button>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
