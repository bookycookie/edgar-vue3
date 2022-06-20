<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { QuestionTable } from '@/models/admin/questions/QuestionTable';
import { QuestionType } from '@/models/admin/questions/QuestionType';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';
import RouteNames from '@/router/routes';
import CONSTANTS from '@/config/constants';

const loading = ref(false);
const service = new ApiService();

const questions = ref<QuestionTable[][]>([[]]);

const skeletonTable: QuestionTable[] = Array(8).fill({
	id: -1,
	id_question_type: -1,
	is_active: false,
	type_name: 'PH',
	user_created: 'ME',
	user_modified: 'ME',
	ts_created: 'NOW',
	ts_modified: 'NOW',
});

const skeletonColumns = [
	{
		header: 'Id',
		field: 'id',
	},
	{
		header: 'Created by',
		field: 'user_created',
	},
	{
		header: 'Created at',
		field: 'ts_created',
	},
	{
		header: 'Modified by.',
		field: 'user_modified',
	},
	{
		header: 'Modified at',
		field: 'ts_modified',
	},
	{
		header: 'Active',
		field: 'is_active',
	},
];

const distinctQuestionTypes = ref<any[]>([]);
const activeCount = ref<number>();
const disabledCount = ref<number>();
const totalCount = ref<number>();

const getQuestionsAsync = async (courseId: number) => {
	service
		.getManyAsync<QuestionTable>('/question/table', {
			courseId: courseId,
		})
		.then(async (qs) => {
			totalCount.value = qs.length;
			disabledCount.value = qs.filter((q) => !q.is_active).length;
			activeCount.value = totalCount.value - disabledCount.value;

			let filteredQuestions = qs.map(
				(q) =>
					({
						name: q.type_name,
						id: q.id_question_type,
					} as QuestionType),
			);
			distinctQuestionTypes.value = filteredQuestions.filter(
				(a, i) => filteredQuestions.findIndex((s) => s.id === a.id) === i,
			);

			for (let idx = 0; idx < distinctQuestionTypes.value.length; idx++) {
				questions.value[idx] = qs.filter((q) => q.id_question_type === distinctQuestionTypes.value[idx].id);
			}
		});
};

onMounted(async () => {
	try {
		loading.value = true;
		await getQuestionsAsync(CONSTANTS.COURSE_ID);
	} finally {
		loading.value = false;
	}
});

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const questionsDt = ref();
const exportCSV = () => questionsDt.value.exportCSV();
</script>

<template>
	<div class="container">
		<br />
		<h2 class="p-card-title">
			Questions
			<small v-if="activeCount && disabledCount && totalCount">
				<Tag class="me-4" icon="pi pi-check" severity="success" :value="`active: ${activeCount}`"></Tag>
				<Tag class="me-4" icon="pi pi-times" severity="danger" :value="`disabled: ${disabledCount}`"></Tag>
				<Tag class="" icon="pi pi-info-circle" severity="info" :value="`total: ${totalCount}`"></Tag>
			</small>
		</h2>
		<TabView v-if="!activeCount || !disabledCount || !totalCount || loading">
			<TabPanel header="Loading..">
				<DataTable :value="skeletonTable" responsive-layout="scroll" show-gridlines class="p-datatable-sm">
					<Column
						v-for="col of skeletonColumns"
						:key="col.field"
						:field="col.field"
						:header="col.header"
						sortable>
						<template #body><Skeleton></Skeleton></template>
					</Column>
				</DataTable>
			</TabPanel>
		</TabView>
		<TabView v-else scrollable>
			<TabPanel
				v-for="(dqt, index) in distinctQuestionTypes"
				:key="dqt.id"
				:header="`${dqt.name} — ${questions[index].length}`">
				<DataTable
					ref="questionsDt"
					v-model:filters="filters"
					:value="questions[index]"
					:paginator="true"
					:rows="8"
					show-gridlines
					filter-display="menu"
					class="p-datatable-sm"
					style="min-height: 10rem">
					<template #header>
						<div style="display: flex">
							<span class="p-input-icon-left">
								<i class="pi pi-search" />
								<InputText
									v-model="filters['global'].value"
									placeholder="Search"
									class="p-inputtext-sm p-inputtext-filled" />
							</span>
							<Button
								icon="pi pi-external-link"
								label="Export"
								class="p-button-sm ml-3"
								@click="exportCSV" />
						</div>
					</template>
					<Column field="id" header="Id" sortable>
						<template #body="{ data }">
							<div class="number-align">
								<router-link
									:to="{
										name: RouteNames.EditQuestion,
										params: {
											id: data.id,
										},
									}">
									{{ data.id }}
									<font-awesome-icon icon="arrow-up-right-from-square" class="ms-2" />
								</router-link>
							</div>
						</template>
					</Column>
					<Column field="user_created" header="Created by" sortable style="min-width: 14rem"></Column>

					<Column field="ts_created" header="Created at" sortable>
						<template #body="{ data }">
							<div style="font-size: 14px">
								{{ new Date(data.ts_created).toISOString().split('T')[0] }}
								<em>
									<small>{{ humanize(new Date(data.ts_created)) }}</small>
								</em>
							</div>
						</template>
					</Column>
					<Column field="user_modified" header="Modified by" sortable style="min-width: 14rem">></Column>
					<Column field="ts_modified" header="Modified at" sortable>
						<template #body="{ data }">
							<div style="font-size: 14px">
								{{ new Date(data.ts_modified).toISOString().split('T')[0] }}
								<em>
									<small>{{ humanize(new Date(data.ts_modified)) }}</small>
								</em>
							</div>
						</template>
					</Column>
					<Column field="is_active" header="Active" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.is_active ? 'check-circle' : 'times-circle'"
									:class="data.is_active ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
				</DataTable>
			</TabPanel>
		</TabView>
	</div>
</template>

<style scoped>
:deep(.p-datatable-wrapper) {
	min-height: 32rem;
}
</style>
