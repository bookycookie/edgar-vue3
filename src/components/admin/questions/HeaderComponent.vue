<script setup lang="ts">
import { defineProps, PropType, defineEmits, computed, ref } from 'vue';
import { Reviewer } from '@/models/admin/questions/Reviewer';
import humanize from '@/utilities/date-humanizer/humanizer';
import useModelWrapper from '@/composables/modelWrapper';
import Dialog from 'primevue/dialog';
import CONSTANTS from '@/config/constants';
// all of these are automatically bound to the template

const emit = defineEmits(['claimAuthorship', 'addReviewer', 'removeReviewer']);

// FIXME: Get this from the store
const reviewer = CONSTANTS.NAME;
const userModified = CONSTANTS.NAME;

const showAddReviewer = computed(() => !internalReviewers.value?.find((r) => r.reviewer === reviewer));

const showClaimAuthorship = computed(() => !(internalUserModified.value === userModified));

const props = defineProps({
	reviewers: {
		type: Object as PropType<Reviewer[] | undefined>,
		default() {
			return;
		},
	},
	id: {
		type: Number,
		required: true,
		default: -1,
	},
	previousQuestionId: {
		type: Number,
		default: -1,
	},
	nextQuestionId: {
		type: Number,
		default: -1,
	},
	version: {
		type: Number,
		required: true,
		default: -1,
	},
	questionType: {
		type: String,
		required: true,
		default: 'PH',
	},
	usedCount: {
		type: Number,
		required: true,
		default: -1,
	},
	usedTime: {
		type: String,
		default: 'PH',
	},
	userCreated: {
		type: String,
		required: true,
		default: 'PH',
	},
	createdTime: {
		type: String,
		required: true,
		default: 'PH',
	},
	userModified: {
		type: String,
		required: true,
		default: 'PH',
	},
	modifiedTime: {
		type: String,
		required: true,
		default: 'PH',
	},
	path: {
		type: String,
		required: true,
		default: 'PH',
	},
	show: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const internalReviewers = useModelWrapper<Reviewer[]>(props, emit, 'reviewers');
const internalUserModified = useModelWrapper<string>(props, emit, 'userModified');
const internalModifiedTime = useModelWrapper<string>(props, emit, 'modifiedTime');

const addReviewer = () => {
	emit('addReviewer');
	// FIXME: Fetch reviewer from store
	internalReviewers.value.push({
		reviewer: reviewer,
		ts_created: new Date(Date.now()).toISOString(),
	});
	closeReviewerDialog();
};
const removeReviewer = () => {
	emit('removeReviewer');
	const idx = internalReviewers.value.findIndex((r: Reviewer) => r.reviewer === reviewer);
	internalReviewers.value.splice(idx, 1);
	closeReviewerDialog();
};

const displayAuthorship = ref(false);
const showAuthorshipDialog = () => (displayAuthorship.value = true);
const closeAuthorshipDialog = () => (displayAuthorship.value = false);

const displayReviewer = ref(false);
const showReviewerDialog = () => (displayReviewer.value = true);
const closeReviewerDialog = () => (displayReviewer.value = false);

const claimAuthorship = () => {
	closeAuthorshipDialog();
	// FIXME: Fetch author from store
	internalUserModified.value = userModified;
	internalModifiedTime.value = new Date(Date.now()).toISOString();
	emit('claimAuthorship');
};
</script>
<template>
	<div>
		<Dialog v-model:visible="displayAuthorship" :base-z-index="1338">
			<template #header>
				<h3>Please confirm</h3>
			</template>
			Are you sure you want to set yourself as the author?
			<template #footer>
				<Button @click="claimAuthorship()">
					<font-awesome-icon icon="thumbs-up" class="me-2"></font-awesome-icon>
					Yes!
				</Button>
				<Button class="p-button-secondary" @click="closeAuthorshipDialog()">
					<font-awesome-icon icon="thumbs-down" class="me-2"></font-awesome-icon>
					No
				</Button>
			</template>
		</Dialog>
		<Dialog v-model:visible="displayReviewer" :base-z-index="1338">
			<template #header>
				<h3>Please confirm</h3>
			</template>
			Are you sure you want to {{ showAddReviewer ? 'set' : 'remove' }} yourself as the reviewer?
			<template #footer>
				<Button @click="showAddReviewer ? addReviewer() : removeReviewer()">
					<font-awesome-icon icon="thumbs-up" class="me-2"></font-awesome-icon>
					Yes!
				</Button>
				<Button class="p-button-secondary" @click="closeReviewerDialog()">
					<font-awesome-icon icon="thumbs-down" class="me-2"></font-awesome-icon>
					No
				</Button>
			</template>
		</Dialog>
		<Accordion :active-index="show ? 0 : -1">
			<AccordionTab header="General information">
				<div class="grid p-fluid">
					<div class="col-12 md:col-6 flex">
						<div class="p-inputgroup">
							<Card id="header-left" style="width: 100%">
								<template #content>
									<strong>
										Id:
										<span class="badge bg-primary">
											{{ id }}
										</span>
									</strong>
									<strong class="ms-4">
										Version:
										<span class="badge bg-primary">
											{{ version }}
										</span>
									</strong>
									<strong v-if="previousQuestionId && previousQuestionId !== -1" class="ms-4">
										Parent (previous) question id:
										<span class="badge bg-primary">
											{{ previousQuestionId }}
										</span>
									</strong>
									<strong v-if="nextQuestionId && nextQuestionId !== -1" class="ms-4">
										Next (child) question id:
										<span class="badge bg-primary">
											{{ nextQuestionId }}
										</span>
									</strong>
									<Divider />
									<strong>Type:</strong>

									{{ questionType }}
									<Divider />
									<router-link to="">Used: {{ usedCount }} time(s)</router-link>

									<span
										v-if="usedTime && !Number.isNaN(new Date(usedTime).getTime())"
										style="font-size: 15px">
										, last: {{ new Date(usedTime).toISOString().split('T')[0] }}
										<em>
											<small>{{ humanize(new Date(usedTime)) }}</small>
										</em>
									</span>

									<Divider />
									<!-- TODO: Dynamically create link -->
									<router-link to="">
										Stats
										<font-awesome-icon icon="chart-line" class="ms-1" />
									</router-link>
									<Divider />
									<router-link to="">Feedback: comments/ratings</router-link>
								</template>
							</Card>
						</div>
					</div>

					<div class="col-12 md:col-6 flex">
						<div class="p-inputgroup">
							<Card id="header-right" style="width: 100%">
								<template #content>
									<span>
										<strong>Created:</strong>
										{{ userCreated }},
										<span
											v-if="createdTime && !Number.isNaN(new Date(createdTime).getTime())"
											style="font-size: 15px">
											{{ new Date(createdTime).toISOString().split('T')[0] }}
											<em>
												<small>{{ humanize(new Date(createdTime)) }}</small>
											</em>
										</span>
									</span>
									<span
										v-if="showClaimAuthorship"
										class="badge bg-primary ms-5 hand-cursor"
										@click="showAuthorshipDialog()">
										Claim authorship
									</span>
									<Divider />
									<strong>Modified:</strong>
									{{ userModified }},
									<span
										v-if="modifiedTime && !Number.isNaN(new Date(modifiedTime).getTime())"
										style="font-size: 15px">
										{{ new Date(modifiedTime).toISOString().split('T')[0] }}
										<em>
											<small>{{ humanize(new Date(modifiedTime)) }}</small>
										</em>
									</span>
									<Divider />
									<strong>Path(s):</strong>
									<span style="word-break: break-all" class="ms-2" v-html="path"></span>

									<Divider />
									<strong>Reviewer(s):</strong>
									<Tag
										v-for="(reviewer, index) in internalReviewers"
										:key="index"
										icon="pi pi-user"
										class="ms-2 mb-2 hand-cursor"
										severity="info"
										@click="showReviewerDialog()">
										[{{ reviewer.reviewer }}
										<span v-if="reviewer.ts_created">
											,
											{{ new Date(reviewer.ts_created).toISOString().split('T')[0] }}
											<em>
												<small>
													{{ humanize(new Date(reviewer.ts_created)) }}
												</small>
											</em>
										</span>
									</Tag>

									<Tag
										v-if="showAddReviewer"
										class="ms-2 hand-cursor"
										label="Add myself"
										@click="showReviewerDialog()">
										Add myself
										<font-awesome-icon class="ms-2" icon="circle-plus" />
									</Tag>
								</template>
							</Card>
						</div>
					</div>
				</div>
			</AccordionTab>
		</Accordion>
	</div>
</template>
