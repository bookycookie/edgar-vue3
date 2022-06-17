<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';
// import { cpp } from '@codemirror/lang-cpp';
// import { javascript } from '@codemirror/lang-javascript';
// import { java } from '@codemirror/lang-java';
// import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import { Coderunner } from '@/models/admin/playground/Coderunner';
import { Snippet } from '@/models/admin/playground/Snippet';
import { SnippetId } from '@/models/admin/playground/SnippetId';
import Menu from 'primevue/menu';
import ApiService from '@/services/ApiService';
import Dialog from 'primevue/dialog';
import { useRouter } from 'vue-router';
import RouteNames from '@/router/routes';
const router = useRouter();

type CodeResponse = {
	code: string;
};

const props = defineProps({
	// eslint-disable-next-line vue/require-default-prop
	id: {
		type: Number,
		required: false,
	},
});

watch(
	() => props.id,
	async () => {
		router.isReady().then(async () => await getQueryDataAsync());
	},
);

const courseId = 155;
const studentId = 23;
const service = new ApiService();

//? Currently hard-coded to be SQL on edgar
const extensions: Extension[] = [sql(), oneDark];

const coderunners = ref<Coderunner[]>([]);
const coderunner = ref<Coderunner>();

const snippets = ref<Snippet[]>([]);
const snippetId = ref<SnippetId | null>(null);

const code = ref('');

const getQueryDataAsync = async () => {
	snippetId.value = await service.getSingleAsync<SnippetId>('/playground/snippet/id', {
		courseId: courseId,
		studentId: studentId,
		snippetId: props.id,
	});
};

onMounted(async () => {
	const promises = [];
	if (props.id) promises.push(getQueryDataAsync());
	else {
		const coderunnerPromise = service
			.getManyAsync<Coderunner>('/playground/coderunners', { courseId: courseId })
			.then((runners: Coderunner[]) => {
				coderunners.value = runners;
				coderunner.value = runners[0];
			});
		promises.push(coderunnerPromise);
	}
	const snippetPromise = service
		.getManyAsync<Snippet>('/playground/snippets', {
			courseId: courseId,
			studentId: studentId,
		})
		.then((s: Snippet[]) => (snippets.value = s));

	promises.push(snippetPromise);

	await Promise.all(promises);
});

const openSnippetMenu = ref();
const toggleOpenSnippetMenu = (event: any) => {
	openSnippetMenu.value.toggle(event);
};
const openSnippetAsync = async (snippet: Snippet) => {
	openSnippetMenu.value.toggle();
	const response = await service.getSingleAsync<CodeResponse>('/playground/snippet', {
		courseId: courseId,
		studentId: studentId,
		snippetId: snippet.id,
	});
	code.value = response?.code ?? '';
};
const insertSnippetMenu = ref();
const toggleInsertSnippetMenu = (event: any) => {
	insertSnippetMenu.value.toggle(event);
};
const insertSnippetAsync = async (snippet: Snippet) => {
	insertSnippetMenu.value.toggle();

	const response = await service.getSingleAsync<CodeResponse>('/playground/snippet', {
		courseId: courseId,
		studentId: studentId,
		snippetId: snippet.id,
	});
	code.value += response?.code ?? '';
};

const rows = ref();
const columns = ref<string[]>();
const sqlError = ref('');

const executeAsync = async (code: string | undefined, codeRunnerId: number | undefined) => {
	if (!code || !codeRunnerId) return;
	await service
		.postAsync('/playground/execute', {
			codeRunnerId: codeRunnerId,
			code: code,
		})
		.then((response: any) => {
			if (!response.data.success && response.data.error) {
				sqlError.value = response.data.error.message;
				return;
			}
			sqlError.value = '';

			console.log(response);

			const headers = response.data.data.fields.map((f: any) => f.name);
			columns.value = headers;
			const rows2 = response.data.data.rows;
			const cs = [];
			for (let index = 0; index < headers.length; index++) {
				cs.push(`C${index}`);
			}

			const tmp2: any[] = [];
			for (let index = 0; index < rows2.length; index++) {
				const r = rows2[index];
				let tmp: any[] = [];
				for (let idx = 0; idx < cs.length; idx++) {
					const c = cs[idx];
					tmp.push(r[c as keyof {}]);
				}
				tmp2.push(tmp);
			}

			rows.value = tmp2.map((row): any =>
				row.reduce((result: { [x: string]: any }, field: any, index: number) => {
					result[headers[index]] = field;
					return result;
				}, {}),
			);
		});
};

const saveAsName = ref('');
const showSaveAsDialog = ref(false);
const saveAsAsync = async () => {
	showSaveAsDialog.value = false;
	await service
		.postAsync('/playground/saveas', {
			title: saveAsName.value,
			code: code.value,
			codeRunnerId: coderunner.value?.id,
			studentId: studentId,
			courseId: courseId,
		})
		.then((response: any) => {
			const newId = parseInt(response.data.rows[0].id);
			router.push({ name: RouteNames.CodeSandboxAdmin, params: { id: newId } });
		});
};

const deleteAsync = async () => {
	await service.postAsync('/playground/delete/id', { snippetId: props.id, studentId: studentId });
	router.push({ name: RouteNames.CodeSandboxAdmin });
};

const publishAsync = async () => {
	await service.postAsync('/playground/publish/id', { snippetId: props.id, studentId: studentId });
};
</script>

<template>
	<div class="container-fluid">
		<Dialog v-model:visible="showSaveAsDialog" :base-z-index="1338" class="w-25">
			<template #header>
				<h3>Save code snippet</h3>
			</template>
			<div>
				<span class="p-float-label mt-4">
					<InputText v-model="saveAsName" class="w-100"></InputText>
					<label for="title">Snippet name</label>
				</span>
				<br />
				<p class="text-xs text-500">Snippets with the same name will be overwritten.</p>
			</div>

			<template #footer>
				<Button @click="saveAsAsync()">
					<font-awesome-icon icon="thumbs-up" class="me-2"></font-awesome-icon>
					Save!
				</Button>
				<Button class="p-button-secondary" @click="showSaveAsDialog = false">
					<font-awesome-icon icon="thumbs-down" class="me-2"></font-awesome-icon>
					Cancel
				</Button>
			</template>
		</Dialog>
		<Card v-if="!props.id" style="min-height: 50rem">
			<template #title>Sandbox</template>
			<template #content>
				<SelectButton v-model="coderunner" :options="coderunners" option-label="name"></SelectButton>
				<div class="edgar-right-overlap-menu">
					<Button
						label="Run"
						class="p-button-success w-100 mb-1"
						style="display: block"
						@click="executeAsync(code, coderunner?.id)" />
					<Button
						label="Save As"
						class="p-button-primary w-100 mb-1"
						style="display: block"
						@click="showSaveAsDialog = true" />
					<Button
						label="Open snippet"
						class="p-button-primary w-100 mb-1"
						style="display: block"
						icon="pi pi-angle-down"
						icon-pos="left"
						@click="toggleOpenSnippetMenu" />
					<Menu ref="openSnippetMenu" :model="snippets" popup>
						<template #item="{ item }">
							<span class="m-3 hand-cursor highlight-span" @click="openSnippet(item)">
								{{ item.label }}
							</span>
						</template>
					</Menu>
					<Button
						label="Insert snippet"
						class="p-button-primary w-100 mb-1"
						style="display: block"
						icon="pi pi-angle-down"
						icon-pos="left"
						@click="toggleInsertSnippetMenu" />
					<Menu ref="insertSnippetMenu" :model="snippets" popup>
						<template #item="{ item }">
							<span class="m-3 hand-cursor highlight-span" @click="insertSnippetAsync(item)">
								{{ item.label }}
							</span>
						</template>
					</Menu>
				</div>
			</template>
			<template #footer>
				<Codemirror v-model="code" :extensions="extensions" :style="{ width: '100%', minHeight: '22rem' }" />
				<br />
				<div v-if="rows && !sqlError">
					<DataTable
						ref="executionTableDt"
						:value="rows"
						filter-display="menu"
						show-gridlines
						class="p-datatable-sm"
						:rows="10"
						paginator>
						<template #header>
							<span class="me-2">Rowcount: {{ rows.length }}, showing 10 entries per page.</span>
						</template>
						<Column v-for="(col, index) of columns" :key="index" :field="col" :header="col" sortable />
					</DataTable>
				</div>
				<h3 v-else class="center">{{ sqlError }}</h3>
			</template>
		</Card>
		<Card v-else-if="props.id && snippetId" style="min-height: 50rem">
			<template #title>Sandbox</template>
			<template #content>
				<Button :label="snippetId?.name" />
				<div class="edgar-right-overlap-menu">
					<Button
						label="Run"
						class="p-button-success w-100 mb-1"
						style="display: block"
						@click="executeAsync(snippetId?.code, snippetId?.id_code_runner)" />
					<Button
						label="Save As"
						class="p-button-primary w-100 mb-1"
						style="display: block"
						@click="showSaveAsDialog = true" />
					<Button
						label="Open snippet"
						class="p-button-primary w-100 mb-1"
						style="display: block"
						icon="pi pi-angle-down"
						icon-pos="left"
						@click="toggleOpenSnippetMenu" />
					<Menu ref="openSnippetMenu" :model="snippets" popup>
						<template #item="{ item }">
							<span class="m-3 hand-cursor highlight-span" @click="openSnippetAsync(item)">
								{{ item.label }}
							</span>
						</template>
					</Menu>
					<Button
						label="Insert snippet"
						class="p-button-primary w-100 mb-1"
						style="display: block"
						icon="pi pi-angle-down"
						icon-pos="left"
						@click="toggleInsertSnippetMenu" />
					<Menu ref="insertSnippetMenu" :model="snippets" popup>
						<template #item="{ item }">
							<span class="m-3 hand-cursor highlight-span" @click="insertSnippetAsync(item)">
								{{ item.label }}
							</span>
						</template>
					</Menu>
					<Button
						label="Delete"
						class="p-button-danger w-100 mb-1"
						style="display: block"
						@click="deleteAsync()" />
					<Button
						label="Publish"
						class="p-button-success w-100 mb-1"
						style="display: block"
						@click="publishAsync()" />
				</div>
			</template>
			<template #footer>
				<span class="me-2"><font-awesome-icon :icon="snippetId.is_public ? 'eye' : 'eye-slash'" /></span>
				<span class="me-2">Id: {{ props.id }}</span>
				<span class="me-4">Title: «{{ snippetId.title }}»</span>
				<span class="me-2">
					<font-awesome-icon icon="user" />
					{{ snippetId.first_name + ' ' + snippetId.last_name }} @ {{ snippetId.ts_modified }}
				</span>
				<Codemirror
					v-model="snippetId.code"
					:extensions="extensions"
					:style="{ width: '100%', minHeight: '22rem' }" />
				<br />
				<div v-if="rows && !sqlError">
					<DataTable
						ref="executionTableDt"
						:value="rows"
						filter-display="menu"
						show-gridlines
						class="p-datatable-sm"
						:rows="10"
						paginator>
						<template #header>
							<span class="me-2">Rowcount: {{ rows.length }}, showing 10 entries per page.</span>
						</template>
						<Column v-for="(col, index) of columns" :key="index" :field="col" :header="col" sortable />
					</DataTable>
				</div>
				<h3 v-else class="center">{{ sqlError }}</h3>
			</template>
		</Card>
	</div>
</template>

<style scoped>
.edgar-right-overlap-menu {
	position: absolute;
	right: 2rem;
	top: 19rem;
	height: 100%;
	min-height: 100%;
	padding: 5px;
	z-index: 10;
}

.highlight-span:hover {
	filter: brightness(85%);
	opacity: 0.5;
}
</style>
