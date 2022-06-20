<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { PlagiarismDetectionAlgorithm } from '@/models/admin/exams/PlagiarismDetectionAlgorithm';
import { Pace } from '@/models/admin/exams/Pace';
import { Policy } from '@/models/admin/exams/Policy';
import { EmailReminderScheme } from '@/models/admin/exams/EmailReminderScheme';
import { Type } from '@/models/admin/exams/Type';
import { Node } from '@/models/admin/exams/Node';
import { GradingModel } from '@/models/admin/exams/GradingModel';
import { BigTest } from '@/models/admin/exams/BigTest';
import { TestPart } from '@/models/admin/exams/TestPart';
import { useRoute, useRouter } from 'vue-router';
import humanize from '@/utilities/date-humanizer/humanizer';
import Calendar from 'primevue/calendar';
import { NodeType } from '@/models/admin/exams/NodeType';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Message from 'primevue/message';
import RouteNames from '@/router/routes';
const route = useRoute();
const router = useRouter();

const toast = useToast();

const appUserId = 46;
const courseId = 2000; // ALCHEMY
// const courseId = 477; // NBP
const academicYearId = 2020;
const service = new ApiService();
const props = defineProps({
	id: { type: Number, required: true },
});

const examError = ref('');
const examWarning = ref('');
const examSuccess = ref('');
const now = new Date(Date.now());
const exam = ref<BigTest>();
const ordinal = ref(1);
const title = ref('');
const titleAbbrev = ref('');
const password = ref('');
const availableFrom = ref<Date>(now);
const availableTo = ref<Date>(now);
const global = ref(false);
const isPublic = ref(false);
const useInStats = ref(false);
const showSolutions = ref(false);
const hintResult = ref(false);
const asyncSubmit = ref(false);
const scoreIgnored = ref(false);
const forwardOnly = ref(false);
const anonStalk = ref(false);
const trimClock = ref(false);
const maxRuns = ref(0);
const maxScore = ref(0);
const noOfQuestions = ref(0);
const duration = ref(0);
const passPercentage = ref(100);
const reviewPeriod = ref(0);
const uploadFiles = ref(0);
const uploadLimit = ref(64);

const questionPaces = ref<Pace[]>([]);
const selectedQuestionPace = ref<Pace>();

const testPaces = ref<Pace[]>([]);
const selectedTestPace = ref<Pace>();

const ticketPolicies = ref<Policy[]>([]);
const selectedTicketPolicy = ref<Policy>();

const emailReminders = ref<EmailReminderScheme[]>([]);
const selectedEmailReminder = ref<EmailReminderScheme>();

const plagiarismAlgorithms = ref<PlagiarismDetectionAlgorithm[]>([]);
const selectedPlagiarismAlgorithm = ref<PlagiarismDetectionAlgorithm>();

const nodes = ref<Node[]>([]);
const selectedNode = ref<Node>();

const gradingModels = ref<GradingModel[]>([]);

const nodesTestParts = ref<Node[]>();
const selectedNodeTestParts = ref<Node>();
const nodeName = ref('');

const fetchedNodes = ref<NodeType[]>([]);

// TODO: Better model for this one bro
const testParts = ref<TestPart[]>([]);

const clone = async () => {
	const cloneResponse = await service.postAsync('/exam/clone', {
		testId: props.id,
		academicYearId: academicYearId,
		appUserId: appUserId,
	});

	if (!cloneResponse || !cloneResponse.data) return;
	const newId = cloneResponse.data[0].clone_test;
	toast.add({
		severity: 'success',
		summary: '200 OK',
		detail: `Exam ${props.id} cloned successfully to ${newId}.`,
	});
	router.push({ name: RouteNames.EditExam, params: { id: newId } });
};
const cloneUp = async () => {
	const cloneResponse = await service.postAsync('/exam/clone', {
		testId: props.id,
		academicYearId: academicYearId,
		appUserId: appUserId,
	});

	if (!cloneResponse || !cloneResponse.data) return;
	const newId = cloneResponse.data[0].clone_test;
	toast.add({
		severity: 'success',
		summary: '200 OK',
		detail: `Exam ${props.id} cloned successfully to ${newId} in the next academic year.`,
	});
};
const validate = async () => {
	const validationObject = {
		id_test: props.id,
		title: title.value,
		title_abbrev: titleAbbrev.value,
		test_ordinal: ordinal.value,
		max_runs: maxRuns.value,
		is_public: isPublic.value,
		is_global: global.value,
		use_in_stats: useInStats.value,
		show_solutions: showSolutions.value,
		hint_result: hintResult.value,
		max_score: maxScore.value,
		test_score_ignored: scoreIgnored.value,
		async_submit: asyncSubmit.value,
		trim_clock: trimClock.value,
		forward_only: forwardOnly.value,
		allow_anonymous_stalk: anonStalk.value,
		password: password.value,
		questions_no: noOfQuestions.value,
		duration_seconds: duration.value,
		pass_percentage: passPercentage.value,
		review_period_mins: reviewPeriod.value,
		id_email_reminder_scheme: selectedEmailReminder.value?.id ?? null,
		ts_available_to: availableTo.value,
		ts_available_from: availableFrom.value,
		is_competition: false, // TODO: Ask.
		eval_comp_score: null, // TODO: Ask.
		upload_file_no: uploadFiles.value,
		upload_file_limit: uploadLimit.value,
		id_plag_detection_algorithm: selectedPlagiarismAlgorithm.value?.id ?? null,
		id_ticket_policy: selectedTicketPolicy.value?.id ?? null,
		id_pace_question: selectedQuestionPace.value?.id ?? null,
		id_pace_test: selectedTestPace.value?.id ?? null,
		test_parts: testParts.value,
		// testQuestions: testQuestions.value, // PHASE 2
		// peerTestGroupIds: peerTestGroupIds.value, // PHASE 2 MASTER
		// peerTestGroupQuestions: peerTestGroupQuestions.value, // PHASE 2 MASTER
		// testPhase1Id: testPhase1Id.value, // PHASE 1
		// testPhase2Id: testPhase2Id.value, // PHASE 1
		// assessmentsNo: assessmentsNo.value, // PHASE 1
		// calibAssessmentsNo: calibAssessmentsNo.value // PHASE 1
	};
	await service
		.postAsync('/exam/validate', validationObject)
		.then((response: any) => {
			response = response.data;
			if (!response.valid) {
				toast.add({
					severity: 'error',
					summary: '400 Bad request',
					detail: `Exam ${props.id} is NOT valid.`,
				});
				examError.value = response.error;
				return;
			}
			if (response.warnings) {
				toast.add({
					severity: 'warn',
					summary: '200 OK',
					detail: `Exam ${props.id} is valid, but has warnings. Warnings: ${response.warnings}.`,
				});
				examWarning.value = response.warnings;
				return;
			}
			toast.add({
				severity: 'success',
				summary: '200 OK',
				detail: `Exam ${props.id} is valid.`,
			});
			examSuccess.value = 'The test definition is valid.';
		})
		.catch((error: any) => {
			toast.add({
				severity: 'error',
				summary: '400 Bad request',
				detail: `Exam ${props.id} is NOT valid. Error: ${JSON.stringify(error)}.`,
			});
		});
};
const save = async () => {
	const saveObject = {
		id_test: props.id,
		title: title.value,
		title_abbrev: titleAbbrev.value,
		test_ordinal: ordinal.value,
		max_runs: maxRuns.value,
		is_public: isPublic.value,
		is_global: global.value,
		use_in_stats: useInStats.value,
		show_solutions: showSolutions.value,
		hint_result: hintResult.value,
		max_score: maxScore.value,
		test_score_ignored: scoreIgnored.value,
		async_submit: asyncSubmit.value,
		trim_clock: trimClock.value,
		forward_only: forwardOnly.value,
		allow_anonymous_stalk: anonStalk.value,
		password: password.value,
		questions_no: noOfQuestions.value,
		duration_seconds: duration.value,
		pass_percentage: passPercentage.value,
		review_period_mins: reviewPeriod.value,
		id_email_reminder_scheme: selectedEmailReminder.value?.id ?? null,
		ts_available_to: new Date(availableTo.value).toLocaleString('sv-SE'),
		ts_available_from: new Date(availableFrom.value).toLocaleString('sv-SE'),
		is_competition: false, // TODO: Ask.
		eval_comp_score: null, // TODO: Ask.
		upload_file_no: uploadFiles.value,
		upload_file_limit: uploadLimit.value,
		id_plag_detection_algorithm: selectedPlagiarismAlgorithm.value?.id ?? null,
		id_ticket_policy: selectedTicketPolicy.value?.id ?? null,
		id_pace_question: selectedQuestionPace.value?.id ?? null,
		id_pace_test: selectedTestPace.value?.id ?? null,
		test_parts: testParts.value,
		// testQuestions: testQuestions.value, // PHASE 2
		// peerTestGroupIds: peerTestGroupIds.value, // PHASE 2 MASTER
		// peerTestGroupQuestions: peerTestGroupQuestions.value, // PHASE 2 MASTER
		// testPhase1Id: testPhase1Id.value, // PHASE 1
		// testPhase2Id: testPhase2Id.value, // PHASE 1
		// assessmentsNo: assessmentsNo.value, // PHASE 1
		// calibAssessmentsNo: calibAssessmentsNo.value // PHASE 1
	};

	await service
		.postAsync('/exam/save', saveObject)
		.then(() => {
			toast.add({
				severity: 'success',
				summary: '200 OK',
				detail: `Exam ${props.id} saved successfully.`,
			});
		})
		.catch((err: any) => {
			toast.add({
				severity: 'error',
				summary: '500 Server error',
				detail: `Exam ${props.id} did not save. Error: ${JSON.stringify(err)}.`,
			});
		});
};
const testGenerate = async () => {
	console.log('testGenerate!');
};

const fetchNodes = async () => {
	fetchedNodes.value = await service.getManyAsync('/exam/edit/filtered_nodes', {
		courseId: courseId,
		nodeTypeId: selectedNode.value?.id,
		nodeName: nodeName.value,
	});
	// if (fetchedNodes.value === [])
};

const deletePart = (testPart: TestPart) => {
	service
		.postAsync('/exam/testparts/delete', {
			id_test_part: testPart.id_test_part,
		})
		.then(() =>
			service
				.getManyAsync<TestPart>('/test_parts', {
					testId: props.id,
				})
				.then((result: TestPart[]) => {
					testParts.value = result;
					testParts.value.forEach((tp) => {
						tp.node_name_and_type_name = `${tp.type_name} — ${tp.node_name}`;
						tp.pass_percentage = parseFloat(`${tp.pass_percentage}`) ?? 0.0;
					});
				}),
		)
		.then(() =>
			toast.add({
				severity: 'success',
				summary: '200 OK',
				detail: `Test part deleted successfully.`,
			}),
		);
};

const addNodeToExamPart = (node: NodeType) => {
	service
		.postAsync('/exam/testparts/addnode', {
			id_test: props.id,
			id_node: node.id,
		})
		.then(() =>
			service
				.getManyAsync<TestPart>('/test_parts', {
					testId: props.id,
				})
				.then((result: TestPart[]) => {
					testParts.value = result;
					testParts.value.forEach((tp) => {
						tp.node_name_and_type_name = `${tp.type_name} — ${tp.node_name}`;
						tp.pass_percentage = parseFloat(`${tp.pass_percentage}`) ?? 0.0;
					});
				}),
		)
		.then(() =>
			toast.add({
				severity: 'success',
				summary: '200 OK',
				detail: `Node added successfully.`,
			}),
		);
};

watch(
	() => props.id,
	async () => {
		await getQueryData().then(() => preselectDropdowns());
	},
);

const preselectDropdowns = () => {
	if (!exam.value) {
		selectedQuestionPace.value = questionPaces.value[0];
		selectedTestPace.value = testPaces.value[0];
		selectedTicketPolicy.value = ticketPolicies.value[0];
		selectedEmailReminder.value = emailReminders.value[0];
		selectedPlagiarismAlgorithm.value = plagiarismAlgorithms.value[0];
	} else {
		selectedQuestionPace.value = questionPaces.value.find((p) => p.id === exam.value?.id_pace_question);
		selectedTestPace.value = testPaces.value.find((p) => p.id === exam.value?.id_pace_test);
		selectedTicketPolicy.value = ticketPolicies.value.find((p) => p.id === exam.value?.id_ticket_policy);
		selectedEmailReminder.value = emailReminders.value.find((p) => p.id === exam.value?.id_email_reminder_scheme);
		selectedPlagiarismAlgorithm.value =
			plagiarismAlgorithms.value.find((p) => p.id === exam.value?.id_plag_detection_algorithm) ??
			plagiarismAlgorithms.value[0];
	}
};

const getQueryData = async () => {
	if (!props.id) return;
	const examPromise = service
		.getSingleAsync<BigTest>('/big_test', {
			testId: props.id,
			courseId: courseId,
			academicYearId: academicYearId,
		})
		.then((apiExam: BigTest | null) => {
			if (!apiExam) return;
			exam.value = apiExam;
			ordinal.value = exam.value.test_ordinal ?? 1;
			title.value = exam.value.title ?? '';
			titleAbbrev.value = exam.value.title_abbrev ?? '';
			password.value = exam.value.password ?? '';
			if (exam.value.ts_available_from && !Number.isNaN(new Date(exam.value.ts_available_from).getTime()))
				availableFrom.value = new Date(exam.value.ts_available_from);
			else {
				availableFrom.value = now;
			}
			if (exam.value.ts_available_to && !Number.isNaN(new Date(exam.value.ts_available_to).getTime()))
				availableTo.value = new Date(exam.value.ts_available_to);
			else {
				availableTo.value = now;
			}

			global.value = exam.value.is_global ?? false;
			isPublic.value = exam.value.is_public ?? false;
			useInStats.value = exam.value.use_in_stats ?? false;
			showSolutions.value = exam.value.show_solutions ?? false;
			hintResult.value = exam.value.hint_result ?? false;
			asyncSubmit.value = exam.value.async_submit ?? false;
			scoreIgnored.value = exam.value.test_score_ignored ?? false;
			forwardOnly.value = exam.value.forward_only ?? false;
			anonStalk.value = exam.value.allow_anonymous_stalk ?? false;
			trimClock.value = exam.value.trim_clock ?? false;

			maxRuns.value = exam.value.max_runs ?? 0;
			maxScore.value = exam.value.max_score ?? 0;
			noOfQuestions.value = exam.value.questions_no ?? 0;
			duration.value = exam.value.duration_seconds ?? 0;
			passPercentage.value = exam.value.pass_percentage ?? 0.0;
			reviewPeriod.value = exam.value.review_period_mins ?? 0;
			uploadFiles.value = exam.value.upload_file_no ?? 0;
			uploadLimit.value = exam.value.upload_file_limit ?? 0;
		});

	const testPartsPromise = service
		.getManyAsync<TestPart>('/test_parts', {
			testId: props.id,
		})
		.then((result: TestPart[]) => {
			testParts.value = result;
			testParts.value.forEach((tp) => {
				tp.node_name_and_type_name = `${tp.type_name} — ${tp.node_name}`;
				tp.pass_percentage = parseFloat(`${tp.pass_percentage}`) ?? 0.0;
			});
		});

	await Promise.all([examPromise, testPartsPromise]);
};

const fetchDropdowns = async () => {
	const pacesPromise = service
		.getManyAsync<Pace>('/pace_names')
		.then((paces: Pace[]) => (questionPaces.value = testPaces.value = paces));
	const ticketsPromise = service
		.getManyAsync<Policy>('/policy_names')
		.then((policies: Policy[]) => (ticketPolicies.value = policies));
	const emailRemindersPromise = service
		.getManyAsync<EmailReminderScheme>('/email_reminder_schemes')
		.then((emails: EmailReminderScheme[]) => (emailReminders.value = emails));
	const plagiarismAlgorithmsPromise = service
		.getManyAsync<PlagiarismDetectionAlgorithm>('/plag_detection_algorithms')
		.then(
			(algos: PlagiarismDetectionAlgorithm[]) =>
				(plagiarismAlgorithms.value = [
					{
						id: 0,
						name: 'Real-time plag detection is OFF',
					},
					...algos,
				]),
		);
	const nodesPromise = service.getManyAsync<Node>('/exam_node_names').then((types: Node[]) => {
		nodes.value = types;
		selectedNode.value = types[0];
	});
	const gradingModelsPromise = service
		.getManyAsync<GradingModel>('/grading_models')
		.then((models: GradingModel[]) => (gradingModels.value = models));
	const nodesTestPartsPromise = service
		.getManyAsync<Node>('/exam/node_names')
		.then((types: Node[]) => (nodesTestParts.value = types));
	const promises = [
		pacesPromise,
		ticketsPromise,
		emailRemindersPromise,
		plagiarismAlgorithmsPromise,
		nodesPromise,
		gradingModelsPromise,
		nodesTestPartsPromise,
	];

	return await Promise.all(promises);
};
onMounted(async () => {
	//! OPTIMIZATION: FetchDropdowns and GetQueryData can be awaited in parallel.
	await fetchDropdowns().then(async () => getQueryData().then(() => preselectDropdowns()));
});
</script>

<template>
	<div class="container-fluid">
		<Toast />
		<Toast />
		<br />
		<Message v-if="examError" severity="error">
			<div v-html="examError"></div>
		</Message>
		<Message v-if="examWarning" severity="warn">
			<div v-html="examWarning"></div>
		</Message>
		<Message v-if="examSuccess" severity="success">
			<div v-html="examSuccess"></div>
		</Message>
		<Card>
			<template #title>
				<h2>Exam definition</h2>
			</template>
			<template #content>
				<Card>
					<template #content>
						<div class="flex" style="justify-content: space-between">
							<div class="col-8 d-flex">
								<div class="d-flex justify-content-between flex-column">
									<span>
										<b class="me-2">Id:</b>
										<Tag>
											{{ exam?.id }}
										</Tag>
									</span>
									<span>
										<b>Type:</b>
										{{ exam?.type_name }}
									</span>
								</div>
								<div class="d-flex justify-content-between flex-column ml-3">
									<span>
										<b>Created:</b>
										{{ exam?.first_name }} {{ exam?.last_name }}
										<span
											v-if="
												exam?.ts_created && !Number.isNaN(new Date(exam?.ts_created).getTime())
											"
											style="font-size: 15px">
											{{ new Date(exam?.ts_created).toISOString().split('T')[0] }}
											<em>
												<small>
													{{ humanize(new Date(exam?.ts_created)) }}
												</small>
											</em>
										</span>
									</span>
									<span>
										<b>Modified:</b>
										{{ exam?.user_modified }}
										<span
											v-if="
												exam?.ts_modified &&
												!Number.isNaN(new Date(exam?.ts_modified).getTime())
											"
											style="font-size: 15px">
											{{ new Date(exam?.ts_modified).toISOString().split('T')[0] }}
											<em>
												<small>
													{{ humanize(new Date(exam?.ts_modified)) }}
												</small>
											</em>
										</span>
									</span>
								</div>
							</div>
							<div class="col-12 md:col-4">
								<span class="p-buttonset">
									<Button label="Clone" class="p-button p-button p-button-info" @click="clone" />
									<Button label="Clone up" class="p-button-help" @click="cloneUp" />
									<Button label="Validate" class="p-button-secondary" @click="validate" />
									<Button label="Save" class="p-button-success" @click="save" />
									<Button label="Test generate" @click="testGenerate" />
								</span>
							</div>
						</div>
					</template>
				</Card>
				<br />
				<Card>
					<template #content>
						<div class="grid p-fluid" style="row-gap: 1rem">
							<div class="col-12 md:col-1">
								<span class="p-float-label">
									<InputNumber
										id="ordinal"
										v-model="ordinal"
										:step="1"
										:min="1"
										:max="99"></InputNumber>
									<label for="ordinal">Ordinal</label>
								</span>
							</div>
							<div class="col-12 md:col-3">
								<span class="p-float-label">
									<InputText id="title" v-model="title"></InputText>
									<label for="title">Title</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<InputText id="title-abbrev" v-model="titleAbbrev"></InputText>
									<label for="title-abbrev">Title abbrev.</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<InputText id="password-exam" v-model="password"></InputText>
									<label for="password-exam">Password</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<Calendar
										id="available-from"
										v-model="availableFrom"
										date-format="yy-mm-dd"
										:show-time="true"
										:show-seconds="true" />
									<label for="available-from">Available from</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<Calendar
										id="available-to"
										v-model="availableTo"
										date-format="yy-mm-dd"
										:show-time="true"
										:show-seconds="true" />
									<label for="available-to">Available to</label>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="global">Global</label>
								<span class="p-float-label">
									<Checkbox id="global" v-model="global" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="Public">Public</label>
								<span class="p-float-label">
									<Checkbox id="Public" v-model="isPublic" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="use-in-stats">Use in stats</label>
								<span class="p-float-label">
									<Checkbox id="use-in-stats" v-model="useInStats" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="show-solutions">Show solutions</label>
								<span class="p-float-label">
									<Checkbox id="show-solutions" v-model="showSolutions" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="hint-result">Hint result</label>
								<span class="p-float-label">
									<Checkbox id="hint-result" v-model="hintResult" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="async-submit">Async submit</label>
								<span class="p-float-label">
									<Checkbox id="async-submit" v-model="asyncSubmit" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="score-ignored">Score ignored</label>
								<span class="p-float-label">
									<Checkbox id="score-ignored" v-model="scoreIgnored" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="forward-only">Forward only</label>
								<span class="p-float-label">
									<Checkbox id="forward-only" v-model="forwardOnly" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="anon-stak">Anon. stalk</label>
								<span class="p-float-label">
									<Checkbox id="anon-stalk" v-model="anonStalk" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1 me-4">
								<label for="trim-clock">Trim clock</label>
								<span class="p-float-label">
									<Checkbox id="trim-clock" v-model="trimClock" binary></Checkbox>
								</span>
							</div>
							<div class="col-12 md:col-1">
								<span class="p-float-label">
									<InputNumber id="max-runs" v-model="maxRuns" :step="1" :min="0"></InputNumber>
									<label for="max-runs">Max runs</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<InputNumber
										id="max-score"
										v-model="maxScore"
										:step="0.01"
										:min="0"
										:min-fraction-digits="2"
										:max-fraction-digits="2"></InputNumber>
									<label for="max-score">Max score</label>
								</span>
							</div>
							<div class="col-12 md:col-1">
								<span class="p-float-label">
									<InputNumber id="no-of-questions" v-model="noOfQuestions"></InputNumber>
									<label for="no-of-questions">No of questions</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<InputNumber id="duration" v-model="duration" suffix=" seconds"></InputNumber>
									<label for="duration">Duration</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<InputNumber id="pass-perc" v-model="passPercentage" suffix=" %"></InputNumber>
									<label for="pass-perc">Pass percentage</label>
								</span>
							</div>
							<div class="col-12 md:col-1">
								<span class="p-float-label">
									<InputNumber id="rvw-period" v-model="reviewPeriod" suffix=" min"></InputNumber>
									<label for="rvw-period">Review period</label>
								</span>
							</div>
							<div class="col-12 md:col-1">
								<span class="p-float-label">
									<InputNumber id="upload-files" v-model="uploadFiles"></InputNumber>
									<label for="upload-files">Upload files</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<InputNumber id="upload-limit" v-model="uploadLimit" suffix=" B"></InputNumber>
									<label for="upload-limit">Upload limit</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<Dropdown
										id="question-pace"
										v-model="selectedQuestionPace"
										:options="questionPaces"
										option-label="pace_name"></Dropdown>
									<label for="question-pace">Question pace</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<Dropdown
										id="test-pace"
										v-model="selectedTestPace"
										:options="testPaces"
										option-label="pace_name"></Dropdown>
									<label for="test-pace">Test pace</label>
								</span>
							</div>
							<div class="col-12 md:col-2">
								<span class="p-float-label">
									<Dropdown
										id="ticket-policy"
										v-model="selectedTicketPolicy"
										:options="ticketPolicies"
										option-label="policy_name"></Dropdown>
									<label for="ticket-policy">Ticket policy</label>
								</span>
							</div>
							<div class="col-12 md:col-3">
								<span class="p-float-label">
									<Dropdown
										id="email-reminder"
										v-model="selectedEmailReminder"
										:options="emailReminders"
										option-label="email_reminder_scheme_name"></Dropdown>
									<label for="email-reminder">Email reminder</label>
								</span>
							</div>
							<div class="col-12 md:col-3">
								<span class="p-float-label">
									<Dropdown
										id="realtime-plagiarism-detection"
										v-model="selectedPlagiarismAlgorithm"
										:options="plagiarismAlgorithms"
										option-label="name"></Dropdown>
									<label for="realtime-plagiarism-detection">Realtime plagiarism detection</label>
								</span>
							</div>
						</div>
					</template>
				</Card>
				<br />
				<Card>
					<template #title>Exam parts</template>
					<template #content>
						<DataTable :value="testParts">
							<template #empty>
								<span class="center">No data to show.</span>
							</template>
							<Column field="" header="#">
								<template #body="{ index }">
									<div>{{ index + 1 }}</div>
								</template>
							</Column>
							<Column field="ordinal" header="Ordinal">
								<template #body="{ data }">
									<InputNumber v-model="data.ordinal" :min="0" :max="200" />
								</template>
							</Column>
							<Column field="node_name_and_type_name" header="Node type and name">
								<template #body="{ data }">
									<strong>{{ data.node_name_and_type_name }}</strong>
								</template>
							</Column>
							<Column field="min_questions" header="Min questions">
								<template #body="{ data }">
									<InputNumber v-model="data.min_questions" :min="0" />
								</template>
							</Column>
							<Column field="max_questions" header="Max questions">
								<template #body="{ data }">
									<InputNumber v-model="data.max_questions" :min="0" />
								</template>
							</Column>
							<Column field="pass_percentage" header="Pass percentage">
								<template #body="{ data }">
									<InputNumber v-model="data.pass_percentage" :min="0" suffix=" %" />
								</template>
							</Column>
							<Column field="id_grading_model" header="Grading model">
								<template #body="{ data }">
									<div class="center-align">
										<Dropdown
											id="email-reminder"
											v-model="data.id_grading_model"
											:options="gradingModels"
											option-label="model_name"
											option-value="id"></Dropdown>
									</div>
								</template>
							</Column>
							<Column field="" header="">
								<template #body="{ data }">
									<div class="center-align">
										<Button class="p-button-danger" label="Delete" @click="deletePart(data)" />
									</div>
								</template>
							</Column>
						</DataTable>
					</template>
				</Card>
			</template>
			<template #footer>
				<Card>
					<template #title>Add nodes</template>
					<template #content>
						<div class="grid p-fluid">
							<div class="col-12 md:col-5">
								<span class="p-float-label">
									<Dropdown
										id="node-type"
										v-model="selectedNode"
										:options="nodes"
										option-label="type_name"></Dropdown>
									<label for="node-type">Node type</label>
								</span>
							</div>
							<div class="col-12 md:col-6">
								<span class="p-float-label">
									<InputText id="filter-name" v-model="nodeName"></InputText>
									<label for="filter-name">Filter name</label>
								</span>
							</div>
							<div class="col-12 md:col-1">
								<Button label="Fetch nodes" class="p-button-info" @click="fetchNodes" />
							</div>
						</div>
					</template>
					<template #footer>
						<h3>Nodes ({{ fetchedNodes.length }})</h3>
						<br />
						<br />
						<div v-for="node in fetchedNodes" :key="node.id">
							<div class="p-inputgroup">
								<div
									class="col-12 md:col-1 p-2 m-2 number-align"
									style="
										border: 1px solid rgba(0, 0, 0, 0.38);
										border-radius: 4px;
										background-color: #eee;
									">
									{{ node.id }}
								</div>
								<div
									class="col-12 md:col-3 p-2 m-2 text-align"
									style="
										border: 1px solid rgba(0, 0, 0, 0.38);
										border-radius: 4px;
										background-color: #eee;
									">
									{{ node.type_name }}
								</div>
								<div
									class="col-12 md:col-3 p-2 m-2 text-align"
									style="
										border: 1px solid rgba(0, 0, 0, 0.38);
										border-radius: 4px;
										background-color: #eee;
									">
									{{ node.node_name }}
								</div>
								<div class="col-12 md:col-2">
									<Button label="Add" @click="addNodeToExamPart(node)" />
								</div>
							</div>
						</div>
					</template>
				</Card>
			</template>
		</Card>
	</div>
</template>

<style scoped>
.p-dropdown :deep(.p-dropdown-label),
.p-dropdown :deep(.p-dropdown-items) {
	font-size: 14px !important;
}
</style>
