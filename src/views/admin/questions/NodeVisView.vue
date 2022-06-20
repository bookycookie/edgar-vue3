<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue';
import ApiService from '@/services/ApiService';
import { Node } from '@/models/admin/questions/Node';
import * as vis from 'vis-network';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';

type VisNode = {
	id_root: number;
	node_name: string;
	id_child: number;
	id_parent: number;
	id_node_type: number;
	cnt_active: number;
	cnt_inactive: number;
};

interface VisNetworkNode extends vis.Node {
	id_parent: number;
}

type VisNodeInformation = {
	idVerAct: string;
	substring: string;
	userModified: string;
	tsModified: string;
	type: string;
};

const service = new ApiService();
const courseId = 477;

const rootId = ref(-1);
const network = ref<vis.Network>();
const selectedNodes = ref<VisNodeInformation[]>();
const selectedNodeId = ref();
const isLoading = ref(false);

// UPDATE
const id = ref();
const updateName = ref('');
const nodeTypes = ref<Node[]>([]);
const selectedUpdateNodeType = ref<Node>();
const reassignParentId = ref();

// INSERT
const insertName = ref('');
const description = ref('');
const selectedInsertNodeType = ref<Node>();
const parentId = ref();

const getVisNodesAsync = async () =>
	await service
		.getManyAsync<VisNode>('/node/vis/network', {
			courseId: courseId,
		})
		.then((visNodes: VisNode[]) => {
			redraw(visNodes);
		});

const redraw = (visNodes: VisNode[]) => {
	network.value?.destroy();
	const container = document.getElementById('vis-network')!;
	const options = {
		nodes: {
			shape: 'dot',
			scaling: {
				min: 10,
				max: 30,
			},
		},
		physics: {
			forceAtlas2Based: {
				gravitationalConstant: -26,
				centralGravity: 0.005,
				springLength: 230,
				springConstant: 0.18,
			},
			maxVelocity: 146,
			solver: 'forceAtlas2Based',
			timestep: 0.15,
			stabilization: { iterations: 150 },
		},
	};

	rootId.value = visNodes[0].id_root;
	const edges = [];
	const nodes: VisNetworkNode[] = [];

	for (let i = 0; i < visNodes.length; i++) {
		const node = visNodes[i];

		nodes.push({
			id: node.id_child,
			value: node.cnt_active,
			label: `${node.node_name} (${node.cnt_active})`,
			group: `${node.id_node_type}`,
			id_parent: node.id_parent ?? null,
		});

		edges.push({
			from: node.id_child,
			to: node.id_parent,
			id: `${node.node_name} — ${node.id_child}${node.id_parent}`,
		});
	}
	const data: vis.Data = { edges: edges, nodes: nodes };
	network.value = new vis.Network(container, data, options);

	network.value.on('click', async (params: any) => {
		const foundNode = nodes.find((i) => i.id === params.nodes[0]);
		if (!foundNode) return;

		try {
			isLoading.value = true;
			updateName.value = foundNode.label ?? '';
			selectedNodeId.value = id.value = parentId.value = foundNode.id;
			reassignParentId.value = foundNode.id_parent;
			if (foundNode.group) {
				const nodeTypeId = parseInt(foundNode.group);

				selectedUpdateNodeType.value = selectedInsertNodeType.value = nodeTypes.value.find(
					(nt) => nt.id === nodeTypeId,
				);
			}
			selectedNodes.value = await service.getManyAsync<VisNodeInformation>('/node/vis', {
				nodeId: foundNode.id,
			});
		} finally {
			isLoading.value = false;
		}
	});
};

const insert = async () => {
	if (!insertName.value || !selectedInsertNodeType.value || !parentId.value) {
		//! Use danger toaster here
		console.log('Failed to insert!');
		return;
	}

	const insertResponse = await service.postAsync('/node/insert', {
		nodeTypeId: selectedInsertNodeType.value.id,
		nodeName: insertName.value,
		description: description.value,
		parentId: parentId.value,
	});

	await getVisNodesAsync();
};

const update = async () => {
	if (!id.value || !updateName.value || !selectedUpdateNodeType.value?.id) {
		//! Use danger toaster here
		console.log('Failed to update');
		return;
	}

	const updateResponse = await service.postAsync('/node/update', {
		nodeName: updateName.value,
		nodeTypeId: selectedUpdateNodeType.value.id,
		nodeId: id.value,
	});

	await getVisNodesAsync();
};

const reassign = async () => {
	if (!id.value || !reassignParentId.value) {
		//! Use danger toaster here
		console.log('Failed to reassign');
		return;
	}
	const reassignResponse = await service.postAsync('/node/reassign', {
		nodeId: id.value,
		parentId: reassignParentId.value,
	});

	await getVisNodesAsync();
};

const deleteNode = async () => {
	if (!id.value) {
		//! Use danger toaster here
		console.log('Failed to delete');
		return;
	}

	const deleteResponse = await service.postAsync('/node/delete', {
		nodeId: id.value,
	});

	await getVisNodesAsync();
};

onMounted(async () => {
	await service.getManyAsync<Node>('/exam_node_names').then((types) => {
		nodeTypes.value = types;
		selectedUpdateNodeType.value = selectedInsertNodeType.value = types[0];
	});

	await getVisNodesAsync();
});

const filters = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

defineEmits(['deleteNode', 'updateNode', 'reassign', 'insert']);
</script>

<template>
	<div class="container-fluid">
		<Toast />
		<Card>
			<template #title>Node Visualization</template>
			<template #content>
				<Accordion :active-index="0">
					<AccordionTab header="Node actions">
						<div class="grid p-fluid">
							<div class="col-12 md:col-6 flex">
								<div class="p-inputgroup">
									<Card id="header-left" style="width: 100%">
										<template #title>Edit existing node</template>
										<template #content>
											<div class="p-inputgroup">
												<span class="p-float-label me-2">
													<InputNumber
														id="update-id"
														v-model="id"
														:min="0"
														disabled></InputNumber>
													<label for="update-id">Id</label>
												</span>
												<span class="p-float-label">
													<InputText id="update-name" v-model="updateName"></InputText>
													<label for="update-name">Name</label>
												</span>
											</div>
											<br />
											<br />
											<div class="p-inputgroup">
												<span class="p-float-label me-4">
													<Dropdown
														id="update-node-type"
														v-model="selectedUpdateNodeType"
														:options="nodeTypes"
														option-label="type_name"
														:placeholder="selectedUpdateNodeType?.node_name"
														style="max-width: 75%"></Dropdown>
													<label for="update-node-type">Type</label>
												</span>
											</div>
											<br />
											<div class="p-inputgroup">
												<Button
													label="Update"
													icon="pi pi-save"
													class="p-button-success"
													@click="update" />
												<Button
													label="Delete"
													icon="pi pi-trash"
													class="p-button-danger"
													@click="deleteNode" />
											</div>
											<br />
											<br />
											<div class="p-inputgroup">
												<Button
													label="Reassign parent"
													icon="pi pi-arrows-h"
													class="p-button-success me-2"
													style="min-width: 12.5rem"
													@click="reassign" />
												<span class="p-float-label me-4">
													<InputNumber
														id="reassign-parent-id"
														v-model="reassignParentId"
														:min="0"
														:disabled="!id"
														style="max-width: 30%"></InputNumber>
													<label for="reassign-parent-id">Parent Id</label>
												</span>
											</div>
										</template>
									</Card>
								</div>
							</div>

							<div class="col-12 md:col-6 flex">
								<div class="p-inputgroup">
									<Card id="header-right" style="width: 100%">
										<template #title>Insert new node</template>
										<template #content>
											<div class="p-inputgroup">
												<span class="p-float-label">
													<InputText id="update-name" v-model="insertName"></InputText>
													<label for="insert-name">Name</label>
												</span>
											</div>
											<br />
											<br />

											<div class="p-inputgroup">
												<span class="p-float-label me-4">
													<Dropdown
														id="insert-node-type"
														v-model="selectedInsertNodeType"
														:options="nodeTypes"
														option-label="type_name"
														:placeholder="selectedInsertNodeType?.node_name"
														style="max-width: 75%"></Dropdown>
													<label for="insert-node-type">Type</label>
												</span>
											</div>
											<br />
											<br />
											<div class="p-inputgroup">
												<span class="p-float-label">
													<Textarea
														id="insert-description"
														v-model="description"
														:auto-resize="true"
														rows="1" />
													<label for="insert-description">
														Description
														<small>(optional)</small>
													</label>
												</span>
											</div>
											<br />
											<br />
											<div class="p-inputgroup"></div>
											<br />
											<div class="p-inputgroup">
												<Button
													label="Insert"
													icon="pi pi-plus-circle"
													class="p-button-success me-2"
													style="min-width: 8.5rem"
													@click="insert" />
												<span class="p-float-label me-4">
													<InputNumber
														id="insert-parent-id"
														v-model="parentId"
														:min="0"
														disabled
														style="max-width: 30%"></InputNumber>
													<label for="insert-parent-id">Parent Id</label>
												</span>
											</div>
										</template>
									</Card>
								</div>
							</div>
						</div>
					</AccordionTab>
				</Accordion>
			</template>
			<template #footer>
				<div class="grid p-fluid">
					<div class="col-12 md:col-8">
						<div class="p-inputgroup">
							<Card style="width: 100%">
								<template #content>
									<div id="vis-network" style="height: 35rem"></div>
								</template>
							</Card>
						</div>
					</div>
					<div v-if="selectedNodeId" class="col-12 md:col-4">
						<div class="p-inputgroup">
							<Card style="width: 100%">
								<template #title>
									<span>
										Node:
										<span class="badge bg-primary">
											{{ selectedNodeId }}
										</span>
									</span>
								</template>
								<template #content>
									<DataTable
										v-model:filters="filters"
										:value="selectedNodes"
										show-gridlines
										class="p-datatable-sm"
										:loading="isLoading"
										filter-display="menu"
										paginator
										:rows="4">
										<template #header>
											<div>
												<span class="p-input-icon-left">
													<i class="pi pi-search" />
													<InputText
														v-model="filters['global'].value"
														placeholder="Search"
														class="p-inputtext-sm p-inputtext-filled"
														style="border-radius: 14px; width: 50%" />
												</span>
											</div>
										</template>
										<template #empty>
											<span class="center">No information was found about this node.</span>
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
												<div class="center-align">
													{{ data.substring }}
												</div>
											</template>
										</Column>
										<Column field="userModified" header="Modified" sortable>
											<template #body="{ data }">
												<div class="center-align">
													<span>
														{{ data.userModified }}
														{{ new Date(data.tsModified).toISOString().split('T')[0] }}
														<p>
															<em>
																<small>{{ humanize(new Date(data.tsModified)) }}</small>
															</em>
														</p>
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
								</template>
							</Card>
						</div>
					</div>
				</div>
			</template>
		</Card>
	</div>
</template>
