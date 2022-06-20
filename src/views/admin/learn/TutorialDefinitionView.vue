<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { TutorialDefTable } from '@/models/admin/learn/TutorialDefTable';
import { FilterMatchMode } from 'primevue/api';
import humanize from '@/utilities/date-humanizer/humanizer';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import CONSTANTS from '@/config/constants';

const loading = ref(false);
const service = new ApiService();

const toast = useToast();
const router = useRouter();

const tutorialDefTable = ref<TutorialDefTable[]>([]);

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const tutorialDefinitionDt = ref();
const skeletonData: TutorialDefTable[] = Array(8).fill({} as TutorialDefTable);
const skeletonColumns = [
	{ field: '', header: '#' },
	{ field: '', header: 'Id/Act/vir' },
	{ field: '', header: 'Title' },
	{ field: '', header: 'Created by' },
	{ field: '', header: 'Created at' },
	{ field: '', header: 'Modified by' },
	{ field: '', header: 'Modified at' },
	{ field: '', header: 'Course(s)' },
	{ field: '', header: 'Analytics' },
	{ field: '', header: 'Delete' },
	{ field: '', header: 'Edit' },
];

onMounted(async () => {
	await getTutorialsAsync();
});

const getTutorialsAsync = async () => {
	try {
		loading.value = true;
		tutorialDefTable.value = await service.getManyAsync<TutorialDefTable>('/tutorial_def_table', {
			courseId: CONSTANTS.COURSE_ID,
		});
	} finally {
		loading.value = false;
	}
};

const exportCSV = () => tutorialDefinitionDt.value.exportCSV();

const deleteAsync = async (tutorial: TutorialDefTable) => {
	toast.add({
		severity: 'success',
		summary: '200 OK',
		detail: `Tutorial ${tutorial.id} deleted successfully.`,
		life: 3000,
	});

	await service
		.postAsync('/lecture/instances/delete', { tutorialId: tutorial.id })
		.then(async () => await getTutorialsAsync());
};
//! TODO: Add edit
const edit = (data: any) => console.log(data);
</script>

<template>
	<div class="container-fluid">
		<br />
		<Card>
			<template #title>Tutorial definitions</template>
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
					ref="tutorialDefinitionDt"
					v-model:filters="filters"
					:value="tutorialDefTable"
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
					<Column field="id_act_vir" header="Id/Act/Vir" sortable>
						<template #body="{ data }">
							<div class="center-align" v-html="data.id_act_vir"></div>
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
					<Column field="user_created_name" header="Created by" sortable></Column>
					<Column field="ts_created" header="Created at" sortable>
						<template #body="{ data }">
							<span class="w-100">{{ new Date(data.ts_created).toISOString().split('T')[0] }}</span>
							<p class="text-xs text-500">
								<em>
									{{ humanize(new Date(data.ts_created)) }}
								</em>
							</p>
						</template>
					</Column>
					<Column field="user_modified_name" header="Modified by" sortable>></Column>
					<Column field="ts_modified" header="Modified at" sortable>
						<template #body="{ data }">
							<span class="w-100">{{ new Date(data.ts_modified).toISOString().split('T')[0] }}</span>
							<p class="text-xs text-500">
								<em>
									{{ humanize(new Date(data.ts_modified)) }}
								</em>
							</p>
						</template>
					</Column>
					<Column field="courses" header="Course(s)" sortable>></Column>
					<Column field="id" header="Analytics">
						<template #body="{ data }">
							<div class="center-align">
								<p>
									<a
										target="_blank"
										:href="`http://localhost:1337/tutorial/analytics/${data.id}/students`">
										Students
										<i class="pi pi-external-link" />
									</a>
								</p>
								<p>
									<a
										target="_blank"
										:href="`http://localhost:1337/tutorial/analytics/${data.id}/groups`">
										Groups
										<i class="pi pi-external-link" />
									</a>
								</p>
								<p>
									<a
										target="_blank"
										:href="`http://localhost:1337/feedback/?tutorialId[]=${data.id}`">
										Feedback
										<i class="pi pi-external-link" />
									</a>
								</p>
							</div>
						</template>
					</Column>
					<Column field="" header="Delete">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-danger" @click="deleteAsync(data)">
									<font-awesome-icon icon="trash"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
					<Column field="" header="Edit">
						<template #body="{ data }">
							<div class="center">
								<a target="_blank" :href="`http://localhost:1337/tutorial/def/${data.id}/edit/?`">
									<Button class="p-button-warning" @click="edit(data)">
										<font-awesome-icon icon="pen-to-square"></font-awesome-icon>
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
