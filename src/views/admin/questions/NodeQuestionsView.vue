<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import ApiService from '@/services/ApiService';
import humanize from '@/utilities/date-humanizer/humanizer';
import { FilterMatchMode } from 'primevue/api';
import { QuestionNode } from '@/models/admin/questions/QuestionNode';
import CONSTANTS from '@/config/constants';
type Question = {
	id: number;
	id_ver_act: string;
	substring: string;
	user_modified: string;
	ts_modified: string;
	type_name: string;
};

const service = new ApiService();

const isLoading = ref(false);

const initialNodesFilter = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const assignedQuestionsFilter = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const otherQuestionsFilter = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const assignedNodesFilter = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const otherNodesFilter = ref({
	global: { value: '', matchMode: FilterMatchMode.CONTAINS },
});

const isQuestionSelected = ref(false);
const isNodeSelected = ref(false);

const nodes = ref<QuestionNode[]>([]);
const selectedNodeRow = ref<QuestionNode>();
const selectNodeRow = async () => {
	isNodeSelected.value = true;
	assignedQuestionIds.value = await service.getManyAsync<number>('/node/questions', {
		nodeId: selectedNodeRow.value?.id,
	});
};
const assignedNodeIds = ref<number[]>([]);
const assignedNodes = computed(() => nodes.value.filter((q) => assignedNodeIds.value.includes(q.id)));
const otherNodes = computed(() => nodes.value.filter((q) => !assignedNodeIds.value.includes(q.id)));

const deleteNodeFromQuestion = async (node: QuestionNode) => {
	if (!node || !selectedQuestionRow.value?.id) {
		console.log('Deleting node from question failed!');
		return;
	}

	const index = assignedNodeIds.value.indexOf(node.id);
	assignedNodeIds.value.splice(index, 1);

	await service.postAsync('/node/delete_pair', {
		nodeId: node.id,
		questionId: selectedQuestionRow.value.id,
	});
};

const addNodeToQuestion = async (node: QuestionNode) => {
	if (!node || !selectedQuestionRow.value?.id) {
		console.log('Adding node to question failed!');
		return;
	}

	assignedNodeIds.value.push(node.id);
	await service.postAsync('/node/add_pair', {
		nodeId: node.id,
		questionId: selectedQuestionRow.value.id,
	});
};

const questions = ref<Question[]>([]);
const selectedQuestionRow = ref<Question>();
const assignedQuestionIds = ref<number[]>([]);
const assignedQuestions = computed(() => questions.value.filter((q) => assignedQuestionIds.value.includes(q.id)));
const selectQuestionRow = async () => {
	isQuestionSelected.value = true;
	assignedNodeIds.value = await service.getManyAsync<number>('/node/nodes', {
		questionId: selectedQuestionRow.value?.id,
	});
};
const otherQuestions = computed(() => questions.value.filter((q) => !assignedQuestionIds.value.includes(q.id)));

const deleteQuestionFromNode = async (question: Question) => {
	if (!question || !selectedNodeRow.value?.id) {
		console.log('Deleting question from node failed!');
		return;
	}

	const index = assignedQuestionIds.value.indexOf(question.id);
	assignedQuestionIds.value.splice(index, 1);

	await service.postAsync('/node/delete_pair', {
		nodeId: selectedNodeRow.value.id,
		questionId: question.id,
	});
};

const addQuestionToNode = async (question: Question) => {
	if (!question || !selectedNodeRow.value?.id) {
		console.log('Adding question to node failed!');
		return;
	}

	assignedQuestionIds.value.push(question.id);
	await service.postAsync('/node/add_pair', {
		nodeId: selectedNodeRow.value.id,
		questionId: question.id,
	});
};

onMounted(async () => {
	try {
		isLoading.value = true;
		nodes.value = await service.getManyAsync<QuestionNode>('/node/questions/nodes', {
			courseId: CONSTANTS.COURSE_ID,
		});
		questions.value = await service.getManyAsync<Question>('/node/questions/all', {
			courseId: CONSTANTS.COURSE_ID,
		});
	} finally {
		isLoading.value = false;
	}
});
</script>

<template>
	<div class="container-fluid">
		<Card>
			<template #content>
				<div class="grid p-fluid">
					<div class="col-12 md:col-6 flex">
						<div v-if="!isQuestionSelected" class="grid p-fluid" style="width: 100%">
							<div class="p-inputgroup">
								<Card style="width: 100%">
									<template #title>Nodes:</template>
									<template #content>
										<div v-if="isLoading">
											<i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
										</div>
										<DataTable
											v-else
											v-model:filters="initialNodesFilter"
											v-model:selection="selectedNodeRow"
											:value="nodes"
											show-gridlines
											filter-display="menu"
											selection-mode="single"
											data-key="id"
											class="p-datatable-sm"
											paginator
											:rows="20"
											@row-select="selectNodeRow">
											<template #empty>
												<span class="center">No nodes found for current course.</span>
											</template>
											<template #header>
												<div style="display: flex">
													<span class="p-input-icon-left">
														<i class="pi pi-search" />
														<InputText
															v-model="initialNodesFilter['global'].value"
															placeholder="Search"
															class="p-inputtext-sm p-inputtext-filled"
															style="border-radius: 14px; min-width: 10rem" />
													</span>
												</div>
											</template>
											<Column field="" header="#">
												<template #body="{ index }">
													<div>{{ index + 1 }}</div>
												</template>
											</Column>
											<Column field="type_name" header="Type name" sortable></Column>
											<Column field="node_name" header="QuestionNode name" sortable></Column>
										</DataTable>
									</template>
								</Card>
							</div>
						</div>
						<div v-if="isQuestionSelected" style="width: 100%">
							<div class="p-inputgroup">
								<Card style="width: 100%">
									<template #title>Assigned nodes:</template>
									<template #content>
										<DataTable
											v-model:filters="assignedNodesFilter"
											v-model:selection="selectedNodeRow"
											:value="assignedNodes"
											show-gridlines
											filter-display="menu"
											selection-mode="single"
											data-key="id"
											class="p-datatable-sm"
											paginator
											:rows="20"
											@row-select="selectNodeRow">
											<template #empty>
												<span class="center">No nodes found for the selected question.</span>
											</template>
											<template #header>
												<div style="display: flex">
													<span class="p-input-icon-left">
														<i class="pi pi-search" />
														<InputText
															v-model="assignedNodesFilter['global'].value"
															placeholder="Search"
															class="p-inputtext-sm p-inputtext-filled"
															style="border-radius: 14px; min-width: 10rem" />
													</span>
												</div>
											</template>
											<Column field="" header="#">
												<template #body="{ index }">
													<div>{{ index + 1 }}</div>
												</template>
											</Column>
											<Column field="type_name" header="Type name" sortable></Column>
											<Column field="node_name" header="QuestionNode name" sortable></Column>
											<Column field="" header="Delete">
												<template #body="{ data }">
													<div class="center">
														<Button
															icon="pi pi-trash"
															class="p-button-danger"
															@click="deleteNodeFromQuestion(data)" />
													</div>
												</template>
											</Column>
										</DataTable>
									</template>
								</Card>
							</div>
							<div class="p-inputgroup">
								<Card style="width: 100%">
									<template #title>Other nodes:</template>
									<template #content>
										<DataTable
											v-model:filters="otherNodesFilter"
											v-model:selection="selectedNodeRow"
											:value="otherNodes"
											show-gridlines
											filter-display="menu"
											selection-mode="single"
											data-key="id"
											class="p-datatable-sm"
											paginator
											:rows="20"
											@row-select="selectNodeRow">
											<template #empty>
												<span class="center">No nodes found for the selected question.</span>
											</template>
											<template #header>
												<div style="display: flex">
													<span class="p-input-icon-left">
														<i class="pi pi-search" />
														<InputText
															v-model="otherNodesFilter['global'].value"
															placeholder="Search"
															class="p-inputtext-sm p-inputtext-filled"
															style="border-radius: 14px; min-width: 10rem" />
													</span>
												</div>
											</template>
											<Column field="" header="#">
												<template #body="{ index }">
													<div>{{ index + 1 }}</div>
												</template>
											</Column>
											<Column field="type_name" header="Type name" sortable></Column>
											<Column field="node_name" header="QuestionNode name" sortable></Column>
											<Column field="" header="Add">
												<template #body="{ data }">
													<div class="center">
														<Button
															icon="pi pi-plus-circle"
															class="p-button-success"
															@click="addNodeToQuestion(data)" />
													</div>
												</template>
											</Column>
										</DataTable>
									</template>
								</Card>
							</div>
						</div>
					</div>
					<div v-if="isNodeSelected" class="col-12 md:col-6 flex">
						<div class="grid p-fluid" style="width: 100%">
							<div class="p-inputgroup">
								<Card style="width: 100%">
									<template #title>Assigned questions:</template>
									<template #content>
										<DataTable
											v-model:filters="assignedQuestionsFilter"
											v-model:selection="selectedQuestionRow"
											:value="assignedQuestions"
											show-gridlines
											filter-display="menu"
											selection-mode="single"
											data-key="id"
											class="p-datatable-sm"
											paginator
											:rows="20"
											@row-select="selectQuestionRow">
											<template #empty>
												<span class="center">
													No questions are assigned to the selected node.
												</span>
											</template>
											<template #header>
												<div style="display: flex">
													<span class="p-input-icon-left">
														<i class="pi pi-search" />
														<InputText
															v-model="assignedQuestionsFilter['global'].value"
															placeholder="Search"
															class="p-inputtext-sm p-inputtext-filled"
															style="border-radius: 14px; min-width: 10rem" />
													</span>
												</div>
											</template>
											<Column field="" header="#">
												<template #body="{ index }">
													<div>{{ index + 1 }}</div>
												</template>
											</Column>
											<Column field="id_ver_act" header="Id/Ver/act" sortable>
												<template #body="{ data }">
													<div v-html="data.id_ver_act"></div>
												</template>
											</Column>
											<Column field="substring" header="Text" sortable></Column>
											<Column field="user_modified" header="Modified" sortable>
												<template #body="{ data }">
													<div class="center-align">
														<span>
															{{ data.user_modified }}
															{{ new Date(data.ts_modified).toISOString().split('T')[0] }}
															<small>
																{{ humanize(new Date(data.ts_modified)) }}
															</small>
														</span>
													</div>
												</template>
											</Column>
											<Column field="" header="Delete">
												<template #body="{ data }">
													<div class="center">
														<Button
															icon="pi pi-trash"
															class="p-button-danger"
															@click="deleteQuestionFromNode(data)" />
													</div>
												</template>
											</Column>
										</DataTable>
									</template>
								</Card>
							</div>
							<div class="p-inputgroup">
								<Card style="width: 100%">
									<template #title>Other questions:</template>
									<template #content>
										<DataTable
											v-model:filters="otherQuestionsFilter"
											v-model:selection="selectedQuestionRow"
											:value="otherQuestions"
											show-gridlines
											filter-display="menu"
											selection-mode="single"
											data-key="id"
											class="p-datatable-sm"
											paginator
											:rows="20"
											@row-select="selectQuestionRow">
											<template #empty>
												<span class="center">
													No questions are assigned to the selected node.
												</span>
											</template>
											<template #header>
												<div style="display: flex">
													<span class="p-input-icon-left">
														<i class="pi pi-search" />
														<InputText
															v-model="otherQuestionsFilter['global'].value"
															placeholder="Search"
															class="p-inputtext-sm p-inputtext-filled"
															style="border-radius: 14px; min-width: 10rem" />
													</span>
												</div>
											</template>
											<Column field="" header="#">
												<template #body="{ index }">
													<div>{{ index + 1 }}</div>
												</template>
											</Column>
											<Column field="id_ver_act" header="Id/Ver/act" sortable>
												<template #body="{ data }">
													<div v-html="data.id_ver_act"></div>
												</template>
											</Column>
											<Column field="substring" header="Text" sortable></Column>
											<Column field="user_modified" header="Modified" sortable>
												<template #body="{ data }">
													<div class="center-align">
														<span>
															{{ data.user_modified }}
															{{ new Date(data.ts_modified).toISOString().split('T')[0] }}
															<small>
																{{ humanize(new Date(data.ts_modified)) }}
															</small>
														</span>
													</div>
												</template>
											</Column>
											<Column field="" header="Add">
												<template #body="{ data }">
													<div class="center">
														<Button
															icon="pi pi-plus-circle"
															class="p-button-success"
															@click="addQuestionToNode(data)" />
													</div>
												</template>
											</Column>
										</DataTable>
									</template>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</template>
		</Card>
	</div>
</template>
