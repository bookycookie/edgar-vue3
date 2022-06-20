<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { SnippetTable } from '@/models/admin/playground/SnippetTable';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';
import RouteNames from '@/router/routes';
import router from '@/router';
import CONSTANTS from '@/config/constants';

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const service = new ApiService();

const snippets = ref<SnippetTable[]>([]);
const snippetsDt = ref();

const exportCSV = () => snippetsDt.value.exportCSV();

const fork = async (snippet: SnippetTable) => {
	await service
		.postAsync('/playground/snippet/fork', { studentId: CONSTANTS.STUDENT_ID, snippetId: snippet.id })
		.then((response: any) => {
			const newId = parseInt(response.data.rows[0].id);

			router.isReady().then(() => router.push({ name: RouteNames.CodeSandboxAdmin, params: { id: newId } }));
		});
};

onMounted(async () => {
	snippets.value = await service.getManyAsync<SnippetTable>('/playground/snippet_table', {
		courseId: CONSTANTS.COURSE_ID,
		academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
		studentId: CONSTANTS.STUDENT_ID,
	});
});
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Snippets for the current course and year:</template>
			<template #content>
				<DataTable
					ref="snippetsDt"
					v-model:filters="filters"
					:value="snippets"
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
					<Column field="" header="Image" sortable>
						<template #body="{}">PH</template>
					</Column>
					<Column field="first_name" header="First name" sortable />
					<Column field="last_name" header="Last name" sortable />
					<Column field="email" header="Email" sortable />
					<Column field="class_group" header="Group" sortable />
					<Column field="id" header="Id" sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.id }}</div>
						</template>
					</Column>
					<Column field="title" header="Snippet title" sortable />
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
					<Column field="" header="Fork">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-secondary" @click="fork(data)">
									<font-awesome-icon icon="code-fork"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
					<Column field="" header="Open in my sandbox">
						<template #body="{ data }">
							<div class="center">
								<router-link :to="{ name: RouteNames.CodeSandboxAdmin, params: { id: data.id } }">
									<Button class="p-button-primary" icon="pi pi-external-link" />
								</router-link>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
