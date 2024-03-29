<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import ApiService from '@/services/ApiService';
import { FeedbackTableRow } from '@/models/admin/learn/FeedbackTableRow';
import humanize from '@/utilities/date-humanizer/humanizer';

type Option = {
	name: string;
	value: number;
};

const courseId = 155;
const academicYearId = 2019;

const feedbackDt = ref();
const loading = ref(false);
const service = new ApiService();

const exercises = ref<Option[]>([]);
const selectedExercises = ref<Option[]>([]);
const getExercisesAsync = async () => {
	exercises.value = await service.getManyAsync<Option>('/feedback/exercises', {
		courseId: courseId,
		academicYearId: academicYearId,
	});
};

const tutorials = ref<Option[]>([]);
const selectedTutorials = ref<Option[]>([]);
const getTutorialsAsync = async () => {
	tutorials.value = await service.getManyAsync<Option>('/feedback/tutorials', {
		courseId: courseId,
		academicYearId: academicYearId,
	});
};

const tutorialSteps = ref<Option[]>([]);
const selectedTutorialSteps = ref<Option[]>([]);
const getTutorialStepsAsync = async () => {
	tutorialSteps.value = await service.getManyAsync<Option>('/feedback/tutorial_steps', {
		courseId: courseId,
		academicYearId: academicYearId,
	});
};

const students = ref<Option[]>([]);
const selectedStudents = ref<Option[]>([]);
const getStudentsAsync = async () => {
	students.value = await service.getManyAsync<Option>('/feedback/students', {
		courseId: courseId,
		academicYearId: academicYearId,
	});
};

const classGroups = ref<Option[]>([]);
const selectedClassGroups = ref<Option[]>([]);
const getClassGroupsAsync = async () => {
	classGroups.value = await service.getManyAsync<Option>('/feedback/class_groups', {
		courseId: courseId,
		academicYearId: academicYearId,
	});
};

const table = ref<FeedbackTableRow[]>([]);
const getTableAsync = async () => {
	table.value = await service.getManyAsync<FeedbackTableRow>('/feedback/table', {
		courseId: courseId,
		academicYearId: academicYearId,
	});
};

const skeletonTable: FeedbackTableRow[] = Array(8).fill({
	id: 37,
	student_id: 22,
	student_alt_id2: 'Quaerat voluptate harum aut error quasi laboriosam.',
	student_label:
		'Nemo et voluptatem ducimus. Amet aut et. Libero et cum dignissimos suscipit quia ut dolore odio. Saepe qui doloremque aut distinctio ea ad. Dolorum voluptas dignissimos corporis eum minima inventore numquam et.',
	class_group: 'adipisci accusamus nisi',
	exercise_id: 'vA=o:B"}y?',
	exercise_title: '0bx)o<CLu|',
	tutorial_id: 40,
	tutorial_title: 'sunt in architecto',
	tutorial_step_id: 24,
	tutorial_step_ordinal: 17,
	tutorial_step_title:
		'Consequatur officiis consectetur ea ut pariatur. Et quas cum numquam. Sequi vel nobis ab totam quia.\n \rEligendi architecto quia. Ut qui animi. Officia asperiores non soluta.\n \rRecusandae non neque dolor natus qui sit ipsa sequi. Iusto at sint omnis culpa quia velit fugit. Harum ab tempore voluptates consequatur. Cum ullam iure aspernatur et porro.',
	question_id: 42,
	question_text:
		'Deleniti velit repellat consectetur dolores ea. Quas est itaque. Quis dignissimos nisi eos rem quo minus. Aliquam aut reprehenderit. Ipsa eum est laborum dignissimos omnis. Id velit nihil possimus est id enim quod asperiores.\n \rVoluptatibus ipsum veritatis. At incidunt consequuntur vel deleniti cumque reprehenderit. Vel quidem est dolor sit. Et aliquam eaque explicabo facilis autem esse sit non natus.\n \rEum et nisi id. Omnis quos quasi et quo. Non aut cumque sed laudantium quae. Blanditiis a voluptatum omnis maxime soluta qui dicta ex. Sint autem ut perferendis numquam cum sequi nesciunt.',
	comment: ')p?mfD=S:g',
	rating: 'quam',
	ts_created: 'iure inventore qui',
	tutorial_title_step_title: 'a',
	star_rating: 3,
	humanized_ts_created: '1',
});

const skeletonColumns: any[] = [
	{ field: '', header: '#' },
	{ field: 'id', header: 'Id' },
	{ field: 'student_label', header: 'Student' },
	{ field: 'class_group', header: 'Class group' },
	{ field: 'exercise_title', header: 'Exercise' },
	{ field: 'tutorial_title_step_title', header: 'Tutorial' },
	{ field: 'question_text', header: 'Question' },
	{ field: 'comment', header: 'Comment' },
	{ field: 'star_rating', header: 'Rating' },
	{ field: 'ts_created', header: 'Created' },
];

const exportCSV = () => feedbackDt.value.exportCSV();

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
	id: { value: '', matchMode: FilterMatchMode.CONTAINS },
	student_label: { value: '', matchMode: FilterMatchMode.CONTAINS },
	class_group: { value: '', matchMode: FilterMatchMode.CONTAINS },
	exercise_title: { value: '', matchMode: FilterMatchMode.CONTAINS },
	tutorial_title_step_title: {
		value: '',
		matchMode: FilterMatchMode.CONTAINS,
	},
	question_text: { value: '', matchMode: FilterMatchMode.CONTAINS },
	comment: { value: '', matchMode: FilterMatchMode.CONTAINS },
	star_rating: { value: '', matchMode: FilterMatchMode.CONTAINS },
	humanized_ts_created: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
	await Promise.all([
		getExercisesAsync(),
		getTutorialsAsync(),
		getTutorialStepsAsync(),
		getStudentsAsync(),
		getClassGroupsAsync(),
		getTableAsync(),
	]);
});
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Feedback</template>
			<template #content>
				<Accordion>
					<AccordionTab header="Filters - TODO">
						<div class="wrapper">
							<div class="p-inputgroup">
								<span class="p-float-label">
									<MultiSelect
										id="question-node-multiselect"
										v-model="selectedExercises"
										:options="exercises"
										option-label="name"
										display="chip"
										filter />
									<label for="question-node-multiselect">Exercises</label>
								</span>
							</div>
							<div class="p-inputgroup">
								<span class="p-float-label">
									<MultiSelect
										id="question-node-multiselect"
										v-model="selectedTutorials"
										:options="tutorials"
										option-label="name"
										display="chip"
										filter />
									<label for="question-node-multiselect">Tutorials</label>
								</span>
							</div>
							<div class="p-inputgroup">
								<span class="p-float-label">
									<MultiSelect
										id="question-node-multiselect"
										v-model="selectedTutorialSteps"
										:options="tutorialSteps"
										option-label="name"
										display="chip"
										filter />
									<label for="question-node-multiselect">Tutorial steps</label>
								</span>
							</div>
							<div class="p-inputgroup">
								<span class="p-float-label">
									<MultiSelect
										id="question-node-multiselect"
										v-model="selectedStudents"
										:options="students"
										option-label="name"
										display="chip"
										filter />
									<label for="question-node-multiselect">Students</label>
								</span>
							</div>
							<div class="p-inputgroup">
								<span class="p-float-label">
									<MultiSelect
										id="question-node-multiselect"
										v-model="selectedClassGroups"
										:options="classGroups"
										option-label="name"
										display="chip"
										filter />
									<label for="question-node-multiselect">Class groups</label>
								</span>
							</div>
							<Button label="Apply filter" />
						</div>
					</AccordionTab>
				</Accordion>
			</template>

			<template #footer>
				<DataTable v-if="loading" :value="skeletonTable" responsive-layout="scroll">
					<template #header>
						<div style="display: flex">
							<span class="p-input-icon-left">
								<i class="pi pi-search" />
								<InputText
									v-model="filters['global'].value"
									placeholder="Search"
									class="p-inputtext-sm p-inputtext-filled"
									style="border-radius: 14px" />
							</span>
							<Button
								icon="pi pi-external-link"
								label="Export"
								class="p-button-sm ml-3"
								@click="exportCSV" />
						</div>
					</template>
					<Column
						v-for="col of skeletonColumns"
						:key="col.field"
						:field="col.field"
						:header="col.header"
						sortable>
						<template #body><Skeleton></Skeleton></template>
					</Column>
				</DataTable>
				<DataTable
					v-else
					ref="feedbackTableDt"
					v-model:filters="filters"
					:value="table"
					filter-display="row"
					show-gridlines
					class="p-datatable-sm"
					:rows="5"
					paginator>
					<template #header>
						<div style="display: flex">
							<span class="p-input-icon-left">
								<i class="pi pi-search" />
								<InputText
									v-model="filters['global'].value"
									placeholder="Search"
									class="p-inputtext-sm p-inputtext-filled"
									style="border-radius: 14px" />
							</span>
							<Button
								icon="pi pi-external-link"
								label="Export"
								class="p-button-sm ml-3"
								@click="exportCSV" />
						</div>
					</template>
					<template #empty><span class="center">No data to show.</span></template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="id" header="Id" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.id }}</div>
						</template>
						<template #filter="{ filterModel, filterCallback }">
							<InputText
								v-model="filterModel.value"
								v-tooltip.top.focus="'Hit enter key to filter'"
								type="text"
								class="p-column-filter"
								:placeholder="`Search`"
								@keydown.enter="filterCallback()" />
						</template>
					</Column>
					<Column field="student_label" header="Student" sortable>
						<template #filter="{ filterModel, filterCallback }">
							<InputText
								v-model="filterModel.value"
								v-tooltip.top.focus="'Hit enter key to filter'"
								type="text"
								class="p-column-filter"
								:placeholder="`Search`"
								@keydown.enter="filterCallback()" />
						</template>
					</Column>
					<Column field="class_group" header="Class group" sortable>
						<template #filter="{ filterModel, filterCallback }">
							<InputText
								v-model="filterModel.value"
								v-tooltip.top.focus="'Hit enter key to filter'"
								type="text"
								class="p-column-filter"
								:placeholder="`Search`"
								@keydown.enter="filterCallback()" />
						</template>
					</Column>
					<Column field="exercise_title" header="Exercise" sortable>
						<template #body="{ data }">
							<p>
								<a :href="data.exercise_id">{{ data.exercise_id }}</a>
							</p>
							<p>{{ data.exercise_title }}</p>
						</template>
						<template #filter="{ filterModel, filterCallback }">
							<InputText
								v-model="filterModel.value"
								v-tooltip.top.focus="'Hit enter key to filter'"
								type="text"
								class="p-column-filter"
								:placeholder="`Search`"
								@keydown.enter="filterCallback()" />
						</template>
					</Column>
					<Column field="tutorial_title_step_title" header="Tutorial" sortable>
						<template #body="{ data }">
							<p>
								<a :href="data.tutorial_id">{{ data.tutorial_title }}</a>
							</p>
							<p>
								<a :href="data.tutorial_step_id">{{ data.tutorial_step_title }}</a>
							</p>
						</template>
						<template #filter="{ filterModel, filterCallback }">
							<InputText
								v-model="filterModel.value"
								v-tooltip.top.focus="'Hit enter key to filter'"
								type="text"
								class="p-column-filter"
								:placeholder="`Search`"
								@keydown.enter="filterCallback()" />
						</template>
					</Column>
					<Column field="question_text" header="Question" sortable>
						<template #body="{ data }">
							<p>
								<a :href="data.question_id">{{ data.question_id }}</a>
							</p>
							<p>{{ data.question_text }}</p>
						</template>
						<template #filter="{ filterModel, filterCallback }">
							<InputText
								v-model="filterModel.value"
								v-tooltip.top.focus="'Hit enter key to filter'"
								type="text"
								class="p-column-filter"
								:placeholder="`Search`"
								@keydown.enter="filterCallback()" />
						</template>
					</Column>
					<Column field="comment" header="Comment" sortable style="width: 17%">
						<template #body="{ data }">
							<span>{{ data.comment }}</span>
						</template>
						<template #filter="{ filterModel, filterCallback }">
							<InputText
								v-model="filterModel.value"
								v-tooltip.top.focus="'Hit enter key to filter'"
								type="text"
								class="p-column-filter"
								:placeholder="`Search`"
								@keydown.enter="filterCallback()" />
						</template>
					</Column>
					<Column field="star_rating" header="Rating" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<Rating :model-value="data.star_rating" :cancel="false" :readonly="true"></Rating>
							</div>
						</template>
						<template #filter="{ filterModel, filterCallback }">
							<InputText
								v-model="filterModel.value"
								v-tooltip.top.focus="'Hit enter key to filter'"
								type="text"
								class="p-column-filter"
								:placeholder="`Search`"
								@keydown.enter="filterCallback()" />
						</template>
					</Column>
					<Column field="humanized_ts_created" header="Created" sortable>
						<template #body="{ data }">
							<span class="w-100">{{ new Date(data.ts_created).toISOString().split('T')[0] }}</span>
							<p class="text-xs text-500">
								<em>
									{{ humanize(new Date(data.ts_created)) }}
								</em>
							</p>
						</template>
						<template #filter="{ filterModel, filterCallback }">
							<InputText
								v-model="filterModel.value"
								v-tooltip.top.focus="'Hit enter key to filter'"
								type="text"
								class="p-column-filter"
								:placeholder="`Search`"
								@keydown.enter="filterCallback()" />
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	column-gap: 2rem;
	row-gap: 2rem;
}
.wrapper > * {
	margin-top: 1rem;
}

.fieldset p {
	line-height: 1.5;
	margin: 0;
}
</style>
