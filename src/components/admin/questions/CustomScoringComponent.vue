<script setup lang="ts">
import { ref, defineProps, PropType, defineEmits, onMounted } from 'vue';
import useModelWrapper from '@/composables/modelWrapper';
import ApiService from '@/services/ApiService';
import { ProgrammingLanguage } from '@/models/admin/questions/ProgrammingLanguage';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';

const extensions: Extension[] = [javascript(), oneDark];
const emit = defineEmits(['update:dataObject']);

const service = new ApiService();
const props = defineProps({
	evalScript: {
		type: String,
		required: true,
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
		default() {
			return {};
		},
	},
	courseId: {
		type: Number,
		required: true,
	},
	programmingLanguages: {
		type: Object as PropType<ProgrammingLanguage[]>,
		required: true,
		default() {
			return [];
		},
	},
	code: {
		type: String,
		required: false,
		default: '',
	},
	freeTextAnswer: {
		type: String,
		required: false,
		default: '',
	},
	questionId: {
		type: Number,
		required: true,
	},
});

onMounted(async () => {
	await new Promise(console.log);
});

const evaluateScoringScript = async () => {
	const evaluationResponse = await service.postAsync('/question/evalscript', {
		courseId: props.courseId,
		evalScript: internalEvalScript.value,
		questionId: props.questionId,
		code: props.code,
		freeTextAnswer: props.freeTextAnswer,
		programmingLanguageId: selectedProgrammingLanguage.value?.id,
	});

	console.table(evaluationResponse);

	if (evaluationResponse.data.success) {
		evaluatedDataObject.value = evaluationResponse.data.data.data_object;
		evaluatedDataObjectLog.value = evaluationResponse.data.data.log;
	} else {
		evaluatedDataObject.value = evaluationResponse.error.message;
		evaluatedDataObjectLog.value = '';
	}
};

//! TODO: MAP THE EVALUATION
const evaluatedDataObject = ref(`Evaluate the data object to see the result.`);

const evaluatedDataObjectLog = ref('Evaluate the data object to see the result log.');

const selectedProgrammingLanguage = ref<ProgrammingLanguage>();
const internalEvalScript = useModelWrapper<string>(props, emit, 'evalScript');
</script>

<template>
	<div id="template-data-component">
		<Accordion :active-index="0">
			<AccordionTab header="Custom scoring script">
				<div class="grid p-fluid">
					<div class="col-12 md:col-6 flex">
						<div class="p-inputgroup">
							<Card style="width: 100%">
								<template #content>
									<Codemirror
										v-model="internalEvalScript"
										:options="{ ...codemirrorOptions, mode: 'text/typescript' }"
										:extensions="extensions"
										:style="{ width: '100%' }" />
									<Button
										v-tooltip.bottom="'Evaluate scoring script'"
										class="p-button-success"
										@click="evaluateScoringScript">
										<font-awesome-icon icon="gears" />
									</Button>
								</template>
							</Card>
						</div>
					</div>
					<div class="col-12 md:col-6 flex">
						<div class="p-inputgroup">
							<Card style="width: 100%">
								<template #content>
									<pre v-html="evaluatedDataObject"></pre>
								</template>
							</Card>
						</div>
					</div>
					<div class="col-12 md:col-4 flex">
						<div class="p-inputgroup">
							<Card style="width: 100%">
								<template #content>
									<pre v-html="evaluatedDataObjectLog"></pre>
								</template>
							</Card>
						</div>
					</div>
				</div>
			</AccordionTab>
		</Accordion>
	</div>
</template>
