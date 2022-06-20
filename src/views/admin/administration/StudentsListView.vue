<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { StudentList } from '@/models/admin/administration/StudentList';
import { FilterMatchMode } from 'primevue/api';
import humanize from '@/utilities/date-humanizer/humanizer';
const courseId = 155;
const academicYearId = 2020;
const appUserId = 46;
const service = new ApiService();

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const students = ref<StudentList[]>([]);

const getStudentsAsync = async () => {
	students.value = await service.getManyAsync<StudentList>('/administration/students/list', {
		courseId: courseId,
		academicYearId: academicYearId,
	});
};

onMounted(async () => {
	await getStudentsAsync();
});

const studentsDt = ref();
const exportCSV = () => studentsDt.value.exportCSV();

const appendTeachersAsync = async () => {
	await service.postAsync('/administration/students/list/appendTeachers', {
		courseId: courseId,
		academicYearId: academicYearId,
	});
};

const sendRegisterEmailsAsync = async () => {
	await service.postAsync('/administration/groupmail', {
		courseId: courseId,
		academicYearId: academicYearId,
		appUserId: appUserId,
	});
};

const sendRegisterEmailAsync = async (studentId: number) => {
	await service.postAsync('/administration/onemail', {
		appUserId: appUserId,
		studentId: studentId,
	});
};

const deleteAsync = async (studentId: number) => {
	await service
		.postAsync('/administration/students/delete', {
			courseId: courseId,
			academicYearId: academicYearId,
			studentId: studentId,
		})
		.then(async () => await getStudentsAsync());
};

const impersonateAsync = async (studentId: number) => {
	//? How to impersonate?
	console.log('How to impersonate without a session?');
};
</script>

<template>
	<div class="container-fluid">
		<Toast />
		<Card>
			<template #title>Students for the current course and year:</template>
			<template #content>
				<DataTable
					ref="studentsDt"
					v-model:filters="filters"
					:value="students"
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
							<Button
								label="Append all teachers (alteregos)"
								class="p-button-sm ml-3 me-3 p-button-success"
								@click="appendTeachersAsync" />
							<Button
								label="Send register emails"
								class="p-button-sm ml-3 me-3 p-button-success"
								@click="sendRegisterEmailsAsync" />
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
					<Column field="class_group" header="Class group name" sortable />
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
					<Column field="" header="Impersonate">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-success" @click="impersonateAsync(data.id)">
									<font-awesome-icon icon="user"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
					<Column field="" header="Send register email">
						<template #body="{ data }">
							<div class="center">
								<Button class="p-button-success" @click="sendRegisterEmailAsync(data.id)">
									<font-awesome-icon icon="envelope"></font-awesome-icon>
								</Button>
							</div>
						</template>
					</Column>
					<Column field="" header="Score">
						<template #body="{}">
							<div class="center">
								<router-link to="">
									<Button class="p-button-success">
										<font-awesome-icon icon="chart-line"></font-awesome-icon>
									</Button>
								</router-link>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
