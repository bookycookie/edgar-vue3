<script setup lang="ts">
import { ref, defineProps, PropType, defineEmits, onMounted } from 'vue';
import { TestItem } from '@/models/admin/questions/TestItem';
import { ProgrammingLanguage } from '@/models/admin/questions/ProgrammingLanguage';
import { RuntimeConstraint } from '@/models/admin/questions/RuntimeConstraint';
import useModelWrapper from '@/composables/modelWrapper';
// import { CmComponentRef } from 'codemirror-editor-vue3';
import { Codemirror } from 'vue-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import ApiService from '@/services/ApiService';

type GeneratorOption = {
	id: number;
	name: string;
};

const service = new ApiService();

const extensions: Extension[] = [cpp(), oneDark];

// const cmRefDom = ref<CmComponentRef[]>([]);
const emit = defineEmits(['update:items', 'update:constraints']);
const props = defineProps({
	items: {
		type: Object as PropType<TestItem[]>,
		required: true,
		default() {
			return [];
		},
	},
	languages: {
		type: Object as PropType<ProgrammingLanguage[]>,
		required: true,
		default() {
			return [];
		},
	},
	showConstraints: {
		type: Boolean,
		required: true,
		default: false,
	},
	constraints: {
		type: Object as PropType<RuntimeConstraint[]>,
		required: true,
		default() {
			return [];
		},
	},
	codemirrorOptions: {
		type: Object as PropType<{
			mode: string;
			theme: string;
			lineNumbers: boolean;
			smartIndent: boolean;
			foldGutter: boolean;
			styleActiveLine: boolean;
			viewportMargin: number;
			indentUnit: number;
			tabSize: number;
			indentWithTabs: boolean | undefined;
		}>,
		required: true,
	},
});

const internalItems = useModelWrapper<TestItem[]>(props, emit, 'items');
const internalConstraints = useModelWrapper<RuntimeConstraint[]>(props, emit, 'constraints');

const generatorOptions = ref<GeneratorOption[]>([
	{ id: 1, name: 'integer — number' },
	{ id: 2, name: 'float — number' },
	{ id: 3, name: 'fixed & alpha — text' },
	{ id: 4, name: 'fixed & all printable — text' },
	{ id: 5, name: 'range & alpha — text' },
	{ id: 6, name: 'range & all printable — text' },
]);
const generatorOption = ref<GeneratorOption>(generatorOptions.value[0]);

const range = (size: number) => [...Array(size).keys()];
const indexes = ref<number[]>([]);
const toggleItems = () => {
	if (indexes.value.length === 0) indexes.value = range(internalItems.value.length);
	else indexes.value = [];
};
const toggleButton = (e: Event) => {
	e.stopPropagation();
	toggleItems();
};

// TODO: Implement button logic
const cloneButton = (index: number) => {
	// TODO: Replace with Node 17's structuredClone
	// internalItems.value.push(structuredClone(internalItems.value[index]));
	console.log(`Cloned ${index}!`);
	const clone = Object.assign({}, internalItems.value[index]);
	internalItems.value.push(clone);
	indexes.value.push(internalItems.value.length);
	document.getElementById('add-button-hack')?.scrollIntoView();
	// refreshCodemirrors();
};

const removeButton = (index: number) => {
	console.log(`Removed ${index}!`);
	internalItems.value.splice(index, 1);
	console.log(`Current amount of items: ${internalItems.value.length}`);
};

const addButton = () => {
	const placeholder: TestItem = {
		id_programming_language: 4,
		c_test_type_id: 1,
		percentage: 100.0,
		allow_diff_order: true,
		allow_diff_letter_size: true,
		trim_whitespace: true,
		comment: '',
		regex_override: 'test',
		input: '1',
		output: 'Added :) -- Need to ask about placeholder values',
		generator_test_file_id: 1,
		arguments: 'null',
		description: 'null',
		random_test_type_id: 1,
		low_bound: 1,
		upper_bound: 2,
		elem_count: 3,
		random_test_type_name: 'null',
		id: 696969,
		is_public: true,
	};
	internalItems.value.push(placeholder);
	indexes.value.push(internalItems.value.length);
	// refreshCodemirrors();

	document.getElementById('add-button-hack')?.scrollIntoView({ behavior: 'smooth' });
};
onMounted(() => {
	// refreshCodemirrors();
	// toggleItems();
});

const generatorOutput = ref('');

const generate = async (typeId?: number, lowBound?: number, upBound?: number, elemCount?: number) => {
	if (!typeId || !lowBound || !upBound || !elemCount) return;
	const response: any = await service.postAsync('/trygenerator', {
		randType: typeId,
		low: lowBound,
		up: upBound,
		count: elemCount,
	});

	generatorOutput.value = response.data.inputs;
};
</script>

<template>
	<Card>
		<template #header>
			<div class="grid col-12">
				<h4 class="col-12 md:col-10 ms-2 mt-2">Test items — {{ internalItems.length }}</h4>
				<Button
					v-if="internalItems.length > 0"
					class="col-12 md:col-1"
					:label="indexes.length === 0 ? 'Show all items' : 'Collapse all items'"
					style="z-index: 1000"
					@click="toggleButton"></Button>
			</div>
		</template>
		<template #content>
			<Accordion v-model:activeIndex="indexes" multiple>
				<AccordionTab v-for="(item, index) in internalItems" :key="item.id">
					<template #header>
						<div class="grid col-12">
							<span class="col-12 md:col-1">
								Test item
								<span class="badge bg-primary ms-2">
									{{ index + 1 }}
								</span>
							</span>

							<span class="col-12 md:col-3">
								Deduct(%) when incorrect:
								<InputNumber
									v-model="item.percentage"
									:min="0"
									:max="100"
									:min-fraction-digits="2"
									:max-fraction-digits="2"
									:step="0.01"
									class="ms-1"
									style="max-height: 2rem; max-width: 1rem"
									@click="$event.stopPropagation()" />
							</span>
							<span class="col-12 md:col-7">
								<Button
									v-tooltip.top="{
										value: item.is_public ? 'Public test case' : 'Private test case',
									}"
									@click="
										item.is_public = !item.is_public;
										$event.stopPropagation();
									">
									<font-awesome-icon :icon="item.is_public ? 'eye' : 'eye-slash'" class="ms-2" />
								</Button>
							</span>
							<Button
								v-tooltip.top="'Clone item'"
								class="col-12 md:col-1 p-button-info me-2"
								icon="pi pi-clone"
								style="z-index: 1000"
								@click="
									cloneButton(index);
									$event.stopPropagation();
								"></Button>
							<Button
								v-tooltip.top="'Remove item'"
								class="col-12 md:col-1 p-button-danger"
								icon="pi pi-times"
								style="z-index: 1000"
								@click="
									removeButton(index);
									$event.stopPropagation();
								"></Button>
						</div>
					</template>
					<TabView>
						<TabPanel header="Details">
							<div>
								<div class="grid">
									<div class="col-12 md:col-3">
										<p>1. Type</p>
										<Divider></Divider>
										<div class="p-inputgroup">
											<RadioButton
												id="fixed-test-case"
												v-model="item.c_test_type_id"
												:value="1"
												class="me-2"></RadioButton>
											<label for="fixed-test-case" class="me-5">1. Fixed</label>
											<RadioButton
												id="random-test-case"
												v-model="item.c_test_type_id"
												:value="2"
												class="me-2"></RadioButton>
											<label for="random-test-case">2. Random</label>
										</div>
									</div>
									<Divider layout="vertical" />
									<div class="col-12 md:col-5" style="min-height: 26rem">
										<p>2. Settings</p>
										<Divider></Divider>
										<br />
										<div v-if="item.c_test_type_id == 1">
											<div class="p-inputgroup">
												<label for="input-settings-test-case" class="text-xs">Input</label>
											</div>
											<div class="p-inputgroup">
												<Codemirror
													id="input-settings-test-case"
													ref="cmRefDom"
													v-model="item.input"
													class="me-2 mb-2"
													:options="codemirrorOptions"
													:extensions="extensions"
													:style="{ width: '100%' }" />
											</div>
											<br />
											<br />
											<div class="p-inputgroup">
												<label for="output-settings-test-case" class="text-xs">Output</label>
											</div>
											<div class="p-inputgroup">
												<Codemirror
													id="output-settings-test-case"
													ref="cmRefDom"
													v-model="item.output"
													class="me-2 mb-2"
													:options="codemirrorOptions"
													:extensions="extensions"
													:style="{ width: '100%' }" />
											</div>
										</div>
										<div v-else-if="item.c_test_type_id == 2">
											<div class="p-inputgroup mb-4">
												<Button
													label="Generate"
													:disabled="!item.low_bound || !item.upper_bound || !item.elem_count"
													class="p-button-success"
													@click="
														generate(
															generatorOption.id,
															item.low_bound,
															item.upper_bound,
															item.elem_count,
														)
													" />
											</div>
											<br />
											<div class="p-inputgroup">
												<span class="p-float-label">
													<Dropdown
														id="generator"
														v-model="generatorOption"
														option-label="name"
														:options="generatorOptions"></Dropdown>
													<label for="generator" class="text-xs text-400">
														Generator type
													</label>
													<Chip
														v-if="generatorOption.name.includes('text')"
														v-tooltip.top="
															'Number of characters will be a random number between boundaries'
														"
														class="ml-2"
														style="background: transparent">
														<font-awesome-icon icon="circle-question"></font-awesome-icon>
													</Chip>
												</span>
											</div>
											<br />
											<br />
											<div class="p-inputgroup">
												<span class="p-float-label">
													<InputNumber
														id="lower-bound-settings-test-case"
														v-model="item.low_bound"
														:step="0.01"></InputNumber>
													<label
														for="lower-bound-settings-test-case"
														class="text-xs text-400">
														Lower bound
													</label>
												</span>
											</div>
											<br />
											<br />
											<div class="p-inputgroup">
												<span class="p-float-label">
													<InputNumber
														id="upper-bound-settings-test-case"
														v-model="item.upper_bound"
														:step="0.01"></InputNumber>
													<label
														for="upper-bound-settings-test-case"
														class="text-xs text-400">
														Upper bound
													</label>
												</span>
											</div>
											<br />
											<br />
											<div class="p-inputgroup">
												<span class="p-float-label">
													<InputNumber
														id="elements-settings-test-case"
														v-model="item.elem_count"
														:min="0"
														:step="1"></InputNumber>
													<label for="elements-settings-test-case" class="text-xs text-400">
														Number of elements
													</label>
												</span>
											</div>
											<Divider />
											<br />
											<div v-if="generatorOutput" class="p-inputgroup">
												<pre v-html="generatorOutput"></pre>
											</div>
										</div>
									</div>
									<Divider layout="vertical" />
									<div class="col-12 md:col-3">
										<p>3. Grading options</p>
										<Divider></Divider>
										<div class="p-inputgroup mb-2">
											<Checkbox
												id="allow-different-order"
												v-model="item.allow_diff_order"
												:binary="true"
												:disabled="item.regex_override"></Checkbox>
											<label for="allow-different-order" class="ms-2">
												Allow different elements order (NOT TESTED)
											</label>
										</div>
										<div class="p-inputgroup mb-2">
											<Checkbox
												id="case-insensitive"
												v-model="item.allow_diff_letter_size"
												:binary="true"
												:disabled="item.regex_override"></Checkbox>
											<label for="case-insensitive" class="ms-2">Case insensitive</label>
										</div>
										<div class="p-inputgroup mb-2">
											<Checkbox
												id="trim-trailing-whitespace"
												v-model="item.trim_whitespace"
												:binary="true"
												:disabled="item.regex_override"></Checkbox>
											<label for="trim-trailing-whitespace" class="ms-2">
												Trim trailing whitespaces
											</label>
										</div>
										<Divider></Divider>
										<br />
										<div class="p-inputgroup">
											<span class="p-float-label">
												<Textarea
													id="regular-expressions-grading-options"
													v-model="item.regex_override"
													class="text-area me-2"
													:auto-resize="true" />
												<label
													for="regular-expressions-grading-options"
													class="text-xs text-400">
													Regular expression (overrides/ignores the former three options):
												</label>
											</span>
										</div>
									</div>
								</div>
								<div>
									<Divider />
									<h6>Comment</h6>
									<Codemirror
										ref="cmRefDom"
										v-model="item.comment"
										class="me-2"
										:options="codemirrorOptions"
										:extensions="extensions"
										:style="{ width: '100%' }" />
								</div>
							</div>
						</TabPanel>
						<TabPanel v-if="true" header="Constraints">
							<TabView>
								<TabPanel v-for="language in languages" :key="language.id" :header="language.name">
									<DataTable :value="internalConstraints" show-gridlines>
										<Column field="constraint_id" header="Id" sortable>
											<template #body="{ data }">
												<div class="number-align">
													{{ data.constraint_id }}
												</div>
											</template>
										</Column>
										<Column field="constraint_name" header="constraint" sortable></Column>
										<Column field="constraint_value" header="value">
											<template #body="{ data }">
												<!-- TODO: Resolve this 'string' to boolean when saving -->
												<div
													v-if="typeof data.constraint_value === 'boolean'"
													class="p-inputgroup">
													<RadioButton
														id="fixed-test-case"
														v-model="data.constraint_value"
														:value="true"
														class="me-2"></RadioButton>
													<label for="fixed-test-case" class="me-5">true</label>
													<RadioButton
														id="fixed-test-case"
														v-model="data.constraint_value"
														:value="false"
														class="me-2"></RadioButton>
													<label for="fixed-test-case" class="me-5">false</label>
													<!-- TODO: Change default to true default -->
													<RadioButton
														id="fixed-test-case"
														v-model="data.value"
														:value="false"
														class="me-2"></RadioButton>
													<label for="fixed-test-case" class="me-5">default</label>
												</div>
												<InputNumber
													v-else-if="typeof data.value === 'number'"
													v-model="data.constraint_value"
													:min="0"
													:step="0.01"
													show-buttons
													decrement-button-class="p-button-info"
													increment-button-class="p-button-info"
													increment-button-icon="pi pi-plus"
													decrement-button-icon="pi pi-minus"
													class="me-2"
													style="max-height: 2.25rem; max-width: 6rem" />
											</template>
										</Column>
										<Column field="constraint_value" header="current value" sortable>
											<template #body="{ data }">
												<div class="number-align">
													<!-- TODO: Resolve this 'string' to boolean when saving -->
													<font-awesome-icon
														v-if="typeof data.constraint_value === 'boolean'"
														:icon="data.constraint_value ? 'check-circle' : 'times-circle'"
														:class="data.constraint_value ? 'success' : 'failure'"
														class="icon" />

													<span v-else-if="typeof data.value === 'number'">
														{{ data.constraint_value }}
														{{ data.j0_unit_type }}
													</span>
												</div>
											</template>
										</Column>
									</DataTable>
								</TabPanel>
							</TabView>
						</TabPanel>
					</TabView>
				</AccordionTab>
			</Accordion>
		</template>
		<!-- TODO: Implement adding functionality -->
		<br />
		<template #footer>
			<Button id="add-button-hack" p-button-outlined @click="addButton">Add new test item</Button>
		</template>
		<!-- </AccordionTab>
  </Accordion> -->
	</Card>
</template>
