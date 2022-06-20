<script setup lang="ts">
import { ref, defineProps, PropType, defineEmits } from 'vue';
import { ColumnMode } from '@/models/admin/questions/ColumnMode';
import useModelWrapper from '@/composables/modelWrapper';
import { FilterMatchMode } from 'primevue/api';
import { Codemirror } from 'vue-codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';

const extensions: Extension[] = [sql(), oneDark];
const activeIndexes = ref([0, 1, 2, 3]);

const executionTableDt = ref();
const exportCSV = () => executionTableDt.value.exportCSV();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const emit = defineEmits([
	'update:sqlAnswer',
	'update:sqlPrefix',
	'update:sqlSuffix',
	'update:presentationQuery',
	'update:checkTupleOrder',
	'update:selectedColumnMode',
	'run',
	'runAll',
]);

const props = defineProps({
	sqlAnswer: {
		type: String,
		required: true,
	},
	sqlPrefix: {
		type: String,
		required: true,
	},
	sqlSuffix: {
		type: String,
		required: true,
	},
	presentationQuery: {
		type: String,
		required: true,
	},
	checkTupleOrder: {
		type: Boolean,
		required: true,
	},
	columnModes: {
		type: Object as PropType<ColumnMode[]>,
		required: true,
		default() {
			return [];
		},
	},
	selectedColumnMode: {
		type: Object as PropType<ColumnMode>,
		required: true,
	},
	columns: {
		type: Object as PropType<Array<string>>,
		required: false,
		default() {
			[];
		},
	},
	rows: {
		type: Object as PropType<Array<any>>,
		required: false,
		default() {
			[];
		},
	},
	sqlError: {
		type: String,
		required: false,
		default: '',
	},
});

const internalSelectedColumnMode = useModelWrapper<ColumnMode>(props, emit, 'selectedColumnMode');
const internalCheckTupleOrder = useModelWrapper<boolean>(props, emit, 'checkTupleOrder');
const internalSqlAnswer = useModelWrapper<string>(props, emit, 'sqlAnswer');
const internalSqlPrefix = useModelWrapper<string>(props, emit, 'sqlPrefix');
const internalSqlSuffix = useModelWrapper<string>(props, emit, 'sqlSuffix');
const internalPresentationQuery = useModelWrapper<string>(props, emit, 'presentationQuery');

const run = async () => {
	emit('run');
	activeIndexes.value = [4];
};

const runAll = async () => {
	emit('runAll');
	activeIndexes.value = [4];
};
</script>

<template>
	<div id="sql-component">
		<Card>
			<template #content>
				<div class="grid" style="row-gap: 1rem; margin-left: 0.5rem">
					<div class="p-inputgroup">
						<Checkbox
							id="evaluated-sql-tuple-order"
							v-model="internalCheckTupleOrder"
							class="me-2"
							:binary="true"></Checkbox>
						<label for="evaluated-sql-tuple-order">Check tuple order</label>
					</div>
					<div v-for="mode in columnModes" :key="mode.id" class="p-inputgroup">
						<RadioButton
							:id="`evaluated-sql-mode-${mode.id}`"
							v-model="internalSelectedColumnMode"
							:value="mode"
							class="me-2"></RadioButton>
						<label :for="`evaluated-sql-mode-${mode.id}`">
							{{ mode.mode_desc }}
						</label>
					</div>
				</div>
			</template>
		</Card>
		<Accordion :active-index="activeIndexes" multiple>
			<AccordionTab>
				<template #header>
					<div class="col-12 md:col-10">
						<span id="sql-answer-header">SQL answer</span>
						<span for="sql-answer-header" class="text-400 ms-2">
							(typically SELECT, but can also be UPDATE, DELETE)
						</span>
					</div>
					<Button
						class="ms-2 p-button-secondary"
						@click="
							run();
							$event.stopPropagation();
						">
						Execute
						<font-awesome-icon icon="play"></font-awesome-icon>
					</Button>
				</template>
				<Codemirror
					id="sql-answer-cm"
					v-model="internalSqlAnswer"
					:extensions="extensions"
					:style="{ width: '100%' }" />
				<div v-if="rows && !sqlError">
					<DataTable
						ref="executionTableDt"
						v-model:filters="filters"
						:value="rows"
						filter-display="menu"
						show-gridlines
						class="p-datatable-sm"
						:rows="10"
						paginator>
						<template #header>
							<span class="me-2">Rowcount: {{ rows.length }}, showing 10 entries per page.</span>
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
						<Column v-for="(col, index) of columns" :key="index" :field="col" :header="col" sortable />
					</DataTable>
				</div>
				<div v-else>
					<span class="text-400 center">
						{{ sqlError ?? 'An error occured with the execution.' }}
					</span>
				</div>
			</AccordionTab>
			<AccordionTab>
				<template #header>
					<div class="col-12 md:col-10">
						<span for="sql-prefix-header" class="text-400 me-2">(optional)</span>
						<span id="sql-prefix-header">SQL prefix</span>
						<span for="sql-prefix-header" class="text-400 ms-2">
							(this code will be concatenated before the SQL answer, e.g. INSERT INTO or CREATE TABLE to
							temporarily change the database)
						</span>
					</div>
					<Button
						class="ms-2 p-button-secondary"
						@click="
							runAll();
							$event.stopPropagation();
						">
						Execute all
						<font-awesome-icon icon="play"></font-awesome-icon>
					</Button>
				</template>
				<Codemirror
					id="sql-prefix-cm"
					v-model="internalSqlPrefix"
					:extensions="extensions"
					:style="{ width: '100%' }" />
			</AccordionTab>
			<AccordionTab>
				<template #header>
					<div class="col-12 md:col-10">
						<span for="sql-suffix-header" class="text-400 me-2">(optional)</span>
						<span id="sql-suffix-header">SQL suffix</span>
						<span for="sql-suffix-header" class="text-400 ms-2">
							(this code will be concatenated after the SQL answer, typically used when SQL answer is NOT
							select query but update, delete...)
						</span>
					</div>
					<Button
						class="ms-2 p-button-secondary"
						@click="
							runAll();
							$event.stopPropagation();
						">
						Execute all
						<font-awesome-icon icon="play"></font-awesome-icon>
					</Button>
				</template>
				<Codemirror
					id="sql-suffix-cm"
					v-model="internalSqlSuffix"
					:extensions="extensions"
					:style="{ width: '100%' }" />
			</AccordionTab>
			<AccordionTab>
				<template #header>
					<div class="col-12 md:col-10">
						<span for="presentation-query-header" class="text-400 me-2">(optional)</span>
						<span id="presentation-query-header">Presentation query</span>
						<span for="presentation-query-header" class="text-400 ms-2">
							(to be used instead of SQL answer, typically when SQL answer is not select but update,
							delete...)
						</span>
					</div>
					<Button
						class="ms-2 p-button-secondary"
						@click="
							runAll();
							$event.stopPropagation();
						">
						Execute all
						<font-awesome-icon icon="play"></font-awesome-icon>
					</Button>
				</template>
				<Codemirror
					id="sql-presentation-query-cm"
					v-model="internalPresentationQuery"
					:extensions="extensions"
					:style="{ width: '100%' }" />
			</AccordionTab>
			<AccordionTab header="Execution result">
				<div v-if="rows && !sqlError">
					<DataTable
						ref="executionTableDt"
						v-model:filters="filters"
						:value="rows"
						filter-display="menu"
						show-gridlines
						class="p-datatable-sm"
						:rows="10"
						paginator>
						<template #header>
							<span class="me-2">Rowcount: {{ rows.length }}, showing 10 entries per page.</span>
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
						<Column v-for="(col, index) of columns" :key="index" :field="col" :header="col" sortable />
					</DataTable>
				</div>
				<div v-else>
					<span class="text-400 center">
						{{ sqlError ?? 'An error occured with the execution.' }}
					</span>
				</div>
			</AccordionTab>
		</Accordion>
	</div>
</template>
