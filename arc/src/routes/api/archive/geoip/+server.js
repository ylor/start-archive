import { json } from '@sveltejs/kit';

console.log('ip-api');

export const GET = async ({ url }) => {
	const res = await fetch('http://ip-api.com/json/');
	const data = await res.json();
	return json(data, { status: 200 });
};
