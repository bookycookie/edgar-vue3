<script setup lang="ts">
import { ref, defineProps, PropType, defineEmits } from 'vue';
import useModelWrapper from '@/composables/modelWrapper';
import { FilterMatchMode } from 'primevue/api';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';

const extensions: Extension[] = [javascript(), oneDark];
const activeIndexes = ref([0, 1, 2, 3]);
const emit = defineEmits([
	'update:assertDeep',
	'update:assertStrict',
	'update:jsonAnswer',
	'update:jsonAltAssertion',
	'update:jsonAltPresentationQuery',
	'update:jsonTestFixture',
	'runJsonAnswer',
	'runJsonAltAssertion',
	'runJsonAltPresentationQuery',
	'runJsonTestFixture',
]);

const executionTableDt = ref();
const exportCSV = () => executionTableDt.value.exportCSV();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});
const props = defineProps({
	assertDeep: { type: Boolean, required: false },
	assertStrict: { type: Boolean, required: false },
	jsonAnswer: {
		type: String,
		required: false,
		default() {
			return;
		},
	},
	jsonAltAssertion: {
		type: String,
		required: false,
		default() {
			return;
		},
	},
	jsonAltPresentationQuery: {
		type: String,
		required: false,
		default() {
			return;
		},
	},
	jsonTestFixture: {
		type: String,
		required: false,
		default() {
			return;
		},
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
	jsonError: {
		type: String,
		required: false,
		default() {
			return;
		},
	},
});

const internalJsonAnswer = useModelWrapper<string>(props, emit, 'jsonAnswer');
const internalJsonAltAssertion = useModelWrapper<string>(props, emit, 'jsonAltAssertion');
const internalJsonAltPresentationQuery = useModelWrapper<string>(props, emit, 'jsonAltPresentationQuery');
const internalJsonTestFixture = useModelWrapper<string>(props, emit, 'jsonTestFixture');
const internalAssertDeep = useModelWrapper<boolean>(props, emit, 'assertDeep');
const internalAssertStrict = useModelWrapper<boolean>(props, emit, 'assertStrict');

const runJsonAnswer = () => {
	emit('runJsonAnswer');
	activeIndexes.value = [4];
};
const runJsonAltAssertion = () => {
	emit('runJsonAltAssertion');
	activeIndexes.value = [4];
};
const runJsonAltPresentationQuery = () => {
	emit('runJsonAltPresentationQuery');
	activeIndexes.value = [4];
};
const runJsonTestFixture = () => {
	emit('runJsonTestFixture');
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
							id="json-question-assert-deep"
							v-model="internalAssertDeep"
							class="me-2"
							binary></Checkbox>
						<label for="json-question-assert-deep">Assert DEEP</label>
					</div>
					<div class="p-inputgroup">
						<Checkbox
							id="json-question-assert-strict"
							v-model="internalAssertStrict"
							class="me-2"
							binary></Checkbox>
						<label for="json-question-assert-strict">Assert STRICT</label>
					</div>
				</div>
			</template>
		</Card>
		<Accordion :active-index="activeIndexes" multiple>
			<AccordionTab>
				<template #header>
					<div class="col-12 md:col-10">
						<span id="json-answer-header">JSON answer</span>
					</div>
					<Button
						class="ms-2 p-button-secondary"
						@click="
							runJsonAnswer();
							$event.stopPropagation();
						">
						Execute
						<font-awesome-icon icon="play" class="ms-2"></font-awesome-icon>
					</Button>
				</template>
				<Codemirror
					id="json-answer-cm"
					v-model="internalJsonAnswer"
					:extensions="extensions"
					:style="{ width: '100%' }" />
			</AccordionTab>
			<AccordionTab>
				<template #header>
					<div class="col-12 md:col-10">
						<span id="json-alt-assertion-header">JSON alt assertion</span>
					</div>
					<Button
						class="ms-2 me-2 p-button-secondary"
						@click="
							runJsonAltAssertion();
							$event.stopPropagation();
						">
						Execute all
						<font-awesome-icon icon="play" class="ms-2"></font-awesome-icon>
					</Button>
				</template>

				<Codemirror
					id="json-alt-assertion-cm"
					v-model="internalJsonAltAssertion"
					:extensions="extensions"
					:style="{ width: '100%' }" />
			</AccordionTab>
			<AccordionTab>
				<template #header>
					<div class="col-12 md:col-10">
						<span id="json-alt-presentation-query-header">JSON alt presentation query</span>
					</div>
					<Button
						class="ms-2 me-2 p-button-secondary"
						@click="
							runJsonAltPresentationQuery();
							$event.stopPropagation();
						">
						Execute all
						<font-awesome-icon icon="play" class="ms-2"></font-awesome-icon>
					</Button>
				</template>
				<Codemirror
					id="json-alt-presentation-query-cm"
					v-model="internalJsonAltPresentationQuery"
					:extensions="extensions"
					:style="{ width: '100%' }" />
			</AccordionTab>
			<AccordionTab>
				<template #header>
					<div class="col-12 md:col-10">
						<span id="json-test-fixture-header">JSON test fixture</span>
					</div>
					<Button
						class="ms-2 me-2 p-button-secondary"
						@click="
							runJsonTestFixture();
							$event.stopPropagation();
						">
						Execute all
						<font-awesome-icon icon="play" class="ms-2"></font-awesome-icon>
					</Button>
				</template>
				<Codemirror
					id="json-test-fixture-cm"
					v-model="internalJsonTestFixture"
					:extensions="extensions"
					:style="{ width: '100%' }" />
			</AccordionTab>
			<AccordionTab header="Execution result">
				<div v-if="rows && !jsonError">
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
						{{ jsonError ?? 'An error occured with the execution.' }}
					</span>
				</div>
			</AccordionTab>
		</Accordion>
	</div>
</template>
