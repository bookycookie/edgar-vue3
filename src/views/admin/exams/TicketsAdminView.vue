<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { Ticket } from '@/models/admin/exams/Ticket';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';

const appUserId = 46;
const studentId = 23;
const courseId = 2000;
const academicYearId = 2020;

const service = new ApiService();

const studentTickets = ref<Ticket[]>([]);
const myTickets = ref<Ticket[]>([]);

onMounted(async () => {
	studentTickets.value = await service.getManyAsync<Ticket>('/my_tickets_student', {
		studentId: studentId,
		courseId: courseId,
		academicYearId: academicYearId,
	});
	myTickets.value = await service.getManyAsync<Ticket>('/my_tickets', {
		appUserId: appUserId,
		courseId: courseId,
		academicYearId: academicYearId,
	});
});

const studentDt = ref();
const studentFilters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const myDt = ref();
const myFilters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});
const exportCSV = (ref: any) => ref.exportCSV();
</script>

<template>
	<div class="container-fluid">
		<!--  -->
		<Card>
			<template #title>Tickets</template>
			<template #content>
				<div class="p-card-title">Tickets for the student:</div>
				<DataTable
					ref="studentDt"
					v-model:filters="studentFilters"
					:value="studentTickets"
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
									v-model="studentFilters['global'].value"
									placeholder="Search"
									class="p-inputtext-sm p-inputtext-filled" />
							</span>
							<Button
								icon="pi pi-external-link"
								label="Export"
								class="p-button-sm ml-3"
								@click="exportCSV(studentDt)" />
						</div>
					</template>
					<template #empty><span class="center">No data to show.</span></template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="title" header="Exam" sortable>
						<template #body="{ data }">
							{{ data.title }}
						</template>
					</Column>

					<Column field="id_question" header="Q. no." sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.id_question }}</div>
						</template>
					</Column>

					<Column field="ts_created" header="Ticket created" sortable>
						<template #body="{ data }">
							<span class="w-100">{{ new Date(data.ts_created).toISOString().split('T')[0] }}</span>
							<p class="text-xs text-500">
								<em>
									{{ humanize(new Date(data.ts_created)) }}
								</em>
							</p>
						</template>
					</Column>
					<Column field="ts_modified" header="Ticket modified" sortable>
						<template #body="{ data }">
							<span class="w-100">{{ new Date(data.ts_modified).toISOString().split('T')[0] }}</span>
							<p class="text-xs text-500">
								<em>
									{{ humanize(new Date(data.ts_modified)) }}
								</em>
							</p>
						</template>
					</Column>
					<Column field="status" header="Status" sortable>
						<template #body="{ data }">
							{{ data.status }}
						</template>
					</Column>
					<Column field="comments" header="Description" sortable>
						<template #body="{ data }">
							{{ data.comments }}
						</template>
					</Column>
				</DataTable>
				<br />
				<br />
				<div class="p-card-title">Tickets assigned to me:</div>
				<DataTable
					ref="myDt"
					v-model:filters="myFilters"
					:value="myTickets"
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
									v-model="myFilters['global'].value"
									placeholder="Search"
									class="p-inputtext-sm p-inputtext-filled" />
							</span>
							<Button
								icon="pi pi-external-link"
								label="Export"
								class="p-button-sm ml-3"
								@click="exportCSV(myDt)" />
						</div>
					</template>
					<template #empty><span class="center">No data to show.</span></template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="title" header="Exam" sortable>
						<template #body="{ data }">
							{{ data.title }}
						</template>
					</Column>

					<Column field="id_question" header="Q. no." sortable>
						<template #body="{ data }">
							<div class="number-align">{{ data.id_question }}</div>
						</template>
					</Column>

					<Column field="ts_created" header="Ticket created" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<span>
									{{ new Date(data.ts_created).toISOString().split('T')[0] }}
									<small>
										<em>
											{{ humanize(new Date(data.ts_created)) }}
										</em>
									</small>
								</span>
							</div>
						</template>
					</Column>
					<Column field="ts_modified" header="Ticket modified" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<span>
									{{ new Date(data.ts_modified).toISOString().split('T')[0] }}
									<small>
										<em>
											{{ humanize(new Date(data.ts_modified)) }}
										</em>
									</small>
								</span>
							</div>
						</template>
					</Column>
					<Column field="status" header="Status" sortable>
						<template #body="{ data }">
							{{ data.status }}
						</template>
					</Column>
					<Column field="comments" header="Description" sortable>
						<template #body="{ data }">
							{{ data.comments }}
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
	</div>
</template>
