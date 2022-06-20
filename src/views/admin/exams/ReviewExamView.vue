<script setup lang="ts">
import ApiService from '@/services/ApiService';
import { ExamReview } from '@/models/admin/exams/ExamReview';
import { ExamReviewOrdinal } from '@/models/admin/exams/ExamReviewOrdinal';
import { ExamReviewAttachment } from '@/models/admin/exams/ExamReviewAttachment';
import { ref, onMounted, watch, computed } from 'vue';
import Avatar from 'primevue/avatar';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import RouteNames from '@/router/routes';
import QuestionPreviewComponent from '@/components/admin/questions/QuestionPreviewComponent.vue';
import { Answer } from '@/models/admin/questions/Answer';
import { markdown } from '@codemirror/lang-markdown';
import render from '@/utilities/markdown/renderer';
import { sql } from '@codemirror/lang-sql';
import { FilterMatchMode } from 'primevue/api';

const courseId = 155;

//? Which one to use generally?
const extensions = [cpp(), oneDark];
const markdownExtensions = [markdown(), oneDark];
const sqlExtensions = [sql(), oneDark];

enum Outcome {
	Correct = 'correct',
	Incorrect = 'incorrect',
	Partial = 'partial',
	Unanswered = 'unanswered',
}
const props = defineProps({
	id: {
		type: Number,
		required: true,
	},
	questionId: {
		type: Number,
		required: true,
		default: 1,
	},
});

const service = new ApiService();

const review = ref<ExamReview | null>(null);
const reviewOrdinal = ref<ExamReviewOrdinal | null>(null);
const reviewQuestionAnswers = ref<Answer[]>([]);
const reviewAttachments = ref<ExamReviewAttachment[]>([]);

const getRouteDataAsync = async () => {
	const reviewPromise = service
		.getSingleAsync<ExamReview>('/exam/review', { instanceId: props.id })
		.then((response: ExamReview | null) => (review.value = response))
		.then(() => updateTimeline());
	const ordinalPromise = getOrdinalDataAsync();

	await Promise.all([reviewPromise, ordinalPromise]);
};

const getOrdinalDataAsync = async () => {
	service
		.getSingleAsync<ExamReviewOrdinal>('/exam/review/ordinal', { instanceId: props.id, ordinal: props.questionId })
		.then(async (response: ExamReviewOrdinal | null) => {
			if (!response) return;

			reviewOrdinal.value = response;

			if (!reviewOrdinal.value.student_answer_code) reviewOrdinal.value.student_answer_code = '';

			if (!review.value?.show_solutions) {
				reviewOrdinal.value.sql_answer = 'This test does not have "show solutions" option enabled.';
				reviewOrdinal.value.json_answer = 'This test does not have "show solutions" option enabled.';
				reviewOrdinal.value.text_answer = 'This test does not have "show solutions" option enabled.';
				reviewOrdinal.value.c_source = 'This test does not have "show solutions" option enabled.';
			}
			if (response?.has_answers) {
				reviewQuestionAnswers.value = await service.getManyAsync<Answer>('/exam/review/question', {
					questionId: response.id,
				});
			}

			if (response?.upload_file_no !== 0) {
				reviewAttachments.value = await service.getManyAsync<ExamReviewAttachment>('/exam/review/attachments', {
					questionId: response.id,
				});
			}
		});
};

const updateTimeline = () => {
	if (!review.value) return;

	const outcomes: string[] = JSON.parse(review.value.answers_outcome);

	timeline.value = outcomes.map((outcome: string) => outcome as Outcome);
};

watch(
	() => props.id,
	async () => {
		await getRouteDataAsync();
	},
);

watch(
	() => props.questionId,
	async () => {
		await getOrdinalDataAsync();
		resetEvaluations();
	},
);

onMounted(async () => {
	await getRouteDataAsync();
});

const markerIcon = (outcome: Outcome) => {
	let icon = '';
	switch (outcome) {
		case Outcome.Correct:
			icon = 'fa-regular fa-face-smile';
			break;
		case Outcome.Incorrect:
			icon = 'fa-regular fa-face-frown';
			break;
		case Outcome.Partial:
			icon = 'fa-regular fa-face-flushed';
			break;
		case Outcome.Unanswered:
			icon = 'fa-regular fa-face-meh';
			break;
		default:
			break;
	}

	return icon;
};

const markerColor = (outcome: Outcome) => {
	let color = '';
	switch (outcome) {
		case Outcome.Correct:
			color = 'text-green';
			break;
		case Outcome.Incorrect:
			color = 'text-red';
			break;
		case Outcome.Partial:
			color = 'text-orange';
			break;
		case Outcome.Unanswered:
			color = 'text-grey';
			break;
		default:
			break;
	}

	return color;
};

const timeline = ref<Outcome[]>([]);

const secondsLeft = computed(() => {
	if (!review.value?.seconds_left) return;
	return new Date(review.value?.seconds_left * 1000).toUTCString().split(' ')[4];
});

const executionTableStudentDt = ref();
const exportCSVStudent = () => executionTableStudentDt.value.exportCSV();
const filtersStudent = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});
const columnNamesStudent = ref();
const columnsStudent = ref();
const sqlErrorStudent = ref('');
const evaluatedStudentCode = ref('');
const evaluatedTeacherCode = ref('');

const evaluateStudentSqlAsync = async () => {
	const response = await service.postAsync('/exec/correct', {
		ordinal: props.questionId,
		testInstanceId: review.value?.id_test_instance,
		courseId: courseId,
	});
	if (!response.data.success && response.data.error) {
		sqlErrorStudent.value = response.data.error.message;
		return;
	}
	sqlErrorStudent.value = '';

	const headers = response.data.data.fields.map((f: any) => f.name);
	columnNamesStudent.value = headers;
	const rows = response.data.data.rows;
	const cs = [];
	for (let index = 0; index < headers.length; index++) {
		cs.push(`C${index}`);
	}

	const tmp2: any[] = [];
	for (let index = 0; index < rows.length; index++) {
		const r = rows[index];
		let tmp: any[] = [];
		for (let idx = 0; idx < cs.length; idx++) {
			const c = cs[idx];
			tmp.push(r[c as keyof {}]);
		}
		tmp2.push(tmp);
	}

	columnsStudent.value = tmp2.map((row): any =>
		row.reduce((result: { [x: string]: any }, field: any, index: number) => {
			result[headers[index]] = field;
			return result;
		}, {}),
	);
};
const evaluateStudentCodeAsync = async () => {
	const response = await service.postAsync('/exec/student', {
		ordinal: props.questionId,
		testInstanceId: review.value?.id_test_instance,
		courseId: courseId,
	});
	evaluatedStudentCode.value = response.data.codeResult;
};

const executionTableTeacherDt = ref();
const exportCSVTeacher = () => executionTableTeacherDt.value.exportCSV();
const filtersTeacher = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});
const columnNamesTeacher = ref();
const columnsTeacher = ref();
const sqlErrorTeacher = ref('');

const evaluateTeacherSqlAsync = async () => {
	const response = await service.postAsync('/exec/correct', {
		ordinal: props.questionId,
		testInstanceId: review.value?.id_test_instance,
		courseId: courseId,
	});
	if (!response.data.success && response.data.error) {
		sqlErrorTeacher.value = response.data.error.message;
		return;
	}
	sqlErrorTeacher.value = '';

	const headers = response.data.data.fields.map((f: any) => f.name);
	columnNamesTeacher.value = headers;
	const rows = response.data.data.rows;
	const cs = [];
	for (let index = 0; index < headers.length; index++) {
		cs.push(`C${index}`);
	}

	const tmp2: any[] = [];
	for (let index = 0; index < rows.length; index++) {
		const r = rows[index];
		let tmp: any[] = [];
		for (let idx = 0; idx < cs.length; idx++) {
			const c = cs[idx];
			tmp.push(r[c as keyof {}]);
		}
		tmp2.push(tmp);
	}

	columnsTeacher.value = tmp2.map((row): any =>
		row.reduce((result: { [x: string]: any }, field: any, index: number) => {
			result[headers[index]] = field;
			return result;
		}, {}),
	);
};
const evaluateTeacherCodeAsync = async () => {
	const response = await service.postAsync('/exec/correct', {
		ordinal: props.questionId,
		testInstanceId: review.value?.id_test_instance,
		courseId: courseId,
	});

	evaluatedTeacherCode.value = response.data.codeResult;
};

const resetEvaluations = () => {
	evaluatedStudentCode.value = '';
	evaluatedTeacherCode.value = '';
	columnsStudent.value = '';
	columnsTeacher.value = '';
};

//! This is reused from EditQuestion, think about abstracting this out
const isAbc = computed((): boolean | undefined => reviewOrdinal.value?.has_answers);
const isFreeText = computed((): boolean | undefined =>
	reviewOrdinal.value?.type_name ? reviewOrdinal.value?.type_name.toUpperCase().includes('FREE TEXT') : false,
);
const isJson = computed((): boolean | undefined =>
	reviewOrdinal.value?.type_name ? reviewOrdinal.value?.type_name.toUpperCase().includes('JSON') : false,
);
const isScale = computed((): boolean | undefined =>
	reviewOrdinal.value?.type_name ? reviewOrdinal.value?.type_name.toUpperCase().includes('SCALE') : false,
);
const isSql = computed((): boolean | undefined =>
	reviewOrdinal.value?.type_name ? reviewOrdinal.value?.type_name.toUpperCase().includes('SQL') : false,
);
const isC = computed((): boolean | undefined =>
	reviewOrdinal.value?.type_name ? reviewOrdinal.value?.type_name.toUpperCase().includes('C-LANG') : false,
);
const isJava = computed((): boolean | undefined =>
	reviewOrdinal.value?.type_name ? reviewOrdinal.value?.type_name.toUpperCase().includes('JAVA') : false,
);
const isPython = computed((): boolean | undefined =>
	reviewOrdinal.value?.type_name ? reviewOrdinal.value?.type_name.toUpperCase().includes('PYTHON') : false,
);
const isCodeExactly = computed((): boolean | undefined => {
	return (
		!isSql.value &&
		!isC.value &&
		!isJava.value &&
		!isPython.value &&
		(reviewOrdinal.value?.type_name ? reviewOrdinal.value?.type_name.toUpperCase().includes('CODE') : false)
	);
});
const isText = computed((): boolean | undefined => isAbc.value || isFreeText.value || isJson.value || isScale.value);
const isCode = computed(
	(): boolean | undefined => (isC.value || isJava.value || isPython.value || isCodeExactly.value) && !isText.value,
);

const isFile = computed(
	() =>
		reviewOrdinal.value?.upload_file_no &&
		reviewOrdinal.value?.upload_file_no > 0 &&
		reviewOrdinal.value.uploaded_files,
);

const ordinalToAlphabetical = (idx: number): string => String.fromCharCode(idx + 64).toLowerCase();

const getAnswerClass = (answer: Answer) =>
	answer.is_correct && review.value?.show_solutions ? 'bg-success' : 'bg-secondary';
const getAnswerClassDiv = (answer: Answer) => {
	if (reviewOrdinal.value?.student_answers.includes(answer.ordinal)) return ' edgar-selected-answer pt-1 ';
};

const showHeader = ref(true);
</script>

//! TODO: Add JSON Component (it doesn't work locally)
<template>
	<div class="container-fluid no-x">
		<Card id="toolbar">
			<template #title>
				<div class="wrapper">
					<div>
						{{ review?.title }}
						<Button
							class="p-button-sm p-button-outlined"
							:icon="!showHeader ? 'pi pi-angle-down' : 'pi pi-angle-up'"
							@click="showHeader = !showHeader" />
						<p>
							<small class="text-600 text-xs">{{ review?.type_name }}</small>
						</p>
						<p v-show="showHeader" class="text-blue">Total score: {{ review?.score }}</p>
					</div>
					<div v-show="showHeader" class="center">
						<Timeline :value="timeline" layout="horizontal">
							<template #marker="slotProps">
								<router-link
									:to="{
										name: RouteNames.ReviewExam,
										params: { id: props.id, questionId: slotProps.index + 1 },
									}"
									style="text-decoration: none">
									<div
										class="flex me-2 p-2"
										:style="
											slotProps.index + 1 === props.questionId
												? 'border: 2px solid lightblue'
												: 'border: 0.5px dashed lightblue'
										">
										<h4 class="me-2">{{ slotProps.index + 1 }}</h4>
										<font-awesome-icon
											class="icon me-4"
											:class="markerColor(slotProps.item)"
											:icon="markerIcon(slotProps.item)" />
									</div>
								</router-link>
							</template>
						</Timeline>
					</div>
					<div v-show="showHeader" class="w-50 wrapper">
						<Avatar class="mt-4" size="xlarge" shape="circle">
							<font-awesome-icon icon="user"></font-awesome-icon>
						</Avatar>
						<div>
							<p class="p-0 m-0">
								<Tag :value="review?.student" class="w-100" />
							</p>
							<p class="p-0 m-0"><Tag class="w-100" :value="review?.alt_id" /></p>
							<p class="p-0 m-0"><Tag class="w-100" :value="review?.alt_id2" /></p>
						</div>
						<div>
							<span class="ms-2">{{ secondsLeft }}</span>
						</div>
					</div>
					<div v-show="showHeader">
						<span class="me-1">
							<Tag severity="success">
								<h3>{{ review?.correct_no }}</h3>
							</Tag>
						</span>
						<span class="me-1">
							<Tag severity="danger">
								<h3>{{ review?.incorrect_no }}</h3>
							</Tag>
						</span>
						<span class="me-1">
							<Tag severity="info">
								<h3>{{ review?.unanswered_no }}</h3>
							</Tag>
						</span>
						<span class="me-1">
							<Tag severity="warning">
								<h3>{{ review?.partial_no }}</h3>
							</Tag>
						</span>
					</div>
				</div>
			</template>
			<template #content>
				<div v-show="showHeader">
					<Divider />
					<h5>{{ reviewOrdinal?.type_name }}</h5>
					<strong class="text-blue">
						Score: {{ reviewOrdinal?.score }} (={{ (reviewOrdinal?.score_perc ?? 0) * 100 }}%)
					</strong>
					<div v-if="reviewOrdinal && reviewOrdinal.id">
						<span class="me-2">
							<strong class="me-2">Id:</strong>
							<router-link :to="{ name: RouteNames.EditQuestion, params: { id: reviewOrdinal.id } }">
								<Tag>
									{{ reviewOrdinal?.id }}
									<font-awesome-icon icon="arrow-up-right-from-square" class="ms-2" />
								</Tag>
							</router-link>
						</span>

						<span>
							<a target="_blank" :href="`http://localhost:1337/question/instances/${reviewOrdinal.id}`">
								See instances (and accept?)
								<font-awesome-icon icon="arrow-up-right-from-square" class="ms-2" />
							</a>
						</span>
					</div>
				</div>
			</template>
		</Card>
		<QuestionPreviewComponent
			:markdown="reviewOrdinal?.question_text"
			layout-question="none"
			layout-preview="'col-12 md:col-12 flex'"
			preview-header="Question" />
		<div v-if="isCode" class="row">
			<!-- TODO: Change to Codemirror component -->
			<QuestionPreviewComponent
				v-if="reviewOrdinal && reviewOrdinal.student_answer_code != null"
				id="review-student"
				class="col"
				:markdown="reviewOrdinal.student_answer_code"
				layout-preview="none"
				layout-question="'col-12 md:col-12 flex'"
				question-header="Student's answer"
				:show-placeholders="false"
				:extensions="extensions"
				:show-cheats="false"
				readonly />
			<!-- TODO: Change to Codemirror component -->
			<QuestionPreviewComponent
				v-if="reviewOrdinal && reviewOrdinal.c_source"
				id="review-teacher"
				class="col"
				:markdown="reviewOrdinal.c_source"
				:layout-preview="'none'"
				:layout-question="'col-12 md:col-12 flex'"
				question-header="Correct answer"
				:show-placeholders="false"
				:extensions="extensions"
				:show-cheats="false"
				readonly />

			<TabView>
				<TabPanel header="Student's result">
					<Button
						:label="evaluatedStudentCode ? 'Rerun student code' : 'Run student code'"
						@click="evaluateStudentCodeAsync" />
					<!-- TODO: Fix bootstrap not working! -->
					<div v-html="evaluatedStudentCode"></div>
				</TabPanel>
				<TabPanel v-if="review?.show_solutions" header="Correct result">
					<Button
						:label="evaluatedTeacherCode ? 'Rerun teacher code' : 'Run teacher code'"
						@click="evaluateTeacherCodeAsync" />
					<!-- TODO: Fix bootstrap not working! -->
					<div v-html="evaluatedTeacherCode"></div>
				</TabPanel>
			</TabView>
		</div>
		<!-- TODO: Change to Codemirror component -->
		<QuestionPreviewComponent
			v-if="isFreeText && reviewOrdinal && reviewOrdinal.student_answer_text != null"
			id="review-student"
			class="col"
			:markdown="reviewOrdinal.student_answer_text"
			layout-preview="none"
			layout-question="'col-12 md:col-12 flex'"
			question-header="Student's answer"
			:show-placeholders="false"
			:extensions="extensions"
			:show-cheats="false"
			readonly />

		<Card v-if="isAbc">
			<template #content>
				<div
					v-for="answer in reviewQuestionAnswers"
					:key="answer.ordinal"
					class="flex"
					:class="getAnswerClassDiv(answer)">
					<Badge
						class="badge block-badge me-2"
						:class="getAnswerClass(answer)"
						:value="ordinalToAlphabetical(answer.ordinal)"
						size="large"></Badge>
					<p v-html="render(answer.answer_text)"></p>
				</div>
			</template>
		</Card>

		<div v-if="isSql" class="row">
			<!-- TODO: Change to Codemirror component -->
			<QuestionPreviewComponent
				v-if="reviewOrdinal && reviewOrdinal.student_answer_code != null"
				id="review-student"
				class="col"
				:markdown="reviewOrdinal.student_answer_code"
				layout-preview="none"
				layout-question="'col-12 md:col-12 flex'"
				question-header="Student's answer"
				:show-placeholders="false"
				:extensions="sqlExtensions"
				:show-cheats="false"
				readonly />
			<!-- TODO: Change to Codemirror component -->
			<QuestionPreviewComponent
				v-if="reviewOrdinal && reviewOrdinal.sql_answer"
				id="review-teacher"
				class="col"
				:markdown="reviewOrdinal.sql_answer"
				:layout-preview="'none'"
				:layout-question="'col-12 md:col-12 flex'"
				question-header="Correct answer"
				:show-placeholders="false"
				:extensions="sqlExtensions"
				:show-cheats="false"
				readonly />

			<TabView>
				<TabPanel header="Student's result">
					<Button
						:label="columnsStudent ? 'Rerun student code' : 'Run student code'"
						@click="evaluateStudentSqlAsync" />
					<!-- TODO: Fix bootstrap not working! -->
					<div v-if="columnsStudent && !sqlErrorStudent">
						<DataTable
							ref="executionTableStudentDt"
							v-model:filters="filtersStudent"
							:value="columnsStudent"
							filter-display="menu"
							show-gridlines
							class="p-datatable-sm"
							:rows="10"
							paginator>
							<template #header>
								<span class="me-2">
									Rowcount: {{ columnsStudent.length }}, showing 10 entries per page.
								</span>
								<div style="display: flex">
									<span class="p-input-icon-left">
										<i class="pi pi-search" />
										<InputText
											v-model="filtersStudent['global'].value"
											placeholder="Search"
											class="p-inputtext-sm p-inputtext-filled" />
									</span>
									<Button
										icon="pi pi-external-link"
										label="Export"
										class="p-button-sm ml-3"
										@click="exportCSVStudent" />
								</div>
							</template>
							<Column
								v-for="(col, index) of columnNamesStudent"
								:key="index"
								:field="col"
								:header="col"
								sortable />
						</DataTable>
					</div>
					<div v-else>
						<span class="text-400 center">
							{{ sqlErrorStudent ?? 'An error occured with the execution.' }}
						</span>
					</div>
				</TabPanel>
				<TabPanel v-if="review?.show_solutions" header="Correct result">
					<Button
						:label="columnsTeacher ? 'Rerun teacher code' : 'Run teacher code'"
						@click="evaluateTeacherSqlAsync" />
					<!-- TODO: Fix bootstrap not working! -->
					<div v-if="columnsTeacher && !sqlErrorTeacher">
						<DataTable
							ref="executionTableTeacherDt"
							v-model:filters="filtersTeacher"
							:value="columnsTeacher"
							filter-display="menu"
							show-gridlines
							class="p-datatable-sm"
							:rows="10"
							paginator>
							<template #header>
								<span class="me-2">
									Rowcount: {{ columnsTeacher.length }}, showing 10 entries per page.
								</span>
								<div style="display: flex">
									<span class="p-input-icon-left">
										<i class="pi pi-search" />
										<InputText
											v-model="filtersTeacher['global'].value"
											placeholder="Search"
											class="p-inputtext-sm p-inputtext-filled" />
									</span>
									<Button
										icon="pi pi-external-link"
										label="Export"
										class="p-button-sm ml-3"
										@click="exportCSVTeacher" />
								</div>
							</template>
							<Column
								v-for="(col, index) of columnNamesTeacher"
								:key="index"
								:field="col"
								:header="col"
								sortable />
						</DataTable>
					</div>
					<div v-else>
						<span class="text-400 center">
							{{ sqlErrorTeacher ?? 'An error occured with the execution.' }}
						</span>
					</div>
				</TabPanel>
			</TabView>
		</div>
		<Card v-if="isFile">
			<template #title>Correct answer</template>
			<template #content>
				<a target="_blank" download :href="`http://localhost:1337/download/${reviewOrdinal?.uploaded_files}`">
					<i class="pi pi-file"></i>
					Uploaded files
				</a>
			</template>
		</Card>
	</div>
</template>

<style scoped>
.file-icon {
	display: table-row;
	margin: 0 0 0 0 !important;
	font-size: 2em;
}
.text-green {
	color: green;
}

.text-red {
	color: red;
}

.text-orange {
	color: orange;
}

.text-gray {
	color: gray;
}

.text-yellow {
	color: yellow;
}

.text-blue {
	color: #5fc0f8;
}

.wrapper {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	/* column-gap: rem; */
}

.row {
	display: flex; /* equal height of the children */
}

.col {
	flex: 1; /* additionally, equal width */
}

#toolbar {
	position: sticky !important;
	position: -webkit-sticky;
	top: 0 !important;
	z-index: 2;
}

.edgar-selected-answer {
	border: darkgreen solid 3px;
	background-color: #fffacd !important;
}
</style>
