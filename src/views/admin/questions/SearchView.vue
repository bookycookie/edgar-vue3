<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import ApiService from '@/services/ApiService';
import { QuestionNode } from '@/models/admin/questions/QuestionNode';
import { Tag } from '@/models/admin/questions/Tag';
import { SearchTable } from '@/models/admin/questions/SearchTable';
import { LocationQueryValue, useRoute, useRouter } from 'vue-router';
import { FilterMatchMode } from 'primevue/api';
import RouteNames from '@/router/routes';
import humanize from '@/utilities/date-humanizer/humanizer';

const courseId = 155;

const loading = ref(false);

const route = useRoute();
const router = useRouter();

const searchTable = ref<SearchTable[]>([]);

const search = async () => {
	router.push({
		query: {
			nodes: selectedNodes.value.map((sn) => sn.id),
			tags: selectedTags.value.map((st) => st.id),
			tagsOperator: tagsOperator.value,
			fts: textSearch.value,
			created_like: userCreated.value,
			modified_like: userModified.value,
			no_results: noResults.value,
		},
	});
};

watch(
	() => route.query,
	async (_) => {
		getQueryData();
		await getDataAsync();
	},
);

const getDataAsync = async () => {
	try {
		loading.value = true;
		const request = {
			noResults: noResults.value,
			nodeIds: selectedNodes.value.map((n: QuestionNode) => n.id),
			courseId: courseId,
			courseTagIds: selectedTags.value.map((t: Tag) => t.id),
			questionText: textSearch.value,
			created: userCreated.value,
			modified: userModified.value,
		};

		searchTable.value = await service.getManyAsync<SearchTable>('/search/table', request);
	} finally {
		loading.value = false;
	}
};

const DEFAULT_NO_RESULTS = 200;
const DEFAULT_TAGS_OPERATOR = 'and';
const service = new ApiService();

const nodeIds = ref<number[]>([]);
const nodes = ref<QuestionNode[]>([]);
const selectedNodes = ref<QuestionNode[]>([]);

const tagIds = ref<number[]>([]);
const tags = ref<Tag[]>([]);
const selectedTags = ref<Tag[]>([]);

//? This does nothing on current edgar?
const tagsOperator = ref(DEFAULT_TAGS_OPERATOR);

const textSearch = ref();
const userCreated = ref();
const userModified = ref();

const noResults = ref(DEFAULT_NO_RESULTS);

const getNumberArrayQuery = (query: LocationQueryValue | LocationQueryValue[]) => {
	if (query instanceof Array) return query.map((n) => parseInt(n?.toString() ?? ''));
	else return [parseInt(query as string)];
};

const parseResultsNo = (queryNumber: string) => {
	if (!queryNumber) {
		router.push({ query: { ...route.query, no_results: DEFAULT_NO_RESULTS } });
		return DEFAULT_NO_RESULTS;
	}

	const parsedNumber = parseInt(queryNumber);
	if (parsedNumber < DEFAULT_NO_RESULTS) {
		router.push({ query: { ...route.query, no_results: DEFAULT_NO_RESULTS } });
		return DEFAULT_NO_RESULTS;
	}
	return parsedNumber;
};

const parseTagOperator = (queryOperator: string) => {
	if (!queryOperator) {
		router.push({
			query: { ...route.query, tagsOperator: DEFAULT_TAGS_OPERATOR },
		});
		return DEFAULT_TAGS_OPERATOR;
	}

	if (queryOperator !== 'and' && queryOperator !== 'or') {
		router.push({
			query: { ...route.query, tagsOperator: DEFAULT_TAGS_OPERATOR },
		});
		return DEFAULT_TAGS_OPERATOR;
	}

	return queryOperator;
};

const getQueryData = () => {
	userModified.value = (route.query.modified_like as string) ?? '';
	userCreated.value = (route.query.created_like as string) ?? '';
	textSearch.value = (route.query.fts as string) ?? '';
	noResults.value = parseResultsNo(route.query.no_results as string);
	tagsOperator.value = parseTagOperator(route.query.tagsOperator as string);

	nodeIds.value = getNumberArrayQuery(route.query.nodes);
	tagIds.value = getNumberArrayQuery(route.query.tags);

	selectedNodes.value = nodes.value.filter((n) => nodeIds.value.includes(n.id));
	selectedTags.value = tags.value.filter((t) => tagIds.value.includes(t.id));
};

onMounted(async () => {
	router.isReady().then(async () => {
		nodes.value = await service.getManyAsync<QuestionNode>('/search/nodes', {
			courseId: courseId,
		});

		tags.value = await service.getManyAsync<Tag>('/question/tags', {
			courseId: courseId,
			global: true,
		});

		getQueryData();
		await getDataAsync();
	});
});

const searchDt = ref();
const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});
const exportCSV = () => searchDt.value.exportCSV();

const skeletonTable: SearchTable[] = Array(7).fill({
	id: 0,
	version: 0,
	is_active: '0',
	question_text: '',
	tags: '',
	user_modified_sl: '',
	ts_modified_sl: '',
	days_ago: 1,
	user_created: '',
	ts_created_sl: '',
	type_name: '',
	ts_last_used: '',
	last_used_by_id: 0,
	last_used_by_name: '',
	last_used_by_alt_id2: '',
	test_instance_id: 0,
});

const skeletonColumns: any[] = [
	{ field: '', header: '#' },
	{ field: '', header: 'Sequence' },
	{ field: '', header: 'Id/Ver/Act' },
	{ field: '', header: 'Similarity' },
	{ field: '', header: 'Text' },
	{ field: '', header: 'Tags' },
	{ field: '', header: 'Type' },
	{ field: '', header: 'User created' },
	{ field: '', header: 'User modified' },
	{ field: '', header: 'TS modified' },
	{ field: '', header: 'Days ago' },
	{ field: '', header: 'Last used by' },
	{ field: '', header: 'TS last used' },
];
</script>

<template>
	<div class="container-fluid">
		<Toast />
		<br />
		<Card>
			<template #title>
				<h3>Search</h3>
				<Divider></Divider>
			</template>
			<template #content>
				<div class="grid p-fluid">
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<span class="p-float-label">
								<MultiSelect
									id="question-node-multiselect"
									v-model="selectedNodes"
									:options="nodes"
									option-label="name"
									display="chip"
									filter />
								<label for="question-node-multiselect">Nodes</label>
							</span>
						</div>
						<br />
						<br />
						<div class="p-inputgroup">
							<span class="p-float-label">
								<MultiSelect
									v-model="selectedTags"
									:options="tags"
									option-label="name"
									display="chip"
									filter
									style="width: 100%" />
								<label for="tags-multiselect">Tags</label>
							</span>
						</div>
						<br />
						<div class="p-inputgroup">
							<span class="me-2">Combine tags with:</span>
							<div class="me-4 flex">
								<RadioButton
									id="evaluated-sql-strict"
									v-model="tagsOperator"
									value="and"
									class="me-2"></RadioButton>
								<label for="evaluated-sql-strict">and</label>
							</div>
							<div class="flex">
								<RadioButton
									id="evaluated-sql-strict"
									v-model="tagsOperator"
									value="or"
									class="me-2"></RadioButton>
								<label for="evaluated-sql-strict">or</label>
							</div>
						</div>
					</div>
					<div class="col-12 md:col-6">
						<div class="p-inputgroup">
							<div class="me-2">
								<span class="p-float-label" style="min-width: 30rem">
									<InputText id="full-text-search" v-model="textSearch" type="text" />
									<label for="full-text-search">Full text search</label>
								</span>
							</div>
							<div>
								<span class="p-float-label">
									<InputNumber id="no-results" v-model="noResults" :min="10" :step="5" />
									<label for="no-results">No. results</label>
								</span>
							</div>
						</div>
						<br />
						<br />
						<div class="p-inputgroup">
							<div class="me-2">
								<span class="p-float-label">
									<InputText id="created" v-model="userCreated" type="text" />
									<label for="created">User created substring</label>
								</span>
							</div>
							<div class="me-2">
								<span class="p-float-label">
									<InputText id="modified" v-model="userModified" type="text" />
									<label for="modified">User modified substring</label>
								</span>
							</div>
							<Button label="Search" @click="search"></Button>
						</div>
					</div>
				</div>
			</template>
			<template #footer>
				<DataTable v-if="loading" :value="skeletonTable" responsive-layout="scroll">
					<template #header>
						<div style="display: flex">
							<span class="p-input-icon-left">
								<i class="pi pi-search" />
								<InputText
									v-model="filters['global'].value"
									placeholder="Search"
									class="p-inputtext-sm p-inputtext-filled"
									style="border-radius: 14px" />
							</span>
							<Button
								icon="pi pi-external-link"
								label="Export"
								class="p-button-sm ml-3"
								@click="exportCSV" />
						</div>
					</template>
					<Column
						v-for="col of skeletonColumns"
						:key="col.field"
						:field="col.field"
						:header="col.header"
						sortable>
						<template #body><Skeleton></Skeleton></template>
					</Column>
				</DataTable>
				<DataTable
					v-else
					ref="searchDt"
					v-model:filters="filters"
					:value="searchTable"
					filter-display="menu"
					show-gridlines
					scroll-height="43rem"
					class="p-datatable-sm"
					responsive-layout="scroll"
					:paginator="true"
					:loading="loading"
					:rows="7">
					<template #header>
						<div style="display: flex">
							<span class="p-input-icon-left">
								<i class="pi pi-search" />
								<InputText
									v-model="filters['global'].value"
									placeholder="Search"
									class="p-inputtext-sm p-inputtext-filled"
									style="border-radius: 14px" />
							</span>
							<Button
								icon="pi pi-external-link"
								label="Export"
								class="p-button-sm ml-3"
								@click="exportCSV" />
						</div>
					</template>
					<template #empty>
						<span class="center">No data to show.</span>
					</template>
					<Column field="" header="#" sortable>
						<template #body="{ index }">
							<div class="number-align">
								{{ index + 1 }}
							</div>
						</template>
					</Column>
					<Column field="sequence" header="Sequence" sortable>
						<template #body="{}">TODO</template>
					</Column>
					<Column field="id" header="Id/Ver/Act" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<p>
									<router-link :to="{ name: RouteNames.EditQuestion, params: { id: data.id } }">
										{{ data.id }}
									</router-link>
								</p>
								<p>{{ data.version }}</p>
								<p v-html="data.is_active"></p>
							</div>
						</template>
					</Column>
					<Column field="" header="Similarity" sortable>
						<template #body="{}">TODO</template>
					</Column>
					<Column field="question-text" header="Text" sortable>
						<template #body="{ data }"><div v-html="data.question_text"></div></template>
					</Column>
					<Column field="tags" header="Tags" sortable />
					<Column field="type_name" header="Type" sortable />
					<Column field="user_created" header="User created" sortable />
					<Column field="user_modified_sl" header="User modified" sortable />
					<Column field="ts_modified_sl" header="TS modified" sortable>
						<template #body="{ data }">
							{{ new Date(data.ts_modified_sl).toISOString().split('T')[0] }}
							<p>
								<em>
									<small>{{ humanize(new Date(data.ts_modified_sl)) }}</small>
								</em>
							</p>
						</template>
					</Column>
					<Column field="days_ago" header="Days ago" sortable />
					<Column field="last_used_by_name" header="Last used by" sortable />
					<Column field="ts_last_used" header="TS last used" sortable>
						<template #body="{ data }">
							<div v-if="data.ts_last_used">
								{{ new Date(data.ts_last_used).toISOString().split('T')[0] }}
								<p>
									<em>
										<small>{{ humanize(new Date(data.ts_last_used)) }}</small>
									</em>
								</p>
							</div>
						</template>
					</Column>
				</DataTable>
			</template>
		</Card>
		<br />
	</div>
</template>
