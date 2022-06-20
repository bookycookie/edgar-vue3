<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import ApiService from '@/services/ApiService';
import { Codemirror } from 'vue-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

const toast = useToast();
const service = new ApiService();
const courseId = 2000;

onMounted(async () => {
	const dataObjects = await service.getManyAsync<any>('/data_object', { courseId: courseId });

	globalDataObject.value = dataObjects[0].data_object;
	courseDataObject.value = dataObjects[1].data_object;
});

const extensions = [javascript(), oneDark];

const globalDataObject = ref(``);
const courseDataObject = ref(``);

const saveCourseDataObject = async () => {
	service
		.postAsync('/data_object/save', {
			dataObject: courseDataObject.value,
			courseId: courseId,
		})
		.then(() => {
			toast.add({
				severity: 'success',
				summary: '200 OK',
				detail: `Course data object updated successfully.`,
				life: 3000,
			});
		})
		.catch(() => {
			toast.add({
				severity: 'error',
				summary: '500 Server Error',
				detail: `Course data object updated failed.`,
				life: 3000,
			});
		});
};
</script>
<template>
	<div class="container-fluid">
		<Toast />
		<Toast />
		<br />
		<div class="grid p-fluid">
			<div class="col-12 md:col-6 flex">
				<Card style="width: 100%" class="ms-2">
					<template #title>
						<h4>Global data object (can't touch this):</h4>
					</template>
					<template #content>
						<Codemirror
							v-model="globalDataObject"
							disabled
							:extensions="extensions"
							:style="{ width: '100%' }" />
					</template>
				</Card>
			</div>
			<div class="col-12 md:col-6 flex">
				<Card style="width: 100%" class="me-2">
					<template #title>
						<h4>
							Course's data object (careful not to impact existing questions and not to bloat the object):
						</h4>
					</template>
					<template #content>
						<Button label="Save" style="width: 10%" @click="saveCourseDataObject" />
						<Codemirror
							v-model="courseDataObject"
							:indent-with-tab="false"
							:extensions="extensions"
							:style="{ width: '100%' }" />
					</template>
				</Card>
			</div>
		</div>
	</div>
</template>
