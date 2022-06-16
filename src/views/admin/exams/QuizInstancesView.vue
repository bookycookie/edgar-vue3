<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { Test } from '@/models/admin/exams/Test';
import { LectureInstancesTable } from '@/models/admin/exams/LectureInstancesTable';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';

const appUserId = 46;
const courseId = 477;
const academicYearId = 2020;
const service = new ApiService();

const lectureInstancesTable = ref<LectureInstancesTable[]>([]);

onMounted(async () => {
	lectureInstancesTable.value = await service.getManyAsync<LectureInstancesTable>('/lecture_instances_table', {
		appUserId: appUserId,
		courseId: courseId,
		academicYearId: academicYearId,
	});
});

const quizInstancesDt = ref();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const skeletonLectureInstanceData = Array(8).fill({
	id: 22,
	ts_start: '',
	ts_end: '',
	title: '',
	max_score: 2,
	spassword: '',
	questions_no: 21,
	user_started: '',
	students_no: 12,
});

const skeletonColumns = [
	{ field: '', header: '#' },
	{ field: 'id', header: 'Id' },
	{ field: 'title', header: 'Title' },
	{ field: 'user_started', header: 'User started' },
	{ field: 'max_score', header: 'Max score' },
	{ field: 'spassword', header: 'Password' },
	{ field: 'questions_no', header: 'No of qs' },
	{ field: 'ts_start', header: 'Started' },
	{ field: 'ts_end', header: 'Finished' },
	{ field: 'students_no', header: 'Students' },
];

const exportCSV = () => quizInstancesDt.value.exportCSV();
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>All quiz instances:</template>
			<template #content>
				<DataTable
					ref="quizInstancesDt"
					v-model:filters="filters"
					:value="lectureInstancesTable"
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
									class="p-inputtext-sm p-inputtext-filled" />
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
					</Column>

					<Column field="title" header="Title" sortable>
						<template #body="{ data }">
							<strong>{{ data.title }}</strong>
						</template>
					</Column>

					<Column field="max_score" header="Max score" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.max_score }}</div>
						</template>
					</Column>
					<Column field="spassword" header="Password" sortable>></Column>
					<Column field="questions_no" header="No of qs" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.questions_no }}</div>
						</template>
					</Column>
					<Column field="ts_submitted" header="Started" sortable>
						<template #body="{ data }">
							{{ new Date(data.ts_start).toLocaleDateString('hr-HR') }}
							<p>
								<em>
									<small>{{ humanize(new Date(data.ts_start)) }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="ts_submitted" header="Finished" sortable>
						<template #body="{ data }">
							{{ new Date(data.ts_end).toLocaleDateString('hr-HR') }}
							<p>
								<em>
									<small>{{ humanize(new Date(data.ts_end)) }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="students_no" header="Students" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.students_no }}</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
