let search = 'r/mech';

export const load = async () => {
	console.log('google autosuggest');
	const res = await fetch('https://google.com/complete/search?client=firefox&q=' + search);
	const data = await res.json();
	console.log(data[1]);
	return { suggestions: data[1] };
};
