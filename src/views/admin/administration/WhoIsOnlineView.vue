<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import { OnlineUser } from '@/models/admin/administration/OnlineUser';
import { FilterMatchMode } from 'primevue/api';
import humanize from '@/utilities/date-humanizer/humanizer';

const courseId = 155;
const academicYearId = 2020;
const service = new ApiService();

const online = ref<OnlineUser[]>([]);
onMounted(async () => {
	online.value = await service.getManyAsync<OnlineUser>('/administration/whoisonline');
});

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const onlineDt = ref();
const exportCSV = () => onlineDt.value.exportCSV();
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Online users (= touched server in the last hour):</template>
			<template #content>
				<DataTable
					ref="onlineDt"
					v-model:filters="filters"
					:value="online"
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
								class="p-button-sm ml-3"
								@click="exportCSV" />
						</div>
					</template>
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="" header="Image" sortable>
						<font-awesome-icon icon="user"></font-awesome-icon>
					</Column>
					<Column field="username" header="Username" sortable />
					<Column field="fullname" header="Full name" />
					<Column field="rolename" header="Role" sortable />
					<Column field="currAcademicYear" header="Academic year" sortable />
					<Column field="currCourse" header="Course" sortable />
					<Column field="lastRoute" header="Last route" sortable />
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
				</DataTable>
			</template>
		</Card>
	</div>
</template>
