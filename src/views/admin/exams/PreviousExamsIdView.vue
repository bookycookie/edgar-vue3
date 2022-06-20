<script setup lang="ts">
import { ref, PropType } from 'vue';
import { PreviousExamNotOver } from '@/models/admin/exams/PreviousExamNotOver';
import { PreviousExamSidebar } from '@/models/admin/exams/PreviousExamSidebar';
import { ExamStatistics } from '@/models/admin/exams/ExamStatistics';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import humanize from '@/utilities/date-humanizer/humanizer';
import RouteNames from '@/router/routes';

defineProps({
	examsNotOver: {
		type: Object as PropType<PreviousExamNotOver[]>,
		required: true,
		default() {
			return [];
		},
	},
	examsSidebar: {
		type: Object as PropType<PreviousExamSidebar[]>,
		required: true,
		default() {
			return [];
		},
	},
	examStatistics: {
		type: Object as PropType<ExamStatistics[]>,
		required: true,
		default() {
			return [];
		},
	},
	isLoading: { type: Boolean, required: true },
});

const skeletonData = Array(8).fill({} as ExamStatistics);
const skeletonColumns = [
	{ field: '', header: 'Started' },
	{ field: '', header: 'Submitted' },
	{ field: '', header: 'Duration' },
	{ field: '', header: 'Correct' },
	{ field: '', header: 'Incorrect' },
	{ field: '', header: 'Partial' },
	{ field: '', header: 'Unanswered' },
	{ field: '', header: 'Score' },
	{ field: '', header: 'Score %' },
	{ field: '', header: 'Passed' },
	{ field: '', header: 'Review' },
];
</script>

<template>
	<div class="container-fluid">
		<div class="flex">
			<div v-if="isLoading" style="width: 100%">
				<DataTable v-if="isLoading" :value="skeletonData">
					<Column
						v-for="col of skeletonColumns"
						:key="col.field"
						:field="col.field"
						:header="col.header"
						sortable>
						<template #body><Skeleton /></template>
					</Column>
				</DataTable>
			</div>
			<div v-else style="width: 100%">
				<DataTable
					:value="examStatistics"
					filter-display="menu"
					show-gridlines
					scrollable
					scroll-height="43rem">
					<template #empty>
						<span class="center">No data to show.</span>
					</template>
					<Column field="ts_started" header="Started">
						<template #body="{ data }">
							<div class="center-align">
								<span>
									{{ new Date(data.ts_started).toISOString().split('T')[0] }}
									<small>
										<em>
											{{ humanize(new Date(data.ts_started)) }}
										</em>
									</small>
								</span>
							</div>
						</template>
					</Column>
					<Column field="ts_submitted" header="Submitted">
						<template #body="{ data }">
							<div class="center-align">
								<span>
									{{ new Date(data.ts_submitted).toISOString().split('T')[0] }}
									<small>
										<em>
											{{ humanize(new Date(data.ts_submitted)) }}
										</em>
									</small>
								</span>
							</div>
						</template>
					</Column>
					<Column field="duration" header="Duration">
						<template #body="{ data }">
							<div class="number-align">{{ data.duration }}</div>
						</template>
					</Column>
					<Column field="correct_no" header="Correct">
						<template #body="{ data }">
							<div class="number-align">{{ data.correct_no }}</div>
						</template>
					</Column>
					<Column field="incorrect_no" header="Incorrect">
						<template #body="{ data }">
							<div class="number-align">
								{{ data.incorrect_no }}
							</div>
						</template>
					</Column>
					<Column field="partial_no" header="Partial">
						<template #body="{ data }">
							<div class="number-align">{{ data.partial_no }}</div>
						</template>
					</Column>
					<Column field="unanswered_no" header="Unanswered">
						<template #body="{ data }">
							<div class="number-align">
								{{ data.unanswered_no }}
							</div>
						</template>
					</Column>
					<Column field="t_score" header="Score">
						<template #body="{ data }">
							<div class="number-align">{{ data.t_score }}</div>
						</template>
					</Column>
					<Column field="t_score_perc" header="Score %">
						<template #body="{ data }">
							<div class="number-align">
								{{ data.t_score_perc }}
							</div>
						</template>
					</Column>
					<Column field="passed" header="Passed">
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									:icon="data.passed ? 'check-circle' : 'times-circle'"
									:class="data.passed ? 'success' : 'failure'"
									class="icon" />
							</div>
						</template>
					</Column>
					<Column field="" header="Review">
						<template #body="{ data }">
							<div class="center-align">
								<router-link
									:to="{
										name: RouteNames.ReviewExam,
										params: { id: data.id_test_instance, questionId: 1 },
									}"
									class="me-2">
									<Button class="p-button-warning p-button-raised">
										<font-awesome-icon icon="magnifying-glass" />
									</Button>
								</router-link>
							</div>
						</template>
					</Column>
				</DataTable>
				<br />
				<h4>By questions:</h4>
				<DataTable
					ref="byQuestionsDt"
					:value="examsNotOver"
					filter-display="menu"
					show-gridlines
					scrollable
					scroll-height="43rem">
					<Column field="" header="#">
						<template #body="{ index }">
							<div>{{ index + 1 }}</div>
						</template>
					</Column>
					<Column field="is_correct" header="Correct" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									v-if="data.is_correct"
									icon="check"
									class="success icon"></font-awesome-icon>
							</div>
						</template>
					</Column>
					<Column field="is_incorrect" header="Incorrect" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									v-if="data.is_incorrect"
									icon="check"
									class="failure icon"></font-awesome-icon>
							</div>
						</template>
					</Column>
					<Column field="is_partial" header="Partial" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									v-if="data.is_partial"
									icon="check"
									class="info icon"></font-awesome-icon>
							</div>
						</template>
					</Column>
					<Column field="is_unanswered" header="Unanswered" sortable>
						<template #body="{ data }">
							<div class="center-align">
								<font-awesome-icon
									v-if="data.is_unanswered"
									icon="check"
									class="icon"></font-awesome-icon>
							</div>
						</template>
					</Column>
					<Column field="correction" header="Correction" sortable></Column>
					<Column field="score" header="Score" sortable>
						<template #body="{ data }">
							<div class="number-align">
								{{ data.score }}
							</div>
						</template>
					</Column>
					<Column field="score_perc" header="Score %" sortable>
						<template #body="{ data }">
							<div class="number-align">
								{{ data.score_perc }}
							</div>
						</template>
					</Column>
				</DataTable>
			</div>
		</div>
	</div>
</template>
