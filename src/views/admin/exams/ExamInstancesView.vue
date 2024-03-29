<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';
import { AllExamInstances } from '@/models/admin/exams/AllExamInstances';

const academicYearId = 2020;
const courseId = 477;
const service = new ApiService();

onMounted(async () => {
	allExamInstances.value = await service.getManyAsync<AllExamInstances>('/all_test_instances', {
		academicYearId: academicYearId,
		courseId: courseId,
	});

	for (let index = 0; index < allExamInstances.value.length; index++) {
		allExamInstances.value[index].started_perc = (
			(allExamInstances.value[index].started / allExamInstances.value[index].total) *
			100
		).toFixed(2);
		allExamInstances.value[index].submitted_perc = (
			(allExamInstances.value[index].submitted / allExamInstances.value[index].total) *
			100
		).toFixed(2);
		allExamInstances.value[index].ongoing =
			allExamInstances.value[index].started - allExamInstances.value[index].submitted;
		allExamInstances.value[index].not_started =
			allExamInstances.value[index].total - allExamInstances.value[index].started;
		// they were being treated as strings for some reason and wouldn't be sorted otherwise???
		allExamInstances.value[index].submitted = allExamInstances.value[index].submitted - 0;
		allExamInstances.value[index].generated = allExamInstances.value[index].generated - 0;
		allExamInstances.value[
			index
		].title_type_name = `${allExamInstances.value[index].title} — ${allExamInstances.value[index].type_name}`;
	}
});

const loading = ref(false);
const allExamInstances = ref<AllExamInstances[]>([]);
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const allExamInstancesDt = ref();
const exportCSV = () => allExamInstancesDt.value.exportCSV();

const flagsPill = (flag: string) => {
	let pillClass = 'badge rounded-pill bg-';
	if (flag.includes('-- STATS-')) pillClass += 'primary';
	else if (flag.includes('--- SCIGNORED')) pillClass += 'secondary';
	else if (flag.includes('----')) pillClass += 'info';
	else pillClass += 'light';
	return pillClass;
};

const skeletonExamInstances: AllExamInstances[] = Array(8).fill({
	id: 1,
	test_ordinal: 1,
	title_type_name: '',
	ts_available_from: '',
	test_flags: '',
	uploaded_files_no: 1,
	started: 1,
	started_perc: '1',
	submitted_perc: '1',
	generated: 1,
	submitted: 1,
	total: 1,
	ongoing: 1,
	not_started: 1,
	type_name: '',
	allow_anonymous_stalk: false,
	seconds_available_from: '',
	title: '',
});
const skeletonColumns: any[] = [
	{ field: '', header: '#' },
	{ field: 'id', header: 'Id' },
	{ field: 'ordinal', header: 'Ordinal' },
	{ field: 'title_type_name', header: 'Title' },
	{ field: 'ts_submitted', header: 'Valid from' },
	{ field: 'test_flags', header: 'Global Public UseStats ScoreIgnored' },
	{ field: 'total', header: 'Total' },
	{ field: 'started_perc', header: 'Started %' },
	{ field: 'submitted_perc', header: 'Submitted %' },
	{ field: '', header: 'Delete All' },
	{ field: '', header: 'Forward generate' },
	{ field: 'generated', header: 'Generated' },
	{ field: 'uploaded_files_no', header: 'Files uploaded' },
	{ field: 'submitted', header: 'Submitted' },
	{ field: 'ongoing', header: 'Ongoing' },
	{ field: 'not_started', header: 'Not started' },
	{ field: '', header: 'Send message' },
	{ field: '', header: 'Manual grading' },
	{ field: '', header: 'Tickets' },
];
</script>

<template>
	<div class="container-fluid">
		<br />
		<h2>Exams for the current course and year:</h2>
		<DataTable v-if="loading" :value="skeletonExamInstances" responsive-layout="scroll">
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
			ref="allExamInstancesDt"
			v-model:filters="filters"
			:value="allExamInstances"
			filter-display="menu"
			show-gridlines
			:rows="4"
			paginator
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
			<Column field="ordinal" header="Ordinal" sortable>
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
			<Column field="ts_submitted" header="Valid from" sortable>
				<template #body="{ data }">
					{{ new Date(data.ts_available_from).toLocaleDateString('hr-HR') }}
					<p>
						<em>
							<small>{{ humanize(new Date(data.ts_available_from)) }}</small>
						</em>
					</p>
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
			<Column field="total" header="Total" sortable>
				<template #body="{ data }">
					<div class="number-align">{{ data.total }}</div>
				</template>
			</Column>
			<Column field="started_perc" header="Started %" sortable>
				<template #body="{ data }">
					<div class="number-align">{{ data.started_perc }}</div>
				</template>
			</Column>
			<Column field="submitted_perc" header="Submitted %" sortable>
				<template #body="{ data }">
					<div class="number-align">{{ data.submitted_perc }}</div>
				</template>
			</Column>
			<Column field="" header="Delete All">
				<template #body="{}">
					<div class="center">
						<Button class="p-button-danger">
							<font-awesome-icon icon="trash"></font-awesome-icon>
						</Button>
					</div>
				</template>
			</Column>
			<Column field="" header="Forward generate">
				<template #body="{}">
					<div class="center">
						<Button class="p-button-warning">
							<font-awesome-icon icon="arrow-turn-right"></font-awesome-icon>
						</Button>
					</div>
				</template>
			</Column>
			<Column field="generated" header="Generated" sortable>
				<template #body="{ data }">
					<div class="center-align">
						<Button class="p-button-outlined p-button-primary">
							{{ data.generated }}
						</Button>
					</div>
				</template>
			</Column>
			<Column field="uploaded_files_no" header="Files uploaded" sortable>
				<template #body="{ data }">
					<div class="center-align">
						<Button class="p-button-outlined p-button-primary">
							{{ data.uploaded_files_no }}
						</Button>
					</div>
				</template>
			</Column>
			<Column field="submitted" header="Submitted" sortable>
				<template #body="{ data }">
					<div class="center-align">
						<Button class="p-button-outlined p-button-primary">
							{{ data.submitted }}
						</Button>
					</div>
				</template>
			</Column>
			<Column field="ongoing" header="Ongoing" sortable>
				<template #body="{ data }">
					<div class="center-align">
						<Button class="p-button-outlined p-button-primary">
							{{ data.ongoing }}
						</Button>
					</div>
				</template>
			</Column>
			<Column field="not_started" header="Not started" sortable>
				<template #body="{ data }">
					<div class="center-align">
						<Button class="p-button-outlined p-button-primary">
							{{ data.not_started }}
						</Button>
					</div>
				</template>
			</Column>
			<Column field="" header="Send message">
				<template #body="{}">
					<div class="center">
						<Button class="p-button-primary">
							<font-awesome-icon icon="comment-dots"></font-awesome-icon>
						</Button>
					</div>
				</template>
			</Column>
			<Column field="" header="Manual grading">
				<template #body="{}">
					<div class="center">
						<Button class="p-button-primary">
							<font-awesome-icon icon="pen"></font-awesome-icon>
						</Button>
					</div>
				</template>
			</Column>
			<Column field="" header="Tickets">
				<template #body="{}">
					<div class="center">
						<Button class="p-button-primary">
							<font-awesome-icon icon="tools"></font-awesome-icon>
						</Button>
					</div>
				</template>
			</Column>
		</DataTable>
	</div>
</template>
