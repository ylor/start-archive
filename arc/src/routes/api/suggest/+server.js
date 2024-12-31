import { json } from '@sveltejs/kit';

console.log('suggesting');

export const GET = async ({ url }) => {
	const engine = url.searchParams.get('engine');
	const q = url.searchParams.get('q');

	let target;

	switch (engine) {
		case 'duck':
		case 'duckduckgo':
			target = 'https://duckduckgo.com/ac/?q=' + q + '&type=list';
			break;
		case 'kagi':
			target = 'https://kagi.com/api/autosuggest?q=' + q;
			break;
		case 'google':
		default:
			target = 'https://google.com/complete/search?client=firefox&q=' + q;
	}

	if (!q) {
		return json([]);
	}

	const res = await fetch(target);
	const data = await res.json();
	return json(data[1].slice(0, 5), { status: 200 });
};
