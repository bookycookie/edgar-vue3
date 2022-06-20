// @ts-ignore
import md from 'markdown-it';
import mj3 from 'markdown-it-mathjax3';
// @ts-ignore
import collapse from 'markdown-it-collapsible';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
export default function render(text: string) {
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
}
