<script setup lang="ts">
import ApiService from '@/services/ApiService';
import { ExamReview } from '@/models/admin/exams/ExamReview';
import { ExamReviewOrdinal } from '@/models/admin/exams/ExamReviewOrdinal';
import { ExamReviewQuestionAnswers } from '@/models/admin/exams/ExamReviewQuestionAnswers';
import { ExamReviewAttachment } from '@/models/admin/exams/ExamReviewAttachment';
import { ref, onMounted, watch, computed } from 'vue';
import Avatar from 'primevue/avatar';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import RouteNames from '@/router/routes';
import QuestionPreviewComponent from '@/components/admin/questions/QuestionPreviewComponent.vue';

const courseId = 2000;

//? Which one to use generally?
const additionalExtensions = [cpp(), oneDark];

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
const reviewQuestionAnswers = ref<ExamReviewQuestionAnswers[]>([]);
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
			reviewOrdinal.value = response;

			if (!response) return;

			if (response?.has_answers) {
				reviewQuestionAnswers.value = await service.getManyAsync<ExamReviewQuestionAnswers>(
					'/exam/review/question',
					{ questionId: response.id },
				);
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

const responseStudent = ref();
const responseTeacher = ref();
const evaluatedStudentCode = ref('aa');
const evaluatedTeacherCode = ref('aa');

const evaluateStudentCodeAsync = async () => {
	responseStudent.value = await service.postAsync('/exec/student', {
		ordinal: props.questionId,
		testInstanceId: review.value?.id_test_instance,
		courseId: courseId,
	});
};
const evaluateTeacherCodeAsync = async () => {
	const response = await service.postAsync('/exec/correct', {
		ordinal: props.questionId,
		testInstanceId: review.value?.id_test_instance,
		courseId: courseId,
	});
	evaluatedTeacherCode.value = response.data.codeResult;
};
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>
				<div class="wrapper">
					<div>
						{{ review?.title }}
						<p>
							<small class="text-600 text-xs">{{ review?.type_name }}</small>
						</p>
						<p class="text-blue">Total score: {{ review?.score }}</p>
					</div>
					<div class="center">
						<Timeline :value="timeline" layout="horizontal">
							<template #marker="slotProps">
								<router-link
									:to="{
										name: RouteNames.ReviewExam,
										params: { id: props.id, questionId: slotProps.index + 1 },
									}"
									style="text-decoration: none">
									<div class="flex me-2 p-2" style="border: 0.5px dashed lightblue">
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
					<div class="w-50 wrapper">
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
					<div>
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
			</template>
		</Card>
		<QuestionPreviewComponent
			:markdown="reviewOrdinal?.question_text"
			layout-question="none"
			layout-preview="'col-12 md:col-12 flex'"
			preview-header="Question" />
		<div class="flex">
			<!-- TODO: Change to Codemirror component -->
			<QuestionPreviewComponent
				id="review-student"
				class="me-1"
				:markdown="reviewOrdinal?.student_answer_code"
				layout-preview="none"
				layout-question="'col-12 md:col-12 flex'"
				question-header="Student's answer"
				:show-placeholders="false"
				:extensions-override="additionalExtensions"
				readonly />
			<!-- TODO: Change to Codemirror component -->
			<QuestionPreviewComponent
				id="review-teacher"
				class="ms-1"
				:markdown="reviewOrdinal?.c_source"
				:layout-preview="'none'"
				:layout-question="'col-12 md:col-12 flex'"
				question-header="Correct answer"
				:show-placeholders="false"
				:extensions-override="additionalExtensions"
				readonly />
		</div>
		<TabView class="center">
			<TabPanel header="Student's result">
				<div v-html="evaluatedStudentCode"></div>
				<Button label="Rerun student's code" @click="evaluateStudentCodeAsync" />
			</TabPanel>
			<TabPanel header="Correct result">
				<div v-html="evaluatedTeacherCode"></div>
				<div>{{ responseTeacher }}</div>
				<Button label="Rerun teacher's code" @click="evaluateTeacherCodeAsync" />
			</TabPanel>
		</TabView>

		<Card>
			<template #title>ExamReviewQuestionAnswers</template>
			<template #content>{{ reviewQuestionAnswers }}</template>
		</Card>
		<Card>
			<template #title>ExamReviewAttachment</template>
			<template #content>{{ reviewAttachments }}</template>
		</Card>
	</div>
</template>

<style scoped>
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

.ui-tabs .ui-tabs-nav {
	text-align: center;
}
.ui-tabs .ui-tabs-nav li {
	float: none !important;
	display: inline-block;
}
</style>
