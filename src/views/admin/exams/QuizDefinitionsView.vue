<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { Test } from '@/models/admin/exams/Test';
import { LectureTable } from '@/models/admin/exams/LectureTable';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from 'vue-router';
import RouteNames from '@/router/routes';
import { useToast } from 'primevue/usetoast';
import CONSTANTS from '@/config/constants';

const router = useRouter();
const isLoading = ref(false);

const toast = useToast();
const service = new ApiService();

const tests = ref<Test[]>([]);
const selectedTest = ref<Test | null>(null);

const lectureTable = ref<LectureTable[]>([]);
const lectureTableDt = ref();

onMounted(async () => {
	tests.value = await service.getManyAsync<Test>('/test_types', { standalone: false, typeName: 'Lecture quiz' });
	selectedTest.value = tests.value?.length > 0 ? tests.value[0] : null;
	await getLectureTableAsync();
});

const getLectureTableAsync = async () => {
	try {
		isLoading.value = true;
		lectureTable.value = await service.getManyAsync<LectureTable>('/lecture_table', {
			courseId: CONSTANTS.COURSE_ID,
			academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
		});
		for (var i = 0; i < lectureTable.value.length; i++) {
			lectureTable.value[
				i
			].title_type_name = `${lectureTable.value[i].title} — ${lectureTable.value[i].type_name}`;
		}
	} finally {
		isLoading.value = false;
	}
};

const flagsPill = (flag: string) => {
	if (!flag) return;
	let pillClass = 'badge rounded-pill bg-';
	if (flag.includes('-- STATS-')) pillClass += 'primary';
	else if (flag.includes('--- SCIGNORED')) pillClass += 'secondary';
	else if (flag.includes('----')) pillClass += 'info';
	else pillClass += 'light';
	return pillClass;
};

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const skeletonLectureData: LectureTable[] = Array(8).fill({} as LectureTable);

const skeletonColumns = [
	{ field: '', header: '#' },
	{ field: 'id', header: 'Id' },
	{ field: 'title_type_name', header: 'Title' },
	{ field: 'ordinal', header: 'Test ordinal' },
	{ field: 'max_runs', header: 'Max runs (0=∞)' },
	{ field: '', header: 'Show solutions' },
	{ field: 'max_score', header: 'Max score' },
	{ field: 'spassword', header: 'Password' },
	{ field: 'questions_no', header: 'No of qs' },
	{ field: 'duration_seconds', header: 'Duration (s)' },
	{ field: 'pass_percentage', header: 'Pass %' },
	{ field: 'ts_from', header: 'Valid from' },
	{ field: 'ts_to', header: 'Valid to' },
	{ field: '', header: 'Delete' },
	{ field: '', header: 'Edit' },
];

const exportCSV = () => lectureTableDt.value.exportCSV();

const create = async () => {
	console.log('Created!');
	service
		.postAsync('/exam/new', {
			testTypeId: selectedTest.value?.id,
			appUserId: CONSTANTS.APP_USER_ID,
			courseId: CONSTANTS.COURSE_ID,
			academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
		})
		.then((response: any) => {
			if (!response) return;

			const newId = parseInt(response.data[0].new_test);
			console.log(newId);
			router.push({ name: RouteNames.EditExam, params: { id: newId } });
		});
};

const deleteAsync = async (lecture?: LectureTable) => {
	if (!lecture) return;
	toast.add({
		severity: 'success',
		summary: '200 OK',
		detail: `Quiz ${lecture.id} deleted successfully.`,
		life: 3000,
	});

	await service.postAsync('/exam/delete', { testId: lecture.id }).then(async () => await getLectureTableAsync());
};
const edit = (id: number) => {
	router.push({ name: RouteNames.EditExam, params: { id: id } });
};

const isVisible = ref(false);
const lectureToDelete = ref<LectureTable>();
const showDeleteDialog = (instance: LectureTable) => {
	isVisible.value = true;
	lectureToDelete.value = instance;
};
</script>

<template>
	<div class="container-fluid no-x">
		<Dialog v-model:visible="isVisible" :base-z-index="1338">
			<template #header>
				<h3>Please confirm</h3>
			</template>
			<p>Do you really want to delete this quiz?</p>
			<template #footer>
				<Button @click="deleteAsync(lectureToDelete)">
					<font-awesome-icon icon="thumbs-up" class="me-2"></font-awesome-icon>
					Yes!
				</Button>
				<Button class="p-button-secondary" @click="isVisible = false">
					<font-awesome-icon icon="thumbs-down" class="me-2"></font-awesome-icon>
					No
				</Button>
			</template>
		</Dialog>
		<Card>
			<template #title>Quizzes for the current course and year:</template>
			<template #content>
				<div v-if="isLoading">
					<div class="ml-5">
						<h5>
							<Skeleton />
							<br />
							<Skeleton />
						</h5>
					</div>
					<br />
				</div>
				<div v-else class="row d-flex justify-content-start">
					<div class="ml-5">
						<h5>
							Create a new exam of the following type
							<Dropdown
								v-model="selectedTest"
								:options="tests"
								:placeholder="selectedTest?.name"
								option-label="name"
								class="me-2 ms-2"></Dropdown>
							<Button
								label="Create"
								icon="pi pi-plus-circle"
								class="center p-button-rounded"
								@click="create"></Button>
						</h5>
					</div>
					<br />
				</div>
				<DataTable
					v-if="isLoading"
					:value="skeletonLectureData"
					responsive-layout="scroll"
					class="p-datatable-sm">
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
								class="p-button-rounded p-button-outlined p-button-sm ml-3"
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
					ref="lectureTableDt"
					v-model:filters="filters"
					:value="lectureTable"
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
					<Column field="title_type_name" header="Title" sortable>
						<template #body="{ data }">
							<strong>{{ data.title }}</strong>
							<p>
								<em>
									<small>{{ data.type_name }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="user_created" header="User created" sortable></Column>
					<Column field="test_ordinal" header="Test ordinal" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.test_ordinal }}</div>
						</template>
					</Column>
					<Column field="max_runs" header="Max runs (0=∞)" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.max_runs }}</div>
						</template>
					</Column>
					<Column field="show_solutions" header="Show solutions" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.show_solutions ? 'check-circle' : 'times-circle'"
									:class="data.show_solutions ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
					<Column field="max_score" header="Max score" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.max_score }}</div>
						</template>
					</Column>
					<Column field="spassword" header="Password" sortable></Column>
					<Column field="questions_no" header="No of qs" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.questions_no }}</div>
						</template>
					</Column>
					<Column field="duration_seconds" header="Duration (s)" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.duration_seconds }}</div>
						</template>
					</Column>
					<Column field="pass_percentage" header="Pass %" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.pass_percentage }}%</div>
						</template>
					</Column>
					<Column field="ts_from" header="Valid from" sortable>
						<template #body="{ data }">
							<span class="w-100">{{ new Date(data.ts_from).toISOString().split('T')[0] }}</span>
							<p class="text-xs text-500">
								<em>
									{{ humanize(new Date(data.ts_from)) }}
								</em>
							</p>
						</template>
					</Column>
					<Column field="ts_to" header="Valid to" sortable>
						<template #body="{ data }">
							<span class="w-100">{{ new Date(data.ts_to).toISOString().split('T')[0] }}</span>
							<p class="text-xs text-500">
								<em>
									{{ humanize(new Date(data.ts_to)) }}
								</em>
							</p>
						</template>
					</Column>
					<Column field="" header="Delete">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-danger" @click="showDeleteDialog(data)">
									<font-awesome-icon icon="trash"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
					<Column field="" header="Edit">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-success" @click="edit(data.id)">
									<font-awesome-icon icon="pen-to-square"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
