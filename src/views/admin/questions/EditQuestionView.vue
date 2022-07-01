<script setup lang="ts">
import { ref, defineProps, onMounted, computed, watch, defineAsyncComponent } from 'vue';
import ApiService from '@/services/ApiService';
// import HeaderComponent from '@/components/admin/questions/HeaderComponent.vue';
// import QuestionPreviewComponent from '@/components/admin/questions/QuestionPreviewComponent.vue';
// import CodeComponent from '@/components/admin/questions/CodeComponent.vue';
// import TestItemsComponent from '@/components/admin/questions/TestItemsComponent.vue';
// import JsonComponent from '@/components/admin/questions/JsonComponent.vue';
// import ToolbarComponent from '@/components/admin/questions/ToolbarComponent.vue';
// import SqlComponent from '@/components/admin/questions/SqlComponent.vue';
// import TemplateDataComponent from '@/components/admin/questions/TemplateDataComponent.vue';
// import CustomScoringComponent from '@/components/admin/questions/CustomScoringComponent.vue';
import { Tag } from '@/models/admin/questions/Tag';
import { Question } from '@/models/admin/questions/Question';
import { Answer } from '@/models/admin/questions/Answer';
import { FreeTextSaveObject } from '@/models/admin/questions/FreeTextSaveObject';
import { ShowAttachmentsAndRuntimeConstraint } from '@/models/admin/questions/ShowAttachmentsAndRuntimeConstraint';
import { Layout } from '@/models/admin/questions/Layout';
import { Reviewer } from '@/models/admin/questions/Reviewer';
import { ProgrammingLanguage } from '@/models/admin/questions/ProgrammingLanguage';
import { Code } from '@/models/admin/questions/Code';
import { Scale } from '@/models/admin/questions/Scale';
import { SaveScale } from '@/models/admin/questions/SaveScale';
import { SavePeerAssessment } from '@/models/admin/questions/SavePeerAssessment';
import { Json } from '@/models/admin/questions/Json';
import { TestItem } from '@/models/admin/questions/TestItem';
import { RuntimeConstraint } from '@/models/admin/questions/RuntimeConstraint';
import { Sql } from '@/models/admin/questions/Sql';
import { ColumnMode } from '@/models/admin/questions/ColumnMode';
import { FreeText } from '@/models/admin/questions/FreeText';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useRouter, useRoute } from 'vue-router';
import RouteNames from '@/router/routes';
import CONSTANTS from '@/config/constants';

const HeaderComponent = defineAsyncComponent(() => import('@/components/admin/questions/HeaderComponent.vue'));
const QuestionPreviewComponent = defineAsyncComponent(
	() => import('@/components/admin/questions/QuestionPreviewComponent.vue'),
);
const CodeComponent = defineAsyncComponent(() => import('@/components/admin/questions/CodeComponent.vue'));
const TestItemsComponent = defineAsyncComponent(() => import('@/components/admin/questions/TestItemsComponent.vue'));
const JsonComponent = defineAsyncComponent(() => import('@/components/admin/questions/JsonComponent.vue'));
const ToolbarComponent = defineAsyncComponent(() => import('@/components/admin/questions/ToolbarComponent.vue'));
const SqlComponent = defineAsyncComponent(() => import('@/components/admin/questions/SqlComponent.vue'));
const TemplateDataComponent = defineAsyncComponent(
	() => import('@/components/admin/questions/TemplateDataComponent.vue'),
);
const CustomScoringComponent = defineAsyncComponent(
	() => import('@/components/admin/questions/CustomScoringComponent.vue'),
);
const props = defineProps({
	id: { type: Number, required: true },
});
const initiateUpload = async (event: any) => {
	// console.log(files);
	// const fileName = files;
	// await service.postAsync('/question/attachment', {
	//   file: event.files[0],
	//   questionId: props.id,
	// });
	const attachment = event.target.files[0];

	let formData = new FormData();

	formData.append('attachment', attachment, attachment.name);
	formData.append('is_public', `${isPublic.value}`);
	formData.append('label', attachmentLabel.value);
	formData.append('id_question', `${props.id}`);
};

const router = useRouter();
const route = useRoute();
const toast = useToast();
const service = new ApiService();
// Good one for ABC: 38441 (course)
// Has data object & eval script (FREE TEXT): 44549 (course)

const isLoading = ref(false);

// General information
const question = ref<Question | null>();
const reviewers = ref<Reviewer[]>();
const showAttachments = ref(false);
const showRuntimeConstraints = ref(false);
const commentMarkdown = ref('');
const isActive = ref(false);
const canUpload = ref(false);
const isPublic = ref(false);
const attachmentLabel = ref('');
const dataObject = ref('');
const evalScript = ref('');

const isAbc = computed((): boolean | undefined => question.value?.has_answers);
const isFreeText = computed((): boolean | undefined =>
	question.value?.type_name ? question.value?.type_name.toUpperCase().includes('FREE TEXT') : false,
);
const isJson = computed((): boolean | undefined =>
	question.value?.type_name ? question.value?.type_name.toUpperCase().includes('JSON') : false,
);
const isScale = computed((): boolean | undefined =>
	question.value?.type_name ? question.value?.type_name.toUpperCase().includes('SCALE') : false,
);
const isSql = computed((): boolean | undefined =>
	question.value?.type_name ? question.value?.type_name.toUpperCase().includes('SQL') : false,
);
const isC = computed((): boolean | undefined =>
	question.value?.type_name ? question.value?.type_name.toUpperCase().includes('C-LANG') : false,
);
const isJava = computed((): boolean | undefined =>
	question.value?.type_name ? question.value?.type_name.toUpperCase().includes('JAVA') : false,
);
const isPython = computed((): boolean | undefined =>
	question.value?.type_name ? question.value?.type_name.toUpperCase().includes('PYTHON') : false,
);
const isCodeExactly = computed((): boolean | undefined => {
	return (
		!isSql.value &&
		!isC.value &&
		!isJava.value &&
		!isPython.value &&
		(question.value?.type_name ? question.value?.type_name.toUpperCase().includes('CODE') : false)
	);
});
const isText = computed((): boolean | undefined => isAbc.value || isFreeText.value || isJson.value || isScale.value);
const isCode = computed(
	(): boolean | undefined => (isC.value || isJava.value || isPython.value || isCodeExactly.value) && !isText.value,
);

const isPeerAssessment = computed((): boolean | undefined =>
	question.value?.type_name ? question.value.type_name.includes('Peer') : false,
);
const languageMode = computed((): string => {
	if (isAbc.value || isFreeText.value || isScale.value) return 'text';
	if (isC.value) return 'text/x-c++src';
	if (isJava.value) return 'text/x-java';
	if (isPython.value) return 'text/x-python';
	if (isJson.value || isCode.value) return 'text/typescript';
	if (isSql.value) return 'text/x-pgsql';

	return 'text';
});

// Toolbar
const selectedLayout = ref<Layout>({
	name: '1-1',
	layoutLeft: 'col-12 md:col-6 flex',
	layoutRight: 'col-12 md:col-6 flex',
});
const save = async () => {
	if (isScale.value) await saveScale();
	if (isAbc.value) await saveAbc();
	if (isFreeText.value) await saveFreeText();
	if (isSql.value) await saveSql();
	if (isPeerAssessment.value) await savePeerAssessment();
};

const saveFreeText = async () => {
	const saveObject: FreeTextSaveObject = {
		id_question: props.id,
		is_active: isActive.value,
		can_upload: true,
		save: 'save',
		question_text: markdown.value,
		question_tags: selectedTags.value.map((t) => t.id),
		attachment: '',
		attachment_label: '',
		text_answer: freeTextMarkdown.value,
		question_comment: commentMarkdown.value,
	};

	try {
		await service.postAsync('/question/big_save', {
			...saveObject,
			appUserId: CONSTANTS.APP_USER_ID,
		});
		toast.add({
			severity: 'success',
			summary: '200 OK',
			detail: `Question ${props.id} saved successfully.`,
		});
	} catch (err) {
		console.log(err);
		toast.add({
			severity: 'error',
			summary: '500 Server error.',
			detail: `Error occured while saving question ${props.id}. ${err}`,
		});
	}
};

// Without permutations TODO: Add them
const saveAbc = async () => {
	try {
		await service.postAsync('/question/abc_save', {
			questionId: props.id,
			isActive: isActive.value,
			canUpload: true, //canUpload.value,
			questionText: markdown.value,
			questionComment: commentMarkdown.value,
			answers: answers.value,
			appUserId: CONSTANTS.APP_USER_ID,
		});
		toast.add({
			severity: 'success',
			summary: '200 OK',
			detail: `Question ${props.id} saved successfully.`,
		});
	} catch (err) {
		console.log(err);
		toast.add({
			severity: 'error',
			summary: '500 Server error.',
			detail: `Error occured while saving question ${props.id}. ${err}`,
		});
	}
};

const saveSql = async () => {
	try {
		await service.postAsync('/question/sql_save', {
			questionId: props.id,
			isActive: isActive.value,
			canUpload: true, //canUpload.value,
			questionText: markdown.value,
			questionComment: commentMarkdown.value,
			appUserId: CONSTANTS.APP_USER_ID,
			sqlAnswer: sqlAnswer.value,
			sqlAltAssertion: sqlSuffix.value,
			sqlTestFixture: sqlPrefix.value,
			sqlAltPresentationQuery: presentationQuery.value,
			checkTupleOrder: checkTupleOrder.value,
			checkColumnModeId: selectedColumnMode.value.id,
			questionTagIds: selectedTags.value.map((t) => t.id),
		});
		toast.add({
			severity: 'success',
			summary: '200 OK',
			detail: `Question ${props.id} saved successfully.`,
		});
	} catch (err) {
		console.log(err);
		toast.add({
			severity: 'error',
			summary: '500 Server error.',
			detail: `Error occured while saving question ${props.id}. ${err}`,
		});
	}
};

const saveScale = async () => {
	const saveObject: SaveScale = {
		id_question: props.id,
		is_active: isActive.value,
		can_upload: true,
		save: 'save',
		question_text: markdown.value,
		attachment: '',
		attachment_label: '',
		id_scale: selectedScale.value?.id ?? 0,
		question_comment: commentMarkdown.value,
		data_object: dataObject.value,
		eval_script: evalScript.value,
	};

	try {
		await service.postAsync('/question/big_save', {
			...saveObject,
			appUserId: CONSTANTS.APP_USER_ID,
		});
	} catch (err) {
		console.log(err);
		toast.add({
			severity: 'error',
			summary: '500 Server error.',
			detail: `Error occured while saving question ${props.id}. ${err}`,
		});
	}
};

const savePeerAssessment = async () => {
	const saveObject: SavePeerAssessment = {
		id_question: props.id,
		is_active: isActive.value,
		can_upload: true,
		save: 'save',
		question_text: markdown.value,
		attachment: '',
		attachment_label: '',
		question_comment: commentMarkdown.value,
		data_object: dataObject.value,
		eval_script: evalScript.value,
	};

	try {
		await service.postAsync('/question/big_save', {
			...saveObject,
			appUserId: CONSTANTS.APP_USER_ID,
		});
	} catch (err) {
		console.log(err);
		toast.add({
			severity: 'error',
			summary: '500 Server error.',
			detail: `Error occured while saving question ${props.id}. ${err}`,
		});
	}
};

const saveInPlace = async () => {
	const saveInPlaceObject = {
		id_question: props.id,
		is_active: isActive.value,
		can_upload: canUpload.value,
		question_text: markdown.value,
		question_comment: commentMarkdown.value,
		text_answer: freeTextMarkdown.value,
		answers: answers.value,
		sql_answer: sqlAnswer.value,
		sql_alt_assertion: sqlSuffix.value,
		sql_test_fixture: sqlPrefix.value,
		sql_alt_presentation_query: presentationQuery.value,
		check_tuple_order: checkTupleOrder.value,
		id_check_column_mode: selectedColumnMode.value.id === -1 ? undefined : selectedColumnMode.value.id,
		prefix: codePrefix.value,
		suffix: codeSuffix.value,
		c_answer: codeSource.value,
		id_app_user: CONSTANTS.APP_USER_ID,
		question_tags: selectedTags.value.map((t) => t.id),
		json_answer: jsonAnswer.value,
		json_alt_assertion: jsonAltAssertion.value,
		json_test_fixture: jsonTestFixture.value,
		json_alt_presentation_query: jsonAltPresentationQuery.value,
		assert_deep: jsonAssertDeep.value,
		assert_strict: jsonAssertStrict.value,
		id_scale: selectedScale.value.id ?? 0,
		data_object: undefined, //! Add data object!
		eval_script: undefined, //! Add eval script!
		id_script_programming_language: undefined, //! Add script programming language
	};
	const saveInPlaceResponse = await service.postAsync('/question/saveinplace', saveInPlaceObject);
	console.log(saveInPlaceResponse);
};
const clone = async () =>
	service
		.postAsync('/question/clone', {
			questionId: props.id,
			appUserId: CONSTANTS.APP_USER_ID,
		})
		.then((response: any) => {
			const intNewId = parseInt(response.data);
			toast.add({
				severity: 'success',
				summary: '200 OK',
				detail: `Question ${props.id} cloned successfully to ${intNewId}.`,
			});
			router.push({ name: RouteNames.EditQuestion, params: { id: intNewId } });
		})
		.catch((err: any) =>
			toast.add({
				severity: 'error',
				summary: '500 Server error.',
				detail: `Error occured while cloning question ${props.id}. ${err}`,
			}),
		);

const deleteQ = async () => {
	try {
		await service.postAsync('/question/delete', {
			questionId: props.id,
		});
		toast.add({
			severity: 'success',
			summary: '200 OK',
			detail: `Question ${props.id} deleted successfully.`,
		});
		router.push({ name: RouteNames.ListAllAndEdit });
	} catch (err) {
		toast.add({
			severity: 'error',
			summary: '500 Server error.',
			detail: `Error occured while deleting question ${props.id}. ${err}`,
		});
	}
};
const disable = async () => {
	try {
		await service.postAsync('/question/toggleactive', {
			questionId: props.id,
		});
		toast.add({
			severity: 'success',
			summary: '200 OK',
			detail: `Question ${props.id} ${isActive.value ? 'disabled' : 'enabled'} successfully.`,
		});
		isActive.value = !isActive.value;
	} catch (err) {
		toast.add({
			severity: 'error',
			summary: '500 Server error.',
			detail: `Error occured while ${isActive.value ? 'disabling' : 'enabling'} question ${props.id}. ${err}`,
		});
	}
};

// Question - Preview
const markdown = ref('');
const tags = ref<Tag[]>([]);
const selectedTags = ref<Tag[]>([]);
const answers = ref<Answer[]>([]);

// Code
const codePrefix = ref('');
const codeSource = ref('');
const codeSuffix = ref('');
const languages = ref<ProgrammingLanguage[]>([]);
const selectedLanguage = ref<ProgrammingLanguage>({
	id: -1,
	name: 'string',
	judge0_id: -1,
	compiler_options: 'string',
	extension: 'string',
});
const testItems = ref<TestItem[]>([]);
const runtimeConstraints = ref<RuntimeConstraint[]>([]);
const testCasesResult = ref('');
const testCasesIndex = ref(0);
const runTestCases = async () => {
	let response: any = await service.postAsync('/execute_question', {
		questionId: props.id,
		courseId: CONSTANTS.COURSE_ID,
		isC: true,
		source: codeSource.value,
		programmingLanguageId: selectedLanguage.value.id,
	});

	testCasesResult.value = response.data.data;
	testCasesIndex.value = 0;
};

// Sql
const sqlAnswer = ref('');
const sqlPrefix = ref('');
const sqlSuffix = ref('');
const presentationQuery = ref('');
const checkTupleOrder = ref(false);
const columnModes = ref<ColumnMode[]>([]);
const selectedColumnMode = ref<ColumnMode>({
	id: -1,
	mode_desc: 'PH',
} as ColumnMode);
const columns = ref();
const columnNames = ref<string[]>();
const sqlError = ref('');

const runSql = async (sql: string) => {
	service
		.postAsync('/execute_question', {
			questionId: props.id,
			courseId: CONSTANTS.COURSE_ID,
			isSql: true,
			sql: sql,
		})
		.then((response: any) => {
			if (!response.data.success && response.data.error) {
				sqlError.value = response.data.error.message;
				return;
			}
			sqlError.value = '';

			const headers = response.data.data.fields.map((f: any) => f.name);
			columnNames.value = headers;
			const rows = response.data.data.rows;
			const cs = [];
			for (let index = 0; index < headers.length; index++) {
				cs.push(`C${index}`);
			}

			const tmp2: any[] = [];
			for (let index = 0; index < rows.length; index++) {
				const r = rows[index];
				let tmp: any[] = [];
				for (let idx = 0; idx < cs.length; idx++) {
					const c = cs[idx];
					tmp.push(r[c as keyof {}]);
				}
				tmp2.push(tmp);
			}

			columns.value = tmp2.map((row): any =>
				row.reduce((result: { [x: string]: any }, field: any, index: number) => {
					result[headers[index]] = field;
					return result;
				}, {}),
			);
		});
};

const runAllSql = async () => {
	console.log('RanAllSql');
	const delimiter = '\n;\n';
	const prefix = sqlPrefix.value ? `${delimiter}${sqlPrefix.value}${delimiter}` : '';
	const answer = sqlAnswer.value ? `${delimiter}${sqlAnswer.value}${delimiter}` : '';
	const suffix = sqlSuffix.value ? `${delimiter}${sqlSuffix.value}${delimiter}` : '';
	const presentation = presentationQuery.value ? `${delimiter}${presentationQuery.value}${delimiter}` : '';

	const sql = prefix + answer + suffix + presentation;
	await runSql(sql);
};

// Free text
const freeTextMarkdown = ref('');

// Scale
const scaleOptions = ref<Scale[]>([]);
const selectedScale = ref<Scale>({ id: -1, name: 'PH', selected: -1 });

// Json
const jsonAnswer = ref('');
const jsonAltAssertion = ref('');
const jsonAltPresentationQuery = ref('');
const jsonTestFixture = ref('');
const jsonAssertDeep = ref(false);
const jsonAssertStrict = ref(false);
const jsonError = ref('');

const runJsonAnswer = async () => {
	service
		.postAsync('/execute_question', {
			questionId: props.id,
			courseId: CONSTANTS.COURSE_ID,
			isJs: true,
			js: jsonAnswer,
		})
		.then((response: any) => {
			if (!response.data.success && response.data.error) {
				jsonError.value = response.data.error.message;
				return;
			}
			jsonError.value = '';

			const headers = response.data.data.fields.map((f: any) => f.name);
			columnNames.value = headers;
			const rows = response.data.data.rows;
			const cs = [];
			for (let index = 0; index < headers.length; index++) {
				cs.push(`C${index}`);
			}

			const tmp2: any[] = [];
			for (let index = 0; index < rows.length; index++) {
				const r = rows[index];
				let tmp: any[] = [];
				for (let idx = 0; idx < cs.length; idx++) {
					const c = cs[idx];
					tmp.push(r[c as keyof {}]);
				}
				tmp2.push(tmp);
			}

			columns.value = tmp2.map((row): any =>
				row.reduce((result: { [x: string]: any }, field: any, index: number) => {
					result[headers[index]] = field;
					return result;
				}, {}),
			);
		});
};
const runJsonAltAssertion = async () => {
	console.log('Bro I ran runJsonAltAssertion answer');
};
const runJsonAltPresentationQuery = async () => {
	console.log('Bro I ran runJsonAltPresentationQuery answer');
};
const runJsonTestFixture = async () => {
	console.log('Bro I ran runJsonTestFixture answer');
};

const getDataAsync = async (id: number) => {
	try {
		isLoading.value = true;

		question.value = await service.getSingleAsync<Question>('/question_information', {
			questionId: id,
			userEmail: 'imekterovi@fer.hr',
		});

		languages.value = await service.getManyAsync<ProgrammingLanguage>('/all_programming_languages');
	} finally {
		isLoading.value = false;
	}
	markdown.value = question.value?.question_text ?? '';
	commentMarkdown.value = question.value?.question_comment ?? '';
	isActive.value = question.value?.is_active ? question.value.is_active : false;
	canUpload.value = question.value?.can_upload ?? false;
	dataObject.value = question.value?.data_object ?? '';
	evalScript.value = question.value?.eval_script ?? '';

	reviewers.value = await service.getManyAsync<Reviewer>('/question/reviewers', {
		questionId: id,
	});
	tags.value = await service.getManyAsync<Tag>('/question/tags', {
		questionId: id,
		courseId: CONSTANTS.COURSE_ID,
		global: true,
	});

	const showAttachmentsAndRuntimeConstraints = await service.getSingleAsync<ShowAttachmentsAndRuntimeConstraint>(
		'/course/attachments_constraints',
		{
			courseId: CONSTANTS.COURSE_ID,
		},
	);
	showAttachments.value = showAttachmentsAndRuntimeConstraints?.show_attachments ?? false;
	showRuntimeConstraints.value = showAttachmentsAndRuntimeConstraints?.show_runtime_constraints ?? false;

	if (isCode.value) {
		const code = await service.getSingleAsync<Code>('/question/code', {
			questionId: id,
		});

		if (code) {
			codePrefix.value = code.c_prefix;
			codeSource.value = code.c_source;
			codeSuffix.value = code.c_suffix;

			testItems.value = await service.getManyAsync<TestItem>('/question/test_items', {
				questionId: id,
			});
		}

		// FIXME: Fix runtime constrains bro
		// if (showRuntimeConstraints.value)
		// runtimeConstraints.value = await service.getManyAsync<RuntimeConstraint>(
		//   '/question/runtime_constraints',
		//   { courseId: courseId, questionId: id },
		// );
	}
	if (isAbc.value)
		answers.value = await service.getManyAsync<Answer>('/question/answers', {
			questionId: id,
		});

	if (isSql.value) {
		const sql = await service.getSingleAsync<Sql>('/question/sql', {
			questionId: id,
		});

		if (sql) {
			sqlAnswer.value = sql.sql_answer ?? '';
			sqlPrefix.value = sql.sql_test_fixture ?? '';
			sqlSuffix.value = sql.sql_alt_assertion ?? '';
			presentationQuery.value = sql.sql_alt_presentation_query ?? '';
			checkTupleOrder.value = sql.check_tuple_order;

			await service.getManyAsync<ColumnMode>('/question/sql/column_modes').then((cms: ColumnMode[]) => {
				columnModes.value = cms;
				const foundColumnMode = cms.find((cm: ColumnMode) => cm.id === sql.id_check_column_mode);
				if (foundColumnMode) selectedColumnMode.value = foundColumnMode;
			});
		}
	}

	if (isScale.value) {
		await service
			.getManyAsync<Scale>('/question/scale', {
				questionId: id,
			})
			.then((scale: Scale[]) => {
				scaleOptions.value = scale;
				const foundScale = scale.find((s: Scale) => s.id === scaleOptions.value[0].selected);
				if (foundScale) selectedScale.value = foundScale;
			});
	}

	if (isJson.value) {
		const json = await service.getSingleAsync<Json>('/question/json', {
			questionId: id,
		});

		jsonAnswer.value = json?.json_answer ?? '';
		jsonAltAssertion.value = json?.json_alt_assertion ?? '';
		jsonAltPresentationQuery.value = json?.json_alt_presentation_query ?? '';
		jsonTestFixture.value = json?.json_test_fixture ?? '';
		jsonAssertDeep.value = json?.assert_deep ?? false;
		jsonAssertStrict.value = json?.assert_strict ?? false;
	}

	if (isFreeText.value) {
		const text = await service.getSingleAsync<FreeText>('/question/freetext', {
			questionId: id,
		});

		if (text?.text_answer) freeTextMarkdown.value = text.text_answer;
	}
};
onMounted(async () => await router.isReady().then(async () => await getDataAsync(props.id)));
watch(
	() => props.id,
	async (newId) => {
		await getDataAsync(newId);
	},
);

const addReviewer = async () => {
	await service.postAsync('/setreviewer', {
		questionId: props.id,
		appUserId: CONSTANTS.APP_USER_ID,
	});
};

const removeReviewer = async () => {
	await service.postAsync('/removereviewer', {
		questionId: props.id,
		appUserId: CONSTANTS.APP_USER_ID,
	});
};

const claimAuthorship = async () => {
	try {
		await service.postAsync('/claimauthor', {
			questionId: props.id,
			appUserId: CONSTANTS.APP_USER_ID,
		});
		toast.add({
			severity: 'success',
			summary: '200 OK',
			detail: "Successfully claimed authorship. Now it's your fault. :)",
			life: 5000,
		});
	} catch (err) {
		toast.add({
			severity: 'error',
			summary: '500 Server error.',
			detail: `Error occured with your request. ${err}`,
			life: 5000,
		});
	}
};
</script>
//! TODO: SCALE IS NOT SAVING PROPERLY! id: 44695
<template>
	<BlockUI :blocked="isLoading" full-screen />
	<div v-if="!question && !isLoading">Missed it. Wanna try not guessing?</div>
	<div v-else class="container-fluid">
		<br />
		<Card id="main">
			<template #title>
				<div class="grid">
					<div class="col-12 md:col-11">
						<h2>Edit question</h2>
					</div>
				</div>
			</template>
			<template #content>
				<HeaderComponent
					v-if="question"
					:id="question.id"
					v-model:reviewers="reviewers"
					v-model:userModified="question.user_modified"
					v-model:modifiedTime="question.ts_modified"
					:previous-question-id="question.id_prev_question"
					:next-question-id="question.id_next_question"
					:version="question.version"
					:question-type="question.type_name"
					:used-count="question.count_used"
					:used-time="question.last_used"
					:user-created="question.user_created"
					:created-time="question.ts_created"
					:path="question.paths"
					:show="false"
					@claim-authorship="claimAuthorship"
					@add-reviewer="addReviewer"
					@remove-reviewer="removeReviewer" />
				<br />
				<ToolbarComponent
					v-model:layout="selectedLayout"
					v-model:canUpload="canUpload"
					:is-active="isActive"
					@save="save"
					@save-in-place="saveInPlace"
					@clone="clone"
					@delete="deleteQ"
					@disable="disable" />
				<br />
				<div v-if="dataObject">
					<TemplateDataComponent v-model:dataObject="dataObject" />
					<br />
				</div>
				<BlockUI :blocked="!isActive">
					<h1 v-if="!isActive" class="center failure">DISABLED</h1>
					<QuestionPreviewComponent
						id="question-preview"
						v-model:markdown="markdown"
						v-model:selected-tags="selectedTags"
						:layout-question="selectedLayout.layoutLeft"
						:layout-preview="selectedLayout.layoutRight"
						:tags="tags"
						:answers="answers"
						:mode="languageMode"
						:is-sql="isSql" />
				</BlockUI>

				<div v-if="evalScript">
					<br />
					<CustomScoringComponent
						v-model:evalScript="evalScript"
						:question-id="props.id"
						:programming-languages="languages" />
				</div>
				<br />
				<CodeComponent
					v-if="isC || isJava || isPython || isCodeExactly"
					v-model:code-prefix="codePrefix"
					v-model:code-source="codeSource"
					v-model:code-suffix="codeSuffix"
					v-model:selected-language="selectedLanguage"
					:languages="languages"
					:language-mode="languageMode" />
				<br />
				<div class="center">
					<Button
						v-if="testItems && testItems.length > 0"
						v-tooltip.right="'Be sure to save (except code-main) before running this'"
						class="p-button-secondary"
						@click="runTestCases">
						<font-awesome-icon icon="gears" class="me-2" />
						<span>Run all test cases</span>
						<font-awesome-icon icon="gears" class="ms-2" />
					</Button>
				</div>
				<br />
				<Accordion v-if="testCasesResult" v-model:active-index="testCasesIndex">
					<AccordionTab header="Test cases result">
						<div v-html="testCasesResult"></div>
					</AccordionTab>
				</Accordion>
				<br />

				<TestItemsComponent
					v-if="isC || isJava || isPython || isCodeExactly"
					v-model:items="testItems"
					v-model:constraints="runtimeConstraints"
					:show-constraints="showRuntimeConstraints"
					:constraints="runtimeConstraints"
					:languages="languages" />
				<SqlComponent
					v-if="isSql"
					v-model:sql-answer="sqlAnswer"
					v-model:sql-prefix="sqlPrefix"
					v-model:sql-suffix="sqlSuffix"
					v-model:presentation-query="presentationQuery"
					v-model:check-tuple-order="checkTupleOrder"
					v-model:selected-column-mode="selectedColumnMode"
					:column-modes="columnModes"
					:columns="columnNames"
					:rows="columns"
					:sql-error="sqlError"
					@run="runSql(sqlAnswer)"
					@run-all="runAllSql()" />
				<JsonComponent
					v-if="isJson"
					v-model:assert-deep="jsonAssertDeep"
					v-model:assert-strict="jsonAssertStrict"
					v-model:json-answer="jsonAnswer"
					v-model:json-alt-assertion="jsonAltAssertion"
					v-model:json-alt-presentation-query="jsonAltPresentationQuery"
					v-model:json-test-fixture="jsonTestFixture"
					:json-error="jsonError"
					:columns="columnNames"
					:rows="columns"
					@run-json-answer="runJsonAnswer()"
					@run-json-alt-assertion="runJsonAltAssertion()"
					@run-json-alt-presentation-query="runJsonAltPresentationQuery()"
					@run-json-test-fixture="runJsonTestFixture()" />
				<br />
				<Accordion v-if="showAttachments">
					<AccordionTab header="Attachments">
						<!-- TODO: FIX THE UPLOAD! -->
						<!-- <FileUpload
              name="attachments[]"
              mode="advanced"
              choose-label="Browse"
              :max-file-size="10 * 1024 * 1024"
              @uploader="uploadAttachments"
              custom-upload
              :multiple="false"
            >
              <template #empty>
                <p>Browse or drag and drop files here to upload.</p>
              </template>
            </FileUpload> -->
						<h3>Insert new attachment:</h3>
						<div>
							<p>
								<label class="ml-2 btn btn-light btn-outline-dark">
									<strong>Browse</strong>
									<input
										id="attachment"
										type="file"
										name="attachment"
										hidden
										multiple
										@change="initiateUpload" />
								</label>
							</p>
						</div>
						<InputSwitch v-model="isPublic" />
						<label>Is public</label>
						<label>Label:</label>
						<InputText v-model="attachmentLabel" />
						<Button label="Upload" @click="initiateUpload" />
					</AccordionTab>
				</Accordion>
				<br />
				<QuestionPreviewComponent
					v-if="isFreeText"
					id="free-text-question"
					v-model:markdown="freeTextMarkdown"
					question-header="Free text question"
					:mode="languageMode"
					:is-sql="false"
					:show-placeholders="false" />
				<Card v-if="isScale">
					<template #title><h4>Scale</h4></template>
					<template #content>
						<Dropdown
							v-model="selectedScale"
							:options="scaleOptions"
							:placeholder="selectedScale?.name"
							option-label="name"
							style="width: 100%" />
					</template>
				</Card>
				<br />
				<QuestionPreviewComponent
					id="question-comment"
					v-model:markdown="commentMarkdown"
					question-header="Question comment"
					:mode="languageMode"
					:is-sql="false"
					:show-placeholders="false" />
			</template>
		</Card>
	</div>
</template>
