<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';
import { AllExamInstances } from '@/models/admin/exams/AllExamInstances';
import CONSTANTS from '@/config/constants';

const service = new ApiService();

onMounted(async () => await getAllExamInstancesAsync());

const getAllExamInstancesAsync = async () => {
	try {
		isLoading.value = true;
		allExamInstances.value = await service.getManyAsync<AllExamInstances>('/all_test_instances', {
			courseId: CONSTANTS.COURSE_ID,
			academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
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
	} finally {
		isLoading.value = false;
	}
};

const isLoading = ref(false);
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

const skeletonExamInstances: AllExamInstances[] = Array(8).fill({} as AllExamInstances);
const skeletonColumns = [
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

const deleteAllAsync = async (instance: AllExamInstances) => {
	await service
		.postAsync('/instances/deleteall', { testId: instance.id })
		.then(async () => await getAllExamInstancesAsync());
};

//! TODO: Implement
const forwardGenerateAsync = async (instance: AllExamInstances) => {};
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Exams for the current course and year:</template>
			<template #content>
				<DataTable v-if="isLoading" :value="skeletonExamInstances" responsive-layout="scroll">
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
								<span :class="flagsPill(data.test_flags)" style="min-width: 7rem">
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
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-danger" @click="deleteAllAsync(data)">
									<font-awesome-icon icon="trash"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
					<Column field="" header="Forward generate">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-warning" @click="forwardGenerateAsync(data)">
									<font-awesome-icon icon="arrow-turn-right"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
					<Column field="generated" header="Generated" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<a
									target="_blank"
									:href="`http://localhost:1337/test/instances/generated/test/${data.id}`">
									<Button class="p-button-outlined p-button-primary">
										{{ data.generated }}
									</Button>
								</a>
							</div>
						</template>
					</Column>
					<Column field="uploaded_files_no" header="Files uploaded" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<a
									target="_blank"
									:href="`http://localhost:1337/test/instances/attachments/${data.id}`">
									<Button class="p-button-outlined p-button-primary">
										{{ data.uploaded_files_no }}
									</Button>
								</a>
							</div>
						</template>
					</Column>
					<Column field="submitted" header="Submitted" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<a
									target="_blank"
									:href="`http://localhost:1337/test/instances/submitted/test/${data.id}`">
									<Button class="p-button-outlined p-button-primary">
										{{ data.submitted }}
									</Button>
								</a>
							</div>
						</template>
					</Column>
					<Column field="ongoing" header="Ongoing" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<a
									target="_blank"
									:href="`http://localhost:1337/test/instances/ongoing/test/${data.id}`">
									<Button class="p-button-outlined p-button-primary">
										{{ data.ongoing }}
									</Button>
								</a>
							</div>
						</template>
					</Column>
					<Column field="not_started" header="Not started" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<a
									target="_blank"
									:href="`http://localhost:1337/test/instances/notstarted/test/${data.id}`">
									<Button class="p-button-outlined p-button-primary">
										{{ data.not_started }}
									</Button>
								</a>
							</div>
						</template>
					</Column>
					<Column field="" header="Send message">
						<template #body="{ data }">
							<div class="center">
								<a
									target="_blank"
									:href="`http://localhost:1337/test/instances/sendmessage/test/${data.id}`">
									<Button class="p-button-primary">
										<font-awesome-icon icon="comment-dots"></font-awesome-icon>
									</Button>
								</a>
							</div>
						</template>
					</Column>
					<Column field="" header="Manual grading">
						<template #body="{ data }">
							<div class="center">
								<a
									target="_blank"
									:href="`http://localhost:1337/test/instances/manualgrading/test/${data.id}`">
									<Button class="p-button-primary">
										<font-awesome-icon icon="pen"></font-awesome-icon>
									</Button>
								</a>
							</div>
						</template>
					</Column>
					<Column field="" header="Tickets">
						<template #body="{ data }">
							<div class="center">
								<a target="_blank" :href="`http://localhost:1337/ticket/test/${data.id}`">
									<Button class="p-button-primary">
										<font-awesome-icon icon="tools"></font-awesome-icon>
									</Button>
								</a>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
