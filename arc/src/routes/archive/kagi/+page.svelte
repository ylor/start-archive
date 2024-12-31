<script>
	export let data;
	// console.log(data.suggestions)
</script>

<p>
	<li>adsf</li>
	{#each data.suggestions as suggestion}
		<li>{suggestion}</li>
	{/each}
</p>
