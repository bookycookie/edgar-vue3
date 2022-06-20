<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ApiService from '@/services/ApiService';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';

const loading = ref(false);

type VisNodeInformation = {
	idVerAct: string;
	substring: string;
	userModified: string;
	tsModified: string;
	type: string;
};

const courseId = 477;

type VisNode = {
	id: number;
	id_ext: number;
	id_parent: number;
	id_parent_ext: number;
	node_name: string;
	depth: number;
	children: VisNode[];
	key: number;
	label: string;
};

type PVTreeNode = {
	key: number;
	label: string;
	data: string;
	icon: string;
	children: PVTreeNode[];
};

const service = new ApiService();
const root = ref();

const selectedNodes = ref<VisNodeInformation[]>([]);

const makeTree = (nodes: VisNode[], parentId: number | null): any => {
	return nodes
		.filter((node: VisNode) => node.id_parent === parentId)
		.reduce(
			(tree: any, node: VisNode) => [
				...tree,
				{
					...node,
					children: makeTree(nodes, node.id),
				},
			],
			[],
		);
};

onMounted(async () => {
	await service.getManyAsync<VisNode>('/vistree', { courseId: courseId }).then((nodes: VisNode[]) => {
		root.value = makeTree(nodes, null);
	});
});

const selectNode = async (node: any) => {
	try {
		loading.value = true;
		selectedNodes.value = await service.getManyAsync<VisNodeInformation>('/node/vis', {
			nodeId: node.id,
		});
	} finally {
		loading.value = false;
	}
};

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #title>Course structure (readonly)</template>
			<template #content>
				<div class="wrapper">
					<Tree :value="root" selection-mode="single" @node-select="selectNode"></Tree>
					<DataTable :value="selectedNodes" show-gridlines class="p-datatable-sm">
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
							</div>
						</template>
						<template #empty>
							<span class="center">No data to show.</span>
						</template>
						<Column field="" header="#">
							<template #body="{ index }">
								<div>{{ index + 1 }}</div>
							</template>
						</Column>
						<Column field="idVerAct" header="Id/Ver/Act" sortable>
							<template #body="{ data }">
								<div class="center-align" v-html="data.idVerAct"></div>
							</template>
						</Column>
						<Column field="substring" header="Substring" sortable>
							<template #body="{ data }">
								<div class="center-align">{{ data.substring }}</div>
							</template>
						</Column>
						<Column field="userModified" header="Modified" sortable>
							<template #body="{ data }">
								<div class="center-align">
									<span>
										{{ data.userModified }}
										{{ new Date(data.tsModified).toISOString().split('T')[0] }}
										<small>
											{{ humanize(new Date(data.tsModified)) }}
										</small>
									</span>
								</div>
							</template>
						</Column>

						<Column field="type" header="Type" sortable>
							<template #body="{ data }">
								<div class="center-align">{{ data.type }}</div>
							</template>
						</Column>
					</DataTable>
				</div>
			</template>
		</Card>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	grid-template-columns: repeat(2, 4fr);
}
</style>
