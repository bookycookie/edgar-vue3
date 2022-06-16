<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ApiService from '@/services/ApiService';
import { QuestionNode } from '@/models/admin/learn/QuestionNode';
import { AdaptivityModel } from '@/models/admin/learn/AdaptivityModel';

const courseId = 2000;
const appUserId = 46;
const academicYearId = 2020;

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

const questionNodes = ref<QuestionNode[]>([]);
const selectedQuestionNodes = ref<QuestionNode[]>([]);

const adaptivityModels = ref<AdaptivityModel[]>([]);
const selectedAdaptivityModel = ref<AdaptivityModel>();

onMounted(async () => {
	const questionNodesPromise = service
		.getManyAsync<QuestionNode>('/question_nodes', { courseId: courseId })
		.then((nodes: QuestionNode[]) => {
			questionNodes.value = nodes;
		});

	const adaptivityModelsPromise = service
		.getManyAsync<AdaptivityModel>('/adaptivity_models')
		.then((models: AdaptivityModel[]) => {
			adaptivityModels.value = models;
			selectedAdaptivityModel.value = models[0];
		});

	await Promise.all([questionNodesPromise, adaptivityModelsPromise]);
});

const isActive = computed(() => activity.value === Activity.Active);

const create = async () => {
	const createObject = {
		courseId: courseId,
		academicYearId: academicYearId,
		adaptivityModelId: selectedAdaptivityModel.value?.id,
		appUserId: appUserId,
		nodeIds: selectedQuestionNodes.value.map((qn: QuestionNode) => qn.id),
		title: title.value,
		description: description.value,
		isActive: isActive,
	};
	await service.postAsync('/tutorial/create', createObject);
};
</script>

<template>
	<div class="container">
		<br />
		<Card>
			<template #title>
				<h2>New exercise definition</h2>
				<hr />
			</template>
			<template #content>
				<div class="grid p-fluid">
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<InputText id="title" v-model="title" type="text" />
								<label for="title">Title*</label>
							</span>
						</div>
					</div>

					<div class="col-12 md:col-5">
						<div class="p-inputgroup">
							<SelectButton v-model="activity" :options="activityOptions"></SelectButton>
							<Chip
								v-tooltip.top="'Should the tutorial be listed for students?'"
								class="ml-2 mr-4"
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
								<MultiSelect
									id="question-node-multiselect"
									v-model="selectedQuestionNodes"
									:options="questionNodes"
									option-label="name"
									display="chip"
									filter />
								<label for="question-node-multiselect">Nodes</label>
							</span>
						</div>
					</div>
					<span class="ms-2 text-xs text-400">
						Pick the nodes that contain the questions you want to use in the exercise
					</span>
				</div>
				<br />
				<br />
				<div class="grid p-fluid">
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<Textarea
									id="description"
									v-model="description"
									auto-resize
									class="text-area"
									rows="1"
									cols="30" />
								<label for="description">Description (optional)</label>
							</span>
						</div>
						<span class="ms-2 text-xs text-400">
							Lecture material that is the content of the tutorial, learning outcomes of the tutorial,
							etc.
						</span>
					</div>
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<Dropdown
									id="adaptivity-models"
									v-model="selectedAdaptivityModel"
									:options="adaptivityModels"
									option-label="name"></Dropdown>
								<label for="adaptivity-models" class="text-xs text-400">Adaptivity model</label>
							</span>
						</div>
						<span class="ms-2 text-xs text-400">
							Defines the adaptivity behaviour:
							<ul>
								<li class="text-xs text-400">Number of question difficulty categories</li>
								<li class="text-xs text-400">
									Thresholds for levelling up and down to a higher or lower difficulty category
								</li>
							</ul>
						</span>
					</div>
				</div>

				<div class="grid p-fluid">
					<div class="col-12 md:col-12">
						<div class="p-inputgroup">
							<Button label="Create" icon="pi pi-check" class="p-button-info" @click="create" />
						</div>
					</div>
				</div>
			</template>
		</Card>
	</div>
</template>
