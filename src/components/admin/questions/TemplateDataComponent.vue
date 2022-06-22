<script setup lang="ts">
import { ref, defineProps, PropType, defineEmits, onMounted } from 'vue';
import useModelWrapper from '@/composables/modelWrapper';
import ApiService from '@/services/ApiService';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import CONSTANTS from '@/config/constants';

const extensions: Extension[] = [javascript(), oneDark];
const emit = defineEmits(['update:dataObject']);

const service = new ApiService();
const props = defineProps({
	dataObject: {
		type: String,
		required: true,
	},
});

//! TODO FINISH ME
onMounted(async () => {
	await new Promise(console.log);
});

const evaluateDataObject = async () => {
	const evaluationResponse = await service.postAsync('/question/evaldo', {
		courseId: CONSTANTS.COURSE_ID,
		dataObject: internalDataObject.value,
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

const evaluatedDataObject = ref(`Evaluate the data object to see the result.`);

const evaluatedDataObjectLog = ref('Evaluate the data object to see the result log.');

const internalDataObject = useModelWrapper<string>(props, emit, 'dataObject');
</script>

<template>
	<div id="template-data-component">
		<Accordion :active-index="0">
			<AccordionTab header="Template data object">
				<div class="grid p-fluid">
					<div class="col-12 md:col-4 flex">
						<div class="p-inputgroup">
							<Card style="width: 100%">
								<template #content>
									<Codemirror
										v-model="internalDataObject"
										:extensions="extensions"
										:style="{ width: '100%' }" />
									<Button
										v-tooltip.bottom="'Evaluate data object'"
										class="p-button-success"
										@click="evaluateDataObject">
										<font-awesome-icon icon="gears" />
									</Button>
								</template>
							</Card>
						</div>
					</div>
					<div class="col-12 md:col-4 flex">
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
