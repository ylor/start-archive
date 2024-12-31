import { SUPABASE_ANON_KEY, SUPABASE_API_URL } from '$env/static/private';

export async function load({ fetch }) {
	const res = await fetch(SUPABASE_API_URL + "?apikey=" + SUPABASE_ANON_KEY);
	const data = await res.json();
	const db = data
		.sort((a, b) => a.name.localeCompare(b.name)) // Sort object by `name`
		.flatMap((obj) => {
			obj.aka = obj.aka ? obj.aka : []; // Ensure `aka` is always an array
			obj.aka.unshift(obj.name); // Push `name` into `aka`
			return obj.aka.map((x) => ({ ...obj, aka: x })); // Create a new object for each entry in 'aka'
		});
	return { db };
}
