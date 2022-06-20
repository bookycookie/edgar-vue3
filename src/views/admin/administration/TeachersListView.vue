<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { TeacherList } from '@/models/admin/administration/TeacherList';
import { TeacherListNo } from '@/models/admin/administration/TeacherListNo';
import { FilterMatchMode } from 'primevue/api';
import humanize from '@/utilities/date-humanizer/humanizer';
import CONSTANTS from '@/config/constants';
const service = new ApiService();

const teachers = ref<TeacherList[]>([]);
const getTeachersAsync = async () => {
	teachers.value = await service.getManyAsync<TeacherList>('/administration/teachers/list', {
		courseId: CONSTANTS.COURSE_ID,
	});
};

const teachersNo = ref<TeacherListNo[]>([]);
const selectedTeacherNo = ref<TeacherListNo>();
const getTeachersNoAsync = async () => {
	teachersNo.value = await service.getManyAsync<TeacherListNo>('/administration/teachers/list_no', {
		courseId: CONSTANTS.COURSE_ID,
	});
};

onMounted(async () => {
	Promise.all([getTeachersAsync(), getTeachersNoAsync()]);
});

const addTeacherNoAsync = async () => {
	if (!selectedTeacherNo.value) return;
	await service
		.postAsync('/administration/teachers/add', {
			teacherId: selectedTeacherNo.value?.id,
			courseId: CONSTANTS.COURSE_ID,
			academicYearId: CONSTANTS.ACADEMIC_YEAR_ID,
		})
		.then(async () => await Promise.all([getTeachersAsync(), getTeachersNoAsync()]));
};

const deleteAsync = async (teacherId: number) => {
	await service
		.postAsync('/administration/teachers/delete', {
			courseId: CONSTANTS.COURSE_ID,
			teacherId: teacherId,
		})
		.then(async () => await Promise.all([getTeachersAsync(), getTeachersNoAsync()]));
};

const teachersDt = ref();
const exportCSV = () => teachersDt.value.exportCSV();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Teachers for the current course:</template>
			<template #content>
				<div class="center flex">
					<span class="p-float-label me-2">
						<Dropdown
							v-model="selectedTeacherNo"
							:options="teachersNo"
							option-label="name"
							filter
							style="min-width: 30rem" />
						<label>Missing teachers</label>
					</span>
					<Button label="Add" @click="addTeacherNoAsync" />
				</div>
			</template>
			<template #footer>
				<DataTable
					ref="teachersDt"
					v-model:filters="filters"
					:value="teachers"
					filter-display="menu"
					show-gridlines
					scroll-height="43rem"
					class="p-datatable-sm"
					responsive-layout="scroll"
					:paginator="true"
					:rows="7">
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
								class="p-button-sm ml-3 me-3"
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
					<Column field="id" header="Id">
						<template #body="{ data }">
							<div class="number-align">
								<div>{{ data.id }}</div>
							</div>
						</template>
					</Column>
					<Column field="" header="Image" sortable>
						<font-awesome-icon icon="user"></font-awesome-icon>
					</Column>
					<Column field="first_name" header="First name" sortable />
					<Column field="last_name" header="Last name" sortable />
					<Column field="alt_id" header="alt_id" sortable />
					<Column field="alt_id2" header="alt_id2" sortable />
					<Column field="email" header="Email" sortable />
					<Column field="username" header="Username" sortable />
					<Column field="provider" header="Provider" sortable />
					<Column field="ts_created" header="Created at" sortable>
						<template #body="{ data }">
							{{ new Date(data.ts_created).toISOString().split('T')[0] }}
							<p>
								<em>
									<small>{{ humanize(new Date(data.ts_created)) }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="ts_modified" header="Modified at" sortable>
						<template #body="{ data }">
							{{ new Date(data.ts_modified).toISOString().split('T')[0] }}
							<p>
								<em>
									<small>{{ humanize(new Date(data.ts_modified)) }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="" header="Delete">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-danger" @click="deleteAsync(data.id)">
									<font-awesome-icon icon="trash"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
