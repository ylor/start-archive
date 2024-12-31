// import { supabase } from '$lib/supabaseClient.js';

let database = $state([]);
// database = await supabase
// 	.from('websites')
// 	.select()
// 	.then((response) => response.data ?? []);
database = await fetch('https://pyaritwlzbjtzgyiyioo.supabase.co/rest/v1/websites', {
	headers: {
		apikey:
			'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YXJpdHdsemJqdHpneWl5aW9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODIyOTgwMzQsImV4cCI6MTk5Nzg3NDAzNH0.1M9XlyJ_0DQ7WTuEhPJRDZHxbIPHiW61P0sZY3hNIac'
	}
}).then((response) => response.json() ?? []);
// let test = database.flatMap((x) => [x.name].concat(x.names).map((name) => ({ name, ...x })));
// database = database.flatMap((obj) => {
// 	return obj.names.map((name) => ({ ...obj, name }));
// });

let test = database.map((item) => {
	// Insert obj.name into obj.names
	item.names = item.names ? item.names : []
	item.names.unshift(item.name);

	// Delete obj.name
	//delete item.name;

	return item;
});

export const db = {
	get entries() {
		return database;
	}
};
