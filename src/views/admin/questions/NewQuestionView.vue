<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { Coderunner } from '@/models/admin/questions/Coderunner';
import { QuestionNode } from '@/models/admin/questions/QuestionNode';
import { ProgrammingLanguage } from '@/models/admin/questions/ProgrammingLanguage';
import Listbox from 'primevue/listbox';
import { useRouter } from 'vue-router';
import RouteNames from '@/router/routes';
import CONSTANTS from '@/config/constants';

const service = new ApiService();
const router = useRouter();

const getCodeRunners = async () => {
	codeRunners.value = await service.getManyAsync<Coderunner>('/code_runners');
	selectedCodeRunner.value = codeRunners.value[0];
};

const getQuestionNodes = async () => {
	questionNodes.value = await service.getManyAsync<QuestionNode>('/question_nodes', {
		courseId: CONSTANTS.COURSE_ID,
	});
	selectedQuestionNodes.value.push(questionNodes.value[0]);
};

//! TODO: Get these values from the DB!
const getQuestionTypes = async () => {
	const defaultLanguages: ProgrammingLanguage[] = [
		{ name: 'SQL', id: 2 } as ProgrammingLanguage,
		{ name: 'JSON', id: 21 } as ProgrammingLanguage,
	];
	programmingLanguages.value = await service.getManyAsync<ProgrammingLanguage>('/course/programming_languages', {
		courseId: CONSTANTS.COURSE_ID,
	});

	questionTypes.value = [...defaultLanguages, ...programmingLanguages.value];

	selectedQuestionType.value = defaultLanguages[0];
};

//! TODO: Get these values from the DB!
const textualQuestions = ref<ProgrammingLanguage[]>([
	{ id: 1, name: 'multiple-choice' } as ProgrammingLanguage,
	{ id: 20, name: 'free text' } as ProgrammingLanguage,
	{ id: 25, name: 'peer assessment' } as ProgrammingLanguage,
	{ id: 26, name: 'scale' } as ProgrammingLanguage,
]);

//! TODO: Get these values from the DB!
const multilanguage: ProgrammingLanguage = { name: 'Multilanguage', id: 23 } as ProgrammingLanguage;
const selectedMultipleLanguages = ref<ProgrammingLanguage[]>([]);

const programmingLanguages = ref<ProgrammingLanguage[]>([]);

const questionTypes = ref<ProgrammingLanguage[]>([]);
const selectedQuestionType = ref<ProgrammingLanguage>();

const codeRunners = ref<Coderunner[]>([]);
const selectedCodeRunner = ref<Coderunner>();

const questionNodes = ref<QuestionNode[]>([]);
const selectedQuestionNodes = ref<QuestionNode[]>([]);

const useTemplates = ref(false);
const useCustomEvaluationScript = ref(false);

const create = async () => {
	const nodeIds = selectedQuestionNodes.value.map((qn: QuestionNode) => qn.id);

	if (!nodeIds || nodeIds.length < 1) return;

	const request = {
		nodeIds: nodeIds,
		questionTypeId: `${selectedQuestionType.value?.id}`,
		codeRunnerId: selectedCodeRunner.value?.id,
		answersCount: '2',
		scripted: 'non-scripted',
		useTemplate: useTemplates.value,
		useScript: useCustomEvaluationScript.value,
		appUserId: CONSTANTS.APP_USER_ID,
	};

	await service.postAsync('/question/new', request).then((response: any) => {
		if (!response || !response.data) return;
		const newId = parseInt(response.data[0].new_question);
		router.push({ name: RouteNames.EditQuestion, params: { id: newId } });
	});
};

onMounted(async () => {
	await Promise.all([getCodeRunners(), getQuestionNodes(), getQuestionTypes()]);
});
</script>

<template>
	<div class="container-fluid">
		<br />
		<Card>
			<template #title>
				<h2>New Question</h2>
				<Divider></Divider>
				<div class="grid p-fluid">
					<div class="col-12 md:col-6 flex">
						<h5>I want to create a...</h5>
					</div>
					<div class="col-12 md:col-6 flex">
						<h5>...and assign it to the following nodes (at least one has to be set!):</h5>
					</div>
				</div>
			</template>
			<template #content>
				<div class="grid p-fluid">
					<div class="col-12 md:col-6 flex">
						<Card>
							<template #content>
								<div class="grid ml-2">
									<div v-for="question in questionTypes" :key="question.id" class="p-inputgroup mb-2">
										<RadioButton
											:id="`question-type-${question.id}`"
											v-model="selectedQuestionType"
											:value="question"
											class="me-2"></RadioButton>
										<label :for="`question-type-${question.id}`">
											New {{ question.name }} question
										</label>
									</div>
									<div v-if="programmingLanguages.length > 1">
										<Divider />
										<div class="p-inputgroup">
											<RadioButton
												id="question-type-23"
												v-model="selectedQuestionType"
												:value="multilanguage"
												class="me-2"></RadioButton>
											<label for="question-type-23">
												<p>New {{ multilanguage.name }} question</p>
												<label for="question-type-23-languages" class="text-xs">
													... for languages:
												</label>
											</label>
										</div>
										<Listbox
											v-model="selectedMultipleLanguages"
											multiple
											:options="programmingLanguages"
											data-key="id"
											option-label="name"></Listbox>
										<Divider />
									</div>
									<div
										v-if="programmingLanguages?.length > 0"
										class="p-inputgroup mt-4"
										style="width: 100%">
										<span class="p-float-label">
											<Dropdown
												id="question-type"
												v-model="selectedCodeRunner"
												:options="codeRunners"
												option-label="name"
												:placeholder="selectedCodeRunner?.name"
												filter></Dropdown>
											<label for="question-type" class="text-xs">... having code runner:</label>
										</span>
									</div>
									<div>
										<Divider />
										<div class="grid">
											<div
												v-for="question in textualQuestions"
												:key="question.id"
												class="p-inputgroup mb-2">
												<RadioButton
													:id="`question-type-${question.id}`"
													v-model="selectedQuestionType"
													:value="question"
													class="me-2"></RadioButton>
												<label :for="`question-type-${question.id}`">
													New {{ question.name }} question
												</label>
											</div>
										</div>
									</div>
								</div>
							</template>
						</Card>
					</div>
					<div class="col-12 md:col-6 flex">
						<Card>
							<template #content>
								<div class="grid p-fluid ml-2">
									<div class="p-inputgroup">
										<span class="p-float-label">
											<MultiSelect
												id="question-node-multiselect"
												v-model="selectedQuestionNodes"
												:options="questionNodes"
												option-label="name"
												display="chip"
												filter />
											<label for="question-node-multiselect">Question nodes</label>
										</span>
									</div>
									<Divider></Divider>
									<div class="p-inputgroup mb-2">
										<Checkbox id="use-templates" v-model="useTemplates" :binary="true"></Checkbox>
										<label for="use-templates" class="ms-2">
											Use templates (programmable question text)
										</label>
										<Chip class="ml-2 hand-cursor" style="background: transparent">
											<a href="/help/questiontemplate">
												<font-awesome-icon icon="circle-question"></font-awesome-icon>
											</a>
										</Chip>
									</div>
									<div class="p-inputgroup">
										<Checkbox
											id="use-custom-evaluation-script"
											v-model="useCustomEvaluationScript"
											:binary="true"></Checkbox>
										<label for="use-custom-evaluation-script" class="ms-2">
											Custom evaluation script (programmable scoring)
										</label>
										<Chip class="ml-2 hand-cursor" style="background: transparent">
											<a href="/help/questionscript">
												<font-awesome-icon icon="circle-question"></font-awesome-icon>
											</a>
										</Chip>
									</div>
								</div>
							</template>
						</Card>
					</div>
				</div>
				<Button label="Create & Continue editing" icon="pi pi-check" class="p-button-info" @click="create" />
			</template>
		</Card>
	</div>
</template>
