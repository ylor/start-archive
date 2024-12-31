import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	// build: {
	// 	target: 'esnext' //browsers can handle the latest ES features
	// },
	esbuild: {
		supported: {
			'top-level-await': true //browsers can handle top-level-await features
		}
	},
	plugins: [sveltekit()]
});
