let search = 'r/mech';

export const load = async () => {
	console.log('kagi autosuggest');
	const res = await fetch('https://kagi.com/api/autosuggest?q=' + search);
	const data = await res.json();
	// console.log(data[1]);
	return { suggestions: data[1] };
};
