<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { Test } from '@/models/admin/exams/Test';
import { TestTable } from '@/models/admin/exams/TestTable';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';

const courseId = 477;
const academicYearId = 2020;

const service = new ApiService();

const tests = ref<Test[]>([]);
const selectedTest = ref<Test | null>(null);

const lectureTable = ref<TestTable[]>([]);
const lectureTableDt = ref();

onMounted(async () => {
	tests.value = await service.getManyAsync<Test>('/test_types', { standalone: false, typeName: 'Lecture quiz' });
	lectureTable.value = await service.getManyAsync<TestTable>('/lecture_table', {
		courseId: courseId,
		academicYearId: academicYearId,
	});

	for (var i = 0; i < lectureTable.value.length; i++) {
		lectureTable.value[i].title_type_name = `${lectureTable.value[i].title} — ${lectureTable.value[i].type_name}`;
	}
});

const flagsPill = (flag: string) => {
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

const skeletonLectureData: TestTable[] = Array(8).fill({
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
</script>

<template>
	<div class="container-fluid no-x">
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
							<Button label="Create" icon="pi pi-plus-circle" class="center p-button-rounded"></Button>
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
					<Column field="test_ordinal" header="Test ordinal" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.test_ordinal }}</div>
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
					<Column field="title_abbrev" header="Abbrev." sortable></Column>
					<Column field="max_runs" header="Max runs (0=∞)" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.max_runs }}</div>
						</template>
					</Column>
					<Column field="test_flags" header="Global Public UseStats ScoreIgnored" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<span :class="flagsPill(data.test_flags)">
									{{ data.test_flags }}
								</span>
							</div>
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
						<template #body="{ index }">
							<Button class="p-button-danger" @click="deleteE(index)">
								<font-awesome-icon icon="trash"></font-awesome-icon>
							</Button>
						</template>
					</Column>
					<Column field="" header="Edit">
						<template #body="{ data }">
							<Button class="p-button-success" @click="edit(data.id)">
								<font-awesome-icon icon="pen-to-square"></font-awesome-icon>
							</Button>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
