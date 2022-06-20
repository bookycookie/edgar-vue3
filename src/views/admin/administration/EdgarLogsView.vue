<script setup lang="ts">
import { ref } from 'vue';
import Calendar from 'primevue/calendar';
import ApiService from '@/services/ApiService';
import { LogEntry, LogConfig } from '@/models/admin/administration/Log';
import { FilterMatchMode } from 'primevue/api';
import humanize from '@/utilities/date-humanizer/humanizer';
const service = new ApiService();

const logsDt = ref();
const exportCSV = () => logsDt.value.exportCSV();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const date = ref();
const logsNum = ref(1000);

const logs = ref<LogEntry[]>([]);

const submitAsync = async () => {
	logs.value = await service.getManyAsync<LogEntry>('/administration/logs', { date: date, rowLimit: logsNum });
};
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title></template>
			<template #content>
				<div class="wrapper">
					<div class="item6">
						<span class="p-float-label">
							<InputNumber v-model="logsNum" :min="1" />
							<label>Number of logs</label>
						</span>
					</div>
					<div class="item7">
						<span class="p-float-label">
							<Calendar v-model="date" date-format="dd/mm/yy" />
							<label>Date</label>
						</span>
					</div>
					<div class="item8"><Button label="Submit" @click="submitAsync" /></div>
				</div>
			</template>
			<template #footer>
				<DataTable
					ref="logsDt"
					v-model:filters="filters"
					:value="logs"
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
					<Column field="ts_collector" header="TS Collector" />
					<Column field="ts_log" header="TS Log" />
					<Column field="hostname" header="Hostname" />
					<Column field="logConfig" header="Log config" sortable />
					<Column field="appInstance" header="Inst." sortable />
					<Column field="level" header="Level" sortable />
					<Column field="message" header="Message" sortable />
					<Column field="email" header="Email" sortable />
					<Column field="script" header="Script" sortable />
				</DataTable>
			</template>
		</Card>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	grid-template-columns: repeat(11, 1fr);
	gap: 1rem;
	grid-template-areas: 'a b b c d d e e f f g h';
	align-items: start;
}
.item1 {
	grid-area: a;
}
.item2 {
	grid-area: b;
}

.item3 {
	grid-area: c;
}
.item4 {
	grid-area: d;
}
.item5 {
	grid-area: e;
}
.item6 {
	grid-area: f;
}
.item7 {
	grid-area: g;
}
.item8 {
	grid-area: h;
}
</style>
