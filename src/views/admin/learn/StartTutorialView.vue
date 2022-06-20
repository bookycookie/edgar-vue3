<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { TutorialTable } from '@/models/admin/learn/TutorialTable';
import { FilterMatchMode } from 'primevue/api';
import humanize from '@/utilities/date-humanizer/humanizer';
import CONSTANTS from '@/config/constants';

const loading = ref(false);
const service = new ApiService();

const tutorialTable = ref<TutorialTable[]>([]);

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const tutorialDt = ref();
const skeletonData: TutorialTable[] = Array(8).fill({} as TutorialTable);
const skeletonColumns = [
	{ field: '', header: '#' },
	{ field: '', header: 'Title' },
	{ field: '', header: 'Course(s)' },
	{ field: '', header: 'Steps' },
	{ field: '', header: 'Finished' },
	{ field: '', header: 'Start' },
];

onMounted(async () => {
	try {
		loading.value = true;
		tutorialTable.value = await service.getManyAsync<TutorialTable>('/tutorials', {
			studentId: CONSTANTS.STUDENT_ID,
			courseId: CONSTANTS.COURSE_ID,
		});
	} finally {
		loading.value = false;
	}
});

const exportCSV = () => tutorialDt.value.exportCSV();

//! TODO: it isn't working on Edgar
const start = async (tutorial: TutorialTable) => console.log('start');
</script>

<template>
	<div class="container-fluid">
		<br />
		<Card>
			<template #title>Tutorials:</template>
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
						<template #body><Skeleton /></template>
					</Column>
				</DataTable>
				<DataTable
					v-else
					ref="tutorialDt"
					v-model:filters="filters"
					:value="tutorialTable"
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
					<Column field="tutorial_title" header="Title" sortable>
						<template #body="{ data }">
							<strong>{{ data.tutorial_title }}</strong>
							<p>
								<em>
									<small>{{ data.tutorial_desc }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="courses" header="Course(s)" sortable>
						<template #body="{ data }">
							<strong>{{ data.courses }}</strong>
						</template>
					</Column>
					<Column field="ts_created" header="Finished" sortable>
						<template #body="{ data }">
							<span>{{ data.finished }}</span>
							<div v-if="data.finished !== 'No'">
								<span class="w-100">{{ new Date(data.ts_finished).toISOString().split('T')[0] }}</span>
								<p class="text-xs text-500">
									<em>
										{{ humanize(new Date(data.ts_finished)) }}
									</em>
								</p>
							</div>
						</template>
					</Column>

					<Column field="" header="Start">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-success" @click="start(data)">
									<font-awesome-icon icon="circle-play"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
