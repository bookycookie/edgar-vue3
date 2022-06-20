<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { FilterMatchMode } from 'primevue/api';
import CONSTANTS from '@/config/constants';

const service = new ApiService();
const isLoading = ref(false);
const exportStudentDt = ref();

const headers = ref<string[]>([]);
const rows = ref<any[]>([]);

onMounted(() => {
	try {
		isLoading.value = true;
		service
			.getManyAsync<any>('/instances/dumpcsv', {
				courseId: CONSTANTS.COURSE_ID,
				academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
			})
			.then((response: any) => {
				headers.value = response.csvheaders;
				rows.value = response.rows;
			});
	} finally {
		isLoading.value = false;
	}
});

const exportCSV = () => exportStudentDt.value.exportCSV();

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const skeletonData = Array(8).fill({} as any);
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
	<div class="container-fluid">
		<Card>
			<template #title>Scores for the current course and year:</template>
			<template #content>
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
						<template #body><Skeleton /></template>
					</Column>
				</DataTable>
				<DataTable
					v-else
					ref="exportStudentDt"
					v-model:filters="filters"
					:global-filter-fields="headers"
					:value="rows"
					filter-display="menu"
					show-gridlines
					class="p-datatable-sm"
					:rows="13"
					paginator>
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
					<template #empty><span class="center">No data found</span></template>
					<Column v-for="header in headers" :key="header" :header="header">
						<template #body="{ data }">
							{{ data[header] }}
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
