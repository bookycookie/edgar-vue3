import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@/': `${path.resolve(__dirname, 'src')}/`,
		},
	},
	plugins: [vue(), eslintPlugin()],
	server: {
		port: 8081,
	},
	// optimizeDeps: {
	// 	include: ['highlight.js', 'markdown-it', 'markdown-it-mathjax3', 'markdown-it-collapsible'],
	// },
});
