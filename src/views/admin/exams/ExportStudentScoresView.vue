<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { FilterMatchMode } from 'primevue/api';

const courseId = 477;
const academicYearId = 2020;
const service = new ApiService();

const exportStudentDt = ref();

const headers = ref<string[]>([]);
const rows = ref<any[]>([]);

onMounted(() => {
	service
		.getManyAsync<any>('/instances/dumpcsv', {
			courseId: courseId,
			academicYearId: academicYearId,
		})
		.then((response: any) => {
			headers.value = response.csvheaders;
			rows.value = response.rows;
		});
});

const exportCSV = () => exportStudentDt.value.exportCSV();
</script>

<template>
	<div class="container-fluid">
		<Toast />
		<Card>
			<template #title>Scores for the current course and year:</template>
			<template #content>
				<DataTable
					ref="exportStudentDt"
					:value="rows"
					filter-display="menu"
					show-gridlines
					class="p-datatable-sm"
					:rows="13"
					paginator>
					<template #header>
						<div style="display: flex">
							<Button
								icon="pi pi-external-link"
								label="Export"
								class="p-button-sm ml-3"
								@click="exportCSV" />
						</div>
					</template>
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
