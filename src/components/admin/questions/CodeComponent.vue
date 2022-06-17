<script setup lang="ts">
import { ref, defineProps, PropType, defineEmits, onMounted, watch, toRefs, computed } from 'vue';
import { ProgrammingLanguage } from '@/models/admin/questions/ProgrammingLanguage';
import useModelWrapper from '@/composables/modelWrapper';
import { Codemirror } from 'vue-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';

const extensions = [oneDark];

const props = defineProps({
	languageMode: { type: String, required: false, default: 'text' },
	codePrefix: {
		type: String,
		required: true,
	},
	codeSource: {
		type: String,
		required: true,
	},
	codeSuffix: {
		type: String,
		required: true,
	},
	languages: {
		type: Object as PropType<ProgrammingLanguage[]>,
		required: true,
		default() {
			return [];
		},
	},
	selectedLanguage: {
		type: Object as PropType<ProgrammingLanguage>,
		default() {
			return;
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

// Props to watch
const propsLanguages = toRefs(props).languages;
const cmOptions = toRefs(props).codemirrorOptions;
watch(propsLanguages, (newValue) => {
	internalSelectedLanguage.value = newValue[0];
});

const activeIndexes = ref([1]);

onMounted(() => {
	// All code accordions and open on page load so
	// the CodeMirror component can render its height properly
	// we minimize them afterwards
	// setTimeout(() => {
	// 	activeIndexes.value = [1];
	// }, 1500);
	internalSelectedLanguage.value = props.languages[0];
});

const computedExtensions = computed((): Extension[] => {
	if (!internalSelectedLanguage.value || !internalSelectedLanguage.value.name) return [...extensions, javascript()];

	if (internalSelectedLanguage.value.name.toUpperCase().indexOf('SQL') >= 0) return [...extensions, sql()];

	if (internalSelectedLanguage.value.name.toUpperCase().indexOf('C') >= 0) return [...extensions, cpp()];
	if (internalSelectedLanguage.value.name.toUpperCase().indexOf('JAVA') >= 0) return [...extensions, java()];
	if (internalSelectedLanguage.value.name.toUpperCase().indexOf('PYTHON') >= 0) return [...extensions, python()];

	return extensions;
});

const emit = defineEmits(['update:codePrefix', 'update:codeSource', 'update:codeSuffix', 'update:selectedLanguage']);
const internalCodePrefix = useModelWrapper<string>(props, emit, 'codePrefix');
const internalCodeSource = useModelWrapper<string>(props, emit, 'codeSource');
const internalCodeSuffix = useModelWrapper<string>(props, emit, 'codeSuffix');
const internalSelectedLanguage = useModelWrapper<ProgrammingLanguage>(props, emit, 'selectedLanguage');
</script>

<template>
	<Accordion :active-index="activeIndexes" multiple>
		<AccordionTab header="Code prefix">
			<Codemirror
				v-model="internalCodePrefix"
				:options="cmOptions"
				:extensions="computedExtensions"
				:style="{ width: '100%' }" />
		</AccordionTab>
		<AccordionTab>
			<template #header>
				<span>Code (main) — {{ internalSelectedLanguage?.name }}</span>
			</template>
			<br />
			<div v-if="languages && languages.length > 0" class="p-inputgroup">
				<span class="p-float-label">
					<Dropdown
						id="languages"
						v-model="internalSelectedLanguage"
						:options="languages"
						option-label="name"
						style="max-width: 25%"></Dropdown>
					<label for="languages" class="text-xs text-400">Language</label>
				</span>
			</div>
			<br />
			<div class="p-inputgroup">
				<Codemirror
					v-model="internalCodeSource"
					:options="cmOptions"
					:extensions="computedExtensions"
					:style="{ width: '100%' }" />
			</div>
		</AccordionTab>
		<AccordionTab header="Code suffix">
			<Codemirror
				v-model="internalCodeSuffix"
				:options="cmOptions"
				:extensions="computedExtensions"
				:style="{ width: '100%' }" />
		</AccordionTab>
	</Accordion>
</template>
