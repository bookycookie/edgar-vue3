<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { Test } from '@/models/admin/exams/Test';
import { LectureTable } from '@/models/admin/exams/LectureTable';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';
import { useRouter } from 'vue-router';
import RouteNames from '@/router/routes';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const router = useRouter();
const courseId = 2000;
const academicYearId = 2020;
const appUserId = 46;

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
	for (var i = 0; i < lectureTable.value.length; i++) {
		lectureTable.value[i].title_type_name = `${lectureTable.value[i].title} — ${lectureTable.value[i].type_name}`;
	}
});

const getLectureTableAsync = async () => {
	lectureTable.value = await service.getManyAsync<LectureTable>('/lecture_table', {
		courseId: courseId,
		academicYearId: academicYearId,
	});
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

const skeletonLectureData: LectureTable[] = Array(8).fill({
	id: 15,
	title: '',
	id_course: 5,
	id_academic_year: 43,
	id_semester: 31,
	id_test_type: 38,
	id_user_created: 29,
	test_ordinal: 17,
	max_runs: 25,
	show_solutions: true,
	max_score: 14,
	password: '',
	questions_no: 29,
	duration_seconds: 6,
	pass_percentage: 1,
	ts_available_from: '',
	ts_available_to: '',
	ts_created: '',
	ts_modified: '',
	user_modified: '',
	review_period_mins: 14,
	hint_result: true,
	test_score_ignored: true,
	title_abbrev: 'odio',
	async_submit: true,
	trim_clock: false,
	id_email_reminder_scheme: 1,
	allow_anonymous: false,
	is_competition: false,
	eval_comp_score: '',
	upload_file_no: 47,
	upload_file_limit: 37,
	forward_only: true,
	id_parent: '',
	allow_anonymous_stalk: false,
	use_in_stats: false,
	is_global: false,
	is_public: false,
	id_plag_detection_algorithm: 2,
	spassword: '',
	ts_from: '',
	ts_to: '',
	type_name: '',
	user_created: '',
	title_type_name: '',
	test_flags: '',
});

const skeletonColumns = [
	{ field: '', header: '#' },
	{ field: 'id', header: 'Id' },
	{ field: 'ordinal', header: 'Ordinal' },
	{ field: 'title_type_name', header: 'Title' },
	{ field: 'user_created', header: 'User created' },
	{ field: 'max_runs', header: 'Max runs (0=∞)' },
	{ field: '', header: 'Show results' },
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
			courseId: courseId,
			academicYearId: academicYearId,
			appUserId: appUserId,
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
				<div class="row d-flex justify-content-start">
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
