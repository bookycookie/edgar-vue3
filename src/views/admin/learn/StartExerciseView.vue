<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ApiService from '@/services/ApiService';
import { ExerciseTable } from '@/models/admin/learn/ExerciseTable';
import { FilterMatchMode } from 'primevue/api';
import humanize from '@/utilities/date-humanizer/humanizer';
import CONSTANTS from '@/config/constants';

const loading = ref(false);
const service = new ApiService();

const exerciseDefTable = ref<ExerciseTable[]>([]);

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const exerciseDefinitionDt = ref();
const skeletonData: ExerciseTable[] = Array(8).fill({
	id: 0,
	title: '',
	description: '',
	is_active: false,
	no_students: 0,
	no_questions: 0,
});
const skeletonColumns = [
	{ field: '', header: '#' },
	{ field: '', header: 'Title' },
	{ field: '', header: 'Active' },
	{ field: '', header: 'Questions' },
	{ field: '', header: 'Students' },
	{ field: '', header: 'Analytics' },
	{ field: '', header: 'Delete' },
	{ field: '', header: 'Edit' },
	{ field: '', header: 'Questions' },
];

onMounted(async () => {
	try {
		loading.value = true;
		exerciseDefTable.value = await service.getManyAsync<ExerciseTable>('/exercise/definitions', {
			courseId: CONSTANTS.COURSE_ID,
			academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
			studentId: CONSTANTS.STUDENT_ID,
		});
	} finally {
		loading.value = false;
	}
});

const exportCSV = () => exerciseDefinitionDt.value.exportCSV();

const deleteE = async () => console.log('delete');
const edit = () => console.log('edit');
</script>

<template>
	<div class="container-fluid">
		<br />
		<Card>
			<template #title>Exercises</template>
			<template #content>
				<DataTable v-if="loading" :value="skeletonData" responsive-layout="scroll">
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
					ref="exerciseDefinitionDt"
					v-model:filters="filters"
					:value="exerciseDefTable"
					filter-display="menu"
					show-gridlines
					class="p-datatable-sm"
					:rows="7"
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
					<template #empty>
						<span class="center">No data to show.</span>
					</template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="title" header="Title" sortable>
						<template #body="{ data }">
							<strong>{{ data.title }}</strong>
							<p>
								<em>
									<small>{{ data.description }}</small>
								</em>
							</p>
						</template>
					</Column>

					<Column field="no_questions" header="Questions" sortable>
						<template #body="{ data }">
							<div class="number-align">
								{{ data.no_questions }}
							</div>
						</template>
					</Column>

					<Column field="" header="Start">
						<template #body="{}">
							<div class="center">
								<router-link to="">
									<Button class="p-button-success">
										<font-awesome-icon icon="circle-play"></font-awesome-icon>
									</Button>
								</router-link>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
