<script setup lang="ts">
import { ref, defineProps, PropType, defineEmits } from 'vue';
import { Layout } from '@/models/admin/questions/Layout';
import useModelWrapper from '@/composables/modelWrapper';
import Dialog from 'primevue/dialog';
const emit = defineEmits([
	'update:layout',
	'update:is-active',
	'update:canUpload',
	'save',
	'saveInPlace',
	'clone',
	'delete',
	'disable',
]);

const layoutOptions = ref<Layout[]>([
	{
		name: '1-0',
		layoutLeft: 'col-12 md:col-12 flex',
		layoutRight: 'none',
	},
	{
		name: '1-2',
		layoutLeft: 'col-12 md:col-4 flex',
		layoutRight: 'col-12 md:col-8 flex',
	},
	// default layout
	{
		name: '1-1',
		layoutLeft: 'col-12 md:col-6 flex',
		layoutRight: 'col-12 md:col-6 flex',
	},
	{
		name: '2-1',
		layoutLeft: 'col-12 md:col-8 flex',
		layoutRight: 'col-12 md:col-4 flex',
	},
	{
		name: '0-1',
		layoutLeft: 'none',
		layoutRight: 'col-12 md:col-12 flex',
	},
	{
		name: 'Vert',
		layoutLeft: 'col-12 md:col-12 flex',
		layoutRight: 'col-12 md:col-12 flex',
	},
]);

// TODO: Add sequence prop
const props = defineProps({
	canUpload: {
		type: Boolean,
		required: true,
		default: false,
	},
	isActive: {
		type: Boolean,
		required: true,
	},
	layout: {
		type: Object as PropType<Layout>,
		required: true,
		default() {
			return null;
		},
	},
});

const display = ref(false);
const actionName = ref('');
const actionColor = ref<any>('');
const confirmAction = () => {
	closeConfirmationDialog();
	switch (actionName.value) {
		case 'save':
			emit('save');
			break;
		case 'save in place':
			emit('saveInPlace');
			break;
		case 'delete':
			emit('delete');
			break;
		case 'disable':
			emit('disable');
			break;
		case 'enable':
			emit('disable');
			break;
		case 'clone':
			emit('clone');
			break;
		default:
			break;
	}
};

const showConfirmationDialog = () => (display.value = true);
const closeConfirmationDialog = () => (display.value = false);

const disable = () => {
	actionName.value = props.isActive ? 'disable' : 'enable';
	actionColor.value = props.isActive ? 'warning' : 'success';
	showConfirmationDialog();
};
const save = () => {
	actionName.value = 'save';
	actionColor.value = 'info';
	showConfirmationDialog();
};
const saveInPlace = () => {
	actionName.value = 'save in place';
	actionColor.value = 'success';
	showConfirmationDialog();
};
const clone = () => {
	actionName.value = 'clone';
	actionColor.value = 'primary';
	showConfirmationDialog();
};
const deleteQ = () => {
	actionName.value = 'delete';
	actionColor.value = 'danger';
	showConfirmationDialog();
};
const internalSelectedLayout = useModelWrapper<Layout>(props, emit, 'layout');
const internalCanUpload = useModelWrapper<boolean>(props, emit, 'canUpload');
</script>

<template>
	<div style="display: unset">
		<Dialog v-model:visible="display" :base-z-index="1338">
			<template #header>
				<h3>Please confirm</h3>
			</template>
			Are you sure you want to
			<Tag :severity="actionColor">{{ actionName }}</Tag>
			this question?
			<template #footer>
				<Button @click="confirmAction">
					<font-awesome-icon icon="thumbs-up" class="me-2"></font-awesome-icon>
					Yes!
				</Button>
				<Button class="p-button-secondary" @click="closeConfirmationDialog">
					<font-awesome-icon icon="thumbs-down" class="me-2"></font-awesome-icon>
					No
				</Button>
			</template>
		</Dialog>
		<Card id="toolbar">
			<template #content>
				<div class="grid p">
					<div class="col-12 md:col-3">
						<SelectButton
							v-model="internalSelectedLayout"
							:options="layoutOptions"
							option-label="name"></SelectButton>
					</div>
					<div class="col-12 md:col-3">
						<FileUpload
							v-show="canUpload"
							name="images[]"
							mode="basic"
							url="./upload"
							choose-label="Upload"></FileUpload>
					</div>
					<div class="col-12 md:col-2">
						<!-- TODO: Add paginator -->
						<div class="field-checkbox">
							<SelectButton
								id="internal-can-upload"
								v-model="internalCanUpload"
								:options="[
									{ value: true, label: 'Can upload' },
									{ value: false, label: `Can't upload` },
								]"
								option-label="label"
								option-value="value" />
							<!-- <label for="internal-can-upload">Upload</label> -->
						</div>
					</div>

					<div class="col-12 md:col-4">
						<span class="p-buttonset">
							<Button label="Save" class="p-button p-button p-button-info" @click="save" />
							<Button label="Save In Place" class="p-button-success" @click="saveInPlace" />
							<Button label="Clone" class="p-button-primary" @click="clone" />
							<Button label="Delete" class="p-button-danger" @click="deleteQ" />
							<Button
								:label="isActive ? 'Disable' : 'Enable'"
								:class="isActive ? 'p-button-warning' : 'p-button-success'"
								@click="disable" />
						</span>
					</div>
				</div>
			</template>
		</Card>
	</div>
</template>

<style scoped>
#toolbar {
	position: sticky !important;
	position: -webkit-sticky;
	top: 0 !important;
	z-index: 2;
}
</style>
