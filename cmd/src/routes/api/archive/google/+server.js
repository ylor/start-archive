import { json } from '@sveltejs/kit';

console.log('google autosuggest');

export const GET = async ({ url }) => {
	const q = url.searchParams.get('q');

	if (!q) {
		return json('Please provide a query', { status: 400 });
	}

	const res = await fetch('https://google.com/complete/search?client=firefox&q=' + q);
	const data = await res.json();
	return json(data[1], { status: 200 });
};
