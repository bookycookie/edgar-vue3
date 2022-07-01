<script setup lang="ts">
import { ref, defineProps, PropType, defineEmits, onMounted, computed } from 'vue';
import useModelWrapper from '@/composables/modelWrapper';
import ApiService from '@/services/ApiService';
import { ProgrammingLanguage } from '@/models/admin/questions/ProgrammingLanguage';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import CONSTANTS from '@/config/constants';

const extensions: Extension[] = [javascript(), oneDark];
const emit = defineEmits(['update:dataObject']);

const service = new ApiService();
const props = defineProps({
	evalScript: {
		type: String,
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
	selectedProgrammingLanguage.value = props.programmingLanguages[0];
});

const evaluateScoringScript = async () => {
	const evaluationResponse = await service.postAsync('/question/evalscript', {
		courseId: CONSTANTS.COURSE_ID,
		evalScript: internalEvalScript.value,
		questionId: props.questionId,
		code: props.code,
		freeTextAnswer: dummyFreeText.value,
		programmingLanguageId: selectedProgrammingLanguage.value?.id,
	});

	isEvaluated.value = true;

	if (evaluationResponse.data.success) {
		evaluatedObject.value = JSON.stringify(evaluationResponse.data.data, null, 4);
		evaluatedScoreObject.value = JSON.stringify(evaluationResponse.data.data.score, null, 4);
		evaluatedScript.value = 'Score is: \n';
		evaluatedScript.value += evaluatedScoreObject.value;
	} else {
		evaluatedScript.value = evaluationResponse.data.error.message;
	}
};

const evaluatedScript = ref(`Evaluate the script to see the result.`);
const evaluatedObject = ref('');
const evaluatedScoreObject = ref('');
const isEvaluated = ref(false);

const dummyFreeText = ref('');

const selectedProgrammingLanguage = ref<ProgrammingLanguage>();
const internalEvalScript = useModelWrapper<string>(props, emit, 'evalScript');

const isShowingEntireObject = ref(false);

const toggleEvalScript = () => {
	if (!evaluatedObject.value || !evaluatedScoreObject.value) return;

	if (isShowingEntireObject.value) {
		evaluatedScript.value = 'Score is: \n';
		evaluatedScript.value += evaluatedScoreObject.value;
		isShowingEntireObject.value = false;
		return;
	}
	isShowingEntireObject.value = true;
	evaluatedScript.value = evaluatedObject.value;
};
</script>

<template>
	<div id="template-data-component">
		<Accordion :active-index="0">
			<AccordionTab>
				<template #header>
					<span class="me-5">Custom scoring script</span>
					<span class="p-float-label script-language-dropdown mt-2">
						<Dropdown
							id="script-programming-language"
							v-model="selectedProgrammingLanguage"
							style="min-width: 15rem"
							:options="programmingLanguages"
							option-label="name"
							class=""
							:placeholder="selectedProgrammingLanguage?.name"
							@click="$event.stopPropagation()" />
						<label for="question-type" class="text-xs">Script language</label>
					</span>
				</template>
				<div class="grid p-fluid">
					<div class="col-12 md:col-6 flex">
						<div class="p-inputgroup">
							<Card style="width: 100%">
								<template #content>
									<div class="p-inputgroup">
										<Codemirror
											v-model="internalEvalScript"
											:extensions="extensions"
											:style="{ width: '100%' }" />
									</div>
									<div class="p-inputgroup">
										<Button
											v-tooltip.bottom="'Evaluate scoring script'"
											class="p-button-success"
											@click="evaluateScoringScript">
											<font-awesome-icon icon="gears" />
										</Button>
									</div>
									<div class="p-inputgroup mt-2">
										<Textarea
											v-model="dummyFreeText"
											placeholder="Dummy free text answer"></Textarea>
									</div>
								</template>
							</Card>
						</div>
					</div>
					<div class="col-12 md:col-6 flex">
						<div class="p-inputgroup">
							<Card style="width: 100%">
								<template #content>
									<pre v-html="evaluatedScript"></pre>
									<div v-if="isEvaluated" class="p-inputgroup">
										<Button
											:label="
												isShowingEntireObject
													? 'Click to show score'
													: 'Click to show entire object'
											"
											@click="toggleEvalScript" />
									</div>
								</template>
							</Card>
						</div>
					</div>
				</div>
			</AccordionTab>
		</Accordion>
	</div>
</template>

<style scoped>
.script-language-dropdown {
	position: relative;
	left: 69%;
}
</style>
