<script>
	import useFetchUsers from './useFetchUsers.svelte.js';

	const response = useFetchUsers();
</script>

{#if response.error}
	<p>An error occured while fetching users</p>
{:else if response.users}
	<ul>
		{#each response.users as user}
			<li>
				<p>
					{user}
				</p>
			</li>
		{/each}
	</ul>
{/if}
