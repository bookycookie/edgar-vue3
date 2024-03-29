<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { TestTable } from '@/models/admin/exams/TestTable';
import { Test } from '@/models/admin/exams/Test';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const courseId = 2000;
const academicYearId = 2020;
const appUserId = 46;

const toast = useToast();
const loading = ref(false);
const service = new ApiService();
const tests = ref<Test[]>([]);
const selectedTest = ref<Test>();

const testTable = ref<TestTable[]>([]);
const testTableDt = ref();

const skeletonTableData: TestTable[] = Array(8).fill({
	id: 45,
	title: '',
	id_course: 14,
	id_academic_year: 28,
	id_semester: 47,
	id_test_type: 10,
	id_user_created: 45,
	test_ordinal: 36,
	max_runs: 23,
	show_solutions: false,
	max_score: 30,
	password: '',
	questions_no: 46,
	duration_seconds: 30,
	pass_percentage: 14,
	ts_available_from: '',
	ts_available_to: '',
	ts_created: '',
	ts_modified: '',
	user_modified: '',
	review_period_mins: 22,
	hint_result: false,
	test_score_ignored: false,
	title_abbrev: '',
	async_submit: false,
	trim_clock: false,
	id_email_reminder_scheme: '',
	allow_anonymous: false,
	is_competition: true,
	eval_comp_score: '',
	upload_file_no: 7,
	upload_file_limit: 47,
	forward_only: true,
	id_parent: 3,
	allow_anonymous_stalk: true,
	use_in_stats: true,
	is_global: true,
	is_public: false,
	id_plag_detection_algorithm: '',
	spassword: '',
	ts_from: '',
	ts_to: '',
	type_name: '',
	user_created: '',
	test_flags: '',
	title_type_name: '',
});
const skeletonColumns = [
	{
		header: 'Id',
		field: 'id',
	},
	{
		header: 'Test ordinal',
		field: 'test_ordinal',
	},
	{
		header: 'Title',
		field: 'title_type_name',
	},
	{
		header: 'Abbrev.',
		field: 'title_abbrev',
	},
	{
		header: 'Max runs (0=∞)',
		field: 'max_runs',
	},
	{
		header: 'Global Public UseStats ScoreIgnored',
		field: 'test_flags',
	},
	{
		header: 'Show solutions',
		field: 'show_solutions',
	},
	{
		header: 'Max score',
		field: 'max_score',
	},
	{
		header: 'Password',
		field: 'spassword',
	},
	{
		header: 'No of qs',
		field: 'questions_no',
	},
	{
		header: 'Duration (s)',
		field: 'duration_seconds',
	},
	{
		header: 'Valid from',
		field: 'ts_from',
	},
	{
		header: 'Valid to',
		field: 'ts_to',
	},
	{ header: 'Delete' },
	{ header: 'Edit' },
];
const flagsPill = (flag: string) => {
	let pillClass = 'badge rounded-pill bg-';
	if (flag.includes('-- STATS-')) pillClass += 'primary';
	else if (flag.includes('--- SCIGNORED')) pillClass += 'secondary';
	else if (flag.includes('----')) pillClass += 'info';
	else pillClass += 'light';
	return pillClass;
};

const exportCSV = () => testTableDt.value.exportCSV();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

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
			router.push({ name: 'EditExam', params: { id: newId } });
		});
};

const deleteE = (index: number) => {
	console.log(`Deleted ${JSON.stringify(testTable.value[index])}`);
	testTable.value.splice(index, 1);

	toast.add({
		severity: 'success',
		summary: '200 OK',
		detail: `Exam ${testTable.value[index].id} deleted successfully.`,
		life: 3000,
	});
};

const edit = (id: number) => {
	router.push({ name: 'EditExam', params: { id: id } });
};

const createNewEdit = async () => {
	const res = await service.postAsync('/exam/new', {
		testTypeId: selectedTest.value?.id,
		courseId: courseId,
		academicYearId: academicYearId,
		appUserId: appUserId,
	});

	return parseInt(res);
};

onMounted(async () => {
	tests.value = await service.getManyAsync<Test>('/test_types', {
		standalone: true,
	});

	if (tests.value && tests.value.length > 0) selectedTest.value = tests.value[0];

	testTable.value = await service.getManyAsync<TestTable>('/test_table', {
		courseId: courseId,
		academicYearId: academicYearId,
	});

	for (var i = 0; i < testTable.value.length; i++) {
		testTable.value[i].title_type_name = `${testTable.value[i].title} — ${testTable.value[i].type_name}`;
	}
});
</script>

<template>
	<div class="container-fluid no-x">
		<Toast />

		<br />
		<h2>Exams for the current course and year:</h2>
		<br />
		<div class="row d-flex justify-content-start">
			<div class="ml-5">
				<h5>
					I want to create a new quiz
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
		<DataTable v-if="loading" :value="skeletonTableData" responsive-layout="scroll" class="p-datatable-sm">
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
			<Column v-for="col of skeletonColumns" :key="col.field" :field="col.field" :header="col.header" sortable>
				<template #body><Skeleton></Skeleton></template>
			</Column>
		</DataTable>
		<DataTable
			v-else
			ref="testTableDt"
			v-model:filters="filters"
			:value="testTable"
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
					<Button icon="pi pi-external-link" label="Export" class="p-button-sm ml-3" @click="exportCSV" />
				</div>
			</template>
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
	</div>
</template>
