<script setup lang="ts">
import { ref, computed, defineProps, PropType, defineEmits, onMounted } from 'vue';
import { Tag } from '@/models/admin/questions/Tag';
// @ts-ignore
import md from 'markdown-it';
import mj3 from 'markdown-it-mathjax3';
// @ts-ignore
import collapse from 'markdown-it-collapsible';
import { Answer } from '@/models/admin/questions/Answer';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import useModelWrapper from '@/composables/modelWrapper';
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';

let extensions = [markdown(), oneDark];

onMounted(() => (extensions = props.extensionsOverride ? props.extensionsOverride : [markdown(), oneDark]));

const render = (text: string) => {
	return md({
		html: true,
		highlight: function (code: string, lang: string) {
			if (lang && hljs.getLanguage(lang)) {
				return hljs.highlight(lang, code).value;
			} else {
				return hljs.highlightAuto(code).value;
			}
		},
	})
		.use(mj3, {
			showProcessingMessages: true,
			jax: ['input/TeX', 'output/HTML-CSS'],
			tex2jax: {
				inlineMath: [
					['$', '$'],
					['\\(', '\\)'],
				],
			},
			TeX: {
				TagSide: 'left',
				Macros: {
					RR: '{\\bf R}',
					bold: ['{\\bf #1}', 1],
				},
			},
		})
		.use(collapse)
		.render(text);
};

const emit = defineEmits(['update:markdown', 'update:selectedTags']);

const props = defineProps({
	id: {
		type: String,
		required: true,
		default: '-1',
	},
	markdown: {
		type: String,
		required: true,
		default: '',
	},
	showPlaceholders: {
		type: Boolean,
		required: false,
		default: true,
	},
	layoutQuestion: {
		type: String,
		required: false,
		default: 'col-12 md:col-6 flex',
	},
	layoutPreview: {
		type: String,
		required: false,
		default: 'col-12 md:col-6 flex',
	},
	tags: {
		type: Object as PropType<Tag[]>,
		required: false,
		default() {
			return [];
		},
	},
	selectedTags: {
		type: Object as PropType<Tag[]>,
		required: false,
		default() {
			return [];
		},
	},
	questionHeader: {
		type: String,
		required: false,
		default: 'Question',
	},
	previewHeader: {
		type: String,
		required: false,
		default: 'Preview',
	},
	answers: {
		type: Object as PropType<Answer[]>,
		required: false,
		default() {
			return [];
		},
	},
	isSql: {
		type: Boolean,
		required: false,
		default: false,
	},
	extensionsOverride: {
		type: Object as PropType<Extension[]>,
		required: false,
		default() {
			return [];
		},
	},
	readonly: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const addAnswer = () => {
	internalAnswers.value.push({
		is_correct: false,
		answer_text: 'PH',
		threshold_weight: 1,
		penalty_percentage: 100,
		ordinal: internalAnswers.value.length + 1,
	});
};

const removeAnswer = (answer: Answer) => {
	internalAnswers.value.splice(internalAnswers.value.indexOf(answer), 1);
};

const internalMarkdown = useModelWrapper<string>(props, emit, 'markdown');

const internalSelectedTags = useModelWrapper<Tag[]>(props, emit, 'selectedTags');

const internalAnswers = useModelWrapper<Answer[]>(props, emit, 'answers');

const markdownToHtml = computed(() => render(internalMarkdown.value));
const ordinalToAlphabetical = (idx: number): string => String.fromCharCode(idx + 64).toLowerCase();
</script>

<template>
	<div :id="`question-preview-segment-${id}`" class="grid p-fluid">
		<div :class="layoutQuestion">
			<div class="p-inputgroup">
				<Card :id="`question-${id}`" style="width: 100%; min-height: 5">
					<template #title>
						<div class="wrapper">
							<div class="item1">
								<h4>
									{{ questionHeader }}
									<small class="text-xs">(GitHub flavored Markdown)</small>
								</h4>
							</div>

							<small class="item2 text-xs">
								<a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">
									MD Cheat sheet
								</a>
								|
								<a href="https://www.tablesgenerator.com/markdown_tables">Tables Generator</a>
								|
								<a href="https://jbt.github.io/markdown-editor/">Online editor</a>
								|
								<a href="https://arachnoid.com/latex/">Formulas editor</a>
							</small>
						</div>
					</template>
					<template #content>
						<Codemirror
							:id="`codemirror-${id}`"
							v-model="internalMarkdown"
							:extensions="extensions"
							:style="{ width: '100%' }"
							:disabled="readonly" />
						<div v-if="isSql || showPlaceholders">
							<br />
							<br />

							<p v-if="isSql">
								Projection (π), Selection (σ), Rename (ρ), Natural join( ⋈ ), θ-join, Semijoin (⋉)(⋊),
								Antijoin (▷), Division (÷), Left outer join (⟕), Right outer join (⟖), Full outer join
								(⟗)
							</p>
							<p v-if="showPlaceholders">Whitespace placeholders (please C/P): · ↵</p>
						</div>
						<div v-if="tags && tags.length > 0 && !(answers && answers.length > 0)">
							<Divider></Divider>
							<br />
							<div class="p-inputgroup">
								<span class="p-float-label">
									<MultiSelect
										:id="`tags-multiselect-${id}`"
										v-model="internalSelectedTags"
										:options="tags"
										option-label="name"
										display="chip"
										filter
										style="width: 100%" />
									<label for="tags-multiselect">Tags</label>
								</span>
							</div>
						</div>
					</template>
					<template v-if="answers && answers.length > 0" #footer>
						<h5>Answers</h5>
						<p v-for="answer in answers" :key="answer.ordinal" class="flex">
							<Badge
								class="badge bg-secondary block-badge me-2"
								:value="ordinalToAlphabetical(answer.ordinal)"
								size="large"></Badge>
							<ToggleButton
								v-model="answer.is_correct"
								on-icon="pi pi-check"
								off-icon="pi pi-times"
								class="me-2"
								style="max-height: 2.25rem; min-width: 2.25rem"></ToggleButton>
							<Codemirror
								v-model="answer.answer_text"
								:options="codemirrorOptions"
								:extensions="extensions"
								:style="{ width: '70%' }" />
							<InputNumber
								v-model="answer.penalty_percentage"
								:min="0"
								:max="100"
								class="ms-2 me-2"
								style="max-height: 2.25rem; max-width: 7rem" />
							<Button
								label="X"
								class="p-button-danger"
								style="max-height: 2.25rem; min-width: 2.25rem"
								@click="removeAnswer(answer)" />
						</p>
						<Button label="Add" @click="addAnswer" />
					</template>
				</Card>
			</div>
		</div>
		<div :class="layoutPreview">
			<div class="p-inputgroup">
				<Card :id="`preview-${id}`" style="width: 100%; min-height: 5">
					<template #title>
						<h4>{{ previewHeader }}:</h4>
					</template>
					<template #content>
						<div id="preview-html" style="word-break: break-all" v-html="markdownToHtml"></div>
					</template>
					<template v-if="internalAnswers && internalAnswers.length > 0" #footer>
						<h5>Answers</h5>
						<div v-for="answer in internalAnswers" :key="answer.ordinal" class="flex">
							<Badge
								class="badge bg-secondary block-badge me-2"
								:value="ordinalToAlphabetical(answer.ordinal)"
								size="large"></Badge>
							<p v-html="render(answer.answer_text)"></p>
						</div>
					</template>
				</Card>
			</div>
		</div>
	</div>
</template>

<style scoped>
.wrapper {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	gap: 1.5rem;
	grid-template-areas: 'a a a a b b b b';
	align-items: start;
}
.item1 {
	grid-area: a;
}
.item2 {
	grid-area: b;
}

.none {
	display: none;
}
</style>
