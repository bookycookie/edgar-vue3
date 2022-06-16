<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ApiService from '@/services/ApiService';
import { QuestionType } from '@/models/admin/learn/QuestionType';
import { Coderunner } from '@/models/admin/learn/Coderunner';

const courseId = 2000;
const appUserId = 46;

enum Activity {
	Active = 'ACTIVE',
	Inactive = 'INACTIVE',
}

enum Access {
	Random = 'RANDOM',
	Sequential = 'SEQUENTIAL',
}

const service = new ApiService();

const title = ref('');
const description = ref('');

const activity = ref<Activity>(Activity.Inactive);
const activityOptions: Activity[] = [Activity.Active, Activity.Inactive];

const randomAccess = ref<Access>(Access.Sequential);
const randomAccessOptions: Access[] = [Access.Random, Access.Sequential];

const steps = ref(10);

const answersCount = ref(5);

const questionTypes = ref<QuestionType[]>([]);
const selectedQuestionType = ref<QuestionType>();

const coderunners = ref<Coderunner[]>([]);
const selectedCoderunner = ref<Coderunner>();

onMounted(async () => {
	const questionTypesPromise = service.getManyAsync<QuestionType>('/question_types').then((types: QuestionType[]) => {
		questionTypes.value = types;
		selectedQuestionType.value = types[0];
	});

	const codeRunnersPromise = service.getManyAsync<Coderunner>('/code_runners').then((runners: Coderunner[]) => {
		coderunners.value = runners;
		selectedCoderunner.value = runners[0];
	});

	await Promise.all([questionTypesPromise, codeRunnersPromise]);
});

const isAbc = computed(() => selectedQuestionType.value?.type_name.includes('ABC'));
const usesCoderunner = computed(() => selectedQuestionType.value?.type_name.includes('Evaluated'));
const isActive = computed(() => activity.value === Activity.Active);
const isRandom = computed(() => randomAccess.value === Access.Random);

const create = async () => {
	const createObject = {
		title: title.value,
		description: description.value,
		isActive: isActive,
		numberOfSteps: steps.value,
		answersCount: answersCount.value,
		questionTypeId: selectedQuestionType.value?.id,
		coderunnerId: selectedCoderunner.value?.id,
		courseId: courseId,
		appUserId: appUserId,
	};

	await service.postAsync('/tutorial/create', createObject);
};
</script>

<template>
	<div class="container">
		<br />
		<Card>
			<template #title>
				<h2>New tutorial</h2>
				<hr />
			</template>
			<template #content>
				<div class="grid p-fluid">
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<InputText id="title" v-model="title" type="text" />
								<label for="title"><small>Title*</small></label>
							</span>
						</div>
					</div>

					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<SelectButton v-model="activity" :options="activityOptions"></SelectButton>
							<Chip
								v-tooltip.top="'Should the tutorial be listed for students?'"
								class="ml-2 mr-4"
								style="background: transparent">
								<font-awesome-icon icon="circle-question"></font-awesome-icon>
							</Chip>
							<SelectButton
								id="random-access"
								v-model="randomAccess"
								:options="randomAccessOptions"></SelectButton>
							<Chip
								v-tooltip.top="
									'Allow random access to tutorial steps (otherwise enforce sequence 1, 2, 3, ...)'
								"
								class="ml-2"
								style="background: transparent">
								<font-awesome-icon icon="circle-question"></font-awesome-icon>
							</Chip>
						</div>
					</div>
				</div>
				<br />
				<div class="grid p-fluid">
					<div class="col-12 md:col-12">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<Textarea
									id="description"
									v-model="description"
									auto-resize
									class="text-area"
									rows="1"
									cols="30" />
								<label for="description">
									<small>Description (optional)</small>
								</label>
							</span>
						</div>
					</div>
					<span class="ms-2 text-xs text-400">
						Lecture material that is the content of the tutorial, learning outcomes of the tutorial, etc.
					</span>
				</div>

				<br />
				<br />
				<div class="grid">
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<Dropdown
									id="question-type"
									v-model="selectedQuestionType"
									:options="questionTypes"
									option-label="type_name"
									:placeholder="selectedQuestionType?.type_name"></Dropdown>
								<label for="question-type" class="text-xs text-400">Question type*</label>
							</span>
						</div>
						<span class="ms-2 text-xs text-400">
							Can be changed later for every question and is only used as default value for new questions
						</span>
					</div>
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<InputNumber v-model="steps" :min="1" :max="100" />
								<label for="steps" class="text-xs text-400">Estimate number of steps*</label>
							</span>
						</div>
						<span class="ms-2 text-xs text-400">
							This number can later be changed by adding or removing individual steps
						</span>
					</div>
				</div>

				<br />
				<br />
				<div class="grid">
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<Dropdown
									id="code-runner"
									v-model="selectedCoderunner"
									:options="coderunners"
									option-label="name"
									:placeholder="selectedCoderunner?.name"
									:disabled="!usesCoderunner"></Dropdown>
								<label for="code-runner">Code runner</label>
							</span>
						</div>
						<span class="ms-2 text-xs text-400">
							if Evalxx uated code question type (SQL, C) is selected
						</span>
					</div>
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<InputNumber
									id="answers-count"
									v-model="answersCount"
									:min="2"
									:max="100"
									:disabled="!isAbc" />
								<label for="answers-count" class="text-xs text-400">Answers count (if ABC)</label>
							</span>
						</div>
						<span class="ms-2 text-xs text-400">if Classic ABC question is selected</span>
					</div>
				</div>
				<br />
				<div class="grid p-fluid">
					<div class="col-12 md:col-12">
						<div class="p-inputgroup">
							<Button
								label="Create & Continue editing"
								icon="pi pi-check"
								class="p-button-info"
								@click="create" />
						</div>
					</div>
				</div>
			</template>
		</Card>
	</div>
</template>
