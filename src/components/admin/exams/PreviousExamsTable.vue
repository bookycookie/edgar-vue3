<script setup lang="ts">
import { ref, PropType } from 'vue';
import { PreviousExam } from '@/models/admin/exams/PreviousExam';
import { PreviousExamSidebar } from '@/models/admin/exams/PreviousExamSidebar';
import { FilterMatchMode } from 'primevue/api';
import humanize from '@/utilities/date-humanizer/humanizer';
import RouteNames from '@/router/routes';
defineProps({
	exams: {
		type: Object as PropType<PreviousExam[]>,
		required: true,
		default() {
			return [];
		},
	},
	examsSidebar: {
		type: Object as PropType<PreviousExamSidebar[]>,
		required: true,
		default() {
			return [];
		},
	},
	isLoading: { type: Boolean, required: true },
});

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const examsDt = ref();
const exportCSV = () => examsDt.value.exportCSV();

const skeletonData = Array(8).fill({} as PreviousExam);
const skeletonColumns = [
	{ field: '', header: '#' },
	{ field: '', header: 'Title' },
	{ field: '', header: 'Score ignored' },
	{ field: '', header: 'Started' },
	{ field: '', header: 'Submitted' },
	{ field: '', header: 'Duration' },
	{ field: '', header: 'Correct' },
	{ field: '', header: 'Incorrect' },
	{ field: '', header: 'Partial' },
	{ field: '', header: 'Unanswered' },
	{ field: '', header: 'Score' },
	{ field: '', header: 'Score %' },
	{ field: '', header: 'Passed' },
	{ field: '', header: 'Review' },
];
</script>

<template>
	<DataTable v-if="isLoading" :value="skeletonData">
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
				<Button icon="pi pi-external-link" label="Export" class="p-button-sm ml-3" @click="exportCSV" />
			</div>
		</template>
		<Column v-for="col of skeletonColumns" :key="col.field" :field="col.field" :header="col.header" sortable>
			<template #body><Skeleton /></template>
		</Column>
	</DataTable>
	<DataTable
		v-else
		ref="examsDt"
		v-model:filters="filters"
		:value="exams"
		filter-display="menu"
		show-gridlines
		scroll-height="43rem"
		class="p-datatable-sm"
		responsive-layout="scroll"
		:paginator="true"
		:rows="7">
		<template #header>
			<div style="display: flex">
				<span class="p-input-icon-left">
					<i class="pi pi-search" />
					<InputText
						v-model="filters['global'].value"
						placeholder="Search"
						class="p-inputtext-sm p-inputtext-filled" />
				</span>
				<Button icon="pi pi-external-link" label="Export" class="p-button-sm ml-3" @click="exportCSV" />
			</div>
		</template>
		<template #empty><span class="center">No data found</span></template>
		<Column field="title" header="Title" sortable></Column>
		<Column field="test_score_ignored" header="Score ignored" sortable>
			<template #body="{ data }">
				<div class="center-align">
					<font-awesome-icon
						:icon="data.test_score_ignored ? 'check-circle' : 'times-circle'"
						:class="data.test_score_ignored ? 'success' : 'failure'"
						class="icon center-align" />
				</div>
			</template>
		</Column>
		<Column field="ts_started" header="Started" sortable>
			<template #body="{ data }">
				{{ new Date(data.ts_started).toISOString().split('T')[0] }}
				<p>
					<em>
						<small>{{ humanize(new Date(data.ts_started)) }}</small>
					</em>
				</p>
			</template>
		</Column>
		<Column field="ts_submitted" header="Submitted" sortable>
			<template #body="{ data }">
				{{ new Date(data.ts_submitted).toISOString().split('T')[0] }}
				<p>
					<em>
						<small>{{ humanize(new Date(data.ts_submitted)) }}</small>
					</em>
				</p>
			</template>
		</Column>
		<Column field="duration" header="Duration" sortable>
			<template #body="{ data }">
				<div class="number-align">{{ data.duration }}</div>
			</template>
		</Column>
		<Column field="correct_no" header="Correct" sortable>
			<template #body="{ data }">
				<div class="number-align">{{ data.correct_no }}</div>
			</template>
		</Column>
		<Column field="incorrect_no" header="Incorrect" sortable>
			<template #body="{ data }">
				<div class="number-align">{{ data.incorrect_no }}</div>
			</template>
		</Column>
		<Column field="partial_no" header="Partial" sortable>
			<template #body="{ data }">
				<div class="number-align">{{ data.partial_no }}</div>
			</template>
		</Column>
		<Column field="unanswered_no" header="Unanswered" sortable>
			<template #body="{ data }">
				<div class="number-align">
					{{ data.unanswered_no }}
				</div>
			</template>
		</Column>
		<Column field="t_score" header="Score" sortable>
			<template #body="{ data }">
				<div class="number-align">{{ data.t_score }}</div>
			</template>
		</Column>
		<Column field="t_score_perc" header="Score %" sortable>
			<template #body="{ data }">
				<div class="number-align">{{ data.t_score_perc }}</div>
			</template>
		</Column>
		<Column field="passed" header="Passed" sortable>
			<template #body="{ data }">
				<div class="center-align">
					<font-awesome-icon
						:icon="data.passed ? 'check-circle' : 'times-circle'"
						:class="data.passed ? 'success' : 'failure'"
						class="icon" />
				</div>
			</template>
		</Column>
		<Column field="" header="Review">
			<template #body="{ data }">
				<div class="center-align">
					<router-link
						:to="{ name: RouteNames.ReviewExam, params: { id: data.id_test_instance, questionId: 1 } }"
						class="me-2">
						<Button class="p-button-warning p-button-raised">
							<font-awesome-icon icon="magnifying-glass" />
						</Button>
					</router-link>
				</div>
			</template>
		</Column>
	</DataTable>
</template>
