export default function useFetchUsers() {
	let users = $state();
	let error = $state();
	// let isLoading = $state(false);

	async function fetchData() {
		// isLoading = true;
		try {
			const response = await fetch('/api/suggest?q=youtube');
			users = await response.json();
			error = undefined;
		} catch (err) {
			error = err;
			users = undefined;
		}
		// isLoading = false;
	}
	fetchData();

	return {
		// get isLoading() {
		// 	return isLoading;
		// },
		get error() {
			return error;
		},
		get users() {
			return users;
		}
	};
}
